"use client";
import { Button } from "@/components/ui/button";
import UserApi, { SocialLoginResponse } from "@/lib/apis/user-api";
import { useRouter } from "@/lib/navigation";
import { Redirect } from "@/types/redirect";
import { Loader2 } from "lucide-react";
import {
  useParams,
  useSearchParams,
  useRouter as useNextRouter,
} from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const AuthHandlePage = () => {
  const router = useRouter();
  const nextRouter = useNextRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations("general");

  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const handle = () => {
      if (params.provider === "google") {
        // handle google login
        UserApi.handleSocialLogin(params.provider, searchParams.toString())
          .then((res) => {
            let response = res.data as SocialLoginResponse;
            localStorage.setItem("access_token", response.token);
  
            const json = localStorage.getItem("redirect");
  
            if (json) {
              const redirect = JSON.parse(json) as Redirect;
              localStorage.removeItem("redirect");
              router.push(redirect.url);
              return;
            }
  
            router.push("/u/dashboard");
          })
          .catch((err) => {
            setFailed(true);
          });
      } else if (params.provider === "facebook") {
        // handle facebook login
      }
    };
    handle();
  }, [params.provider, router, searchParams]);

  const goback = () => {
    router.push("/auth/signin");
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <>
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />{" "}
        <h1 className="text-md ms-4">{t('verifying')}</h1>
      </>
    </div>
  );
};

export default AuthHandlePage;
