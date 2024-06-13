"use client";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowDown,
  Banknote,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  ScrollText,
  Trash2
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import LeftMenuItem from "@/components/left-menu-item";
import { Link } from "@/lib/navigation";
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
import { PaymentMethod } from "@/types/payment-method";
import PaymentMethodApi from "@/lib/apis/payment-method-api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AddPaymentDialog } from "@/components/add-payment";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Links from '@mui/material/Link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SkeletonElement from "@/components/ui/skeleton";

export default function Billings({
  params: { locale },
}: Readonly<{ params: { locale: string } }>) {
  const t = useTranslations();
  const tGeneral = useTranslations("general");
  const [paymentMethods, setPaymentMethods] = useState([] as PaymentMethod[]);
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionIsOpen, setActionIsOpen] = useState(true);
  const [removeDefaultCCAlert, setRemoveDefaultCCAlert] = useState(false);

  const getPaymentMethods = () => {
    setIsLoading(true);
    PaymentMethodApi.get(locale, 99)
      .then((res) => {
        setPaymentMethods(res.data.data);
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

  useEffect(() => {
    getPaymentMethods();
  }, [showAddDialog]);

  const makeDefault = (id: string) => {
    setIsLoading(true);
    PaymentMethodApi.makeDefault(id)
      .then((res) => {
        toast({
          title: t('payment_methods.success1'),
          description: t('payment_methods.updated'),
        });
        getPaymentMethods();
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

  const remove = (id: string, isDefault: boolean) => {
    setIsLoading(true);
    PaymentMethodApi.delete(id)
      .then((res) => {
        if (isDefault && paymentMethods.length > 1) {
          setRemoveDefaultCCAlert(true);
          const timer = setTimeout(() => {
            setRemoveDefaultCCAlert(false);
          }, 3000);
           return () => clearTimeout(timer);
        }
        toast({
          title: t('payment_methods.success1'),
          description: t('payment_methods.removed'),
        });
        getPaymentMethods();
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

  return (
    <>
    {isLoading ? (
      <SkeletonElement />
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-8">
        <div className="lg:col-span-1 order-last lg:order-first">
          <Collapsible
            className="lg:me-4"
            onOpenChange={setActionIsOpen}
            open={actionIsOpen}
          >
            <CollapsibleTrigger className="w-full">
              <div className="p-4 bg-orange-500 w-full text-sm font-bold uppercase flex flex-row justify-between items-center">
                {t('payment_methods.billing')}
                {actionIsOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="text-sm border border-zinc-100">
              <div>
                <div className="divide-y">
                  <Link href="/u/billings">
                    <LeftMenuItem
                      title={t("billings.my_invoices")}
                      icon={<ScrollText className="h-4 w-4" />}
                    />
                  </Link>

                  <Link href="/u/cards">
                    <LeftMenuItem
                      title={t("billings.manage_cards")}
                      icon={<Banknote className="h-4 w-4" />}
                    />
                  </Link>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className="lg:col-span-3">
          <div role="presentation" className="lg:px-4">
            <Breadcrumbs separator=">" style={{color: "#9ca3af"}} aria-label="breadcrumb">
              <Links underline="hover" style={{color: "#9ca3af"}} href="/">
                {tGeneral('home')}
              </Links>
              <Links underline="hover" style={{color: "#9ca3af"}} href="/u/dashboard">
                {tGeneral('dashboard')}
              </Links>
              <Typography className="text-white">{tGeneral('payment_method')}</Typography>
            </Breadcrumbs>
          </div>
          <div className="lg:p-4">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-2xl font-bold uppercase mb-8">
                {t("payment_methods.title")}
              </h1>
              <Button
                size={"sm"}
                onClick={() => {
                  setShowAddDialog(true);
                }}
              >
                {t('payment_methods.add')}
              </Button>
            </div>
            <Table>
              <TableCaption>{t("payment_methods.table.footer")}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("payment_methods.table.brand")}</TableHead>
                  <TableHead>{t("payment_methods.table.card_no")}</TableHead>
                  <TableHead>
                    {t("payment_methods.table.expiry_date")}
                  </TableHead>
                  <TableHead>{t("general.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentMethods.map((instance, key) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium">
                      {instance.brand}
                    </TableCell>
                    <TableCell>{instance.last4}</TableCell>
                    <TableCell>
                      {instance.exp_month}/{instance.exp_year}
                    </TableCell>
                    <TableCell>
                      {!instance.is_default ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                size={"icon"}
                                variant={"ghost"}
                                onClick={() => {
                                  makeDefault(instance.id);
                                }}
                                className="text-xs rounded-none h-10 w-10"
                              >
                                {isLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                {t("payment_methods.table.make_default")}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : null}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                size={"icon"}
                                variant={"ghost"}
                                onClick={() => {
                                  remove(instance.id, instance.is_default);
                                }}
                                className="text-xs rounded-none h-10 w-10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                {t("payment_methods.table.remove")}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    )}

      {showAddDialog && <AddPaymentDialog onOpenChange={setShowAddDialog} />}
      {removeDefaultCCAlert &&
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{padding: "1.5rem"}}>
              {t('removed_default_cc')}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4" style={{marginTop: "1px solid #CECECE"}}>
            <p className="text-white">
              {t('select_other_cc')}
            </p>
          </div>
        </DialogContent>
      </Dialog>
      }
    </>
  );
}
