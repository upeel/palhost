"use client";

import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CheckoutApi from "@/lib/apis/checkout-api";
import ProductApi from "@/lib/apis/product-api";
import { Product } from "@/types/product";
import { Region } from "@/types/region";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import UserHelper from "@/lib/user-helper";
import { usePathname, useRouter } from "@/lib/navigation";
import { useRouter as useNextRouter } from "next/navigation";
import { Redirect } from "@/types/redirect";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Links from '@mui/material/Link';

type OrderLayoutProps = {
  product: Product;
  regions: Region[];
  lang: string;
};

const OrderLayout = (props: OrderLayoutProps) => {
  const { product, regions, lang } = props;
  const t = useTranslations("checkout");
  const tHome = useTranslations("home");
  const tGeneric = useTranslations("general");
  const { toast } = useToast();
  const router = useRouter();
  const nextRouter = useNextRouter();
  const pathname = usePathname();
  const [products, setProducts] = useState([] as Product[]);
  const [price, setPrice] = useState('');
  const [productCode, setProductCode] = useState('');

  const [selectedRegion, setSelectedRegion] = useState<Region | null>({} as Region);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegionSelected, setIsRegionSelected] = useState<boolean>(false);

  const onValueChange = (value: string) => {
    const region = regions.find((r) => r.region === value) ?? null;
    setSelectedRegion(region);
    setIsRegionSelected(true);
    getProductFilterRegion(value);
  };
  const onFilterChange = (value: string) => {
    const prod = products.find((p) => p.code === value) ?? null;
    setPrice(prod?.price.toString()!);
    setProductCode(value);
  };

  async function getProductFilterRegion(region: string) {
    const productByRegion = await ProductApi.getProductByRegion(product.name, region);
    setProducts(productByRegion.data.products);
    const productMonthly = productByRegion.data.products.find((pr: { period: number; }) => pr.period === 1) ?? null;
    setProductCode(productMonthly?.code!);
    setPrice(productMonthly.price);
  }

  useEffect(() => {
    async function getProduct() {
      const products = await ProductApi.getProductByName(product.name);
      setProducts(products.data.products);
    }
    const setRegionFirstLoad = () => {
      const region = regions.find((r) => r.region === 'ap-singapore') ?? null;
      setSelectedRegion(region);
      setIsRegionSelected(true)
    };
    getProduct();
    setRegionFirstLoad();
    setProductCode(product.code);
    setPrice(product.price.toString());
  },[product.code, product.name, product.price, regions])
  
  const checkingOut = () => {
    if (!UserHelper.isLoggedIn()) {
      toast({
        title: t('not_logged'),
        description: t('please_login'),
      });

      const redirect = {
        url: pathname,
      } as Redirect;

      localStorage.setItem("redirect", JSON.stringify(redirect));

      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);

    if (!selectedRegion) {
      toast({
        title: "Select a region.",
        description: "Please select a region to continue.",
      });
      setIsLoading(false);
      return;
    }

    CheckoutApi.checkout({
      product_code: productCode,
      region: selectedRegion.region,
    })
      .then((res) => {
        toast({
          title: t('checkout_created'),
          description: t('redirect'),
        });
        const invoice_no = res.data.checkout.invoice_id;
        router.push(`/u/billings/pay/${invoice_no}`);
      })
      .catch((err) => {
        toast({
          title: "An error occurred.",
          description: err.response.data.message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <div role="presentation" className="mb-3">
        <Breadcrumbs separator=">" style={{color: "#9ca3af"}} aria-label="breadcrumb">
          <Links underline="hover" style={{color: "#9ca3af"}} href="/">
            {tGeneric('home')}
          </Links>
          <Typography className="text-white">{tGeneric('order_detail')}</Typography>
        </Breadcrumbs>
      </div>
      <h1 className="text-3xl uppercase font-bold">{t("title")}</h1>
      <h3>{t("subtitle")}</h3>
      <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-4 mt-8">
        <div className="sm:col-auto lg:col-span-2">
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle>Palword {product.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>{t("upgrade_any_time")}</p>
              <ul className="list-disc ms-8 mb-4">
                {product.name == 'Rift' &&
                  <li>10 Slots</li>
                }
                {product.name == 'Nebula' &&
                  <li>20 Slots</li>
                }
                {product.name == 'Zenith' &&
                  <li>32 Slots</li>
                }
                <li>{t("01")}</li>
                <li>{t("02")}</li>
                <li>{t("03")}</li>
                <li>{t("04")}</li>
                <li>{t("05")}</li>
                <li>{t("06")}</li>
              </ul>
              <h1 className="font-bold text-orange-500">{t("high_demand")}</h1>
            </CardContent>
          </Card>
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle>{t("selected_server")}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-y-8 gap-x-8">
              <div className="lg:col-span-1">
                <ProductCard product={product} lang={lang} hideOrderButton />
              </div>
              <div className="lg:col-span-2">
                <h1>
                  {t("select_region")} <span className="text-red-500">*</span>
                </h1>
                <Select
                  onValueChange={onValueChange}
                  value={selectedRegion?.region}
                >
                  <SelectTrigger className="sm:w-full lg:w-[240px] mt-4">
                    <SelectValue placeholder={t("select_region_placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {regions.map((region: Region) => (
                        <SelectItem
                          key={region.region}
                          value={region.region}
                          disabled={region.product_code == null}
                        >
                          {region.regionName}{" "}
                          {region.product_code == null ? "(Not available)" : ""}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <h1 className="mt-3 mb-4">
                  {t('billing_cycle')}
                </h1>
                <RadioGroup value={productCode} onValueChange={onFilterChange}>
                  {products.map((item, key) => (
                    <div key={key}>
                      {item.period == 1 &&
                      <div className="flex items-center space-x-2 p-3" style={{justifyContent: "space-between", border: "1px solid #CECECE"}}>
                        <div>
                          <RadioGroupItem value={item.code} id="monthly" />
                          <Label htmlFor="monthly" className="text-bold ml-2" style={{fontSize: "18px"}}>
                            {t("period.monthly")}
                          </Label>
                          <p className="ml-6" style={{fontSize: "14px"}}>
                            {t('pay_monthly')}
                          </p>
                        </div>
                        <div>
                          <p className="text-bold text-right" style={{fontSize: "18px"}}>${item.price}</p>
                          <p style={{fontSize: "14px"}}>/ {t('period.monthly')}</p>
                        </div>
                      </div>
                      }
                      {item.period == 3 &&
                      <div className="flex items-center space-x-2 p-3" style={{justifyContent: "space-between", border: "1px solid #CECECE"}}>
                        <div>
                          <div className="flex">
                            <RadioGroupItem value={item.code} id="quarterly" />
                            <Label htmlFor="quarterly" className="text-bold ml-2" style={{fontSize: "18px"}}>
                              {t("period.quarterly")}
                            </Label>
                            <span
                              className="bg-orange-500 text-white text-xs p-1"
                              style={{
                                transform: "translateX(25%)",
                              }}
                            >
                              {tHome('5_off')}
                            </span>
                          </div>
                          <p className="ml-6" style={{fontSize: "14px"}}>
                            {t('pay_quarterly')}
                          </p>
                        </div>     
                        <div>
                          <p className="text-bold text-right" style={{fontSize: "18px"}}>${item.price}</p>
                          <p style={{fontSize: "14px"}}>/ {t('period.quarterly')}</p>
                        </div>
                      </div>
                      }
                      {item.period == 6 &&
                        <div className="flex items-center space-x-2 p-3" style={{justifyContent: "space-between", border: "1px solid #CECECE"}}>
                          <div>
                            <div className="flex">
                              <RadioGroupItem value={item.code} id="semiannually" />
                              <Label htmlFor="semiannually" className="text-bold ml-2" style={{fontSize: "18px"}}>
                                {t("period.semiannually")}
                              </Label>
                              <span
                                className="bg-orange-500 text-white text-xs p-1"
                                style={{
                                  transform: "translateX(25%)",
                                }}
                              >
                                {tHome('10_off')}
                              </span>
                            </div>
                            <p className="ml-6" style={{fontSize: "14px"}}>
                              {t('pay_semiannually')}
                            </p>
                          </div>
                          <div>
                            <p className="text-bold text-right" style={{fontSize: "18px"}}>${item.price}</p>
                            <p style={{fontSize: "14px"}}>/ {t('period.semiannually')}</p>
                          </div>
                        </div>
                      }
                      {item.period == 12 &&
                        <div className="flex items-center space-x-2 p-3" style={{justifyContent: "space-between", border: "1px solid #CECECE"}}>
                          <div>
                            <div className="flex">
                              <RadioGroupItem value={item.code} id="annually" />
                              <Label htmlFor="annually" className="text-bold ml-2" style={{fontSize: "18px"}}>
                                {t("period.annually")}
                              </Label>
                              <span
                                className="bg-orange-500 text-white text-xs p-1"
                                style={{
                                  transform: "translateX(25%)",
                                }}
                              >
                                {tHome('15_off')}
                              </span>
                            </div>
                            <p className="ml-6" style={{fontSize: "14px"}}>
                              {t('pay_annually')}
                            </p>
                          </div>
                          <div>
                            <p className="text-bold text-right" style={{fontSize: "18px"}}>${item.price}</p>
                            <p style={{fontSize: "14px"}}>/ {t('period.annually')}</p>
                          </div>
                        </div>
                      }
                    </div>
                  ))}
                </RadioGroup>        
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-auto">
          <Card>
            <CardHeader className="bg-orange-500 p-4">
              <CardTitle>{t("order_summary")}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2">
                <div className="text-left">{product.name}</div>
                <div className="text-right">${price}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-left">{tGeneric('tax')}</div>
                <div className="text-right">$0.00</div>
              </div>
              <div className="grid">
                <div className="text-left">
                  {t("server_location")}&nbsp;
                  {isRegionSelected ? selectedRegion?.regionName : ""}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-orange-500 p-4 flex justify-end items-end flex-col w-full">
              <h1 className="font-bold text-2xl">${price}</h1>
              <small>{t("due_today")}</small>
            </CardFooter>
          </Card>
          <div className="flex justify-center mt-4 flex-col">
            <Button
              className="rounded-none bg-orange-500 text-white uppercase"
              variant="secondary"
              onClick={checkingOut}
              disabled={isLoading || !isRegionSelected}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                t("checkout")
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderLayout;
