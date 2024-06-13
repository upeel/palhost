"use client";
import { XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Link, useRouter } from "@/lib/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Failed({
  params: { locale },
}: Readonly<{ params: { locale: string } }>) {
  // unstable_setRequestLocale(locale);
  const t = useTranslations("confirmation");
  const router = useRouter();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push("/u/billings");
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <>
      <div className="flex justify-center" style={{ height: "100vh" }}>
        <Card style={{ textAlign: "center", width: "60%" }}>
          <XCircle
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
              {t('order_failed')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t('sorry')}</p>
            <p>{t('redirect')}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
