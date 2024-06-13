import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const [, locale, ...segments] = request.nextUrl.pathname.split("/");

  if (locale == null) {
    request.nextUrl.pathname = `/en`;
  }

  const handleI18nRouting = createMiddleware({
    // A list of all locales that are supported
    locales: ["en", "zh", "kr", "jp", "zh-hant"],

    // Used when no locale matches
    defaultLocale: "en",
    localePrefix: "always",
  });

  const response = handleI18nRouting(request);
  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
