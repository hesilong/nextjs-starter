import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SafetyNotice() {
  const t = useTranslations("Home");

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
      <Alert className="border-amber-200 bg-amber-50/60 text-amber-900 dark:border-amber-800/60 dark:bg-amber-900/10 dark:text-amber-100">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle>{t("safety.title")}</AlertTitle>
        <AlertDescription>{t("safety.description")}</AlertDescription>
      </Alert>
    </section>
  );
}
