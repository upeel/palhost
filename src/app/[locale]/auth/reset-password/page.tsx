"use client";
import {
  ChevronDown,
  ChevronUp,
  Shield,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter, Link } from "@/lib/navigation";
import useCurrentUserStore from "@/store/currentUserStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import UserApi from "@/lib/apis/user-api";

export default function ResetPass({
  params: { locale },
}: Readonly<{ params: { locale: string } }>) {
  const t = useTranslations("account");
  const tService = useTranslations("service");
  const genericT = useTranslations("general");
  const router = useRouter();
  const [actionIsOpen, setActionIsOpen] = useState(true);
  const { user } = useCurrentUserStore();

  const formSchema = z.object({
    newPass: z.string().min(8),
    confirmNewPass: z.string().min(8)
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPass: "",
      confirmNewPass: ""
    },
  });

  // const onSubmit = (values: z.infer<typeof formSchema>) => {
  //   UserApi.resetPassword(values)
  //     .then(() => {
        
  //     })
  //     .catch((error) => {
        
  //     });
  // };

  return (
    <>
      <div className="grid grid-cols-1 gap-y-8">
        <div>
          <div className="lg:p-4">
            <h1 className="text-2xl font-bold uppercase mb-8">
              {tService("reset_password")}
            </h1>
            <Form {...form}>
              <form
                // onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 w-full"
              >
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="newPass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('new_pass')}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmNewPass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('confirm_new')}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
