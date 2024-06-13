"use client";

import ProductApi from "@/lib/apis/product-api";
import { Product } from "@/types/product";
import { Tab } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import ProductCard from "./product-card";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import Footer from "./footer";
import image1 from "../../public/images/img_faq_1.webp";
import image2 from "../../public/images/img_faq_2.webp";
import Image from "next/image";
import bg from "../../public/images/palworld.webp";

type HomeProps = {
  products?: Product[];
  lang: string;
};

const Home = (props: HomeProps) => {
  const t = useTranslations("home");
  const featureT = useTranslations("home.our_features_list");
  const [products, setProducts] = useState<Product[]>(props.products || []);
  const features = [
    featureT("automatic_updates"),
    featureT("auto_file_validation"),
    featureT("scheduled_restarts"),
    featureT("automatic_backups"),
    featureT("fully_configurable"),
    featureT("full_ftp_access"),
    featureT("control_panel"),
    featureT("uptime_100_percent"),
    featureT("ddos_protection"),
    featureT("support_24_7"),
    featureT("global_locations"),
    featureT("self_serve_guides"),
    featureT("low_latency"),
    featureT("server_console"),
    featureT("instant_setup"),
  ];

  const onTabChange = (index: number) => {
    let period = 1;
    switch (index) {
      case 0:
        period = 1;
        break;
      case 1:
        period = 3;
        break;
      case 2:
        period = 6;
        break;
      case 3:
        period = 12;
        break;
    }

    ProductApi.getProducts(period).then((res) => {
      setProducts(res.data.data as Product[]);
    });
  };

  useEffect(() => {
    onTabChange(0);
  }, []);

  return (
    <section
      style={{
        background: `url(${bg.src}) center center / cover no-repeat`,
        height: "calc(100vh - 80px)",
        width: "100%",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(180deg,rgba(8,8,8,.1) -12%,#080808 23.50%)",
          width: "100%",
        }}
        className="relative overflow-x-hidden"
      >
        <div className="md:container">
          <div className="flex items-center w-100 flex-col pt-12 md:pt-32">
            <h1 className="font-bold uppercase text-4xl text-center">
              {t("hero_title")}
            </h1>
            <h2 className="uppercase bold text-xl text-center">
              {t("hero_subtitle")}
            </h2>
          </div>
          <div className="flex mt-24 p-4 justify-center">
            <div className="items-center justify-center">
              <Tab.Group onChange={onTabChange}>
                <Tab.List as="div">
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      /* Use the `selected` state to conditionally style the selected tab. */
                      <button
                        className={`${
                          selected ? "bg-orange-500" : "bg-black"
                        } text-white p-2 uppercase font-bold text-md relative min-w-28 mr-4 md:mr-0 mb-6 md:mb-0`}
                      >
                        {t("period.monthly")}
                      </button>
                    )}
                  </Tab>
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      /* Use the `selected` state to conditionally style the selected tab. */
                      <button
                        className={`${
                          selected ? "bg-orange-500" : "bg-black"
                        } text-white p-2 uppercase font-bold text-md relative min-w-28 mr-4 md:mr-0 mb-6 md:mb-0`}
                      >
                        {t("period.quarterly")}
                        <span
                          className={`absolute ${
                            selected
                              ? "bg-white text-black"
                              : "bg-orange-500 text-white"
                          }  text-xs p-1`}
                          style={{
                            top: "-16px",
                            left: 0,
                            transform: "translateX(50%)",
                          }}
                        >
                          {t('5_off')}
                        </span>
                      </button>
                    )}
                  </Tab>
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      /* Use the `selected` state to conditionally style the selected tab. */
                      <button
                        className={`${
                          selected ? "bg-orange-500" : "bg-black"
                        } text-white p-2 uppercase font-bold text-md relative min-w-28 mr-4 md:mr-0 mb-6 md:mb-0`}
                      >
                        {t("period.semiannually")}
                        <span
                          className={`absolute ${
                            selected
                              ? "bg-white text-black"
                              : "bg-orange-500 text-white"
                          }  text-xs p-1`}
                          style={{
                            top: "-16px",
                            left: 0,
                            transform: "translateX(70%)",
                          }}
                        >
                          {t('10_off')}
                        </span>
                      </button>
                    )}
                  </Tab>
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      /* Use the `selected` state to conditionally style the selected tab. */
                      <button
                        className={`${
                          selected ? "bg-orange-500" : "bg-black"
                        } text-white p-2 uppercase font-bold text-md relative min-w-28 mr-4 md:mr-0 mb-6 md:mb-0`}
                      >
                        {t("period.annually")}
                        <span
                          className={`absolute ${
                            selected
                              ? "bg-white text-black"
                              : "bg-orange-500 text-white"
                          }  text-xs p-1`}
                          style={{
                            top: "-16px",
                            left: 0,
                            transform: "translateX(25%)",
                          }}
                        >
                          {t('15_off')}
                        </span>
                      </button>
                    )}
                  </Tab>
                </Tab.List>
              </Tab.Group>
            </div>
          </div>
          <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-stretch md:grid-cols-3 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product.name} product={product} lang={props.lang} />
              ))}
            </div>
          </div>
          <div className="p-4">
            <h1 className="text-center text-2xl font-bold mb-4">
              {t("our_features")}
            </h1>
            <div className="grid grid-rows-1 md:grid-cols-5 gap-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center border-orange-500 border"
                >
                  <div className="bg-orange-500 p-2">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="ml-2 text-md">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <h1 className="text-center text-2xl font-bold mb-4">
              {t("blog.title")}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="p-4 text-md text-justify"
                dangerouslySetInnerHTML={{ __html: t.raw("blog.content") }}
              ></div>
              <div className="p-4">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/IltMIJeK-1M?si=WQeuktXuFkyFGo7V"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h1 className="text-center text-2xl font-bold mb-4">
              {t("faq.title")}
            </h1>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 md:col-span-2">
                  <h1 className="text-orange-500 text-xl font-bold mb-4">
                    {t("faq.faq_1.title")}
                  </h1>
                  <div
                    className="text-md text-justify"
                    dangerouslySetInnerHTML={{
                      __html: t.raw("faq.faq_1.content"),
                    }}
                  ></div>
                </div>
                <div className="relative w-full h-60 md:h-auto">
                  <Image src={image1} alt="faq_1" fill style={{objectFit: "cover"}} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative w-full h-60 md:h-auto order-last md:order-first">
                  <Image src={image2} alt="faq_1" fill style={{objectFit: "cover"}} />
                </div>
                <div className="p-4 md:col-span-2">
                  <h1 className="text-orange-500 text-xl font-bold mb-4">
                    {t("faq.faq_2.title")}
                  </h1>
                  <div
                    className="text-md text-justify"
                    dangerouslySetInnerHTML={{
                      __html: t.raw("faq.faq_2.content"),
                    }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4">
                  <h1 className="text-orange-500 text-xl font-bold mb-4">
                    {t("faq.faq_3.title")}
                  </h1>
                  <div
                    className="text-md text-justify"
                    dangerouslySetInnerHTML={{
                      __html: t.raw("faq.faq_3.content"),
                    }}
                  ></div>
                </div>
                <div className="p-4">
                  <h1 className="text-orange-500 text-xl font-bold mb-4">
                    {t("faq.faq_4.title")}
                  </h1>
                  <div
                    className="text-md text-justify"
                    dangerouslySetInnerHTML={{
                      __html: t.raw("faq.faq_4.content"),
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </section>
  );
};

export default Home;
