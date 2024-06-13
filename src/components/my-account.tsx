import { Button } from "@/components/ui/button";
import { useToast } from "./ui/use-toast";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import UserApi from "@/lib/apis/user-api";
import axios from "axios";

interface Country {
  id: number;
  name: string;
}

type MyAccountProps = {
  locale: string;
};

export default function MyAccount(props: MyAccountProps) {
  const { locale } = props;
  const { toast } = useToast();
  const t = useTranslations("account");
  const tContact = useTranslations('contact');
  const [countries, setCountries] = useState<Country[]>([]);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const mediaList = [
    { name: t('none') },
    { name: t('google') },
    { name: t('youtube') },
    { name: t('facebook') },
    { name: t('twitter') },
    { name: t('instagram') },
    { name: t('ads') },
    { name: t('other') },
  ]

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get<Country[]>(`/countries/${locale}/countries.json`);
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    const getProfile = () => {
      UserApi.profile()
        .then((res) => {
          const data = res.data;
          Object.keys(data).forEach(key => {
            setValue(key, data[key]);
          });
        })
        .catch((err) => {
          toast({
            title: "Error!",
            description: err.response.data.message,
          });
        })
    };
    fetchCountries();
    getProfile();
  }, [setValue, toast]);

  const onSubmit = (formData: any) => {
    const filteredData =Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => value !== '')
    )
    UserApi.update(filteredData)
      .then(() => {
        toast({
          title: t('profile_updated'),
          description: t('updated_successfully'),
        });
      })
      .catch((error: any) => {
        toast({
          title: t('update_failed'),
          description: error.response.data.message,
        });
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="flex flex-col gap-2">
        <div className="grid gap-4 grid-cols-2 mb-2">
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('name')}
            </label>
            <input
              {...register('name', { required: true })}
              className="flex h-10 mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              type="text"
              placeholder={t('name')}
            />
            {errors.name && <span>{tContact('field_required')}</span>}
          </div>
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('address1')}
            </label>
            <input
              {...register('address_1', { required: false })}
              className="flex h-10 mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              type="text"
              placeholder={t('address1')}
            />
          </div>
        </div>
        <div className="grid gap-4 grid-cols-2 mb-2">
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('address2')}
            </label>
            <input
              {...register('address_2', { required: false })}
              className="flex h-10 mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              type="text"
              placeholder={t('address2')}
            />
          </div>
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('company')}
            </label>
            <input
              {...register('company_name', { required: false })}
              className="flex h-10 mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              type="text"
              placeholder={t('company')}
            />
          </div>
        </div>
        <div className="grid gap-4 grid-cols-2 mb-2">
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('city')}
            </label>
            <input
              {...register('city', { required: false })}
              className="flex h-10 mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              type="text"
              placeholder={t('city')}
            />
          </div>
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('email')}
            </label>
            <input
              {...register('email', { required: false })}
              className="flex h-10 mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              type="text"
              disabled
            />
          </div>
        </div>
        <div className="grid gap-4 grid-cols-2 mb-2">
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('state')}
            </label>
            <input
              {...register('state', { required: false })}
              className="flex h-10 mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              type="text"
              placeholder={t('state')}
            />
          </div>
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('zip')}
            </label>
            <input
              {...register('zip', { required: false })}
              className="flex h-10 mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              type="text"
              placeholder={t('zip')}
            />
          </div>   
        </div>
        <div className="grid gap-4 grid-cols-2 mb-2">
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('country')}
            </label>
            <select
              {...register('country', { required: false })}
              // onValueChange={handleChange}
              className="cursor-pointer flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 sm:w-full mt-4"
            >
              {countries.map(country => (
                <option
                  key={country.id}
                  value={country.name}
                >
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('hear_aboutus')}
            </label>
            <select
              {...register('hear_about_us', { required: false })}
              // onValueChange={(e) => handleChange(e)}
              className="cursor-pointer flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 sm:w-full mt-4"
            >
              {mediaList.map(item => (
                <option
                  key={item.name}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-4 grid-cols-2">
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('phone')}
            </label>
            <input
              {...register('phone', { required: false })}
              className="flex h-10 mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              type="text"
              placeholder={t('phone')}
            />
          </div>
        </div>
      </div>
      <Button
        type="submit"
        variant="secondary"
        size={"lg"}
        className="bg-orange-500"
      >
        {t("save_changes")}
      </Button>
    </form>
  );
}
