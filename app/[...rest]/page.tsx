import { DEFAULT_LOCALE } from "@/i18n/routing";
import { redirect } from "next/navigation";

type Params = Promise<{
  rest: string[];
}>;

export default async function CatchAllRedirectPage({
  params,
}: {
  params: Params;
}) {
  const { rest } = await params;
  const path = rest.join("/");
  redirect(`/${DEFAULT_LOCALE}/${path}`);
}
