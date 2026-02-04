import { Globe, Puzzle, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

const featureIcons = {
  platform: Globe,
  skills: Puzzle,
  ownership: ShieldCheck,
} as const;

const featureOrder = ["platform", "skills", "ownership"] as const;

type FeatureKey = (typeof featureOrder)[number];

export default function Features() {
  const t = useTranslations("Home");

  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
          {t("features.title")}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          {t("features.description")}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {featureOrder.map((key) => {
          const Icon = featureIcons[key];
          return (
            <div
              key={key}
              className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-foreground">
                {t(`features.items.${key}.title` as const)}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {t(`features.items.${key}.description` as const)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
