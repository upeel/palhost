"use client";

import { useToast } from "@/components/ui/use-toast";
import UserApi from "@/lib/apis/user-api";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import bg from "../../../../../public/images/palworld.webp";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Signup = ({
  params: { locale },
}: Readonly<{ params: { locale: string } }>) => {
  const t = useTranslations("register");
  const tLogin = useTranslations("login");
  const tGeneral = useTranslations("general");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const ref = React.useRef<ReCAPTCHA>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verifyEmailAlert, setVerifyEmailAlert] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const signup = () => {
    if (!email || !password || !isVerified || !name || !confirmPassword) {
      toast({
        title: "An error occurred.",
        description: "Please fill in all the fields and verify the captcha.",
      });
      return;
    }

    let body = {
      email: email,
      password: password,
      password_confirmation: confirmPassword,
      name: name,
      "g-recaptcha-response": token,
    };

    UserApi.signup(body)
      .then((res) => {
        toast({
          title: "Account created.",
          description: "We've created your account for you.",
        });

        setVerifyEmailAlert(true);

        const redirectTimer = setTimeout(() => {
          router.push("/auth/signin");
        }, 3000);
         return () => clearTimeout(redirectTimer);

      })
      .catch((err) => {
        const errors = err.response.data.errors;
        const errorList = Object.keys(errors).map(key => (
          `<li>${errors[key][0]}</li>`
        )).join('');
        const toastDescription = `<ul>${errorList}</ul>`;
        toast({
          title: 'Error',
          description: <div dangerouslySetInnerHTML={{ __html: toastDescription }} />,
        })
      });
  };

  const handleCaptchaSubmission = (value: string | null) => {
    setIsVerified(true);
    setToken(value!);
  };

  const handleGoogleLogin = () => {
    window.location.replace(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/redirect/google`
    );
  };

  return (
    <section className="relative flex flex-wrap lg:h-screen lg:items-center">
      <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">{t("title")}</h1>

          <p className="mt-4 text-gray-500">{t("subtitle")}</p>
        </div>

        <div className="mx-auto mb-0 mt-8 max-w-md space-y-4">
          <div>
            <label className="sr-only">{t("email")}</label>

            <div className="relative">
              <input
                type="email"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder={t("email_placeholder")}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />

              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </span>
            </div>
          </div>
          <div>
            <label className="sr-only">{t("name")}</label>

            <div className="relative">
              <input
                type="email"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder={t("name_placeholder")}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          </div>

          <div>
            <label className="sr-only">{t("password")}</label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder={t("password_placeholder")}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />

              <button className="absolute inset-y-0 end-0 grid place-content-center px-4" onClick={togglePasswordVisibility}>
                {!showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path xmlns="http://www.w3.org/2000/svg" d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path xmlns="http://www.w3.org/2000/svg" d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="sr-only">{t("confirm_password")}</label>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder={t("confirm_password_placeholder")}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />

              <button className="absolute inset-y-0 end-0 grid place-content-center px-4" onClick={toggleConfirmPasswordVisibility}>
                {!showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path xmlns="http://www.w3.org/2000/svg" d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path xmlns="http://www.w3.org/2000/svg" d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              ref={ref}
              onChange={handleCaptchaSubmission}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {t("have_account")} &nbsp;
              <Link className="underline hover:text-white" href="/auth/signin">
                {t("sign_in")}
              </Link>
            </p>

            <button
              onClick={signup}
              className="inline-block rounded-lg bg-orange-500 px-5 py-3 text-sm font-medium text-white"
            >
              {t("sign_up")}
            </button>
          </div>
          {/* <div className="flex items-center justify-center">
            <span>{tGeneral('or')}</span>
          </div>
          <Button className="w-full" onClick={() => handleGoogleLogin()}>
            <svg
              className="size-4 mr-2 "
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Google</title>
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            {tLogin('signin_with')} Google
          </Button> */}
        </div>
      </div>

      <div className="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
        <Image
          src={bg.src}
          unoptimized
          fill
          style={{
            objectFit: "cover",
          }}
          objectFit="cover"
          alt="login-image"
        />
      </div>
      {verifyEmailAlert &&
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{padding: "1.5rem"}}>
              {t('link_sent')}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4" style={{marginTop: "1px solid #CECECE"}}>
            <p className="text-white">
              {t('please_click_link')}
            </p>
          </div>
        </DialogContent>
      </Dialog>
      }
    </section>
  );
};

export default Signup;
