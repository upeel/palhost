import Header from "@/components/header";
import { Suspense } from "react";
import Home from "@/components/home";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Index({
  params: { locale },
}: Readonly<{ params: { locale: string } }>) {
  unstable_setRequestLocale(locale);
  return (
    <main>
      <Suspense>
        <header>
          <Header />
        </header>
      <Home lang={locale} />
      </Suspense>
    </main>
  );
}
