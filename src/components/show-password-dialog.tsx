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

export function ShowPasswordDialog({
  password,
  onOpenChange,
}: {
  password: string;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const t = useTranslations("dashboard.show_password_dialog");
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copied!",
          description: "The text has been copied to your clipboard.",
        });
      })
      .catch((err) => {
        toast({
          title: "Error!",
          description: "Failed to copy the text to your clipboard.",
        });
      });
  };

  return (
    <Dialog defaultOpen onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("password")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              {t("password")}
            </Label>
            <span className="p-2 bg-gray-500 rounded text-gray-200">
              {password}
            </span>
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={() => copyToClipboard(password)}
          >
            <span className="sr-only">{t("copy")}</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="bg-orange-500">
              {t("close")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
