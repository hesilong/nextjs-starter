import { DEFAULT_LOCALE } from "@/i18n/routing";
import { redirect } from "next/navigation";

type Params = Promise<{ locale: string }>;

export default async function Page({ params }: { params: Params }) {
  const { locale } = await params;
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  redirect(`${prefix}/tools/openclaw-model-config-generator`);
}
