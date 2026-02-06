import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { Link as I18nLink } from "@/i18n/routing";
import {
  BookOpen,
  Download,
  Globe,
  MessageCircle,
  Puzzle,
  SlidersHorizontal,
} from "lucide-react";
import { useTranslations } from "next-intl";

const steps = [
  { id: "install", icon: Download, href: routes.install },
  { id: "models", icon: SlidersHorizontal, href: routes.models },
  { id: "chat", icon: MessageCircle, href: routes.chatIntegrations },
  { id: "webSearch", icon: Globe, href: routes.webSearch },
  { id: "skills", icon: Puzzle, href: routes.skills },
] as const;

type StepId = (typeof steps)[number]["id"];

type StepTab = {
  title: string;
  description: string;
  href?: string;
};

export default function PathSteps() {
  const t = useTranslations("Home");

  return (
    <section
      id="path"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
          {t("steps.title")}
        </h2>
        <p className="text-lg text-muted-foreground">
          {t("steps.description")}
        </p>
      </div>

      <div className="mt-10 space-y-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const stepTitle = t(`steps.items.${step.id}.title` as const);
          const tabs = t.raw(
            `steps.items.${step.id}.tabs` as const
          ) as StepTab[];
          const isInstall = step.id === "install";
          const moreText = isInstall
            ? t("steps.items.install.more")
            : t("steps.more");
          const visitText = t("steps.items.install.visit");

          return (
            <div
              key={step.id}
              className="rounded-3xl border border-border bg-card/60 p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-sm font-semibold text-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {stepTitle}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {t(`steps.items.${step.id}.description` as const)}
                  </p>
                </div>

                {isInstall && (
                  <div className="flex items-start lg:justify-end">
                    <I18nLink
                      href={step.href}
                      className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80"
                    >
                      {moreText}
                    </I18nLink>
                  </div>
                )}
              </div>

              {isInstall ? (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tabs.map((tab) => {
                    const href = tab.href || step.href;
                    const isExternal =
                      href?.startsWith("http://") ||
                      href?.startsWith("https://");
                    const content = (
                      <>
                        <p className="text-base font-semibold text-foreground">
                          {tab.title}
                        </p>
                        <p className="mt-3 text-sm text-muted-foreground">
                          {tab.description}
                        </p>
                        <div className="mt-4 text-sm font-medium text-primary opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                          {visitText}
                        </div>
                      </>
                    );

                    if (isExternal) {
                      return (
                        <a
                          key={tab.title}
                          href={href}
                          target="_blank"
                          rel="noreferrer nofollow noopener"
                          className="group min-h-[170px] rounded-3xl border border-border bg-background/90 p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                        >
                          {content}
                        </a>
                      );
                    }

                    return (
                      <I18nLink
                        key={tab.title}
                        href={href}
                        className="group min-h-[170px] rounded-3xl border border-border bg-background/90 p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        {content}
                      </I18nLink>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tabs.map((tab) => {
                    const href = tab.href;
                    const isExternal =
                      href?.startsWith("http://") ||
                      href?.startsWith("https://");
                    const isLocaleHref =
                      href?.startsWith("/zh/") || href?.startsWith("/en/");
                    const content = (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-primary">
                            <BookOpen className="h-3 w-3" />
                            {stepTitle}
                          </span>
                          <span className="inline-flex items-center rounded-full border border-border bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                            {t("steps.cardBadge")}
                          </span>
                        </div>
                        <p className="mt-4 text-sm font-semibold text-foreground">
                          {tab.title}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {tab.description}
                        </p>
                        {href && (
                          <div className="mt-4 text-xs font-medium text-primary opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                            {visitText}
                          </div>
                        )}
                      </>
                    );

                    if (!href) {
                      return (
                        <div
                          key={tab.title}
                          className="min-h-[140px] rounded-2xl border border-border bg-background/80 p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
                        >
                          {content}
                        </div>
                      );
                    }

                    if (isLocaleHref) {
                      return (
                        <a
                          key={tab.title}
                          href={href}
                          className="group min-h-[140px] rounded-2xl border border-border bg-background/80 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                        >
                          {content}
                        </a>
                      );
                    }

                    if (isExternal) {
                      return (
                        <a
                          key={tab.title}
                          href={href}
                          target="_blank"
                          rel="noreferrer nofollow noopener"
                          className="group min-h-[140px] rounded-2xl border border-border bg-background/80 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                        >
                          {content}
                        </a>
                      );
                    }

                    return (
                      <I18nLink
                        key={tab.title}
                        href={href}
                        className="group min-h-[140px] rounded-2xl border border-border bg-background/80 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        {content}
                      </I18nLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
