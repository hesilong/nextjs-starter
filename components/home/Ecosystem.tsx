import { useTranslations } from "next-intl";

type EcosystemGroup = {
  title: string;
  items: string[];
};

export default function Ecosystem() {
  const t = useTranslations("Home");
  const groups = t.raw("ecosystem.groups") as EcosystemGroup[];

  return (
    <section
      id="ecosystem"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
          {t("ecosystem.title")}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          {t("ecosystem.description")}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group.title}
            className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-foreground">
              {group.title}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
