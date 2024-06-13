"use client";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useRouter, Link } from "@/lib/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import InvoiceApi from "@/lib/apis/invoice-api";
import { Invoice } from "@/types/invoice";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import Stripe from 'stripe';
import weixin from "../../../../../../../public/images/weixin.svg";
import alipay from "../../../../../../../public/images/alipay.svg";
import visa from "../../../../../../../public/images/cc-visa.svg";
import Image from "next/image";
import PaymentMethodApi from "@/lib/apis/payment-method-api";
import { PaymentMethod } from "@/types/payment-method";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import cvc from "../../../../../../../public/images/ccv.webp";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Links from '@mui/material/Link';
import { loadStripe } from '@stripe/stripe-js';

interface Specification {
  cpu: string;
  memory: string;
  disk: string;
}


export default function PayInvoice({ params: { locale, invoice_no },
}: Readonly<{ params: { locale: string, invoice_no: string } }>) {
  const t = useTranslations("billings");
  const tGeneral = useTranslations("general");
  const tPayment = useTranslations("payment_methods");
  const tContact = useTranslations('contact');
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [specs, setSpecs] = useState<Specification | null>(null)
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newCard, setNewCard] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  // const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [defaultCard, setDefaultCard] = useState('');
  const router = useRouter();
  const [paymentMethodList, setPaymentMethodList] = useState([] as PaymentMethod[]);
  const [cnyPrice, setCnyPrice] = useState('');
  const [cnySubtotal, setCnySubotal] = useState('');
  const [cnyProductPrice, setCnyProductPrice] = useState('');
  const [cardNewOrExisting, setcardNewOrExisting] = useState('new');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
  });

  const stripeAPI = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!, {
    apiVersion: '2023-10-16',
  });

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

  const onFilterChange = (value: string) => {
    if (value === "new") {
        setNewCard(true)
    } else {
        setNewCard(false)
    }
  };

  const handleSelectPaymentMethod = (method: string) => {
    setSelectedPaymentMethod(method);
    if (method == 'alipay' || method == 'wechat_pay') {
      const cny = parseFloat(invoice?.total_for_human!) * 7.5;
      const sub = parseFloat(invoice?.sub_total_for_human!) * 7.5;
      const prod = parseFloat(invoice?.order.product.price!) *7.5;
      setCnyPrice(cny.toString());
      setCnySubotal(sub.toString());
      setCnyProductPrice(prod.toString());
    }
  }

  const addPayment = (values: any) => {
    PaymentMethodApi.add(values)
      .then(() => {
      })
      .catch((error) => {
        toast({
          title: "Card Not Added!",
          description: error.response.data.message,
        });
      });
  };

  const onSubmitNew = async (values: any) => {
    setIsLoading(true);
    try {
      const paymentMethod = await stripeAPI.paymentMethods.create({
        type: 'card',
        card: {
          number: values.number,
          exp_month: parseInt(values.exp_month),
          exp_year: parseInt(values.exp_year),
          cvc: values.cvc
        }
      });
      const attachToCust = await stripe.paymentMethods.attach(
        paymentMethod.id,
        {
          customer: invoice?.user.stripe_id!
        }
      )
      addPayment({
        stripe_payment_method_id: paymentMethod.id,
        type: paymentMethod.type,
        exp_month: paymentMethod.card?.exp_month.toString(),
        exp_year: paymentMethod.card?.exp_year.toString(),
        last4: paymentMethod.card?.last4,
        brand: paymentMethod.card?.brand,
        is_default: '0'
      });
      const stripeInvoice = await stripe.invoices.create({
        customer: invoice?.user.stripe_id,
        default_payment_method: `${paymentMethod.id}`,
        metadata: {
          invoice_id: invoice?.id!,
          order_id: invoice?.order.id!,
          client_token: invoice?.order.instance.client_token!
        },
        currency: 'usd',
        description: invoice?.product_desc
      });
      const invoiceItem = await stripe.invoiceItems.create({
        customer: invoice?.user.stripe_id!,
        amount: invoice?.total!,
        invoice: stripeInvoice.id,
        currency: 'usd',
        description: invoice?.product_desc
      })
      const finalize = await stripe.invoices.finalizeInvoice(stripeInvoice.id);
      const pi_id = finalize.payment_intent?.toString();
      const paymentIntent = await stripe.paymentIntents.update(pi_id!, {
        setup_future_usage: "off_session",
        metadata: {
          invoice_id: invoice?.id!,
          order_id: invoice?.order.id!,
          client_token: invoice?.order.instance.client_token!
        },
      });
      const stripeJs = await stripePromise;
      if (!stripeJs) {
        console.error('Stripe is not initialized.');
        return;
      }
      const confirmedPaymentIntent = await stripeJs.confirmCardPayment(paymentIntent.client_secret!);
      if (confirmedPaymentIntent.paymentIntent?.status == 'succeeded') {
        router.push('/confirmation/success');
      }
      toast({
        title: t('payment_success'),
        description: t('redirect'),
      });
      setIsLoading(false);
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.response.data.message,
      });
      router.push('/confirmation/failed');
      setIsLoading(false);
      throw error;
    }
  };

  const onValueChange = (value: string) => {
    const pmId = paymentMethodList.find((pm) => pm.last4 === value) ?? null;
    setPaymentMethodId(pmId?.stripe_payment_method_id!);
  }

  const onSubmitExisting = async () => {
    setIsLoading(true);
    try {
      const paymentMethod = await stripe.paymentMethods.retrieve(
        paymentMethodId
      );
      if (paymentMethod.customer !== invoice?.user.stripe_id) {
        const attachPayment = await stripe.paymentMethods.attach(
          paymentMethodId,
          {
            customer: invoice?.user.stripe_id!
          }
        )
      }
      const stripeInvoice = await stripe.invoices.create({
        customer: invoice?.user.stripe_id,
        default_payment_method: `${paymentMethodId}`,
        metadata: {
          invoice_id: invoice?.id!,
          order_id: invoice?.order.id!
        },
        currency: 'usd',
        description: invoice?.product_desc
      });
      const invoiceItem = await stripe.invoiceItems.create({
        customer: invoice?.user.stripe_id!,
        amount: invoice?.total!,
        invoice: stripeInvoice.id,
        currency: 'usd',
        description: invoice?.product_desc
      })
      const finalize = await stripe.invoices.finalizeInvoice(stripeInvoice.id);
      const pi_id = finalize.payment_intent?.toString();
      const paymentIntent = await stripe.paymentIntents.update(pi_id!, {
        setup_future_usage: "off_session",
        metadata: {
          invoice_id: invoice?.id!,
          order_id: invoice?.order.id!
        }
      });
      const stripeJs = await stripePromise;
      if (!stripeJs) {
        console.error('Stripe is not initialized.');
        return;
      }
      const confirmedPaymentIntent = await stripeJs.confirmCardPayment(paymentIntent.client_secret!);
      if (confirmedPaymentIntent.paymentIntent?.status == 'succeeded') {
        router.push('/confirmation/success');
      }
      toast({
        title: t('payment_success'),
        description: t('redirect'),
      });
      setIsLoading(false);
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.response.data.message,
      });
      router.push('/confirmation/failed');
      setIsLoading(false);
      throw error;
    }
  };

  const payWithAlipay = async () => {
    setIsLoading(true);
    try {
      const stripeJs = await stripePromise;
      if (!stripeJs) {
        console.error('Stripe is not initialized.');
        return;
      }

      const price = (invoice?.total ?? 0) * 7.5;
      const priceString = price.toString().replace('.', '');
      const paymentIntent = await stripe.paymentIntents.create({
        amount: parseInt(priceString),
        currency: 'cny',
        payment_method_types: ["alipay"],
        customer: invoice?.user.stripe_id,
        metadata: {
          invoice_id: invoice?.id!,
          order_id: invoice?.order.id!
        },
      });
      const { error } = await stripeJs.confirmAlipayPayment(paymentIntent.client_secret!, {
        return_url: `${process.env.NEXT_PUBLIC_API_URL}/confirmation/success`,
      });
      if (error) {
        toast({
          title: "Error!",
          description: error.message,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.message,
      });
      router.push('/confirmation/failed');
      setIsLoading(false);
      throw error;
    }
  }

  const payWithWepay = async () => {
    setIsLoading(true);
    try {
      const stripeJs = await stripePromise;
      if (!stripeJs) {
        console.error('Stripe is not initialized.');
        return;
      }

      const price = (invoice?.total ?? 0) * 7.5;
      const priceString = price.toString().replace('.', '');
      const wechatPaymentIntent = await stripe.paymentIntents.create({
        amount: parseInt(priceString),
        currency: 'cny',
        payment_method_types: ["wechat_pay"],
        customer: invoice?.user.stripe_id,
        metadata: {
          invoice_id: invoice?.id!,
          order_id: invoice?.order.id!
        },
      });
      const { error, paymentIntent } = await stripeJs.confirmWechatPayPayment(wechatPaymentIntent.client_secret!, {
        payment_method_options: {
          wechat_pay: {
            client: 'web',
          },
        },
        return_url: `${process.env.NEXT_PUBLIC_API_URL}/confirmation/success`,
      });
      if (error) {
        toast({
          title: "Error!",
          description: error.message,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.message,
      });
      router.push('/confirmation/failed');
      setIsLoading(false);
      throw error;
    }
  }

  useEffect(() => {
    const getInvoiceByNo = () => {
      setIsLoading(true);
      InvoiceApi.getInvoiceByInvoiceNumber(invoice_no)
        .then((res) => {
          setInvoice(res.data);
          let spec = JSON.parse(res.data.order.product.specifications);
          setSpecs(spec);
        })
        .catch((err) => {
          toast({
            title: "Error!",
            description: err.response.data.message,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    const getDefaultPaymentMethod = () => {
      PaymentMethodApi.getDefault()
        .then((res) => {
          setPaymentMethodId(res.data.stripe_payment_method_id);
          setDefaultCard(res.data.last4);
        })
        .catch((err) => {
          toast({
            title: "Error!",
            description: err.response.data.message,
          });
        })
    };
    const getPaymentMethodList = () => {
      PaymentMethodApi.get(locale, 99)
        .then((res) => {
          setPaymentMethodList(res.data.data);
        })
        .catch((err) => {
          toast({
            title: "Error!",
            description: err.response.data.message,
          });
        })
    };
    if (paymentMethodList.length == 0) {
      setNewCard(true);
      setcardNewOrExisting('new');
    } else {
      setNewCard(false);
      setcardNewOrExisting('existing');
    };
    
    setSelectedPaymentMethod('card');
    getDefaultPaymentMethod();
    getPaymentMethodList();
    getInvoiceByNo();
  }, [invoice_no, paymentMethodList.length, toast]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-8">
        <div className="lg:col-span-2 order-last lg:order-first">
          <div role="presentation" className="lg:px-4">
            <Breadcrumbs separator=">" style={{color: "#9ca3af"}} aria-label="breadcrumb">
              <Links underline="hover" style={{color: "#9ca3af"}} href="/">
                {tGeneral('home')}
              </Links>
              <Links underline="hover" style={{color: "#9ca3af"}} href="/u/dashboard">
                {tGeneral('dashboard')}
              </Links>
              <Links underline="hover" style={{color: "#9ca3af"}} href="/u/billings">
                {tGeneral('my_billing')}
              </Links>
              <Typography className="text-white">{tGeneral('payment')}</Typography>
            </Breadcrumbs>
          </div>
            <h1 className="text-2xl font-bold uppercase mb-8">
              {t('invoice_payment')}
            </h1>
            <p className="mb-2 font-bold text-orange-500">
              {t('invoice_created')}
            </p>
            <h2 className="text-xl font-bold mb-2">
              {t('select_payment')}
            </h2>
            <div className="mb-4">
              <div className="divide-y py-2">
                <RadioGroup
                  className="mb-4 flex"
                  onValueChange={(e) => handleSelectPaymentMethod(e)}
                  defaultValue="card"
                >
                  <div className="flex items-center space-x-2 mr-4">
                    <RadioGroupItem value="card" id="card" />
                    <Label
                      htmlFor="visa"
                      className="flex flex-row justify-center items-center bg-white rounded p-2 text-black gap-2"
                    >
                      <div className="">
                        <Image src={visa} alt="Visa" width={24} height={24} />
                      </div>
                      {tGeneral('cards')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mr-4">
                    <RadioGroupItem value="alipay" id="alipay" />
                    <Label
                      htmlFor="alipay"
                      className="flex flex-row justify-center items-center bg-white rounded p-2 text-black gap-2"
                    >
                      <div className="">
                        <Image
                          src={alipay}
                          alt="Alipay"
                          width={24}
                          height={24}
                        />
                      </div>
                      {tGeneral('alipay')}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wechat_pay" id="wechat_pay" />
                    <Label
                      htmlFor="wechat_pay"
                      className="flex flex-row justify-center items-center bg-white rounded p-2 text-black gap-2"
                    >
                      <div className="">
                        <Image
                          src={weixin}
                          alt="WeChat Pay"
                          width={24}
                          height={24}
                        />
                      </div>
                      {tGeneral('wechat')}
                    </Label>
                  </div>
                </RadioGroup>
                {selectedPaymentMethod == 'card' ? (
                <RadioGroup defaultValue={cardNewOrExisting} onValueChange={onFilterChange}>
                  {paymentMethodList.length > 0 &&
                  <div className="flex items-center space-x-2 p-3">
                    <RadioGroupItem value="existing" id="existing" />
                    <Label htmlFor="existing">
                      {t('use_existing')}
                    </Label>
                  </div>
                  }
                  <div className="flex items-center space-x-2 p-3">
                    <RadioGroupItem value="new" id="new" />
                    <Label htmlFor="new">{t('enter_new_card')}</Label>
                  </div>
                </RadioGroup>
                ) : (
                  ''
                )}
              </div>
            </div>
            {/* <div className="mb-4">
                <div className="lg:col-span-2 text-bold">
                    Billing Address
                </div>
                <div className="lg:col-span-2">
                    Address
                </div>
            </div> */}
            <div>
                { selectedPaymentMethod == 'card' && newCard &&
                <div className="flex flex-col gap-2">
                  <form
                      onSubmit={handleSubmit(onSubmitNew)}
                      className="space-y-4 lg:w-1/2"
                  >
                    <div>
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {t('card_number')}
                      </label>
                      <input
                        {...register('number', { required: true })}
                        className="flex h-10 mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        type="text"
                        placeholder={t('card_number')}
                      />
                      {errors.number && 
                      <div style={{padding: "5px 8px", backgroundColor: "#e74141", borderRadius: "8px", marginTop: "8px"}}>
                        <p className="text-sm font-medium">{tContact('field_required')}</p>
                      </div>
                      }
                    </div>
                      <div className="grid gap-4 grid-cols-2">
                        <div>
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t('exp_month')}
                          </label>
                          <input
                            {...register('exp_month', { required: true })}
                            className="flex h-10 mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            type="number"
                            min={1}
                            max={12}
                            placeholder={t('exp_month')}
                          />
                          {errors.exp_month && 
                          <div style={{padding: "5px 8px", backgroundColor: "#e74141", borderRadius: "8px", marginTop: "8px"}}>
                            <p className="text-sm font-medium">{tContact('field_required')}</p>
                          </div>
                          }
                        </div>
                        <div>
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t('exp_year')}
                          </label>
                          <input
                            {...register('exp_year', { required: true })}
                            className="flex h-10 mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            type="number"
                            min={new Date().getFullYear()}
                            placeholder={t('exp_year')}
                          />
                          {errors.exp_year && 
                          <div style={{padding: "5px 8px", backgroundColor: "#e74141", borderRadius: "8px", marginTop: "8px"}}>
                            <p className="text-sm font-medium">{tContact('field_required')}</p>
                          </div>
                          }
                        </div>
                      </div>
                      <div className="grid gap-4 grid-cols-2">
                        <div>
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            CVV/CVC2
                          </label>
                          <input
                            {...register('cvc', { required: true })}
                            className="flex h-10 mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            type="password"
                          />
                          {errors.cvc && 
                          <div style={{padding: "5px 8px", backgroundColor: "#e74141", borderRadius: "8px", marginTop: "8px"}}>
                            <p className="text-sm font-medium">{tContact('field_required')}</p>
                          </div>
                          }
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger style={{alignSelf: "end"}} onClick={(e) => e.preventDefault()}>
                              {tPayment('find_cvc')}
                            </TooltipTrigger>
                            <TooltipContent>
                            <Image
                              src={cvc}
                              alt="CVC Number"
                            />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <Button
                        type="submit"
                        variant="secondary"
                        size={"default"}
                        className="bg-orange-500 text-white w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          t("submit")
                        )}
                      </Button>
                  </form>
                </div>
                }
                { selectedPaymentMethod == 'card' && !newCard &&
                  <div>
                    <Select
                      onValueChange={onValueChange}
                      value={defaultCard}
                    >
                      <SelectTrigger className="sm:w-full lg:w-[240px] mt-4">
                        <SelectValue placeholder={t('select_card')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {paymentMethodList.map((item, key) => (
                            <SelectItem
                              key={key}
                              value={item.last4}
                            >
                              {item.last4}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="secondary"
                      size={"default"}
                      className="bg-orange-500 text-white mt-4"
                      onClick={onSubmitExisting}
                      disabled={isLoading || paymentMethodId == undefined}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        t("submit")
                      )}
                    </Button>
                  </div>
                }
                { selectedPaymentMethod == 'alipay' && 
                  <Button
                    className="bg-orange-500 text-white"
                    variant="secondary"
                    onClick={payWithAlipay}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      t("submit")
                    )}
                  </Button>
                }
                { selectedPaymentMethod == 'wechat_pay' && 
                  <Button
                    variant="secondary"
                    className="bg-orange-500 text-white"
                    onClick={payWithWepay}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      t("submit")
                    )}
                  </Button>
                }
            </div>
        </div>
        <div className="lg:col-span-2">
          <div className="lg:p-4">
            <Card style={{borderRadius: "10px"}}>
                <CardHeader className="bg-orange-500 p-2" style={{borderTopRightRadius: "10px", borderTopLeftRadius: "10px"}}>
                    <CardTitle className="text-md flex flex-row justify-center">
                        {invoice?.invoice_no}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table className="mb-4">
                        <TableHeader>
                            <TableRow>
                            <TableHead style={{textAlign: "left"}}>{t('desc')}</TableHead>
                            <TableHead style={{textAlign: "right"}}>{t('amount')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                  {/* <p>
                                    {invoice?.order.product.name}
                                  </p> */}
                                  {/* <p>
                                    {t('period')}: {invoice?.order.product.period} {t('month')}, {t('region')}: {invoice?.order.region}
                                  </p> */}
                                  <p>
                                    {invoice?.product_desc}
                                  </p>
                                </TableCell>
                                {selectedPaymentMethod == 'card' ? (
                                <TableCell style={{textAlign: "right"}}>${invoice?.order.product.price} USD</TableCell>
                                ) : (
                                <TableCell style={{textAlign: "right"}}>¥{cnyProductPrice} CNY</TableCell>
                                )}
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{textAlign: "right"}}>{t('subtotal')}</TableCell>
                                {selectedPaymentMethod == 'card' ? (
                                <TableCell style={{textAlign: "right"}}>${invoice?.sub_total_for_human} USD</TableCell>
                                ) : (
                                <TableCell style={{textAlign: "right"}}>¥{cnySubtotal} CNY</TableCell>
                                )} 
                            </TableRow>
                            <TableRow>
                                <TableCell style={{textAlign: "right"}}>{t('tax')}</TableCell>
                                {selectedPaymentMethod == 'card' ? (
                                <TableCell style={{textAlign: "right"}}>{invoice?.tax == 0 ? "$0.00" : invoice?.tax} USD</TableCell>
                                ) : (
                                <TableCell style={{textAlign: "right"}}>{invoice?.tax == 0 ? "¥0.00" : invoice?.tax} CNY</TableCell>
                                )}
                            </TableRow>
                            <TableRow>
                                <TableCell style={{textAlign: "right"}}>{t('total_due')}</TableCell>
                                {selectedPaymentMethod == 'card' ? (
                                <TableCell style={{textAlign: "right"}}>${invoice?.total_for_human} USD</TableCell>
                                ) : (
                                <TableCell style={{textAlign: "right"}}>¥{cnyPrice} CNY</TableCell>
                                )}
                            </TableRow>
                        </TableBody>
                    </Table>
                    {/* <div className="p-8">
                        <h4 className="font-bold text-center">
                            {t('payment_to_date')}
                        </h4>
                        <h4 className="font-bold text-center">
                            {t('balance_due')}
                        </h4>
                    </div> */}
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
