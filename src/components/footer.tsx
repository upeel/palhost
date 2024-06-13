"use client";
import Image from "next/image";
import logo from "../../public/images/logo.png";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import UserHelper from "@/lib/user-helper";
import twitter from "../../public/images/icons8-twitter-48.png";
import discord from "../../public/images/icons8-discord-48.png";
import youtube from "../../public/images/icons8-youtube-48.png";
import tiktok from "../../public/images/icons8-tiktok-48.png";
import { MapPinned } from "lucide-react";

const Footer = () => {
  const router = useRouter();
  const t = useTranslations("footer");

  const redirectToHome = () => {
    router.push("/");
  };

  return (
    <footer className="bg-dark" style={{borderTop: "1px solid #222"}}>
      <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="text-orange-600 cursor-pointer">
              <Image
                src={logo}
                alt="logo"
                height={60}
                onClick={redirectToHome}
              />
            </div>

            <ul className="mt-8 flex gap-6">
              <li>
                <a
                  href="https://twitter.com/pal_host"
                  rel="noreferrer"
                  target="_blank"
                  className="text-white transition hover:opacity-75"
                >
                  <span className="sr-only">Twitter</span>

                  <Image
                    src={twitter}
                    alt="Twitter"
                    width={24}
                    height={24}
                  />
                </a>
              </li>

              <li>
                <a
                  href="https://discord.gg/7jN4NtQz"
                  rel="noreferrer"
                  target="_blank"
                  className="text-white transition hover:opacity-75"
                >
                  <span className="sr-only">Discord</span>

                  <Image
                    src={discord}
                    alt="Discord"
                    width={24}
                    height={24}
                  />
                </a>
              </li>

              <li>
                <a
                  href="https://www.youtube.com/@Palhost"
                  rel="noreferrer"
                  target="_blank"
                  className="text-white transition hover:opacity-75"
                >
                  <span className="sr-only">Youtube</span>

                  <Image
                    src={youtube}
                    alt="Youtube"
                    width={24}
                    height={24}
                  />
                </a>
              </li>

              <li>
                <a
                  href="https://www.tiktok.com/@pal_host?_t=8knkqwKpvFP&_r=1"
                  rel="noreferrer"
                  target="_blank"
                  className="text-white transition hover:opacity-75"
                >
                  <span className="sr-only">Tiktok</span>

                  <Image
                    src={tiktok}
                    alt="Tiktok"
                    width={24}
                    height={24}
                  />
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            <div>
              <p className="font-medium text-lg uppercase text-white">{t('clients')}</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                {UserHelper.isLoggedIn() ? (
                  <a
                    href="/u/dashboard"
                    className="text-white transition hover:opacity-75"
                  >
                    {" "}
                    {t('clients_area')}{" "}
                  </a>
                ) : (
                  <a
                    href="/auth/signin"
                    className="text-white transition hover:opacity-75"
                  >
                    {" "}
                    {t('clients_area')}{" "}
                  </a>
                )}
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-lg uppercase text-white">{t('company')}</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-white transition hover:opacity-75"
                  >
                    {" "}
                    {t('privacy_policy')}{" "}
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-white transition hover:opacity-75"
                  >
                    {" "}
                    {t('contact_us')}{" "}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <MapPinned className="h-8 w-8" />
            </div>
            <div>
              <p>
                <a href="http://www.metastation8.com/" target="_blank">
                  METASTATION TECHNOLOGIES PTE. LTD.
                </a>
              </p>
              <p>
                1 GATEWAY DRIVE
              </p>
              <p>
                #07-01
              </p>
              <p>
                WESTGATE TOWER
              </p>
              <p>
                SINGAPORE ( 608531 )
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-white">
          &copy; 2024. <a href="http://www.metastation8.com/" target="_blank">METASTATION TECHNOLOGIES PTE. LTD.</a> All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
