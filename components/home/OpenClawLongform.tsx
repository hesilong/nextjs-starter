import { getTranslations } from "next-intl/server";

type LongformSection = {
  title: string;
  paragraphs: string[];
};

type LongformContent = {
  title: string;
  subtitle: string;
  sections: LongformSection[];
  highlights: {
    title: string;
    items: string[];
  };
  faq: {
    title: string;
    items: { q: string; a: string }[];
  };
};

export default async function OpenClawLongform({
  locale,
}: {
  locale: string;
}) {
  if (locale !== "zh") return null;

  const t = await getTranslations({ locale, namespace: "Home" });
  const longform = t.raw("longform") as LongformContent;

  return (
    <section
      id="openclaw-story"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="max-w-3xl space-y-4">
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
          {longform.title}
        </h2>
        <p className="text-lg text-muted-foreground">{longform.subtitle}</p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-8">
          {longform.sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                {section.title}
              </h3>
              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card/50 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">
              {longform.highlights.title}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {longform.highlights.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card/50 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">
              {longform.faq.title}
            </h3>
            <div className="mt-4 space-y-4">
              {longform.faq.items.map((item) => (
                <div key={item.q}>
                  <p className="text-sm font-semibold text-foreground">
                    {item.q}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
