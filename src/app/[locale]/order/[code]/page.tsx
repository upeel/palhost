import Footer from "@/components/footer";
import Header from "@/components/header";
import OrderLayout from "@/components/order-layout";
import ProductApi from "@/lib/apis/product-api";
import { Suspense, use } from "react";
import { unstable_setRequestLocale } from "next-intl/server";

async function getProduct(code: string) {
  const product = await ProductApi.getProductByCode(code);
  return product;
}

async function getRegions(lang: string, code: string) {
  const regions = await ProductApi.getRegions(lang, code);
  return regions;
}

const OrderPage = ({ params: { locale, code }, }: Readonly<{
  params: { locale: string, code: string };
}>) => {
  unstable_setRequestLocale(locale);
  const product = use(getProduct(code));
  const regions = use(getRegions(locale, code));

  return (
    <>
      <Header />
      <div className="md:container pb-8 px-4 ">
        <Suspense>
          <OrderLayout product={product} regions={regions} lang={locale} />
        </Suspense>
      </div>
      <Footer />
    </>
  );
};

export default OrderPage;
