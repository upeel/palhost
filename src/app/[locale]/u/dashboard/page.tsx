"use client";
import { useToast } from "@/components/ui/use-toast";
import InstanceApi from "@/lib/apis/instance-api";
import { Instance } from "@/types/instance";
import {
  ArrowDown,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  Loader2,
  LogOut,
  ScrollText,
  Server,
  ShoppingBag,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { use, useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import LeftMenuItem from "@/components/left-menu-item";
import { useRouter, Link } from "@/lib/navigation";
import Stats from "@/components/stats";
import UserHelper from "@/lib/user-helper";
import useCurrentUserStore from "@/store/currentUserStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserApi from "@/lib/apis/user-api";
import { Dashboard } from "@/types/dashboard";
import InvoiceApi from "@/lib/apis/invoice-api";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Links from '@mui/material/Link';
import SkeletonCard from "@/components/ui/skeleton-card";

export default function Dashboard({
  params: { locale },
}: Readonly<{ params: { locale: string } }>) {
  const t = useTranslations("dashboard");
  const genericT = useTranslations("general");
  const tService = useTranslations("service");
  const [instances, setInstances] = useState([] as Instance[]);
  const { toast } = useToast();
  const router = useRouter();
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [actionIsOpen, setActionIsOpen] = useState(true);
  const { user } = useCurrentUserStore();
  const [dashboardData, setDashboardData] = useState<Dashboard | null>(null);

  const getInstances = () => {
    setIsLoading(true);
    InstanceApi.getActiveList()
      .then((res) => {
        setInstances(res.data);
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

  const getUnpaidInvoice = () => {
    setIsLoading(true);
    InvoiceApi.getUnpaid(10)
      .then((res) => {
        setTotalUnpaid(res.data.data.length);
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

  const getDashboardData = () => {
    setIsLoading(true);
    UserApi.dashboard()
      .then((res) => {
        setDashboardData(res.data);
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
    getInstances();
    getDashboardData();
    getUnpaidInvoice();
  }, [toast]);

  const goToHome = () => {
    router.push("/");
  };

  const logout = () => {
    UserHelper.logout();
  };

  const gotoInstance = (token: string) => {
    router.push(`/u/instance/${token}`);
  }

  return (
    <>
    {isLoading ? (
      <SkeletonCard />
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
                {t('shortcut')}{" "}
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

                  <LeftMenuItem
                    title={t("logout")}
                    icon={<LogOut className="h-4 w-4" />}
                    onClick={() => {
                      logout();
                    }}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className="lg:col-span-3">
        <div role="presentation" className="lg:px-4">
          <Breadcrumbs separator=">" style={{color: "#9ca3af"}} aria-label="breadcrumb">
            <Links underline="hover" style={{color: "#9ca3af"}} href="/">
              {genericT('home')}
            </Links>
            <Typography className="text-white">{genericT('dashboard')}</Typography>
          </Breadcrumbs>
        </div>
          <div className="lg:p-4">
            <h1 className="text-2xl font-bold uppercase mb-8">
              {t('welcome')} {user?.name || ""}
            </h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/u/services?status=Active">
                <Stats
                  title={t('services')}
                  icon={<Server className="h-4 w-4" />}
                  value={dashboardData ? dashboardData.total_instances : 0}
                />
              </Link>
              <Link href="/u/billings?status=Unpaid">
                <Stats
                  title={t('invoices')}
                  icon={<ScrollText className="h-4 w-4" />}
                  value={dashboardData ? dashboardData.total_invoices : 0}
                />
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <Card className="rounded-none">
                <CardHeader className="bg-orange-500 p-2">
                  <CardTitle className="text-md flex flex-row justify-between">
                    <span>{t("active_server")}</span>
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        router.push("/u/services?status=Active");
                      }}
                    >
                      {t("see_all")}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {instances.map((instance, key) => (
                      <div className="p-2 cursor-pointer flex" key={key} onClick={() => gotoInstance(instance.client_token)}>
                        {instance.name} - {tService('server_id')}: <span className="ml-1" style={{color: "#3384ff"}}>{instance.client_token.substring(0, 6)}</span>
                      </div>
                    ))}
                    {isLoading ? (
                      <div className="p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : null}
                    {instances.length === 0 && !isLoading ? (
                      <div className="p-2 text-sm">{t("no_active_server")}</div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-none">
                <CardHeader className="bg-orange-500 p-2">
                  <CardTitle className="text-md flex flex-row justify-between">
                    <span>{t("unpaid_invoice")}</span>
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        router.push("/u/billings?status=Unpaid");
                      }}
                    >
                      {t("see_all")}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="divide-y">
                    {totalUnpaid > 0 &&
                    <span>{t('you_have')} {totalUnpaid} {t('unpaid_desc')}</span>
                    }
                    {isLoading ? (
                      <div className="p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : null}
                    {totalUnpaid === 0 && !isLoading ? (
                      <div className="p-2 text-sm">{t("no_unpaid_invoice")}</div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
