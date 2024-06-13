"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/lib/navigation";
import { Check, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const changeLanguage = (lang: string) => {
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/${lang}/${pathname}`;
    // window.location.reload();
  };

  const t = useTranslations("general");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="text-sm flex items-center gap-2 font-bold cursor-pointer">
          <Languages className="h-4 w-4" /> {t('change_language')}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4 w-56">
        <DropdownMenuLabel>{t("change_language")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => changeLanguage("en")}>
          {locale == "en" ? <Check className="w-4 h-4 mr-4" /> : null} English
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => changeLanguage("zh")}>
          {locale == "zh" ? <Check className="w-4 h-4 mr-4" /> : null} Chinese
          Simplified
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => changeLanguage("zh-hant")}>
          {locale == "zh-hant" ? <Check className="w-4 h-4 mr-4" /> : null}{" "}
          Chinese Traditional
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => changeLanguage("jp")}>
          {locale == "jp" ? <Check className="w-4 h-4 mr-4" /> : null} Japanese
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => changeLanguage("kr")}>
          {locale == "kr" ? <Check className="w-4 h-4 mr-4" /> : null} Korean
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
