import AppHeader from "@/components/app-header";
import UserHelper from "@/lib/user-helper";
import Footer from "@/components/footer";
import { Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";
import { ReactNode, useState } from "react";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Palhost | Dashboard",
};

const AppLayout = ({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) => {
  unstable_setRequestLocale(locale);

  if (!UserHelper.isLoggedIn()) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/signin";
    }
  }

  return (
    <div className="w-full min-h-screen">
        <Suspense>
        <AppHeader />
        <div className="container mx-auto p-6 lg:px-8">{children}</div>
        <Footer />
        </Suspense>
    </div>
  );
};

export default AppLayout;
