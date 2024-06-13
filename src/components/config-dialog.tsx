import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "./ui/use-toast";
import { useTranslations } from "next-intl";
import { Config } from "@/types/config";
import {
  XCircle
} from "lucide-react";

export function ConfigDialog({
  settings,
  onOpenChange,
  handleChange,
  handleSubmit
}: {
  settings: Config[];
  onOpenChange: (open: boolean) => void;
  handleChange: (index: number, value: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const { toast } = useToast();
  const t = useTranslations("service");

  return (
    <Dialog defaultOpen onOpenChange={onOpenChange}>
      <DialogContent style={{maxHeight: "75%", overflow: "auto", maxWidth: "75%", padding: "0px", position: "fixed"}}>
        <DialogHeader style={{position: "sticky", width: "100%", top: "-5px", zIndex: "2", backgroundColor: "#020817", padding: "1.5rem"}}>
          <DialogTitle style={{height: "22px", marginLeft: "16px"}}>{t('config_setting')}</DialogTitle>
          <XCircle className="cursor-pointer" style={{position: "absolute", right: "16px", top: "8px"}} onClick={() => onOpenChange(false)} />
        </DialogHeader>
        <div className="px-8" style={{overflow: "auto"}}>
          <form onSubmit={handleSubmit} className="w-full">
            {settings.map((item, key) => (
              <div key={key} className="flex p-3" style={{justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #222"}}>
                <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" style={{whiteSpace: "normal"}}>
                  {item.display}
                </div>
                {(item.value == "False" || item.value == "True") && (item.key !== 'DeathPenalty' && item.key !== 'Difficulty') &&
                <select
                  key={key}
                  onChange={(e) => handleChange(key, e.target.value)}
                  defaultValue={item.value}
                  className="cursor-pointer flex h-10 w-1/3 border-white items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 mt-4"
                  disabled={item.allow_edit !== 1}
                >
                  <option
                    value="True"
                  >
                    {t('enabled')}
                  </option>
                  <option
                    value="False"
                  >
                    {t('disabled')}
                  </option>
                </select>
                }
                {(item.value !== "False" && item.value !== "True") && (item.key !== 'DeathPenalty' && item.key !== 'Difficulty') &&
                <input
                  key={key}
                  className="flex h-10 w-1/3 rounded-md border border-white bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  type="text"
                  value={item.value}
                  onChange={(e) => handleChange(key, e.target.value)}
                  disabled={item.allow_edit !== 1}
                />
                }
                {item.key == 'DeathPenalty' &&
                <select
                  key={key}
                  onChange={(e) => handleChange(key, e.target.value)}
                  defaultValue={item.value}
                  className="cursor-pointer flex h-10 w-1/3 border-white items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 mt-4"
                  disabled={item.allow_edit !== 1}
                >
                  <option
                    value="DropAll"
                  >
                    {t('drop_all')}
                  </option>
                  <option
                    value="None"
                  >
                    {t('none')}
                  </option>
                  <option
                    value="DropItemsOnly"
                  >
                    {t('drop_item')}
                  </option>
                  <option
                    value="DropItemsAndEquipment"
                  >
                    {t('drop_item_equipment')}
                  </option>
                </select>
                }
                {item.key == 'Difficulty' &&
                <select
                  key={key}
                  onChange={(e) => handleChange(key, e.target.value)}
                  defaultValue={item.value}
                  className="cursor-pointer flex h-10 w-1/3 border-white items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 mt-4"
                  disabled={item.allow_edit !== 1}
                >
                  <option
                    value="Default"
                  >
                    {t('default')}
                  </option>
                  <option
                    value="Casual"
                  >
                    {t('casual')}
                  </option>
                  <option
                    value="Normal"
                  >
                    {t('normal')}
                  </option>
                  <option
                    value="Difficult"
                  >
                    {t('difficult')}
                  </option>
                </select>
                }
              </div>
            ))}
            <Button
              type="submit"
              variant="secondary"
              size={"lg"}
              className="bg-orange-500 mt-3 mb-8"
            >
              {t("save_changes")}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
