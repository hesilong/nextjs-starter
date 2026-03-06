import { Callout } from "@/components/mdx/Callout";
import MDXComponents from "@/components/mdx/MDXComponents";
import { Link as I18nLink } from "@/i18n/routing";
import { DEFAULT_LOCALE, Locale, LOCALES } from "@/i18n/routing";
import { getPosts } from "@/lib/getBlogs";
import { constructMetadata } from "@/lib/metadata";
import { BlogPost } from "@/types/blog";
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import remarkGfm from "remark-gfm";

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
};

type Params = Promise<{
  locale: string;
  slug: string;
}>;

type MetadataProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale, slug } = await params;
  let { posts }: { posts: BlogPost[] } = await getPosts(locale);
  const post = posts.find((post) => post.slug === "/" + slug);

  if (!post) {
    return constructMetadata({
      title: "404",
      description: "Page not found",
      noIndex: true,
      locale: locale as Locale,
      path: `/blog/${slug}`,
      canonicalUrl: `/blog/${slug}`,
    });
  }

  return constructMetadata({
    page: "blog",
    title: post.title,
    description: post.description,
    images: post.image ? [post.image] : [],
    locale: locale as Locale,
    path: `/blog/${slug}`,
    canonicalUrl: `/blog/${slug}`,
  });
}

export default async function BlogPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  let { posts }: { posts: BlogPost[] } = await getPosts(locale);

  const post = posts.find((item) => item.slug === "/" + slug);

  if (!post) {
    // Cross-locale fallback: if a post doesn't exist in the current locale,
    // redirect to the locale where the slug exists.
    for (const fallbackLocale of LOCALES.filter((item) => item !== locale)) {
      const { posts: fallbackPosts } = await getPosts(fallbackLocale);
      const fallbackPost = fallbackPosts.find((item) => item.slug === `/${slug}`);
      if (fallbackPost) {
        const prefix = fallbackLocale === DEFAULT_LOCALE ? "" : `/${fallbackLocale}`;
        redirect(`${prefix}/blog/${slug}`);
      }
    }

    return notFound();
  }

  const currentIndex = posts.findIndex((item) => item.slug === post.slug);
  const previousPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost =
    currentIndex >= 0 && currentIndex < posts.length - 1
      ? posts[currentIndex + 1]
      : null;

  const content = post?.content || "";
  const html = post?.html || "";
  const hasLeadingH1 = /^\s*#\s+/.test(content);
  const contentWithoutLeadingH1 = hasLeadingH1
    ? content.replace(/^\s*#\s+.*(?:\r?\n)+/, "")
    : content;
  const tags = Array.isArray(post.tags)
    ? post.tags
    : post.tags
        ?.split(",")
        .map((tag) => tag.trim())
        .filter(Boolean) ?? [];

  return (
    <div className="w-full md:w-3/5 px-2 md:px-12 pb-20 md:pb-28">
      <h1 className="break-words text-4xl font-bold mt-6 mb-4">
        {post.title}
      </h1>
      {tags.length ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            return (
              <div
                key={tag}
                className={`rounded-md bg-gray-200 hover:!no-underline dark:bg-[#24272E] flex px-2.5 py-1.5 text-sm font-medium transition-colors hover:text-black hover:dark:bg-[#15AFD04C] hover:dark:text-[#82E9FF] text-gray-500 dark:text-[#7F818C] outline-none focus-visible:ring transition`}
              >
                {tag}
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
      {!hasLeadingH1 && post.description && (
        <Callout>{post.description}</Callout>
      )}
      {html ? (
        <article
          className="mt-6 max-w-none prose prose-neutral dark:prose-invert prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-lg prose-img:border prose-img:border-gray-200 dark:prose-img:border-gray-700 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:text-gray-900 dark:prose-pre:text-gray-100 prose-pre:shadow-sm prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700 prose-pre:font-mono prose-code:before:content-none prose-code:after:content-none prose-code:text-gray-900 dark:prose-code:text-gray-100"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <MDXRemote
          source={contentWithoutLeadingH1}
          components={MDXComponents}
          options={mdxOptions}
        />
      )}

      {(previousPost || nextPost) && (
        <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previousPost ? (
              <I18nLink
                href={`/blog${previousPost.slug}`}
                className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#161a20] px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-[#1b2028]"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("previousPost")}
                </p>
                <p className="mt-1 text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 line-clamp-2">
                  {previousPost.title}
                </p>
              </I18nLink>
            ) : (
              <div className="hidden md:block" />
            )}

            {nextPost ? (
              <I18nLink
                href={`/blog${nextPost.slug}`}
                className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#161a20] px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-[#1b2028] md:text-right"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("nextPost")}
                </p>
                <p className="mt-1 text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 line-clamp-2">
                  {nextPost.title}
                </p>
              </I18nLink>
            ) : (
              <div className="hidden md:block" />
            )}
          </div>
        </nav>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];

  for (const locale of LOCALES) {
    const { posts } = await getPosts(locale);

    posts
      .filter((post) => post.slug)
      .forEach((post) => {
        const slugPart = post.slug.replace(/^\//, "").replace(/^blog\//, "");
        params.push({
          locale,
          slug: slugPart,
        });
      });
  }

  return params;
}
