import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "./ui/use-toast";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import PaymentMethodApi from "@/lib/apis/payment-method-api";
import Stripe from 'stripe';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import cvc from "../../public/images/ccv.webp";

export function AddPaymentDialog({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const t = useTranslations("payment_methods");
  const tContact = useTranslations('contact');
  const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!, {
    apiVersion: '2023-10-16',
  });
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const addPayment = (values: any) => {
    PaymentMethodApi.add(values)
      .then(() => {
        toast({
          title: t('card_added'),
          description: t('success'),
        });
        onOpenChange(false);
      })
      .catch((error) => {
        toast({
          title: t('failed'),
          description: error.response.data.message,
        });
      });
  };

  const onSubmit = async (values: any) => { 
    try {
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
              number: values.number,
              exp_month: parseInt(values.exp_month),
              exp_year: parseInt(values.exp_year),
              cvc: values.cvc
            }
        });
        addPayment({
          stripe_payment_method_id: paymentMethod.id,
          type: paymentMethod.type,
          exp_month: paymentMethod.card?.exp_month.toString(),
          exp_year: paymentMethod.card?.exp_year.toString(),
          last4: paymentMethod.card?.last4,
          brand: paymentMethod.card?.brand,
          is_default: '0'
        });
    } catch (error: any) {
      toast({
        title: t('failed'),
        description: error.response.data.message,
      });
    }
  };

  return (
    <Dialog defaultOpen onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            <DialogHeader>
              <DialogTitle>{t("add_card")}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">
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
                      {t('find_cvc')}
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
            </div>
            <DialogFooter className="sm:justify-start">
              <Button
                type="submit"
                variant="secondary"
                size={"sm"}
                className="bg-orange-500"
              >
                {t("save")}
              </Button>
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  );
}
