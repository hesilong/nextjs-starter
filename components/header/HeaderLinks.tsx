"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link as I18nLink, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { HeaderLink } from "@/types/common";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const HeaderDropdownLink = ({ link }: { link: HeaderLink }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "rounded-xl px-4 py-2 flex items-center gap-x-1 hover:bg-accent-foreground/10 hover:text-accent-foreground",
              pathname === link.href && "font-semibold text-accent-foreground"
            )}
          >
            {link.name}
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-56">
          {link.children?.map((child) => {
            const isExternal =
              child.href.startsWith("http://") ||
              child.href.startsWith("https://");

            if (isExternal) {
              return (
                <DropdownMenuItem key={child.name} asChild>
                  <a
                    href={child.href}
                    target={child.target || "_blank"}
                    rel={child.rel || "noreferrer noopener"}
                    className="flex items-center justify-between"
                  >
                    <span>{child.name}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </DropdownMenuItem>
              );
            }

            return (
              <DropdownMenuItem key={child.name} asChild>
                <I18nLink href={child.href} prefetch={true}>
                  {child.name}
                </I18nLink>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const HeaderLinks = () => {
  const tHeader = useTranslations("Header");
  const pathname = usePathname();

  const headerLinks: HeaderLink[] = tHeader.raw("links");

  return (
    <div className="hidden md:flex flex-row items-center gap-x-2 text-sm font-medium text-muted-500">
      {headerLinks.map((link) => {
        if (link.children && link.children.length > 0) {
          return <HeaderDropdownLink key={link.name} link={link} />;
        }

        return (
          <I18nLink
            key={link.name}
            href={link.href}
            title={link.name}
            prefetch={link.target && link.target === "_blank" ? false : true}
            target={link.target || "_self"}
            rel={link.rel || undefined}
            className={cn(
              "rounded-xl px-4 py-2 flex items-center gap-x-1 hover:bg-accent-foreground/10 hover:text-accent-foreground",
              pathname === link.href && "font-semibold text-accent-foreground"
            )}
          >
            {link.name}
            {link.target && link.target === "_blank" && (
              <span className="text-xs">
                <ExternalLink className="w-4 h-4" />
              </span>
            )}
          </I18nLink>
        );
      })}
    </div>
  );
};

export default HeaderLinks;
