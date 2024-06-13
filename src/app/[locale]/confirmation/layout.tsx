import { Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Palhost | Confirmation",
};

const layout = ({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) => {
  unstable_setRequestLocale(locale);

  return <>{children}</>;
};

export default layout;
