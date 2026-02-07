import ModelConfigTool from "@/components/tools/ModelConfigTool";
import { Locale, LOCALES } from "@/i18n/routing";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Params = Promise<{ locale: string }>;

type MetadataProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ConfigTool" });

  return constructMetadata({
    page: "ConfigTool",
    title: t("title"),
    description: t("description"),
    locale: locale as Locale,
    path: "/tools/openclaw-model-config-generator",
    canonicalUrl: "/tools/openclaw-model-config-generator",
  });
}

export default async function Page() {
  return <ModelConfigTool />;
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({
    locale,
  }));
}

