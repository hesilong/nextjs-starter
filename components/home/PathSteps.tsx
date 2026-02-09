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

const SKILL_MARKETPLACE_BASE_URL = "https://openclaw.ai/skills";

const toAnchorId = (value: string) =>
  `skills-${value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

type StepId = (typeof steps)[number]["id"];

type StepTab = {
  title: string;
  description: string;
  href?: string;
};

type SkillCategory = {
  title: string;
  count: number;
  href?: string;
  skills: {
    name: string;
    description?: string;
    href?: string;
  }[];
};

type SkillInstall = {
  title: string;
  subtitle: string;
  command: string;
  hint?: string;
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
          const isSkills = step.id === "skills";
          const moreText = isInstall
            ? t("steps.items.install.more")
            : t("steps.more");
          const visitText = t("steps.items.install.visit");
          const skillCategories = isSkills
            ? (t.raw(
                "steps.items.skills.categories" as const
              ) as SkillCategory[])
            : [];
          const skillInstall = isSkills
            ? (t.raw("steps.items.skills.install" as const) as SkillInstall)
            : null;

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
              ) : isSkills ? (
                <div className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {skillCategories.map((category) => (
                      <div
                        key={category.title}
                        id={toAnchorId(category.title)}
                        className="scroll-mt-24 rounded-2xl border border-border bg-background/80 p-5 shadow-sm target:border-primary/40 target:ring-2 target:ring-primary/20"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="text-sm font-semibold text-foreground">
                            {category.title}
                          </h4>
                          {category.href ? (
                            <a
                              href={category.href}
                              target="_blank"
                              rel="nofollow noopener noreferrer"
                              className="inline-flex items-center rounded-full border border-border bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                            >
                              {category.count}
                            </a>
                          ) : (
                            <span className="inline-flex items-center rounded-full border border-border bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                              {category.count}
                            </span>
                          )}
                        </div>
                        <div className="mt-4 space-y-2">
                          {category.skills.map((skill) => {
                            const href =
                              skill.href ||
                              `${SKILL_MARKETPLACE_BASE_URL}/${skill.name}`;
                            return (
                              <a
                                key={skill.name}
                                href={href}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/90 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                              >
                                <span className="text-foreground font-medium">
                                  {skill.name}
                                </span>
                                {skill.description && (
                                  <span className="text-right text-muted-foreground">
                                    {skill.description}
                                  </span>
                                )}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {skillInstall ? (
                    <div className="rounded-2xl border border-border bg-muted/40 p-6 shadow-sm">
                      <div className="space-y-2">
                        <h4 className="text-base font-semibold text-foreground">
                          {skillInstall.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {skillInstall.subtitle}
                        </p>
                      </div>
                      <div className="mt-4 rounded-xl border border-border bg-background/90 px-4 py-3 font-mono text-sm text-emerald-600">
                        {skillInstall.command}
                      </div>
                      {skillInstall.hint && (
                        <p className="mt-3 text-xs text-muted-foreground">
                          {skillInstall.hint}
                        </p>
                      )}
                    </div>
                  ) : null}
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
