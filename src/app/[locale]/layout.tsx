import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider, useMessages } from "next-intl";
import Script from "next/script";
import Footer from "@/components/footer";
import { config } from "@fortawesome/fontawesome-svg-core";
import { GoogleAnalytics } from '@next/third-parties/google'
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Palhost | Your Palworld Server",
};

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = useMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
        <Script
          src={process.env.NEXT_PUBLIC_TIDIO_SRC}
          async
        ></Script>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTIC_ID && process.env.NEXT_PUBLIC_GOOGLE_ANALYTIC_ID !== '' &&
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTIC_ID} />
        }
      </body>
    </html>
  );
}

export function generateStaticParams() {
  const locales = ["en", "zh", "kr", "jp", "zh-hant"];
  return locales.map((locale) => ({ locale }));
}
