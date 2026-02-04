import { useTranslations } from "next-intl";

const categoryOrder = [
  "productivity",
  "marketing",
  "development",
  "content",
  "life",
  "wellness",
] as const;

type CategoryKey = (typeof categoryOrder)[number];

type SkillCategory = {
  title: string;
  items: string[];
};

export default function SkillCategories() {
  const t = useTranslations("Home");
  const categories = t.raw("skills.categories") as Record<CategoryKey, SkillCategory>;

  return (
    <section
      id="skills"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
          {t("skills.title")}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          {t("skills.description")}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categoryOrder.map((key) => (
          <div
            key={key}
            className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-foreground">
              {categories[key].title}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {categories[key].items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
