import Header from "@/components/header";
import PrivacyPolicy from "@/components/privacy-policy";
import { Suspense, use } from "react";
import { unstable_setRequestLocale } from "next-intl/server";

const PrivacyPolicyPage = ({ params: { locale }, }: Readonly<{
  params: { locale: string };
}>) => {
  unstable_setRequestLocale(locale);

  return (
    <>
      <Header />
      <div>
        <Suspense>
          <PrivacyPolicy />
        </Suspense>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
