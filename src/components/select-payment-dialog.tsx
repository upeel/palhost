import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { useTranslations } from "next-intl";
import Image from "next/image";
import alipay from "../../public/images/alipay.svg";
import weixin from "../../public/images/weixin.svg";
import visa from "../../public/images/cc-visa.svg";

export function SelectPaymentDialog({
  onOpenChange,
  onSelect,
}: {
  onOpenChange: (open: boolean) => void;
  onSelect: (payment: string) => void;
}) {
  const t = useTranslations("dashboard.make_payment_dialog");

  const handleSelect = (payment: string) => {
    onSelect(payment);
    onOpenChange(false);
  };

  return (
    <Dialog defaultOpen onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="gap-4 flex">
          <button
            className="flex flex-row justify-center items-center bg-white rounded p-2 text-black gap-2 text-sm cursor-pointer"
            onClick={() => handleSelect("card")}
          >
            <Image src={visa} alt="WeChat Pay" width={24} height={24} />
            Cards
          </button>
          <button
            className="flex flex-row justify-center items-center bg-white rounded p-2 text-black gap-2 text-sm cursor-pointer"
            onClick={() => handleSelect("alipay")}
          >
            <Image src={alipay} alt="WeChat Pay" width={24} height={24} />
            Alipay
          </button>
          <button
            className="flex flex-row justify-center items-center bg-white rounded p-2 text-black gap-2 text-sm cursor-pointer"
            onClick={() => handleSelect("wechat_pay")}
          >
            <Image src={weixin} alt="WeChat Pay" width={24} height={24} />
            Wechat Pay
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
