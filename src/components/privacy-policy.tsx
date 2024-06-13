"use client";

import { Fragment, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Footer from "./footer";
import bg from "../../public/images/palworld.webp";

const PrivacyPolicy = () => {
  const t = useTranslations("privacy_policy");

  useEffect(() => {
  }, []);

  return (
    <section
      style={{
        background: `url(${bg.src}) center center / cover no-repeat`,
        height: "calc(100vh - 450px)",
        width: "100%",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(180deg,rgba(8,8,8,.4) -5%,#080808 13.5%)",
          width: "100%",
        }}
        className="relative overflow-x-hidden pb-8 px-4"
      >
        <div className="md:container">
          <div className="flex items-center w-100 flex-col pt-16 md:pt-28">
            <h1 className="font-bold uppercase text-4xl text-center">
              {t("hero_title")}
            </h1>
            <h2 className="uppercase bold text-xl text-center">
              {t("hero_subtitle")}
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 mt-36">
            <div className="lg:col-span-2 font-bold text-2xl uppercase mb-4" style={{borderBottom: "1px solid #FFF"}}>
              {t('brief_intro')}
            </div>
            <div className="text-justify">
              {t('intro_1')} 
              <p className="mt-4">
                {t('may_be_contacted')} <a href="/contact" className="hover:underline" style={{color: "#03a9dd"}}>https://pal.host/contact</a>
              </p>
            </div>
            <div className="text-justify">
              {t('intro_2')} {t('terms_of_service')}
            </div>
          </div>
          <div className="mt-8">
            <div className="lg:col-span-2 font-bold text-2xl uppercase mb-4" style={{borderBottom: "1px solid #FFF"}}>
              {t('personal_info')}
            </div>
            <ul style={{listStyle: "disc"}}>
              <li className="text-justify">
                {t('pi_1')}
              </li >
              <li className="text-justify">
                {t('pi_2')}
              </li>
              <li className="text-justify">
                {t('pi_3')} <a href="/contact" className="hover:underline" style={{color: "#03a9dd"}}>{t('contacting_us')}</a>
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <div className="lg:col-span-2 font-bold text-2xl uppercase mb-4" style={{borderBottom: "1px solid #FFF"}}>
              {t('log_data')}
            </div>
            <ul style={{listStyle: "disc"}}>
              <li className="text-justify">
                {t('log_data_1')}
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <div className="lg:col-span-2 font-bold text-2xl uppercase mb-4" style={{borderBottom: "1px solid #FFF"}}>
              {t('cookies')}
            </div>
            <ul style={{listStyle: "disc"}}>
              <li className="text-justify">
                {t('cookies_1')}
              </li>
              <li className="text-justify">
                {t('cookies_2')}
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <div className="lg:col-span-2 font-bold text-2xl uppercase mb-4" style={{borderBottom: "1px solid #FFF"}}>
              {t('security')}
            </div>
            <ul style={{listStyle: "disc"}}>
              <li className="text-justify">
                {t('security_1')}
              </li>
              <li className="text-justify">
                {t('security_2')}
              </li>
              <li className="text-justify">
                {t('security_3')}
              </li>
              <li className="text-justify">
                {t('security_4')}
              </li>
              <li className="text-justify">
                {t('security_5')}
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <div className="lg:col-span-2 font-bold text-2xl uppercase mb-4" style={{borderBottom: "1px solid #FFF"}}>
              {t('link_other')}
            </div>
            <ul style={{listStyle: "disc"}}>
              <li className="text-justify">
                {t('link_other_1')}
              </li>
              <li className="text-justify">
                {t('link_other_2')}
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <div className="lg:col-span-2 font-bold text-2xl uppercase mb-4" style={{borderBottom: "1px solid #FFF"}}>
              {t('changes_privacy_policy')}
            </div>
            <ul style={{listStyle: "disc"}}>
              <li className="text-justify">
                {t('changes_privacy_policy_1')}
              </li>
              <li className="text-justify">
                {t('changes_privacy_policy_2')}
              </li>
            </ul>
          </div>
          <div className="mt-8 mb-6">
            <div className="lg:col-span-2 font-bold text-2xl uppercase mb-4" style={{borderBottom: "1px solid #FFF"}}>
              {t('contact_us')}
            </div>
            <ul style={{listStyle: "disc"}}>
              <li className="text-justify">
                {t('contact_us_1')} <a href="/contact" className="hover:underline" style={{color: "#03a9dd"}}>{t('contact_us')}</a>
              </li>
            </ul>
          </div>
        </div>
        <Footer />
      </div>
    </section>
  );
};
export default PrivacyPolicy;
