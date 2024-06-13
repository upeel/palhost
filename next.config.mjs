import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["tailwindui.com"],
  },
  distDir: "_next",
  basePath: "",
};

export default withNextIntl(nextConfig);
