"use client";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Link as I18nLink } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

type HeroStat = {
  value: string;
  label: string;
};

export default function Hero() {
  const t = useTranslations("Home");
  const stats = t.raw("hero.stats") as HeroStat[];

  const handleScrollToPath = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    const target = document.getElementById("path");
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    const base = `${window.location.pathname}${window.location.search}`;
    if (window.location.hash !== "#path") {
      window.history.replaceState(null, "", `${base}#path`);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 pt-24 text-center">
      <div className="mx-auto max-w-4xl space-y-6">
        <span className="inline-flex items-center rounded-full border border-border px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {t("hero.kicker")}
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
          {t("hero.title", { name: siteConfig.name })}
        </h1>
        <p className="text-lg text-muted-foreground sm:text-xl">
          {t("hero.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" asChild>
            <I18nLink
              href="/#path"
              className="gap-2"
              onClick={handleScrollToPath}
            >
              {t("hero.ctaPrimary")}
              <ArrowRight className="h-4 w-4" />
            </I18nLink>
          </Button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card/50 px-6 py-4 text-left shadow-sm"
          >
            <p className="text-2xl font-semibold text-foreground">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
