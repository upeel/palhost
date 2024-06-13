"use client";
import { useToast } from "@/components/ui/use-toast";
import {
  ChevronDown,
  ChevronUp,
  Shield,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import LeftMenuItem from "@/components/left-menu-item";
import { useRouter, Link } from "@/lib/navigation";
import useCurrentUserStore from "@/store/currentUserStore";
import MyAccount from "@/components/my-account";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Links from '@mui/material/Link';

export default function AccountDetail({
  params: { locale },
}: Readonly<{ params: { locale: string } }>) {
  const t = useTranslations("account");
  const tGeneral = useTranslations("general");
  const router = useRouter();
  const [actionIsOpen, setActionIsOpen] = useState(true);
  const { user } = useCurrentUserStore();

  const goToAccountDetail = () => {
    router.push("/u/setting/account-detail");
  };

  const changePassword = () => {
    router.push("/u/setting/change-password");
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-8">
        <div className="lg:col-span-1 order-last lg:order-first">
          <Collapsible
            className="lg:me-4"
            onOpenChange={setActionIsOpen}
            open={actionIsOpen}
          >
            <CollapsibleTrigger className="w-full">
              <div className="p-4 bg-orange-500 w-full text-sm font-bold uppercase flex flex-row justify-between items-center">
                {t("account_setting")}{" "}
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
                    title={t("my_details")}
                    icon={<User className="h-4 w-4" />}
                    onClick={() => {
                      goToAccountDetail();
                    }}
                  />

                  {user?.must_set_password ? (
                  <LeftMenuItem
                    title={t("set_pass")}
                    icon={<Shield className="h-4 w-4" />}
                    onClick={() => {
                      changePassword();
                    }}
                  />
                  ) : (
                  <LeftMenuItem
                    title={t("change_password")}
                    icon={<Shield className="h-4 w-4" />}
                    onClick={() => {
                      changePassword();
                    }}
                  />
                  )}
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
              <Typography className="text-white">{tGeneral('my_details')}</Typography>
            </Breadcrumbs>
          </div>
          <div className="lg:p-4">
            <h1 className="text-2xl font-bold uppercase mb-8">
              {t("my_details")}
            </h1>
            <MyAccount locale={locale} />
          </div>
        </div>
      </div>
    </>
  );
}
