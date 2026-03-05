const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const rootDir = process.cwd();
const blogsDir = path.join(rootDir, "blogs");
const outputPath = path.join(rootDir, "lib", "generated", "blogCache.json");
const locales = ["en", "zh"];

function loadLocalePosts(locale) {
  const localeDir = path.join(blogsDir, locale);
  if (!fs.existsSync(localeDir)) {
    return [];
  }

  const files = fs
    .readdirSync(localeDir)
    .filter((name) => name.endsWith(".mdx"));

  return files.map((filename) => {
    const fullPath = path.join(localeDir, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      locale,
      title: data.title,
      description: data.description,
      image: data.image || "",
      slug: data.slug,
      tags: data.tags,
      date: data.date,
      visible: data.visible || "published",
      pin: data.pin || false,
      content,
      metadata: data,
    };
  });
}

function main() {
  const payload = {
    generatedAt: new Date().toISOString(),
    locales: {},
  };

  for (const locale of locales) {
    payload.locales[locale] = loadLocalePosts(locale);
  }

  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), "utf8");
  console.log(`Generated blog cache: ${outputPath}`);
}

main();
