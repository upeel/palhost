"use client";
import InstanceApi from "@/lib/apis/instance-api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Fragment, useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import LeftMenuItem from "@/components/left-menu-item";
import {
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Loader2,
  Banknote
} from "lucide-react";
import { useRouter, Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { Instance } from "@/types/instance";
import { Tab } from "@headlessui/react";
import useCurrentUserStore from "@/store/currentUserStore";
import { Button } from "@/components/ui/button";
import { Config } from "@/types/config";
import CheckoutApi from "@/lib/apis/checkout-api";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Links from '@mui/material/Link';
import SkeletonCard from "@/components/ui/skeleton-card";

const ServiceDetailPage = ({ params }: { params: { locale: string, token: string } }) => {
  const [actionIsOpen, setActionIsOpen] = useState(true);
  const [instance, setInstance] = useState<Instance | null>(null);
  const [hostingInfo, setHostingInfo] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("service");
  const tDashboard = useTranslations("dashboard");
  const tCheckout = useTranslations("checkout");
  const tGeneral = useTranslations("general");
  const [config, setConfig] = useState([] as Config[]);
  const [isLoading, setIsLoading] = useState(false);
  const [disableButton, setDisablebutton] = useState(false);
  const { user } = useCurrentUserStore();

  const getSingleInstance = () => {
    InstanceApi.getInstance(params.locale, params.token)
      .then((res) => {
        setInstance(res.data);
      })
      .catch((err) => {
        toast({
          title: "Error!",
          description: err.response.data.message,
        });
      })
  };
  const getConfigOptions = () => {
    setIsLoading(true);
    InstanceApi.getConfig(params.locale, params.token)
      .then((res) => {
        setConfig(res.data.settings)
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
    getSingleInstance();
    getConfigOptions();

    const interval = setInterval(getSingleInstance, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToHome = () => {
    router.push("/");
  };

  const onTabChange = (index: number) => {
    switch (index) {
      case 0:
        setHostingInfo(true)
        break;
      case 1:
        setHostingInfo(false)
        break;
    }
  };

  const handleChange = (index: number, value: string) => {
    const newArrayData = [...config];
    newArrayData[index].value = value;
    setConfig(newArrayData);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const settingObject = {
      settings: config
    }
    InstanceApi.updateConfig(params.token, settingObject)
      .then(() => {
        toast({
          title: t('setting_updated'),
          description: t('successfully'),
        });
      })
      .catch((error: any) => {
        const errors = error.response.data.errors;
        const errorList = Object.keys(errors).map(key => (
          `<li>${errors[key][0]}</li>`
        )).join('');
        const toastDescription = `<ul>${errorList}</ul>`;
        toast({
          title: t('update_failed'),
          description: <div dangerouslySetInnerHTML={{ __html: toastDescription }} />,
        });
      });
  };

  const restartService = () => {
    setIsLoading(true);
    InstanceApi.restart(params.token)
      .then((res) => {
        getSingleInstance();
        toast({
          title: res.data.message
        });
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

  const startService = () => {
    setIsLoading(true);
    InstanceApi.start(params.token)
      .then((res) => {
        getSingleInstance();
        toast({
          title: res.data.message
        });
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

  const stopService = () => {
    setIsLoading(true);
    InstanceApi.stop(params.token)
      .then((res) => {
        getSingleInstance();
        toast({
          title: res.data.message
        });
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

  const updateService = () => {
    setIsLoading(true);
    InstanceApi.update(params.token)
      .then((res) => {
        getSingleInstance();
        toast({
          title: res.data.message
        });
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

  const makePayment = () => {
    setIsLoading(true);
    CheckoutApi.checkout({
      product_code: instance?.code!,
      region: instance?.region!,
    })
      .then((res) => {
        toast({
          title: tCheckout('checkout_created'),
          description: tCheckout('redirect'),
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
    {isLoading ? (
      <SkeletonCard />
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-8">
        <div className="lg:col-span-1 order-last lg:order-first">
          <Collapsible
            className="lg:me-4"
            defaultOpen={true}
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
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className="lg:col-span-2 order-first lg:order-last">
          <div role="presentation" className="lg:px-4 mb-4">
            <Breadcrumbs separator=">" style={{color: "#9ca3af"}} aria-label="breadcrumb">
              <Links underline="hover" style={{color: "#9ca3af"}} href="/">
                {tGeneral('home')}
              </Links>
              <Links underline="hover" style={{color: "#9ca3af"}} href="/u/dashboard">
                {tGeneral('dashboard')}
              </Links>
              <Links underline="hover" style={{color: "#9ca3af"}} href="/u/services">
                {tGeneral('my_service')}
              </Links>
              <Typography className="text-white">{tGeneral('service_details')}</Typography>
            </Breadcrumbs>
          </div>
          {instance?.status_in_string === 'Active' ? (
          <div className="lg:me-4" style={{backgroundColor: "#dcf6e8", borderRadius: "10px"}}>
            <div style={{padding: "24px 0 0 0", borderRadius: "10px", backgroundColor: "#101010", lineHeight: "1em", textAlign: "center"}}>
              <div className="mb-8">
                <div className="h-32 w-32" style={{marginLeft: "auto", marginRight: "auto", backgroundColor: "#222222", borderRadius: "50%"}} />
              </div>
              <div style={{borderRadius: "10px", fontSize: "24px"}}>
                <h3 className="mb-4">
                  {instance?.name}
                </h3>
              </div>
              <div className="text-center p-4">
                {instance?.description}
              </div>
            </div>
            <div className="p-2 text-center" style={{color: "#0aa54f", fontWeight: "600"}}>
              {instance.status_in_string}
            </div>
          </div>
          ) : (
          <div className="lg:me-4" style={{backgroundColor: "#cdcdd0", borderRadius: "10px"}}>
            <div style={{padding: "24px 0 0 0", borderRadius: "10px", backgroundColor: "#101010", lineHeight: "1em", textAlign: "center"}}>
              <div className="mb-8">
                <div className="h-32 w-32" style={{marginLeft: "auto", marginRight: "auto", backgroundColor: "#222222", borderRadius: "50%"}} />
              </div>
              <div style={{borderRadius: "10px", fontSize: "24px"}}>
                <h3 className="mb-4">
                  {instance?.name}
                </h3>
              </div>
              <div className="text-center p-4">
                {instance?.description}
              </div>
            </div>
            <div className="p-2 text-center text-gray-600">
              {instance?.status_in_string}
            </div>
          </div>
          )}
          <div className="flex p-4 lg:me-4" style={{justifyContent: "space-between"}}>
            <Button
              type="button"
              variant="secondary"
              size={"sm"}
              className="bg-blue-500"
              style={{width: "22%"}}
              onClick={restartService}
              disabled={instance?.status == 4}
            >
              {t("restart")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size={"sm"}
              className="bg-green-500"
              style={{width: "22%"}}
              onClick={startService}
              disabled={instance?.status == 3}
            >
              {t("start")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size={"sm"}
              className="bg-orange-500"
              style={{width: "22%"}}
              onClick={updateService}
              disabled={instance?.status == 3}
            >
              {t("update")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size={"sm"}
              className="bg-red-500"
              style={{width: "22%"}}
              onClick={stopService}
              disabled={instance?.status == 4}
            >
              {t("stop")}
            </Button>
          </div>
          <div className="flex p-4 lg:me-4">
            <Button
              className="rounded-none bg-orange-500 text-white uppercase w-full"
              variant="secondary"
              onClick={makePayment}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <div className="flex" style={{alignItems: "center"}}>
                  <Banknote className="h-6 w-6 mr-2" />
                  <span>{tDashboard("table.make_payment")}</span>
                </div>
              )}
            </Button>
          </div>
        </div>
        <div className="lg:col-span-2 order-first lg:order-last">
          <Card>
            <CardHeader className="p-2 mt-2 text-center">
              <CardTitle>{t('registration_date')}</CardTitle>
            </CardHeader>
            <CardContent className="p-2 mb-2 text-center">
              <CardDescription>{instance?.created_at_for_human}</CardDescription>
            </CardContent>
            <CardHeader className="p-2 text-center">
              <CardTitle>{t('recurring_amount')}</CardTitle>
            </CardHeader>
            <CardContent className="p-2 mb-2 text-center">
              <CardDescription>${instance?.price_for_human} USD</CardDescription>
            </CardContent>
            <CardHeader className="p-2 text-center">
              <CardTitle>{t('billing_cycle')}</CardTitle>
            </CardHeader>
            <CardContent className="p-2 mb-2 text-center">
              <CardDescription>{instance?.billing_cycle}</CardDescription>
            </CardContent>
            <CardHeader className="p-2 mt-2 text-center">
              <CardTitle>{t('next_due_date')}</CardTitle>
            </CardHeader>
            <CardContent className="p-2 mb-2 text-center">
              <CardDescription>{instance?.expiry_date}</CardDescription>
            </CardContent>
            <CardHeader className="p-2 mt-2 text-center">
              <CardTitle>{t('payment_method')}</CardTitle>
            </CardHeader>
            <CardContent className="p-2 mb-2 text-center">
              <CardDescription>{t('ccdebit')}</CardDescription>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 order-first lg:order-last">
        </div>
        <div className="lg:col-span-4 order-first lg:order-last" style={{whiteSpace: "nowrap"}}>
          <div className="flex p-4">
            <div className="items-center">
              <Tab.Group onChange={onTabChange}>
                <Tab.List as="div" style={{whiteSpace: "normal"}}>
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <button
                        className={`${
                          selected ? "bg-orange-500" : "bg-black"
                        } text-white p-2 uppercase font-bold text-md relative min-w-28 mr-4 md:mr-0 mb-6 md:mb-0`}
                      >
                        {t("hosting_info")}
                      </button>
                    )}
                  </Tab>
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <button
                        className={`${
                          selected ? "bg-orange-500" : "bg-black"
                        } text-white p-2 uppercase font-bold text-md relative min-w-28 mr-4 md:mr-0 mb-6 md:mb-0`}
                      >
                        {t("configurable")}
                      </button>
                    )}
                  </Tab>
                </Tab.List>
              </Tab.Group>
            </div>
          </div>
          {hostingInfo ? (
          <Card className="flex justify-center p-4" style={{flexDirection: "column", alignItems: "center"}}>
            <CardContent className="grid grid-cols-2">
              <div className="font-bold mr-4 ml-auto">
                {t('ip_address')}
              </div>
              <div>
                {instance?.public_ip}
              </div>
            </CardContent>
            <CardContent className="grid grid-cols-2">
              <div className="font-bold mr-4 ml-auto">
                {t('slot')}
              </div>
              <div>
                {instance?.description}
              </div>
            </CardContent>
            <CardContent className="grid grid-cols-2">
              <div className="font-bold mr-4 ml-auto">
                {t('port')}
              </div>
              <div>
                {instance?.port}
              </div>
            </CardContent>
            <CardContent className="grid grid-cols-2">
              <div className="font-bold mr-4 ml-auto">
                {t('server_location')}
              </div>
              <div>
                {instance?.server_region}
              </div>
            </CardContent>
            <CardContent className="grid grid-cols-2">
              <div className="font-bold mr-4 ml-auto">
                {t('username')}
              </div>
              <div>
                {user?.email}
              </div>
            </CardContent>
            <CardContent className="grid grid-cols-2">
              <div className="font-bold mr-4 ml-auto">
                {t('password')}
              </div>
              <div style={{whiteSpace: "normal"}}>
                {t('check_email')}
                <Link
                  style={{color: "#009fea"}} 
                  href="/u/setting/change-password"
                >
                  &nbsp;{t('reset_password')}
                </Link>
              </div>
            </CardContent>
          </Card>
            ) : (
            <Card className="p-4">
              <form onSubmit={handleSubmit} className="w-full">
                {config.map((item, key) => (
                  item.key !== 'ServerPlayerMaxNum' &&
                  <div key={key} className="flex p-3" style={{justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #222"}}>
                    <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" style={{whiteSpace: "normal"}}>
                      {item.display}
                    </div>
                    {(item.value == "False" || item.value == "True") && (item.key !== 'DeathPenalty' && item.key !== 'Difficulty') &&
                    <select
                      key={key}
                      onChange={(e) => handleChange(key, e.target.value)}
                      defaultValue={item.value}
                      className="cursor-pointer flex h-10 w-1/3 border-white items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 mt-4"
                      disabled={item.allow_edit !== 1}
                    >
                      <option
                        value="True"
                      >
                        {t('enabled')}
                      </option>
                      <option
                        value="False"
                      >
                        {t('disabled')}
                      </option>
                    </select>
                    }
                    {(item.value !== "False" && item.value !== "True") && (item.key !== 'DeathPenalty' && item.key !== 'Difficulty') &&
                    <input
                      key={key}
                      className="flex h-10 w-1/3 rounded-md border border-white bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      value={item.value}
                      onChange={(e) => handleChange(key, e.target.value)}
                      disabled={item.allow_edit !== 1}
                    />
                    }
                    {item.key == 'DeathPenalty' &&
                      <select
                      key={key}
                      onChange={(e) => handleChange(key, e.target.value)}
                      defaultValue={item.value}
                      className="cursor-pointer flex h-10 w-1/3 border-white items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 mt-4"
                      disabled={item.allow_edit !== 1}
                    >
                      <option
                        value="DropAll"
                      >
                        {t('drop_all')}
                      </option>
                      <option
                        value="None"
                      >
                        {t('none')}
                      </option>
                      <option
                        value="DropItemsOnly"
                      >
                        {t('drop_item')}
                      </option>
                      <option
                        value="DropItemsAndEquipment"
                      >
                        {t('drop_item_equipment')}
                      </option>
                    </select>
                    }
                    {item.key == 'Difficulty' &&
                      <select
                      key={key}
                      onChange={(e) => handleChange(key, e.target.value)}
                      defaultValue={item.value}
                      className="cursor-pointer flex h-10 w-1/3 border-white items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 mt-4"
                      disabled={item.allow_edit !== 1}
                    >
                      <option
                        value="Default"
                      >
                        {t('default')}
                      </option>
                      <option
                        value="Casual"
                      >
                        {t('casual')}
                      </option>
                      <option
                        value="Normal"
                      >
                        {t('normal')}
                      </option>
                      <option
                        value="Difficult"
                      >
                        {t('difficult')}
                      </option>
                    </select>
                    }
                  </div>
                ))}
                <Button
                  type="submit"
                  variant="secondary"
                  size={"lg"}
                  className="bg-orange-500 mt-3"
                >
                  {t("save_changes")}
                </Button>
              </form>
            </Card>
          )}
        </div>
      </div>
    )}
    </>
  );
};

export default ServiceDetailPage;