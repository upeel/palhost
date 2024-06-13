"use client";

import { CheckCircle } from "lucide-react";
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

export default function Success({
  params: { locale },
}: Readonly<{ params: { locale: string } }>) {
  // unstable_setRequestLocale(locale);
  const t = useTranslations("confirmation");
  const router = useRouter();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push('/u/billings');
    }, 3000);

    return () => clearTimeout(redirectTimer)
  }, [router]);

  return (
    <>
      <div className="flex justify-center" style={{ height: "100vh" }}>
        <Card style={{ textAlign: "center", width: "60%" }}>
          <CheckCircle
            className="h-16 w-16"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "120px",
              marginBottom: "24px",
            }}
          />
          <CardHeader className="bg-orange-500 p-8 mb-4">
            <CardTitle className="text-2xl font-bold uppercase flex flex-row justify-center">
              {t('order_success')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t('thanks')}</p>
            <p>{t('redirect')}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
