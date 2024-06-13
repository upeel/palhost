import { Button } from "@/components/ui/button";
import { useToast } from "./ui/use-toast";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import UserApi from "@/lib/apis/user-api";

export default function ChangePassword() {
  const { toast } = useToast();
  const t = useTranslations("account");
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();

  const onSubmit = (values: any) => {
    UserApi.changePassword(values)
      .then(() => {
        toast({
          title: t('success'),
          description: t('pass_changed'),
        });
        reset();
      })
      .catch((error) => {
        toast({
          title: t('failed'),
          description: error.response.data.message,
        });
      });
  };
  const validateConfirmPassword = (value: any) => {
    const newPassword = watch('new_password'); 
    return value === newPassword || "Passwords don't match";
  };

  return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-1/2"
      >
        <div className="flex flex-col gap-2">
          <div>
            <label className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('existing_pass')}
            </label>
            <input
              {...register('password', { required: true, minLength: 8 })}
              className="flex h-10 mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              type="password"
            />
            {errors.password && 
            <div style={{padding: "5px 8px", backgroundColor: "#e74141", borderRadius: "8px", marginTop: "8px"}}>
              <p className="text-sm font-medium">{t('min_pass')}</p>
            </div>
            }
          </div>
          <div>
            <label className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('new_pass')}
            </label>
            <input
              {...register('new_password', { required: true, minLength: 8 })}
              className="flex h-10 mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              type="password"
            />
            {errors.new_password && 
            <div style={{padding: "5px 8px", backgroundColor: "#e74141", borderRadius: "8px", marginTop: "8px"}}>
              <p className="text-sm font-medium">{t('min_pass')}</p>
            </div>
            }
          </div>
          <div>
            <label className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('confirm_new')}
            </label>
            <input
              {...register('confirm_password', { required: true, validate: validateConfirmPassword })}
              className="flex h-10 mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              type="password"
            />
            {errors.confirm_password && 
            <div style={{padding: "5px 8px", backgroundColor: "#e74141", borderRadius: "8px", marginTop: "8px"}}>
              <p className="text-sm font-medium">{t('pass_dont_match')}</p>
            </div>
            }
          </div>
        </div>
          <Button
            type="submit"
            variant="secondary"
            size={"sm"}
            className="bg-orange-500"
          >
            {t("save_changes")}
          </Button>
      </form>
  );
}
