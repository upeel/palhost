"use client";

import { MailX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useRouter, Link } from "@/lib/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { unstable_setRequestLocale } from "next-intl/server";

export default function SuccessVerification({
  params: { locale },
}: Readonly<{ params: { locale: string } }>) {
  // unstable_setRequestLocale(locale);
  const t = useTranslations("confirmation");
  const router = useRouter();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push('/auth/signin');
    }, 3000);

    return () => clearTimeout(redirectTimer)
  }, [router]);

  return (
    <>
      <div className="flex justify-center" style={{ height: "100vh" }}>
        <Card style={{ textAlign: "center", width: "60%" }}>
          <MailX
            className="h-16 w-16"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "120px",
              marginBottom: "24px",
            }}
          />
          <CardHeader className="bg-red-500 p-8 mb-4">
            <CardTitle className="text-2xl font-bold uppercase flex flex-row justify-center">
              {t('verify_failed')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t('failed_msg')}</p>
            <p>{t('redirect_login')}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
