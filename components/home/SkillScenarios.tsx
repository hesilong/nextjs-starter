import { useTranslations } from "next-intl";

type SkillScenarioItem = {
  title: string;
  count: number;
  audience: string;
  example: string;
};

type SkillScenarioGroup = {
  title: string;
  items: SkillScenarioItem[];
};

type SkillScenarioHeaders = {
  category: string;
  audience: string;
  example: string;
};

type SkillScenarios = {
  title: string;
  description: string;
  headers: SkillScenarioHeaders;
  groups: SkillScenarioGroup[];
};

const toAnchorId = (value: string) =>
  `skills-${value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

export default function SkillScenarios() {
  const t = useTranslations("Home");
  const scenarios = t.raw("steps.items.skills.scenarios") as SkillScenarios;

  if (!scenarios?.groups?.length) return null;

  return (
    <section
      id="skill-scenarios"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
          {scenarios.title}
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          {scenarios.description}
        </p>
      </div>

      <div className="mt-10 space-y-8">
        {scenarios.groups.map((group) => (
          <div
            key={group.title}
            className="rounded-3xl border border-border bg-card/60 p-6 shadow-sm"
          >
            <div className="text-center">
              <h3 className="text-base font-semibold text-foreground">
                {group.title}
              </h3>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-background/80 p-5">
              <div className="hidden sm:grid grid-cols-[1.1fr_1fr_2fr] gap-4 text-xs font-semibold text-muted-foreground">
                <span>{scenarios.headers.category}</span>
                <span>{scenarios.headers.audience}</span>
                <span>{scenarios.headers.example}</span>
              </div>

              <div className="mt-2 divide-y divide-border">
                {group.items.map((item) => (
                  <div
                    key={item.title}
                    className="grid grid-cols-1 gap-3 py-4 text-sm sm:grid-cols-[1.1fr_1fr_2fr] sm:gap-4"
                  >
                    <div>
                      <span className="sm:hidden text-[11px] font-semibold text-muted-foreground">
                        {scenarios.headers.category}
                      </span>
                      <a
                        href={`#${toAnchorId(item.title)}`}
                        className="font-semibold text-foreground transition-colors hover:text-primary"
                      >
                        {item.title}
                      </a>
                    </div>
                    <div className="text-muted-foreground">
                      <span className="sm:hidden text-[11px] font-semibold text-muted-foreground">
                        {scenarios.headers.audience}
                      </span>
                      <p>{item.audience}</p>
                    </div>
                    <div className="text-muted-foreground">
                      <span className="sm:hidden text-[11px] font-semibold text-muted-foreground">
                        {scenarios.headers.example}
                      </span>
                      <p className="rounded-xl border border-border bg-background/90 px-3 py-2 text-xs text-muted-foreground">
                        {item.example}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
