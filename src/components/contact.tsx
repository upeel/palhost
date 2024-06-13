"use client";

import React, { Fragment, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Footer from "./footer";
import bg from "../../public/images/palworld.webp";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useToast } from "./ui/use-toast";
import ContactApi from "@/lib/apis/contact-api";
import useCurrentUserStore from "@/store/currentUserStore";
import UserHelper from "@/lib/user-helper";
import InstanceApi from "@/lib/apis/instance-api";
import { Instance } from "@/types/instance";
import SkeletonLine from "./ui/skeleton-line";
import { Loader2 } from "lucide-react";

type MyAccountProps = {
  locale: string;
};
const Contact_us = (props: MyAccountProps) => {
  const { locale } = props;
  const t = useTranslations("contact");
  const { toast } = useToast();
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
  const { user } = useCurrentUserStore();
  const [instances, setInstances] = useState([] as Instance[]);
  const [isLoading, setIsLoading] = useState(false);

  const getInstances = () => {
    setIsLoading(true);
    InstanceApi.getAll(locale)
      .then((res) => {
        setInstances(res.data.data);
      })
      .catch((err) => {
        toast({
          title: "Error!",
          description: err.response.data.message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if (UserHelper.isLoggedIn()) {
      setValue('name', user?.name);
      setValue('email', user?.email);
      getInstances();
    }
  }, [user]);

  const onSubmit = (formData: any) => {
    if (UserHelper.isLoggedIn()) {
      setIsLoading(true);
      const parsedData = {
        department: parseInt(formData.department),
        email: formData.email,
        name: formData.name,
        client_token: formData.client_token,
        message: formData.message,
        priority: parseInt(formData.priority),
        subject: formData.subject
      };
      ContactApi.submitTicket(parsedData)
        .then(() => {
          toast({
            title: t('submitted'),
            description: t('submitted_successfully'),
          });
          reset({
            name: user?.name,
            email: user?.email,
            subject: '',
            department: '30',
            instance_id: '0',
            priority: '20',
            message: '',
          });
        })
        .catch((error: any) => {
          const errors = error.response.data.errors;
          const errorList = Object.keys(errors).map(key => (
            `<li>${errors[key][0]}</li>`
          )).join('');
          const toastDescription = `<ul>${errorList}</ul>`;
          toast({
            title: t('submit_failed'),
            description: <div dangerouslySetInnerHTML={{ __html: toastDescription }} />,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(true);
      const parsedData = {
        department: parseInt(formData.department),
        email: formData.email,
        name: formData.name,
        message: formData.message,
        subject: formData.subject
      };
      ContactApi.submit(parsedData)
        .then(() => {
          toast({
            title: t('submitted'),
            description: t('submitted_successfully'),
          });
          reset({
            name: '',
            email: '',
            subject: '',
            department: '30',
            message: '',
          });
        })
        .catch((error: any) => {
          const errors = error.response.data.errors;
          const errorList = Object.keys(errors).map(key => (
            `<li>${errors[key][0]}</li>`
          )).join('');
          const toastDescription = `<ul>${errorList}</ul>`;
          toast({
            title: t('submit_failed'),
            description: <div dangerouslySetInnerHTML={{ __html: toastDescription }} />,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <section
      style={{
        background: `url(${bg.src}) center center / cover no-repeat`,
        height: "calc(100vh - 400px)",
        width: "100%",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(180deg,rgba(8,8,8,.4) -1%,#080808 13.5%)",
          width: "100%",
        }}
        className="relative overflow-x-hidden pb-8 px-4"
      >
        <div className="md:container">
          <div className="flex items-center w-100 flex-col pt-12 md:pt-14 pb-12 md:pb-16">
            <h1 className="font-bold uppercase text-4xl text-center">
              {t("hero_title")}
            </h1>
          </div>
          <div className="mt-8 mb-8">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              {isLoading ? (
                <SkeletonLine />
              ) : (
              <div className="flex flex-col gap-2">
                <div className="grid gap-4 lg:grid-cols-2 mb-4">
                  <div>
                    <label className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t('name')}
                    </label>
                    <input
                      {...register('name', { required: false })}
                      className="flex h-10 mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      disabled={UserHelper.isLoggedIn()}
                    />
                  </div>
                  <div>
                    <label className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t('email')}
                    </label>
                    <input
                      {...register('email', { required: false })}
                      className="flex h-10 mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      disabled={UserHelper.isLoggedIn()}
                    />
                  </div>
                </div>
                <div className="grid gap-4 lg:grid-cols-2 mb-4">
                  <div>
                    <label className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t('subject')}
                    </label>
                    <input
                      {...register('subject', { required: false })}
                      className="flex h-10 mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      placeholder={t('subject')}
                    />
                  </div>
                  <div>
                    <label className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t('department')}
                    </label>
                    <select
                      {...register('department', { required: false })}
                      defaultValue={30}
                      className="cursor-pointer flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 sm:w-full mt-4"
                    >
                      <option
                        value={30}
                      >
                        {t('pre_sales')}
                      </option>
                      <option
                        value={20}
                      >
                        {t('sales')}
                      </option>
                      <option
                        value={10}
                      >
                        {t('general_support')}
                      </option>
                    </select>
                  </div>
                </div>
                {UserHelper.isLoggedIn() &&
                <div className="grid gap-4 lg:grid-cols-2 mb-4">
                  <div>
                    <label className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t('related_service')}
                    </label>
                    <select
                      {...register('client_token', { required: false })}
                      defaultValue={0}
                      className="cursor-pointer flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 sm:w-full mt-4"
                    >
                      <option
                        value={0}
                      >
                        {t('none')}
                      </option>
                      {instances.map((instance, key) => (
                      <option
                        key={key}
                        value={instance.client_token}
                      >
                        <span className="flex">
                          {instance.name} - <span className="ml-1" style={{color: "#3384ff"}}> {instance.client_token.substring(0, 6)}</span> <span>({instance.status_in_string})</span>
                        </span>
                      </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t('priority')}
                    </label>
                    <select
                      {...register('priority', { required: false })}
                      defaultValue={20}
                      className="cursor-pointer flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 sm:w-full mt-4"
                    >
                      <option
                        value={30}
                      >
                        {t('high')}
                      </option>
                      <option
                        value={20}
                      >
                        {t('medium')}
                      </option>
                      <option
                        value={10}
                      >
                        {t('low')}
                      </option>
                    </select>
                  </div>
                </div>
                }
                <div className="mb-4">
                  <label className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t('message')}
                  </label>
                  <textarea
                    {...register('message', { required: false })}
                    className="flex mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={t('type_message')}
                    style={{minHeight: "100px"}}
                  />
                </div>
              </div>
              )}
              <Button
                type="submit"
                variant="secondary"
                size={"lg"}
                className="bg-orange-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  t("send_message")
                )}
              </Button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </section>
  );
};
export default Contact_us;
