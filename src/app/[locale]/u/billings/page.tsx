"use client";
import { useToast } from "@/components/ui/use-toast";
import {
  Banknote,
  ChevronDown,
  ChevronUp,
  View,
  Loader2,
  ScrollText,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import LeftMenuItem from "@/components/left-menu-item";
import { useRouter, Link } from "@/lib/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import InvoiceApi from "@/lib/apis/invoice-api";
import { Invoice } from "@/types/invoice";
import { useSearchParams } from 'next/navigation'
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Links from '@mui/material/Link';
import SkeletonElement from "@/components/ui/skeleton";

export default function Billings({
  params: { locale },
}: Readonly<{ params: { locale: string } }>) {
  const t = useTranslations("billings");
  const tGeneral = useTranslations("general");
  const t2 = useTranslations("app_header");
  const [invoices, setInvoices] = useState([] as Invoice[]);
  const { toast } = useToast();
  const router = useRouter();
  const [defaultStatus, setDefaultStatus] = useState("");
  const [viewIsOpen, setViewIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [actionIsOpen, setActionIsOpen] = useState(true);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(1);
  
  const status = searchParams.get('status');

  const getInvoices = () => {
    if (status == 'Unpaid') {
      setDefaultStatus('10')
      setIsLoading(true);
      InvoiceApi.get(locale, 10, 1, rowsPerPage)
        .then((res) => {
          setInvoices(res.data.data);
          setTotal(res.data.total);
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
    } else {
      setDefaultStatus('all')
      setIsLoading(true);
      InvoiceApi.get(locale, 99, 1, rowsPerPage)
        .then((res) => {
          setInvoices(res.data.data);
          setTotal(res.data.total);
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
    }
  };

  useEffect(() => {
    getInvoices();
  }, []);

  const onFilterChange = (value: string) => {
    setDefaultStatus(value)
    if (value === "all") {
      setIsLoading(true);
      setPage(0);
      InvoiceApi.get(locale, 99, 1, rowsPerPage)
        .then((res) => {
          setInvoices(res.data.data);
          setTotal(res.data.total);
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
    } else {
      setIsLoading(true);
      setPage(0);
      InvoiceApi.get(locale, parseInt(value), 1, rowsPerPage)
        .then((res) => {
          setInvoices(res.data.data);
          setTotal(res.data.total);
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
    }
  };

  const openDetail = (value: string) => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/my-invoices/${value}/show?lang=${locale}`;
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    if (status == 'Unpaid') {
    setIsLoading(true);
    setPage(newPage);
    InvoiceApi.get(locale, 10, newPage+1, rowsPerPage)
      .then((res) => {
        setInvoices(res.data.data);
        setTotal(res.data.total);
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
    } else {
      if (defaultStatus == 'all') {
        setIsLoading(true);
        setPage(newPage);
        InvoiceApi.get(locale, 99, newPage+1, rowsPerPage)
          .then((res) => {
            setInvoices(res.data.data);
            setTotal(res.data.total);
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
      } else {
        setIsLoading(true);
        setPage(newPage);
        InvoiceApi.get(locale, parseInt(defaultStatus), newPage+1, rowsPerPage)
          .then((res) => {
            setInvoices(res.data.data);
            setTotal(res.data.total);
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
      }
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (status == 'Unpaid') {
    setIsLoading(true);
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    InvoiceApi.get(locale, 10, 1, newRowsPerPage)
      .then((res) => {
        setInvoices(res.data.data);
        setTotal(res.data.total);
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
    } else {
      if (defaultStatus === 'all') {
        setIsLoading(true);
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        InvoiceApi.get(locale, 99, 1, newRowsPerPage)
          .then((res) => {
            setInvoices(res.data.data);
            setTotal(res.data.total);
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
      } else {
        setIsLoading(true);
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        InvoiceApi.get(locale, parseInt(defaultStatus), 1, newRowsPerPage)
          .then((res) => {
            setInvoices(res.data.data);
            setTotal(res.data.total);
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
      }
    }
  };

  return (
    <>
    {isLoading ? (
      <SkeletonElement />
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-8">
        <div className="lg:col-span-1 order-last lg:order-first">
        <Collapsible
            className="lg:me-4 mb-4"
            defaultOpen={true}
            onOpenChange={setViewIsOpen}
            open={viewIsOpen}
          >
            <CollapsibleTrigger className="w-full">
              <div className="p-4 bg-orange-500 w-full text-sm font-bold uppercase flex flex-row justify-between items-center">
                {tGeneral('view')}{" "}
                {actionIsOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="text-sm border border-zinc-100">
              <div>
                <div className="divide-y py-2">
                  <RadioGroup value={defaultStatus} onValueChange={onFilterChange}>
                    <div className="flex items-center space-x-2 px-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all">{tGeneral('all')}</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2">
                      <RadioGroupItem
                        value="20"
                        id="Paid"
                      />
                      <Label htmlFor="Paid">{t('paid')}</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2">
                      <RadioGroupItem
                        value="10"
                        id="Unpaid"
                      />
                      <Label htmlFor="Unpaid">{t('unpaid')}</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2">
                      <RadioGroupItem
                        value="40"
                        id="Expired"
                      />
                      <Label htmlFor="Expired">{t('expired')}</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible
            className="lg:me-4"
            onOpenChange={setActionIsOpen}
            open={actionIsOpen}
          >
            <CollapsibleTrigger className="w-full">
              <div className="p-4 bg-orange-500 w-full text-sm font-bold uppercase flex flex-row justify-between items-center">
                {t2('billing')}
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
                      title={t("my_invoices")}
                      icon={<ScrollText className="h-4 w-4" />}
                    />
                  </Link>
                  <Link href="/u/cards">
                    <LeftMenuItem
                      title={t("manage_cards")}
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
              <Typography className="text-white">{tGeneral('my_billing')}</Typography>
            </Breadcrumbs>
          </div>
          <div className="lg:p-4">
            <h1 className="text-2xl font-bold uppercase mb-8">
              {t("my_invoices")}
            </h1>
            <Table>
              <TableCaption>{t("table.footer")}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.invoice_no")}</TableHead>
                  <TableHead>{t("table.invoice_date")}</TableHead>
                  <TableHead>{t("table.due_date")}</TableHead>
                  <TableHead>{t("table.total")}</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice, key) => (
                  <TableRow key={key} onClick={() => openDetail(invoice.invoice_no)} className="cursor-pointer">
                    <TableCell className="font-medium">
                      {invoice.invoice_no}
                    </TableCell>
                    <TableCell>{invoice.date_for_human}</TableCell>
                    <TableCell>{invoice.due_date_for_human}</TableCell>
                    <TableCell>${invoice.total_for_human} USD</TableCell>
                    <TableCell>
                    {invoice.status === 20 &&
                    <div style={{display: "inline-flex", alignItems: "center", borderRadius: "0.25rem", color: "#0aa54f", backgroundColor: "#dcf6e8", padding: "0 10px", fontWeight: "600"}}>
                      {invoice.status_in_string}
                    </div>
                    }
                    {invoice.status === 10 &&
                    <div style={{display: "inline-flex", alignItems: "center", borderRadius: "0.25rem", backgroundColor: "#ffe2e3", padding: "0 10px", color: "#ff4c51", fontWeight: "600"}}>
                      {invoice.status_in_string}
                    </div>
                    }
                    {invoice.status === 40 &&
                    <div className="text-gray-600" style={{display: "inline-flex", alignItems: "center", borderRadius: "0.25rem", backgroundColor: "#cdcdd0", padding: "0 10px"}}>
                      {invoice.status_in_string}
                    </div>
                    }
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell
                    colSpan={6}
                  >
                    <TablePagination
                      style={{color: "#FFF", fontWeight: "600"}}
                      component="div"
                      count={total}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>
      )}
    </>
  );
}
