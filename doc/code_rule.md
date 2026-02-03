# code_rule

**项目定位**
- 框架为 Next.js 16（App Router），TypeScript + Tailwind CSS，国际化由 next-intl 驱动。
- 内容形态以 MDX 为主，博客与静态页都走文件系统。

**运行与依赖**
- Node 版本要求为 20.x（见 `package.json` -> `engines`）。
- 包管理器固定为 pnpm 10.12.4（见 `package.json` -> `packageManager`）。
- 常用脚本：`pnpm dev`、`pnpm build`、`pnpm start`、`pnpm lint`。

**路由与国际化**
- 路由使用 App Router，页面位于 `app/`，带语言的页面位于 `app/[locale]/`。
- 支持的语言在 `i18n/routing.ts` 的 `LOCALES` 定义，默认语言为 `DEFAULT_LOCALE`。
- 需要使用 `i18n/routing.ts` 导出的 `Link`、`useRouter`、`usePathname` 等进行导航，确保国际化路由正确。

**博客与内容规则**
- 博客文章存放在 `blogs/<locale>/*.mdx`（例如 `blogs/en/*.mdx`）。
- 博客 frontmatter 规范与字段以 `types/blog.ts` 为准，常见字段：`title`、`description`、`image`、`slug`、`tags`、`date`、`visible`、`pin`。
- 仅 `visible: published` 的文章会显示；未设置时默认为 `published`（见 `lib/getBlogs.ts`）。
- 列表排序规则：先按 `pin` 置顶，再按 `date` 倒序（见 `lib/getBlogs.ts`）。
- `slug` 作为路由关键字段，需在同语言内唯一且以 `/` 开头。
- 静态内容页存放在 `content/<page>/<locale>.mdx`，例如 `content/about/zh.mdx`。

**站点与 SEO 配置**
- 站点基本信息在 `config/site.ts`，`NEXT_PUBLIC_SITE_URL` 可覆盖基础域名。
- 站点地图与 robots 规则分别在 `app/sitemap.ts`、`app/robots.ts`。

**环境变量**
- 环境变量参考 `.env.example`，包括：站点基础信息、国际化检测、统计与广告、邮件与限流等。
- 与国际化相关的变量：`NEXT_PUBLIC_LOCALE_DETECTION`。
- 与图像优化相关的变量：`NEXT_PUBLIC_OPTIMIZED_IMAGES`、`R2_PUBLIC_URL`（见 `next.config.mjs`）。

**避免硬编码**
- 站点名称、描述、作者与社媒链接统一在 `config/site.ts` 管理，页面中禁止重复写死。
- 文本内容一律走 `i18n/messages/*.json` 或 MDX 内容文件，不在组件中直接写死多语言文案。
- URL 与外链统一在配置或常量模块定义，避免在组件内散落硬编码。
- 业务枚举值（如状态、类型、标签）统一集中在 `config/` 或 `types/` 中维护，避免魔法字符串。
- 资源路径优先使用 `public/` 或配置项，不在组件内拼接固定域名。

**样式与组件**
- Tailwind 主题与扫描路径在 `tailwind.config.ts`，深色模式为 `class`。
- 全局样式在 `styles/globals.css`。
- Shadcn/ui 配置在 `components.json`，组件别名基于 `@/components` 与 `@/lib`。

**代码规范与类型**
- ESLint 继承 `next/core-web-vitals`（见 `.eslintrc.json`）。
- TypeScript `strict` 开启，路径别名 `@/*` 映射到仓库根（见 `tsconfig.json`）。
