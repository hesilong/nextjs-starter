import MDXComponents from "@/components/mdx/MDXComponents";
import { Button } from "@/components/ui/button";
import { Locale, LOCALES } from "@/i18n/routing";
import { constructMetadata } from "@/lib/metadata";
import fs from "fs/promises";
import { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import path from "path";
import remarkGfm from "remark-gfm";
import {
  Boxes,
  Cloud,
  Container,
  Cpu,
  HardDrive,
  Layers,
  Laptop,
  Package,
  Server,
  ShieldCheck,
  Terminal,
} from "lucide-react";

const options = {
  parseFrontmatter: true,
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
};

async function getMDXContent(locale: string) {
  const filePath = path.join(
    process.cwd(),
    "content",
    "install",
    `${locale}.mdx`
  );
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error(`Error reading MDX file: ${error}`);
    return "";
  }
}

type Params = Promise<{
  locale: string;
}>;

type MetadataProps = {
  params: Params;
};

type InstallCard = {
  id: string;
  title: string;
  description: string;
  badge?: string;
  href?: string;
  tags?: string[];
  icon?: string;
};

type InstallMessages = {
  title: string;
  description: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  featured: {
    title: string;
    description: string;
    more: string;
    items: InstallCard[];
  };
  allMethods: {
    title: string;
    description: string;
    items: InstallCard[];
  };
  requirements: {
    title: string;
    items: string[];
  };
  quickStart: {
    title: string;
    steps: string[];
    code: string;
    verify: string;
  };
  faq: {
    title: string;
    items: { q: string; a: string }[];
  };
};

const iconMap = {
  laptop: Laptop,
  cloud: Cloud,
  server: Server,
  docker: Container,
  k8s: Layers,
  marketplace: Package,
  script: Terminal,
  source: Boxes,
  private: ShieldCheck,
  nas: HardDrive,
  gpu: Cpu,
} as const;

type IconKey = keyof typeof iconMap;

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Install" });

  return constructMetadata({
    page: "Install",
    title: t("title"),
    description: t("description"),
    locale: locale as Locale,
    path: "/install",
    canonicalUrl: "/install",
  });
}

export default async function Page({ params }: { params: Params }) {
  const { locale } = await params;
  const isZh = locale === "zh";

  if (!isZh) {
    const content = await getMDXContent(locale);
    return (
      <article className="w-full md:w-3/5 px-2 md:px-12">
        <MDXRemote
          source={content}
          components={MDXComponents}
          options={options}
        />
      </article>
    );
  }

  const messages = await getMessages();
  const install = messages.Install as InstallMessages;
  const featured = install.featured.items || [];
  const allMethods = install.allMethods.items || [];

  return (
    <article className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <section className="space-y-6">
        <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
          {install.hero.eyebrow}
        </span>
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            {install.hero.title}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            {install.hero.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href="#featured">{install.hero.ctaPrimary}</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="#all-methods">{install.hero.ctaSecondary}</a>
          </Button>
        </div>
      </section>

      <section id="featured" className="mt-12 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              {install.featured.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {install.featured.description}
            </p>
          </div>
          <a
            href="#all-methods"
            className="text-sm font-medium text-primary hover:underline"
          >
            {install.featured.more}
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featured.map((item) => {
            const Icon =
              iconMap[(item.icon || "package") as IconKey] || Package;
            return (
              <a
                key={item.id}
                href={item.href || "#all-methods"}
                className="group rounded-2xl border border-border bg-card/60 p-5 shadow-sm transition-colors hover:bg-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {item.badge}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
                <div className="mt-4 text-sm font-medium text-primary">
                  {install.featured.more}
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section id="all-methods" className="mt-14 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            {install.allMethods.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {install.allMethods.description}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allMethods.map((item) => {
            const Icon =
              iconMap[(item.icon || "package") as IconKey] || Package;
            return (
              <div
                key={item.id}
                id={item.id}
                className="rounded-2xl border border-border bg-card/40 p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {item.description}
                </p>
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/40 p-6">
          <h2 className="text-xl font-semibold text-foreground">
            {install.requirements.title}
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {install.requirements.items.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 p-6">
          <h2 className="text-xl font-semibold text-foreground">
            {install.quickStart.title}
          </h2>
          <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
            {install.quickStart.steps.map((step) => (
              <li key={step} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <pre className="mt-4 rounded-xl bg-muted px-4 py-3 text-sm text-foreground overflow-x-auto">
            <code>{install.quickStart.code}</code>
          </pre>
          <p className="mt-3 text-xs text-muted-foreground">
            {install.quickStart.verify}
          </p>
        </div>
      </section>

      <section className="mt-14 space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">
          {install.faq.title}
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {install.faq.items.map((item) => (
            <div
              key={item.q}
              className="rounded-2xl border border-border bg-card/40 p-5"
            >
              <h3 className="text-base font-semibold text-foreground">
                {item.q}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({
    locale,
  }));
}
