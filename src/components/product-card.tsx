"use client";

import CheckoutApi from "@/lib/apis/checkout-api";
import { Product } from "@/types/product";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import UserHelper from "@/lib/user-helper";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";

type ProductCardProps = {
  product: Product;
  hideOrderButton?: boolean;
  lang: string;
};

const ProductCard = (props: ProductCardProps) => {
  const t = useTranslations("product");
  const { product } = props;
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkout = (productCode: string) => {
    router.push(`/order/${productCode}`);
  };

  const getPeriodName = (period: number) => {
    if (period == 1) {
      return t("month");
    } else if (period == 3) {
      return t("quarter");
    } else if (period == 6) {
      return t("half_year");
    } else if (period == 12) {
      return t("annual");
    }
  };

  return (
    <div className="divide-y divide-gray-200 rounded-2xl border bg-white border-gray-200 shadow-sm">
      <div className="p-6 sm:px-8">
        <h2 className="text-2xl font-medium text-gray-900 ">
          {product.name}
          <span className="sr-only">Plan</span>
        </h2>

        <p className="mt-2 sm:mt-4">
        {props.lang == 'en' &&
          <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {" "}
              <sup className="text-orange-500" style={{fontSize: "16px", top: "-.75em"}}>$</sup>{product.price}{" "}
          </strong>
        }
        {props.lang == 'kr' &&
          <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {" "}
              <sup className="text-orange-500" style={{fontSize: "16px", top: "-.75em"}}>₩</sup>{product.exchange_prices.KRW}{" "}
          </strong>
        }
        {props.lang == 'jp' &&
          <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {" "}
              <sup className="text-orange-500" style={{fontSize: "16px", top: "-.75em"}}>¥</sup>{product.exchange_prices.JPY}円{" "}
          </strong>
        }
        {props.lang == 'zh' &&
          <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {" "}
              <sup className="text-orange-500" style={{fontSize: "16px", top: "-.75em"}}>¥</sup>{product.exchange_prices.CNY}元{" "}
          </strong>
        }
        {props.lang == 'zh-hant' &&
          <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {" "}
              <sup className="text-orange-500" style={{fontSize: "16px", top: "-.75em"}}>¥</sup>{product.exchange_prices.CNY}元{" "}
          </strong>
        }
          <span className="text-sm font-medium text-gray-700">
            {"/"} {getPeriodName(product.period)}
          </span>
        </p>
      </div>

      <div className="p-6 sm:px-8">
        <p className="text-lg font-medium text-gray-900 sm:text-xl">
          {t("whats_included")}
        </p>
        {product.name == 'Rift' &&
        <ul className="mt-2 space-y-2 sm:mt-4">
          <li className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 text-indigo-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>

            <span className="text-gray-700">{t('max_player')}10 Slots </span>
          </li>
          <li className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 text-indigo-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>

            <span className="text-gray-700">
              {" "}
              {t('processing_power')} 4 CPU
            </span>
          </li>
          <li className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 text-indigo-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>

            <span className="text-gray-700">{t('allocated_ram')}16G</span>
          </li>
          <li className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 text-indigo-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>

            <span className="text-gray-700">{t('max_traffic')}5TB</span>
          </li>
          <li className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 text-indigo-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>

            <span className="text-gray-700">{t('max_bandwith')}35M</span>
          </li>
        </ul>
        }
        {product.name == 'Nebula' &&
        <ul className="mt-2 space-y-2 sm:mt-4">
          <li className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 text-indigo-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>

            <span className="text-gray-700">{t('max_player')}20 Slots </span>
          </li>
          <li className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 text-indigo-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>

            <span className="text-gray-700">
              {" "}
              {t('processing_power')} 8 CPU
            </span>
          </li>
          <li className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 text-indigo-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>

            <span className="text-gray-700">{t('allocated_ram')}32G</span>
          </li>
          <li className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 text-indigo-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>

            <span className="text-gray-700">{t('max_traffic')}6TB</span>
          </li>
          <li className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 text-indigo-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>

            <span className="text-gray-700">{t('max_bandwith')}45M</span>
          </li>
        </ul>
        }
        {product.name == 'Zenith' &&
          <ul className="mt-2 space-y-2 sm:mt-4">
          <li className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 text-indigo-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>

            <span className="text-gray-700">{t('max_player')}32 Slots </span>
          </li>
          <li className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 text-indigo-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>

            <span className="text-gray-700">
              {" "}
              {t('processing_power')}16 CPU
            </span>
          </li>
          <li className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 text-indigo-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>

            <span className="text-gray-700">{t('allocated_ram')}64G</span>
          </li>
          <li className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 text-indigo-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>

            <span className="text-gray-700">{t('max_traffic')}7TB</span>
          </li>
          <li className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 text-indigo-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>

            <span className="text-gray-700">{t('max_bandwith')}55M</span>
          </li>
        </ul>
        }
        {!props.hideOrderButton && product.is_available && (
          <button
            disabled={isLoading}
            className="mt-4 rounded flex justify-center items-center border w-full border-orange-500 bg-orange-500 px-12 py-3 text-center text-sm font-medium text-white hover:bg-transparent hover:text-orange-500 focus:outline-none focus:ring active:text-orange-500 sm:mt-6"
            onClick={() => checkout(product.code)}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              t("order_now")
            )}
          </button>
        )}
        {!props.hideOrderButton && !product.is_available && (
          <button
            disabled={true}
            className="mt-4 rounded flex justify-center items-center border w-full border-gray-500 bg-gray-500 px-12 py-3 text-center text-sm font-medium text-white focus:outline-none focus:ring sm:mt-6"
          >
            {t("sold_out")}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
