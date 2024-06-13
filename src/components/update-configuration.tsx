import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

const UpdateConfiguration = ({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) => {
  const t = useTranslations("configuration");

  return (
    <Dialog defaultOpen onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateConfiguration;
