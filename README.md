# SHOPAGG CMS 官网

SHOPAGG CMS（思普艾格）官网使用 Astro 构建。页面在构建阶段输出为纯静态 HTML、CSS、JavaScript 和 JSON，可以部署到 Cloudflare Workers Static Assets、Nginx、Apache 或任意静态托管服务。

## 本地开发

需要 Node.js 22.19 或更高版本。

```bash
npm install
npm run dev
```

访问 Astro 输出的本地地址。提交前运行：

```bash
npm run check
npm run build
```

构建结果位于 `dist/`。

## 内容结构

- `src/pages/`：页面和构建时生成的静态 JSON 路由。
- `src/content/docs/`：Markdown 文档源文件。
- `src/components/`：导航、页脚等共享组件。
- `src/data/`：项目、兼容性和版本数据。
- `public/`：图片、样式、脚本、`robots.txt` 和 `llms.txt`。
- `scripts/sync-releases.mjs`：从 GitHub Releases 同步稳定版本数据。

文档文件可以直接使用 Markdown。为保留原官网的卡片、提示框和表格样式，迁移过来的部分内容仍包含合法的 HTML 区块，后续新增的普通标题、段落、列表和代码示例可以直接使用 Markdown 语法。

版本接口在构建时生成，不依赖运行时 Worker：

- `/api/project.json`
- `/api/capabilities.json`
- `/api/compatibility.json`
- `/api/docs/index.json`
- `/api/openapi.json`
- `/api/releases/latest.json`
- `/api/releases/index.json`

搜索和 AI 入口：

- `/sitemap.xml`
- `/robots.txt`
- `/llms.txt`
- `/llms-full.txt`

## 发布流程

`.github/workflows/deploy.yml` 会在 `main` 更新、每天定时任务或手动触发时：

1. 同步 `zhpelo/shopagg-b2b-website` 的稳定版 GitHub Releases。
2. 校验并构建 Astro 静态站点。
3. 使用 Wrangler 部署到 `shopagg-org` Cloudflare Worker。

GitHub 仓库需要配置以下 Actions Secrets：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

如果迁移到其他服务器，只需运行 `npm ci && npm run build`，然后将 `dist/` 交给目标静态服务器，不需要保留 Cloudflare Worker 运行时。
