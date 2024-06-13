"use client";
import { useEffect, useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import UserHelper from "@/lib/user-helper";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import LanguageSwitcher from "./language-switcher";
import Image from "next/image";
import bg from "../../public/images/logo.png";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UserApi from "@/lib/apis/user-api";
import { User as UserType } from "@/types/user";
import useCurrentUserStore from "@/store/currentUserStore";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("app_header");
  const { setUser, user } = useCurrentUserStore();

  useEffect(() => {
    UserApi.profile()
      .then((res) => {
        let user = res.data as UserType;
        setUser(user);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setUser]);

  return (
    <header className="bg-dark">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <div className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <div className="h-8 w-auto">
              <Link href="/">
                <Image
                  src={bg.src}
                  unoptimized
                  width={140}
                  height={60}
                  alt="login-image"
                />
              </Link>
            </div>
          </div>
        </div>

        <Popover>
          <PopoverTrigger>
            <div className="flex lg:hidden">
              <div
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="gap-4 grid">
            <LanguageSwitcher />
            {UserHelper.isLoggedIn() ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="text-sm flex items-center gap-2 font-bold cursor-pointer">
                    <User className="h-4 w-4" />{t('hello')} {user?.name}!
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-4 w-56">
                  <Link href="/u/dashboard">
                    <DropdownMenuItem className="cursor-pointer">{t("dashboard")}</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <Link href="/u/setting/account-detail">
                    <DropdownMenuItem className="cursor-pointer">{t("setting")}</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => UserHelper.logout()}>
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm font-semibold leading-6 text-white"
              >
                {t("login")} <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </PopoverContent>
        </Popover>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-4">
          <LanguageSwitcher />
          {UserHelper.isLoggedIn() ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full p-2 bg-orange-500 cursor-pointer">
                <User className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-4 w-56">
                <DropdownMenuLabel>{t('hello')} {user?.name}!</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/u/dashboard">
                  <DropdownMenuItem className="cursor-pointer">{t("dashboard")}</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link href="/u/setting/account-detail">
                  <DropdownMenuItem className="cursor-pointer">{t("setting")}</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => UserHelper.logout()}>
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/auth/signin"
              className="text-sm font-semibold leading-6 text-white"
            >
              {t("login")} <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
