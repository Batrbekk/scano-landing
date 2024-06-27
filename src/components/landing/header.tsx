import React, { useTransition } from "react";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/navigation";
import WhiteLogo from "@/public/logo.svg";
import Logo from "@/public/logo.svg";
import { Menu } from "lucide-react";
import { useLocale, useTranslations } from "use-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Props {
  isBlack: boolean;
  isSticky: boolean;
}

const Header: React.FC<Props> = ({ isBlack, isSticky }) => {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const navList = [
    {
      href: "/",
      text: t("landing.mainPage"),
    },
    {
      href: "/landing/about",
      text: t("landing.aboutUs"),
    },
    {
      href: "/landing/peculiarities",
      text: t("landing.features"),
    },
    {
      href: "/landing/analytic",
      text: t("landing.analytic"),
    },
    {
      href: "/landing/price",
      text: t("landing.price"),
    },
    {
      href: "/landing/career",
      text: t("landing.career"),
    },
  ];

  const onChangeLang = (value: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: value });
    });
  };

  const handleButtonClick = () => {
    window.location.href = "https://app.scano.kz/ru";
  };

  return (
    <>
      <div
        className={cn(
          `hidden items-center justify-between lg:flex`,
          isSticky ? "bg-white px-14 py-4 shadow-md" : "container bg-transparent px-0 py-8"
        )}
      >
        <Image priority={true} src={WhiteLogo} alt="Logo" />
        <nav
          className={cn(
            `flex items-center gap-x-8 rounded-xl p-4`,
            isBlack ? "bg-[#F9F9F9]" : "border bg-[#FFFFFF10]"
          )}
        >
          {navList.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className={cn(
                `text-base font-medium `,
                !isBlack && !isSticky && "text-gray-300 hover:text-white",
                pathname === item.href && isBlack && "text-[#0FAF62]",
                pathname === item.href && !isBlack && !isSticky && "text-white",
                pathname === item.href && !isBlack && isSticky && "text-[#0FAF62]"
              )}
            >
              {item.text}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-x-4">
          <Select value={locale} onValueChange={onChangeLang}>
            <SelectTrigger className="h-fit gap-x-2 rounded-xl px-8 py-4">
              <SelectValue className="uppercase text-[#242331]">
                <p className="text-base uppercase">{locale}</p>
              </SelectValue>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="kk">KK</SelectItem>
                  <SelectItem value="ru">RU</SelectItem>
                  <SelectItem value="en">EN</SelectItem>
                </SelectGroup>
              </SelectContent>
            </SelectTrigger>
          </Select>
          <Button
            className={cn(
              `h-fit rounded-xl bg-white px-8 py-4`,
              !isSticky && !isBlack && "bg-white text-[#242331] hover:bg-white hover:text-[#0FAF62]",
              isSticky && !isBlack && "bg-[#0FAF62] hover:bg-[#0FAF62]",
              !isSticky && isBlack && "bg-[#0FAF62] hover:bg-[#0FAF62]",
              isSticky && isBlack && "bg-[#0FAF62] hover:bg-[#0FAF62]"
            )}
            onClick={handleButtonClick}
          >
            <p className="text-base">{t("landing.login")}</p>
          </Button>
        </div>
      </div>
      <div
        className={cn(
          `container flex items-center px-4 py-2 lg:hidden`,
          isSticky ? "bg-white shadow-md" : "bg-transparent"
        )}
      >
        <Dialog>
          <DialogTrigger>
            <Menu size={16} />
          </DialogTrigger>
          <DialogContent className="h-dvh w-screen">
            <Image
              priority={true}
              src={Logo}
              height={32}
              alt="logo"
              className="absolute left-2 top-2"
            />
            <div className="mt-16 flex flex-col">
              <nav className={cn(`flex flex-col gap-y-4`)}>
                {navList.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className={cn(
                      `text-base font-medium `,
                      !isBlack && !isSticky && "text-gray-300",
                      pathname === item.href && isBlack && "text-[#0FAF62]",
                      pathname === item.href && !isBlack && !isSticky && "text-[#0FAF62]",
                      pathname === item.href && !isBlack && isSticky && "text-[#0FAF62]"
                    )}
                  >
                    {item.text}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 flex flex-col gap-y-4">
                <Select value={locale} onValueChange={onChangeLang}>
                  <SelectTrigger className="h-fit gap-x-2 rounded-lg px-4 py-2">
                    <SelectValue className="uppercase text-[#242331]">
                      <p className="text-sm uppercase">{locale}</p>
                    </SelectValue>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="kk">KK</SelectItem>
                        <SelectItem value="ru">RU</SelectItem>
                        <SelectItem value="en">EN</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </SelectTrigger>
                </Select>
                <Button
                  className={cn(
                    `h-fit rounded-lg bg-white px-4 py-2`,
                    !isSticky && !isBlack && "bg-[#0FAF62] hover:bg-[#0FAF62]",
                    isSticky && !isBlack && "bg-[#0FAF62] hover:bg-[#0FAF62]",
                    !isSticky && isBlack && "bg-[#0FAF62] hover:bg-[#0FAF62]",
                    isSticky && isBlack && "bg-[#0FAF62] hover:bg-[#0FAF62]"
                  )}
                  onClick={handleButtonClick}
                >
                  <p className="text-sm">{t("landing.login")}</p>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Image
          priority={true}
          src={WhiteLogo}
          alt="Logo"
          className="mx-auto w-[40%]"
        />
        <Button
          className={cn(
            `h-fit rounded-lg bg-white px-4 py-2`,
            !isSticky && !isBlack && "bg-[#0FAF62] hover:bg-[#0FAF62]",
            isSticky && !isBlack && "bg-[#0FAF62] hover:bg-[#0FAF62]",
            !isSticky && isBlack && "bg-[#0FAF62] hover:bg-[#0FAF62]",
            isSticky && isBlack && "bg-[#0FAF62] hover:bg-[#0FAF62]"
          )}
          onClick={handleButtonClick}
        >
          <p className="text-sm">{t("landing.login")}</p>
        </Button>
      </div>
    </>
  );
};

export { Header };
