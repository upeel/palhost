import Header from "@/components/header";
import Contact_us from "@/components/contact";
import { Suspense, use } from "react";
import { unstable_setRequestLocale } from "next-intl/server";

const ContactUsPage = ({ params: { locale }, }: Readonly<{
  params: { locale: string };
}>) => {
  unstable_setRequestLocale(locale);

  return (
    <>
      <Header />
      <div>
        <Suspense>
          <Contact_us locale={locale} />
        </Suspense>
      </div>
    </>
  );
};

export default ContactUsPage;
