"use client";
import { ShowPasswordDialog } from "@/components/show-password-dialog";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/components/ui/use-toast";
import InstanceApi from "@/lib/apis/instance-api";
import { Instance } from "@/types/instance";
import {
  Banknote,
  ChevronDown,
  ChevronUp,
  Cog,
  Copy,
  View,
  Loader2,
  Eye,
  ShoppingBag,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import LeftMenuItem from "@/components/left-menu-item";
import { useRouter } from "@/lib/navigation";
import { InstanceStatus } from "@/types/instance-status";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SelectPaymentDialog } from "@/components/select-payment-dialog";
import { Config } from "@/types/config";
import { ConfigDialog } from "@/components/config-dialog";
import { useSearchParams } from 'next/navigation'
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Links from '@mui/material/Link';
import SkeletonElement from "@/components/ui/skeleton";

export default function Services({
  params: { locale },
}: Readonly<{ params: { locale: string } }>) {
  const t = useTranslations("dashboard");
  const genericT = useTranslations("general");
  const tService = useTranslations("service");
  const [instances, setInstances] = useState([] as Instance[]);
  const [statuses, setStatuses] = useState([] as InstanceStatus[]);
  const { toast } = useToast();
  const router = useRouter();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [actionIsOpen, setActionIsOpen] = useState(true);
  const [viewIsOpen, setViewIsOpen] = useState(true);
  const [instance, setInstance] = useState<Instance | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [settings, setSettings] = useState([] as Config[]);
  const [selectedToken, setSelectedToken] = useState('');
  const [defaultStatus, setDefaultStatus] = useState("");
  const searchParams = useSearchParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(1);

  const status = searchParams.get('status');

  const getInstances = () => {
    if (status == 'Active') {
      setIsLoading(true);
      setDefaultStatus('3')
      InstanceApi.get(locale, 3, 1, rowsPerPage)
        .then((res) => {
          setInstances(res.data.data);
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
      setDefaultStatus('all')
      InstanceApi.get(locale, 99, 1, rowsPerPage)
        .then((res) => {
          setInstances(res.data.data);
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

  const getStatuses = () => {
    setIsLoading(true);
    InstanceApi.getStatuses(locale)
      .then((res) => {
        setStatuses(res.data);
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

  const showDetail = (token: string) => {
    router.push(`/u/instance/${token}`);
  };

  const showPassword = (token: string) => {
    setIsLoading(true);
    InstanceApi.showPassword(token)
      .then((res) => {
        setPassword(res.data.password);
        setShowPasswordDialog(true);
      })
      .catch((err) => {
        toast({
          title: "Error!",
          description: "Failed to show the password.",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const showSettings = (token: string) => {
    setIsLoading(true);
    InstanceApi.showSettings(locale, token)
      .then((res) => {
        setSettings(res.data.settings)
        setConfigDialogOpen(true)
        setSelectedToken(token)
      })
      .catch((err) => {
        toast({
          title: "Error!",
          description: "Failed to show the password.",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChangeForm = (index: number, value: string) => {
    const newArrayData = [...settings];
    newArrayData[index].value = value;
    setSettings(newArrayData);
  };

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const settingObject = {
      settings: settings
    }
    InstanceApi.updateConfig(selectedToken, settingObject)
      .then(() => {
        toast({
          title: tService('setting_updated'),
          description: tService('successfully'),
        });
      })
      .catch((error: any) => {
        const errors = error.response.data.errors;
        const errorList = Object.keys(errors).map(key => (
          `<li>${errors[key][0]}</li>`
        )).join('');
        const toastDescription = `<ul>${errorList}</ul>`;
        toast({
          title: tService('update_failed'),
          description: <div dangerouslySetInnerHTML={{ __html: toastDescription }} />,
        })
      });
  };

  useEffect(() => {
    getInstances();
    getStatuses();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copied!",
          description: "The text has been copied to your clipboard.",
        });
      })
      .catch((err) => {
        toast({
          title: "Error!",
          description: "Failed to copy the text to your clipboard.",
        });
      });
  };

  const goToHome = () => {
    router.push("/");
  };

  const onFilterChange = (value: string) => {
    setDefaultStatus(value)
    if (value === "all") {
      setIsLoading(true);
      setPage(0);
      InstanceApi.get(locale, 99, page, rowsPerPage)
        .then((res) => {
          setInstances(res.data.data);
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
      InstanceApi.get(locale, parseInt(value), page, rowsPerPage)
        .then((res) => {
          setInstances(res.data.data);
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

  const showPaymentDialog = (instance: Instance) => {
    setPaymentDialogOpen(true);
    setInstance(instance);
  };

  const makeAdvancePayment = (payment: string) => {
    if (instance) {
      setIsLoading(true);
      InstanceApi.makeAdvancePayment({
        client_token: instance.client_token,
        payment_method: payment,
      })
        .then((res) => {
          toast({
            title: "Payment created.",
            description: "We will redirect you to the payment page.",
          });
          window.location.href = res.data.checkout.url;
        })
        .catch((err) => {
          toast({
            title: "An error occurred.",
            description: "We were unable to checkout.",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const goToInstancePayment = (token: string) => {
    router.push(`/u/services/pay/${token}`);
  }

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    if (status == 'Active') {
    setIsLoading(true);
    setPage(newPage);
    InstanceApi.get(locale, 3, newPage+1, rowsPerPage)
      .then((res) => {
        setInstances(res.data.data);
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
      setPage(newPage);
      InstanceApi.get(locale, 99, newPage+1, rowsPerPage)
        .then((res) => {
          setInstances(res.data.data);
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
        InstanceApi.get(locale, parseInt(defaultStatus), newPage+1, rowsPerPage)
          .then((res) => {
            setInstances(res.data.data);
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
    if (status == 'Active') {
    setIsLoading(true);
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    InstanceApi.get(locale, 3, 1, newRowsPerPage)
      .then((res) => {
        setInstances(res.data.data);
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
      InstanceApi.get(locale, 99, 1, newRowsPerPage)
        .then((res) => {
          setInstances(res.data.data);
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
        InstanceApi.get(locale, parseInt(defaultStatus), 1, newRowsPerPage)
          .then((res) => {
            setInstances(res.data.data);
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
                {genericT('view')}{" "}
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
                      <Label htmlFor="all">{genericT('all')}</Label>
                    </div>
                    {statuses.map((status, key) => (
                      <div
                        key={key}
                        className="flex items-center space-x-2 p-2 "
                      >
                        <RadioGroupItem
                          value={status.value}
                          id={status.value}
                          checked={status.value == defaultStatus}
                        />
                        <Label htmlFor={status.value}>{status.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible
            className="lg:me-4"
            defaultOpen={true}
            onOpenChange={setActionIsOpen}
            open={actionIsOpen}
          >
            <CollapsibleTrigger className="w-full">
              <div className="p-4 bg-orange-500 w-full text-sm font-bold uppercase flex flex-row justify-between items-center">
                {genericT('actions')}{" "}
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
                  <LeftMenuItem
                    title={t("create_order")}
                    icon={<ShoppingBag className="h-4 w-4" />}
                    onClick={() => {
                      goToHome();
                    }}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className="lg:col-span-3">
        <div role="presentation" className="mb-4 ml-4">
          <Breadcrumbs separator=">" style={{color: "#9ca3af"}} aria-label="breadcrumb">
            <Links underline="hover" style={{color: "#9ca3af"}} href="/">
              {genericT('home')}
            </Links>
            <Links underline="hover" style={{color: "#9ca3af"}} href="/u/dashboard">
              {genericT('dashboard')}
            </Links>
            <Typography className="text-white">{genericT('my_service')}</Typography>
          </Breadcrumbs>
        </div>
          <Table>
            <TableCaption>{t("table.footer")}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.name")}</TableHead>
                <TableHead>{t("table.pricing")}</TableHead>
                <TableHead>{t("table.next_due_date")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead>{genericT("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instances.map((instance, key) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">
                    <div className="mb-2">
                      {instance.name}
                    </div>
                    <div className="flex">
                      {tService('server_id')}: <span className="ml-1" style={{color: "#3384ff"}}> {instance.client_token.substring(0, 6)}</span>
                    </div>
                  </TableCell>
                  <TableCell>${instance.price} USD {instance.billing_cycle}</TableCell>
                  {/* <TableCell>
                    {instance.public_ip}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 mr-2"
                      onClick={() => copyToClipboard(instance.public_ip)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </TableCell> */}
                  <TableCell>{instance.expiry_date} </TableCell>
                  <TableCell>
                    {instance.status === 3 ? (
                    <div style={{display: "inline-flex", alignItems: "center", borderRadius: "0.25rem", color: "#0aa54f", backgroundColor: "#dcf6e8", padding: "0 10px", fontWeight: "600"}}>
                      {instance.status_in_string}
                    </div>
                    ) : (
                    <div className="text-gray-600" style={{display: "inline-flex", alignItems: "center", borderRadius: "0.25rem", backgroundColor: "#cdcdd0", padding: "0 10px"}}>
                      {instance.status_in_string}
                    </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {/* <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          onClick={() => showPassword(instance.client_token)}
                          className="text-xs inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground text-xs rounded-none h-10 w-10"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{t("table.show_password")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider> */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          onClick={() => showDetail(instance.client_token)}
                          className="text-xs inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground text-xs rounded-none h-10 w-10">
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <View className="h-4 w-4" />
                            )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{t("table.show_detail")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {/* <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            size={"icon"}
                            variant={"ghost"}
                            onClick={() => goToInstancePayment(instance.client_token)}
                            className="text-xs rounded-none h-10 w-10"
                          >
                            <Banknote className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{t("table.make_payment")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider> */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          onClick={() => showSettings(instance.client_token)}
                          className="text-xs inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground text-xs rounded-none h-10 w-10"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Cog className="h-4 w-4" />
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{t("table.settings")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
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
    )}

      {showPasswordDialog && (
        <ShowPasswordDialog
          password={password}
          onOpenChange={setShowPasswordDialog}
        />
      )}

      {paymentDialogOpen && (
        <SelectPaymentDialog
          onOpenChange={setPaymentDialogOpen}
          onSelect={(payment) => makeAdvancePayment(payment)}
        />
      )}

      {configDialogOpen && (
        <ConfigDialog
          settings={settings}
          onOpenChange={setConfigDialogOpen}
          handleChange={handleChangeForm}
          handleSubmit={handleSubmitForm}
        />
      )}
    </>
  );
}
