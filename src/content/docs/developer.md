---
title: "开发文档 - 灯塔 CMS（Lighthouse CMS）"
description: "灯塔 CMS v1.3.4 开发文档，覆盖 PHP MVC、SQLite 迁移、插件运行时、主题、区块、安全和扩展规范。"
version: "1.3.4"
modifiedTime: "2026-10-12T00:00:00+08:00"
---

<p>这份文档面向二次开发者、插件作者、主题作者和维护人员。它说明灯塔 CMS 的目录结构、请求生命周期、核心模块、数据库迁移、插件运行时、主题区块、安全边界和常见扩展方式。</p>
<div class="doc-intro-grid">
  <div class="doc-card">
    <h3>技术定位</h3>
    <p>纯 PHP MVC + SQLite3，不依赖 Composer 包，部署体验接近传统 PHP 网站。</p>
  </div>
  <div class="doc-card">
    <h3>扩展重点</h3>
    <p>插件 Manifest 与 Plugin API 是首选扩展面；控制器、模型、迁移和主题模板用于核心开发。</p>
  </div>
</div>
<div class="callout "><strong>当前版本</strong><p>本文档按 <code>灯塔 CMS v1.3.4</code> 编写。当前源码包含 22 个迁移文件、完整的 Plugin API 1.0、4 种商品价格模式和基于 Google Translate 的 249 种语言能力。</p></div>
<section class="doc-section" id="stack">
<h2>技术栈</h2>
<div class="table-wrap"><table><thead><tr><th>层次</th><th>技术</th><th>说明</th></tr></thead><tbody><tr><td>后端</td><td>PHP 8.1+</td><td>纯 PHP 实现，不依赖 Composer。</td></tr><tr><td>数据库</td><td>SQLite3</td><td>文件数据库，默认位于 <code>storage/site.db</code>，支持自动迁移。</td></tr><tr><td>架构</td><td>MVC + Router</td><td>单入口、集中路由、控制器、模型、视图分层。</td></tr><tr><td>前台主题</td><td>PHP 模板 + Tailwind CDN</td><td>默认主题使用 Tailwind 类名组织前台视觉。</td></tr><tr><td>后台界面</td><td>PHP 视图 + JavaScript</td><td>后台视图位于 <code>app/views/admin/</code>，脚本集中在 <code>assets/admin/</code>。</td></tr><tr><td>富文本与交互</td><td>Jodit、SortableJS、Font Awesome</td><td>用于富文本、拖拽排序、图标和后台编辑能力。</td></tr></tbody></table></div>
</section>
<section class="doc-section" id="目录结构">
<h2>目录结构</h2>
<p>核心目录如下：</p>
<figure class="code-block"><pre><code class="language-text">shopagg-b2b-website/
├── index.php
├── app/
│   ├── Controllers/
│   │   ├── BaseController.php
│   │   ├── SiteController.php
│   │   └── AdminController.php
│   ├── Core/
│   │   ├── Router.php
│   │   ├── Controller.php
│   │   ├── Database.php
│   │   ├── Migrator.php
│   │   ├── AuthManager.php
│   │   ├── MediaManager.php
│   │   └── AdminNavigation.php
│   ├── Plugins/               # Plugin API 1.0 运行时
│   ├── Models/
│   │   ├── BaseModel.php
│   │   ├── Product.php
│   │   ├── PostModel.php
│   │   ├── Setting.php
│   │   ├── Inquiry.php
│   │   ├── Message.php
│   │   ├── Menu.php
│   │   ├── Slider.php
│   │   └── Updater.php
│   ├── Helpers/
│   ├── Migrations/
│   ├── views/admin/
│   └── routes.php
├── assets/
│   ├── admin/
│   └── site/
├── themes/
│   └── default/
├── storage/
│   ├── blocks/
│   ├── backups/
│   ├── logs/
│   ├── plugins/               # 已安装插件版本
│   └── site.db
├── plugin-assets/             # 对外提供的插件静态资源
├── plugin-dev/                # 本地插件开发目录
├── shopagg                    # 插件 CLI
├── uploads/
└── Documents/</code></pre></figure>
<h3 id="目录职责">目录职责</h3>
<div class="table-wrap"><table><thead><tr><th>目录</th><th>职责</th><th>扩展建议</th></tr></thead><tbody><tr><td><code>app/Controllers</code></td><td>核心前后台请求处理。</td><td>修改核心页面时从这里扩展；独立业务优先写插件。</td></tr><tr><td><code>app/Core</code></td><td>路由、数据库、迁移、认证、媒体和后台导航。</td><td>非必要不要改核心类，优先使用 Plugin API。</td></tr><tr><td><code>app/Plugins</code></td><td>插件运行时、Manifest、事件、服务、任务和隔离能力。</td><td>扩展协议由这里定义，业务插件放在 <code>plugin-dev/</code> 开发。</td></tr><tr><td><code>app/Models</code></td><td>SQLite 数据访问。</td><td>核心新表应配套模型，不要在控制器里直接写大量 SQL。</td></tr><tr><td><code>app/Migrations</code></td><td>核心数据库结构版本化。</td><td>核心表结构变更必须写迁移。</td></tr><tr><td><code>app/views/admin</code></td><td>核心后台页面。</td><td>保持后台布局和组件风格一致。</td></tr><tr><td><code>themes/{theme}</code></td><td>前台主题模板。</td><td>主题只处理展示和可配置区块，不应改核心数据结构。</td></tr><tr><td><code>storage/plugins</code></td><td>已安装插件的版本化代码。</td><td>由插件管理器维护，不要手动覆盖活动版本。</td></tr><tr><td><code>plugin-assets</code></td><td>启用插件公开的 CSS、JS 等静态资源。</td><td>由插件资产发布流程维护。</td></tr><tr><td><code>storage</code></td><td>数据库、区块配置、备份和日志。</td><td>生产环境必须禁止 Web 直接访问。</td></tr><tr><td><code>uploads</code></td><td>用户上传文件。</td><td>通过媒体库和 <code>asset_url()</code> 访问。</td></tr></tbody></table></div>
</section>
<section class="doc-section" id="architecture">
<h2>请求生命周期</h2>
<p>一次前台产品详情请求的大致流程如下：</p>
<figure class="code-block"><pre><code class="language-text">GET /product/stainless-steel-pipe
  -&gt; Web 服务器重写到 index.php
  -&gt; index.php 定义常量、启动 Session、注册自动加载
  -&gt; 加载 app/Helpers/Helpers.php
  -&gt; Database::getInstance()
  -&gt; Migrator 执行待处理迁移
  -&gt; 加载 app/routes.php
  -&gt; Router 匹配 /product/:slug
  -&gt; SiteController::productDetail($slug)
  -&gt; Product::getBySlug($slug)
  -&gt; BaseController::renderSite()
  -&gt; 加载 themes/{theme}/functions.php
  -&gt; 渲染 product_detail.php</code></pre></figure>
<p>后台请求与前台类似，但会先经过认证和权限检查。未登录用户访问 <code>/admin/*</code> 会被重定向到登录页；员工账号只能进入被授权的模块。</p>
</section>
<section class="doc-section" id="核心模块">
<h2>核心模块</h2>
<h3 id="入口文件-indexphp">入口文件 <code>index.php</code></h3>
<p>入口文件负责：</p>
<ul><li>定义 <code>APP_ROOT</code>、<code>APP_VERSION</code>、<code>APP_BASE_PATH</code> 等常量。</li><li>设置错误处理和安全响应头。</li><li>启动 Session。</li><li>注册 <code>App\</code> 命名空间自动加载。</li><li>加载全局辅助函数。</li><li>初始化数据库连接并触发迁移。</li><li>加载路由表并分发请求。</li></ul>
<p><code>APP_VERSION</code> 是后台更新和资源版本号的统一来源。当前源码版本为 <code>1.3.4</code>。</p>
<h3 id="路由系统-router">路由系统 <code>Router</code></h3>
<p>路由集中注册在 <code>app/routes.php</code>。前台、后台、媒体、主题、区块、菜单、轮播、更新、robots 和 sitemap 都在这里定义。</p>
<figure class="code-block"><pre><code class="language-php">$router-&gt;add('GET', '/', [SiteController::class, 'home']);
$router-&gt;add('GET', '/product/:slug', [SiteController::class, 'productDetail']);
$router-&gt;add('POST', '/contact', [SiteController::class, 'contact']);
$router-&gt;add('GET', '/admin/products', [AdminController::class, 'products']);</code></pre></figure>
<p>路由扩展建议：</p>
<ul><li>前台展示页面放在 <code>SiteController</code>。</li><li>后台管理页面放在 <code>AdminController</code>。</li><li>POST 路由必须检查 CSRF。</li><li>需要权限控制的后台功能必须走 <code>AuthManager</code>。</li><li>不要把业务逻辑写在 <code>routes.php</code> 里。</li></ul>
<h3 id="数据库层-database">数据库层 <code>Database</code></h3>
<p><code>Database</code> 是 SQLite 单例连接入口。系统初始化数据库时会：</p>
<ol><li>创建或打开 <code>storage/site.db</code>。</li><li>设置 SQLite 运行参数。</li><li>确保迁移表存在。</li><li>执行待处理迁移。</li></ol>
<p>生产环境建议：</p>
<ul><li><code>storage/site.db</code> 文件权限控制在 Web 用户可读写范围内。</li><li>配合 Web 服务器规则禁止下载数据库文件。</li><li>定期备份数据库文件。</li></ul>
<h3 id="migrations">迁移系统 <code>Migrator</code></h3>
<p>迁移文件放在 <code>app/Migrations/</code>，按时间戳顺序执行。每个迁移只执行一次，执行记录写入 <code>migrations</code> 表。</p>
<figure class="code-block"><pre><code class="language-php">return new class {
    public function up(SQLite3 $db): void
    {
        $db-&gt;exec('CREATE TABLE IF NOT EXISTS faqs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            sort_order INTEGER DEFAULT 0,
            created_at TEXT NOT NULL
        )');
    }

    public function down(SQLite3 $db): void
    {
        $db-&gt;exec('DROP TABLE IF EXISTS faqs');
    }
};</code></pre></figure>
<p>迁移命名规范：</p>
<figure class="code-block"><pre><code class="language-text">YYYYMMDDHHMMSS_description.php
20260731000000_add_product_price_range_fields.php</code></pre></figure>
<h3 id="控制器层">控制器层</h3>
<p>控制器层分为三层：</p>
<div class="table-wrap"><table><thead><tr><th>类</th><th>职责</th></tr></thead><tbody><tr><td><code>Controller</code></td><td>基础渲染、JSON 输出、跳转。</td></tr><tr><td><code>BaseController</code></td><td>前台公共数据加载，读取站点设置和当前主题。</td></tr><tr><td><code>SiteController</code></td><td>前台页面、产品、文章、案例、页面、询盘和 sitemap。</td></tr><tr><td><code>AdminController</code></td><td>后台全部管理功能。</td></tr></tbody></table></div>
<p>建议把数据读写交给模型，把请求参数整理和业务协调放在控制器，把 HTML 输出放在视图或主题模板。</p>
<h3 id="模型层">模型层</h3>
<p>所有模型继承 <code>BaseModel</code>，通过预处理语句访问 SQLite。模型负责封装常用查询、创建、更新、删除和列表检索。</p>
<div class="table-wrap"><table><thead><tr><th>模型</th><th>表</th><th>说明</th></tr></thead><tbody><tr><td><code>User</code></td><td><code>users</code></td><td>管理员和员工账号，包含角色与权限。</td></tr><tr><td><code>Setting</code></td><td><code>settings</code></td><td>Key-Value 配置，包含 <code>site_currency</code> 全局货币。</td></tr><tr><td><code>Product</code></td><td><code>products</code>、<code>product_prices</code>、<code>product_skus</code></td><td>产品、阶梯价格、SKU 价格。</td></tr><tr><td><code>PostModel</code></td><td><code>posts</code></td><td>文章、案例、页面共用内容表。</td></tr><tr><td><code>Category</code></td><td><code>categories</code></td><td>产品和内容分类。</td></tr><tr><td><code>Inquiry</code></td><td><code>inquiries</code></td><td>产品询盘。</td></tr><tr><td><code>Message</code></td><td><code>messages</code></td><td>联系留言。</td></tr><tr><td><code>Menu</code></td><td><code>menus</code>、<code>menu_items</code></td><td>多菜单和多级菜单。</td></tr><tr><td><code>Slider</code></td><td><code>sliders</code>、<code>slider_items</code></td><td>轮播图分组和轮播项。</td></tr><tr><td><code>Updater</code></td><td><code>update_logs</code></td><td>程序更新、备份和迁移状态。</td></tr></tbody></table></div>
</section>
<section class="doc-section" id="data-model">
<h2>数据库设计</h2>
<p>当前版本由 22 个核心迁移文件维护站点、商品、内容、应用商店和插件平台的数据结构。插件还可以在自己的命名空间内维护独立迁移。</p>
<h3 id="核心业务表">核心业务表</h3>
<div class="table-wrap"><table><thead><tr><th>表</th><th>用途</th><th>关键字段</th></tr></thead><tbody><tr><td><code>settings</code></td><td>全站设置</td><td><code>key</code>、<code>value</code>，包含 <code>site_currency</code>。</td></tr><tr><td><code>users</code></td><td>后台账号</td><td><code>role</code>、<code>permissions</code>、<code>password_hash</code>。</td></tr><tr><td><code>product_categories</code></td><td>商品分类</td><td><code>slug</code>、<code>parent_id</code>。</td></tr><tr><td><code>products</code></td><td>商品</td><td><code>slug</code>、<code>images_json</code>、<code>price_mode</code>、<code>deleted_at</code>。</td></tr><tr><td><code>product_prices</code></td><td>阶梯价格</td><td><code>min_qty</code>、<code>max_qty</code>、<code>price</code>。</td></tr><tr><td><code>product_skus</code></td><td>多规格 SKU</td><td><code>sku_name</code>、<code>min_qty</code>、<code>price</code>、<code>deleted_at</code>。</td></tr><tr><td><code>posts</code></td><td>文章、案例、页面</td><td><code>post_type</code>、<code>slug</code>、<code>content</code>、<code>seo_*</code>。</td></tr><tr><td><code>messages</code></td><td>联系留言</td><td>联系人、邮箱、电话、留言内容。</td></tr><tr><td><code>inquiries</code></td><td>商品询盘</td><td>商品、数量、客户信息、状态。</td></tr><tr><td><code>media_files</code></td><td>媒体库</td><td>文件路径、类型、大小、文件夹。</td></tr><tr><td><code>menus</code> / <code>menu_items</code></td><td>导航菜单</td><td>Slug、层级、排序、链接。</td></tr><tr><td><code>sliders</code> / <code>slider_items</code></td><td>轮播图</td><td>Slug、图片、标题、按钮链接。</td></tr><tr><td><code>app_store_theme_installs</code></td><td>主题安装</td><td>远程资源、版本、安装记录。</td></tr><tr><td><code>plugins</code> / <code>plugin_*</code></td><td>插件平台</td><td>版本、设置、迁移、任务、运行记录和日志。</td></tr><tr><td><code>update_logs</code></td><td>更新日志</td><td>版本、状态、日志、备份信息。</td></tr><tr><td><code>migrations</code></td><td>迁移记录</td><td>已执行迁移版本。</td></tr></tbody></table></div>
<h3 id="产品价格模式">产品价格模式</h3>
<p><code>products.price_mode</code> 控制详情页显示方式：</p>
<div class="table-wrap"><table><thead><tr><th>值</th><th>前台含义</th><th>关联数据</th></tr></thead><tbody><tr><td><code>tier</code></td><td>阶梯价格</td><td><code>product_prices</code></td></tr><tr><td><code>sku</code></td><td>多规格 SKU 价格</td><td><code>product_skus</code></td></tr><tr><td><code>range</code></td><td>价格区间</td><td><code>products.price_range_min</code>、<code>products.price_range_max</code></td></tr><tr><td><code>negotiable</code></td><td>面谈价格</td><td>不展示固定价格，引导询盘</td></tr></tbody></table></div>
<p>辅助函数负责标准化模式：</p>
<figure class="code-block"><pre><code class="language-php">function product_price_modes(): array {
    return ['tier', 'sku', 'range', 'negotiable'];
}

function normalize_product_price_mode(string $mode, string $fallback = 'tier'): string {
    return in_array($mode, product_price_modes(), true) ? $mode : $fallback;
}</code></pre></figure>
<div class="callout callout-warning"><strong>兼容提醒</strong><p><code>product_prices.currency</code> 是历史字段。当前价格展示统一读取 <code>settings.site_currency</code>，避免同一站点不同产品显示混乱。</p></div>
</section>
<section class="doc-section" id="routes">
<h2>添加前台页面</h2>
<p>新增前台页面通常需要三步：注册路由、添加控制器方法、创建主题模板。</p>
<figure class="code-block"><figcaption>app/routes.php</figcaption><pre><code class="language-php">$router-&gt;add('GET', '/faq', [SiteController::class, 'faq']);</code></pre></figure>
<figure class="code-block"><figcaption>SiteController.php</figcaption><pre><code class="language-php">public function faq(): void
{
    $this-&gt;renderSite('faq', [
        'seo' =&gt; [
            'title' =&gt; 'FAQ',
            'description' =&gt; 'Frequently asked questions'
        ]
    ]);
}</code></pre></figure>
<figure class="code-block"><figcaption>themes/default/faq.php</figcaption><pre><code class="language-php">&lt;?php include __DIR__ . '/header.php'; ?&gt;
&lt;main class=&quot;container mx-auto px-4 py-12&quot;&gt;
    &lt;h1&gt;&lt;?= h($seo['title'] ?? 'FAQ') ?&gt;&lt;/h1&gt;
&lt;/main&gt;
&lt;?php include __DIR__ . '/footer.php'; ?&gt;</code></pre></figure>
<p>扩展原则：</p>
<ul><li>路由只负责声明路径和控制器。</li><li>控制器负责组装数据，不直接输出 HTML。</li><li>模板负责展示，所有动态文本使用 <code>h()</code> 转义。</li><li>需要后台可编辑的文案应放入主题 <code>blocks.php</code>。</li></ul>
</section>
<section class="doc-section" id="添加新数据表">
<h2>添加新数据表</h2>
<p>新增数据表必须写迁移，不要直接修改现有数据库文件。</p>
<p>步骤：</p>
<ol><li>在 <code>app/Migrations/</code> 创建时间戳文件。</li><li><code>up()</code> 中创建表、索引和默认数据。</li><li><code>down()</code> 中写回滚逻辑。</li><li>创建模型封装读写。</li><li>在控制器中调用模型。</li><li>登录后台程序更新页检查迁移状态。</li></ol>
<p>建议：</p>
<ul><li>SQLite 中新增列前先检查列是否存在。</li><li>表和索引使用 <code>IF NOT EXISTS</code>。</li><li>迁移要幂等，重复执行不应破坏数据。</li><li>不要在迁移里删除用户数据，除非功能明确要求且有备份。</li></ul>
</section>
<section class="doc-section" id="添加后台功能">
<h2>添加后台功能</h2>
<p>后台功能通常涉及路由、控制器、视图、权限和导航。</p>
<figure class="code-block"><pre><code class="language-text">1. app/routes.php 注册 /admin/example 路由
2. AdminController 增加方法
3. 方法开头执行登录和权限检查
4. app/views/admin/example/index.php 创建视图
5. 如需数据表，先写迁移和模型
6. 在后台导航或权限映射里加入模块</code></pre></figure>
<p>后台扩展要求：</p>
<ul><li>POST 请求必须带 CSRF。</li><li>员工可访问模块必须经过权限判断。</li><li>表单错误要有明确提示。</li><li>批量删除、更新、上传等操作要做输入校验。</li><li>不要在视图里写复杂 SQL。</li></ul>
</section>
<section class="doc-section" id="plugins">
<h2>插件系统</h2>
<p>灯塔 CMS v1.3 提供进程内模块化插件运行时，兼容普通 PHP 共享主机。插件由 <code>plugin.json</code> Manifest 描述，启用或停用时编译为 PHP 缓存，正常请求无需扫描插件目录。</p>
<h3 id="插件能力">扩展能力</h3>
<div class="table-wrap"><table><thead><tr><th>能力</th><th>用途</th></tr></thead><tbody><tr><td><code>routes</code></td><td>注册前台、后台、API 或 Webhook 路由，支持 standalone、theme 和 admin 布局。</td></tr><tr><td><code>events</code> / <code>filters</code></td><td>监听表单、询盘等事件，或修改商品列表、详情和表单数据。</td></tr><tr><td><code>slots</code></td><td>向页面 head、body、内容前后和 footer 注入可控输出。</td></tr><tr><td><code>services</code></td><td>通过服务注册表提供或消费订单、支付、会员、通知、积分、购物车等业务能力。</td></tr><tr><td><code>jobs</code></td><td>执行定时任务、重试任务和可分片的长任务。</td></tr><tr><td><code>admin_menu</code> / <code>permissions</code></td><td>把插件页面加入后台业务分组，并为 Staff 动态增加权限。</td></tr><tr><td><code>assets</code></td><td>按路由或视图加载插件自己的 CSS、JavaScript 和 ES Module。</td></tr><tr><td><code>settings</code></td><td>生成插件设置表单并隔离保存配置。</td></tr></tbody></table></div>
<h3 id="插件目录结构">插件目录结构</h3>
<figure class="code-block"><pre><code class="language-text">plugin-dev/lighthouse-commerce/
├── plugin.json
├── src/
│   └── Plugin.php
├── assets/
├── views/
└── migrations/</code></pre></figure>
<p>Manifest 至少声明 Schema 版本、插件 ID、名称、供应商、语义化版本、环境要求和 PSR-4 自动加载。插件 ID 仅使用小写字母、数字和中间连字符。</p>
<h3 id="插件-cli">插件 CLI</h3>
<figure class="code-block"><pre><code class="language-bash">php shopagg plugin:make lighthouse-commerce
php shopagg plugin:validate plugin-dev/lighthouse-commerce
php shopagg plugin:test plugin-dev/lighthouse-commerce
php shopagg plugin:pack plugin-dev/lighthouse-commerce
php shopagg plugin:install lighthouse-commerce.zip
php shopagg plugin:enable lighthouse-commerce
php shopagg plugin:jobs 20</code></pre></figure>
<h3 id="插件安全边界">安全边界</h3>
<ul><li>所有管理路由继续执行管理员认证和 CSRF 校验；插件权限使用动态 Staff 权限。</li><li>插件数据表使用插件命名空间，并通过插件迁移管理版本。</li><li>插件设置、Session、日志、静态资源和 HTTP 调用由运行时提供隔离封装。</li><li>卸载默认保留数据；版本切换不会反向删除数据库迁移。</li><li>路由、文件路径、依赖、冲突和环境要求会在安装或启用前校验。</li></ul>
<div class="callout "><strong>服务契约</strong><p>核心当前提供 14 类插件契约，包括购物车、订单、支付、退款、会员、积分、通知、表单类型、数据采集、导入导出和文件转换。插件之间应通过服务注册表协作，避免直接依赖对方内部类。</p></div>
</section>
<section class="doc-section" id="themes">
<h2>主题系统</h2>
<p>主题目录位于 <code>themes/{theme}</code>。主题只负责前台展示和可配置内容，不应修改核心控制器、模型或数据库结构。</p>
<h3 id="主题目录规范">主题目录规范</h3>
<figure class="code-block"><pre><code class="language-text">themes/default/
├── style.css
├── screenshot.jpg
├── functions.php
├── blocks.php
├── header.php
├── footer.php
├── home.php
├── product_list.php
├── product_detail.php
├── post_list.php
├── post_detail.php
├── case_list.php
├── case_detail.php
└── page_detail.php</code></pre></figure>
<p><code>style.css</code> 顶部必须包含主题元数据：</p>
<figure class="code-block"><pre><code class="language-css">/*
Theme Name: Default
Theme URI: https://shopagg.org
Author: Lighthouse CMS
Version: 1.0.0
Description: Default Lighthouse CMS B2B theme.
*/</code></pre></figure>
<h3 id="主题渲染机制">主题渲染机制</h3>
<p><code>Controller::render()</code> 会根据系统设置中的当前主题加载模板。如果目标主题不存在，系统回退到 <code>themes/default/</code>。</p>
<p>模板可调用：</p>
<ul><li>全局辅助函数，例如 <code>h()</code>、<code>url()</code>、<code>asset_url()</code>。</li><li>主题辅助函数，例如产品卡片、媒体渲染、轮播读取。</li><li>主题区块函数，例如 <code>block()</code> 和 <code>block_all()</code>。</li></ul>
</section>
<section class="doc-section" id="模板区块系统">
<h2>模板区块系统</h2>
<p>模板区块是主题可维护能力的核心。开发主题时，凡是客户需要改的文字、图片、按钮、颜色、产品、轮播、显示数量，都应暴露到 <code>blocks.php</code>。</p>
<h3 id="blocksphp-基本结构">blocks.php 基本结构</h3>
<figure class="code-block"><pre><code class="language-php">return [
    'home_hero' =&gt; [
        'label' =&gt; '首页 - 首屏',
        'group' =&gt; 'home',
        'group_label' =&gt; '首页',
        'fields' =&gt; [
            'label' =&gt; [
                'type' =&gt; 'text',
                'label' =&gt; '区块小标签',
                'default' =&gt; 'B2B Manufacturer'
            ],
            'title' =&gt; [
                'type' =&gt; 'text',
                'label' =&gt; '主标题',
                'default' =&gt; 'Premium Quality Industrial Products'
            ],
            'featured_products' =&gt; [
                'type' =&gt; 'product_picker',
                'label' =&gt; '推荐产品',
                'default' =&gt; []
            ]
        ]
    ]
];</code></pre></figure>
<p>模板读取：</p>
<figure class="code-block"><pre><code class="language-php">$title = block('home_hero', 'title', 'Premium Quality Industrial Products');
$products = block('home_hero', 'featured_products', []);</code></pre></figure>
<h3 id="字段类型规范">字段类型规范</h3>
<div class="table-wrap"><table><thead><tr><th>字段类型</th><th>用途</th><th>建议</th></tr></thead><tbody><tr><td><code>text</code></td><td>标题、按钮文字、短文案。</td><td>单行文本。</td></tr><tr><td><code>textarea</code></td><td>简介、多行说明。</td><td>不要放复杂 HTML。</td></tr><tr><td><code>richtext</code></td><td>需要格式的正文。</td><td>用于关于、服务等长内容。</td></tr><tr><td><code>image</code></td><td>单张图片。</td><td>输出前用 <code>asset_url()</code>。</td></tr><tr><td><code>media</code></td><td>图片或视频。</td><td>适合 Banner、背景媒体。</td></tr><tr><td><code>product_picker</code></td><td>产品选择弹窗。</td><td>产品展示区块必须优先使用。</td></tr><tr><td><code>select</code></td><td>下拉选项。</td><td>适合布局、开关、轮播图选择。</td></tr><tr><td><code>hidden</code></td><td>技术兜底字段。</td><td>不作为运营主要配置项。</td></tr></tbody></table></div>
<h3 id="产品区块规则">产品区块规则</h3>
<p>产品展示区块必须使用 <code>product_picker</code>，不要用 <code>item1_title</code>、<code>item1_image</code>、<code>item1_url</code> 伪造产品卡片。</p>
<p>原因：</p>
<ul><li>后台无法复用产品选择弹窗。</li><li>产品详情、价格、图片、分类和询盘入口会与真实数据脱节。</li><li>运营改产品时需要同时改多处假数据。</li><li>SEO 和前台详情链接不稳定。</li></ul>
<h3 id="轮播区块规则">轮播区块规则</h3>
<p>首页首屏轮播、Banner 轮播等模块应读取「外观区块 → 轮播图」里的真实轮播图数据。模板区块只配置使用哪个轮播图 Slug。</p>
<figure class="code-block"><pre><code class="language-php">'hero_slider_slug' =&gt; [
    'type' =&gt; 'select',
    'label' =&gt; '选择轮播图区块',
    'default' =&gt; 'home-hero',
    'options' =&gt; $sliderOptions
]</code></pre></figure>
<p>禁止在 <code>blocks.php</code> 中逐张配置：</p>
<figure class="code-block"><pre><code class="language-php">'slide1_image' =&gt; ['type' =&gt; 'image'],
'slide2_image' =&gt; ['type' =&gt; 'image'],
'slide3_image' =&gt; ['type' =&gt; 'image'],</code></pre></figure>
<p>旧主题为了兼容可以保留隐藏字段，但后台可见维护入口应使用轮播图管理。</p>
</section>
<section class="doc-section" id="主题代码规范">
<h2>主题代码规范</h2>
<h3 id="安全输出">安全输出</h3>
<p>模板输出必须转义：</p>
<figure class="code-block"><pre><code class="language-php">&lt;h1&gt;&lt;?= h($product['title'] ?? '') ?&gt;&lt;/h1&gt;
&lt;a href=&quot;&lt;?= h(url('/products')) ?&gt;&quot;&gt;Products&lt;/a&gt;
&lt;img src=&quot;&lt;?= h(asset_url($image)) ?&gt;&quot; alt=&quot;&lt;?= h($product['title'] ?? '') ?&gt;&quot;&gt;</code></pre></figure>
<p>规则：</p>
<ul><li>普通文本和属性使用 <code>h()</code>。</li><li>系统内部链接使用 <code>url()</code>。</li><li>上传文件路径使用 <code>asset_url()</code>。</li><li>富文本只输出经过后台编辑器保存、可控来源的字段。</li><li>不把 <code>$_GET</code>、<code>$_POST</code> 原始值直接输出到页面。</li></ul>
<h3 id="主题辅助函数">主题辅助函数</h3>
<p>重复逻辑放在 <code>functions.php</code>：</p>
<ul><li>产品卡片。</li><li>媒体渲染。</li><li>轮播读取。</li><li>图片兜底。</li><li>价格展示。</li><li>菜单渲染。</li></ul>
<p>不要在多个模板复制同一段产品卡片 HTML，后续改版会很难维护。</p>
<h3 id="tailwind-使用建议">Tailwind 使用建议</h3>
<p>默认主题使用 Tailwind CDN。新主题应尽量用 Tailwind 类名完成布局和响应式，<code>style.css</code> 保留：</p>
<ul><li>主题元数据。</li><li>Tailwind 不方便表达的少量补充样式。</li><li>特定动画或第三方组件覆盖。</li></ul>
<p>不要把整个主题视觉都堆进 <code>style.css</code>，否则后台切换主题和后续维护成本会变高。</p>
</section>
<section class="doc-section" id="菜单与轮播模型">
<h2>菜单与轮播模型</h2>
<h3 id="菜单">菜单</h3>
<p>前台主题通常通过 <code>Menu</code> 模型读取菜单：</p>
<figure class="code-block"><pre><code class="language-php">$menuModel = new \App\Models\Menu();
$navItems = $menuModel-&gt;getMenuItems('main-nav');
$footerLinks = $menuModel-&gt;getMenuItems('footer');</code></pre></figure>
<p>常用菜单 Slug：</p>
<div class="table-wrap"><table><thead><tr><th>Slug</th><th>用途</th></tr></thead><tbody><tr><td><code>main-nav</code></td><td>头部主导航。</td></tr><tr><td><code>footer</code></td><td>页脚菜单。</td></tr><tr><td><code>product-nav</code></td><td>产品中心或分类菜单。</td></tr></tbody></table></div>
<h3 id="轮播">轮播</h3>
<p>轮播数据由 <code>sliders</code> 和 <code>slider_items</code> 管理。主题应读取激活轮播项，不要硬编码轮播图片。</p>
<p>建议主题辅助函数返回统一结构：</p>
<figure class="code-block"><pre><code class="language-php">[
    'title' =&gt; 'Slide title',
    'description' =&gt; 'Slide description',
    'image' =&gt; '/uploads/...',
    'button_text' =&gt; 'Learn More',
    'button_url' =&gt; '/products'
]</code></pre></figure>
</section>
<section class="doc-section" id="认证与权限">
<h2>认证与权限</h2>
<p>后台认证由 <code>AuthManager</code> 管理。权限以模块为粒度，管理员拥有全部权限，员工按授权访问。</p>
<p>开发后台功能时需要确认：</p>
<ul><li>路由是否需要登录。</li><li>是否只允许管理员访问。</li><li>是否需要模块权限，例如产品、内容、询盘、外观、设置。</li><li>导航是否根据权限显示或隐藏。</li><li>直接访问 URL 是否仍然会被拦截。</li></ul>
<p>权限控制不能只做前端隐藏，控制器必须二次检查。</p>
</section>
<section class="doc-section" id="security">
<h2>安全规范</h2>
<p>系统包含多层安全措施：</p>
<div class="table-wrap"><table><thead><tr><th>层次</th><th>说明</th></tr></thead><tbody><tr><td>Web 服务器</td><td><code>.htaccess</code> 或 Nginx 规则阻止敏感目录访问。</td></tr><tr><td>入口文件</td><td>设置安全响应头和基础错误处理。</td></tr><tr><td>后台认证</td><td>Session、角色、权限检查。</td></tr><tr><td>表单提交</td><td>CSRF Token。</td></tr><tr><td>文件上传</td><td>MIME、扩展名和目录校验。</td></tr><tr><td>输出渲染</td><td><code>h()</code>、<code>url()</code>、<code>asset_url()</code>。</td></tr><tr><td>安全检查</td><td>Dashboard 检查数据库权限和访问规则。</td></tr></tbody></table></div>
<h3 id="开发时禁止事项">开发时禁止事项</h3>
<ul><li>禁止直接输出未转义用户输入。</li><li>禁止在主题里写删除文件、重置配置、写数据库等破坏性逻辑。</li><li>禁止绕过 <code>AuthManager</code> 写后台入口。</li><li>禁止让上传路径可执行 PHP。</li><li>禁止在迁移中无提示删除用户数据。</li><li>禁止把 API Key、密码、Token 写入主题或前台模板。</li></ul>
</section>
<section class="doc-section" id="程序更新与备份">
<h2>程序更新与备份</h2>
<p><code>Updater</code> 模型负责程序更新相关能力：</p>
<ul><li>获取当前版本。</li><li>检查远程更新。</li><li>下载更新包。</li><li>创建备份。</li><li>安装更新。</li><li>查看迁移状态。</li><li>执行待处理迁移。</li><li>写入更新日志。</li></ul>
<p>维护人员在修改更新逻辑时必须考虑：</p>
<ol><li>更新前备份是否可靠。</li><li>更新失败能否给出清楚错误。</li><li>是否会覆盖用户上传文件。</li><li>是否会覆盖用户自定义主题。</li><li>数据库迁移是否可重复检测。</li><li>更新日志是否能帮助排查。</li></ol>
</section>
<section class="doc-section" id="部署说明">
<h2>部署说明</h2>
<h3 id="根目录部署">根目录部署</h3>
<p>常规部署只需要把源码放在网站根目录，Web 服务器入口指向该目录。访问首页后系统会自动初始化数据库。</p>
<h3 id="子目录部署">子目录部署</h3>
<p>系统支持二级目录部署，<code>APP_BASE_PATH</code> 会根据请求路径计算。主题模板里的内部链接应使用 <code>url()</code>，不要手写绝对路径。</p>
<figure class="code-block"><pre><code class="language-php">&lt;a href=&quot;&lt;?= h(url('/products')) ?&gt;&quot;&gt;Products&lt;/a&gt;</code></pre></figure>
<p>这样无论部署在根目录还是 <code>/b2b</code> 子目录，链接都能保持正确。</p>
<h3 id="敏感目录保护">敏感目录保护</h3>
<p>生产环境必须禁止直接访问：</p>
<ul><li><code>app/</code></li><li><code>storage/</code></li><li><code>Documents/</code></li><li><code>.env</code></li><li>数据库文件。</li><li>备份文件。</li><li>更新包。</li></ul>
</section>
<section class="doc-section" id="扩展示例faq-模块">
<h2>扩展示例：FAQ 模块</h2>
<p>如果要添加 FAQ 模块，可以按这个步骤拆分：</p>
<ol><li>写迁移创建 <code>faqs</code> 表。</li><li>创建 <code>Faq</code> 模型。</li><li>在 <code>SiteController</code> 添加前台 FAQ 页面。</li><li>在 <code>AdminController</code> 添加 FAQ 管理。</li><li>在 <code>app/views/admin/faqs/</code> 添加列表和表单。</li><li>在 <code>app/routes.php</code> 注册前后台路由。</li><li>在权限映射中添加 <code>faqs</code> 模块。</li><li>在主题中创建 <code>faq.php</code> 模板。</li><li>在菜单管理中添加 FAQ 页面链接。</li></ol>
<p>最小迁移示例：</p>
<figure class="code-block"><pre><code class="language-php">return new class {
    public function up(SQLite3 $db): void
    {
        $db-&gt;exec('CREATE TABLE IF NOT EXISTS faqs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT &quot;published&quot;,
            sort_order INTEGER DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )');
        $db-&gt;exec('CREATE INDEX IF NOT EXISTS idx_faqs_status_sort ON faqs(status, sort_order)');
    }

    public function down(SQLite3 $db): void
    {
        $db-&gt;exec('DROP TABLE IF EXISTS faqs');
    }
};</code></pre></figure>
</section>
<section class="doc-section" id="checklist">
<h2>主题开发验收清单</h2>
<div class="checklist"><div class="check-item"><i class="fas fa-check"></i><span>主题目录包含 <code>style.css</code>、<code>blocks.php</code>、<code>functions.php</code>、<code>header.php</code>、<code>footer.php</code>。</span></div><div class="check-item"><i class="fas fa-check"></i><span><code>style.css</code> 顶部包含主题元数据。</span></div><div class="check-item"><i class="fas fa-check"></i><span><code>blocks.php</code> 可以被 <code>include</code> 并返回数组。</span></div><div class="check-item"><i class="fas fa-check"></i><span>客户需要编辑的文案、图片、按钮、颜色、数量和链接都已暴露到区块。</span></div><div class="check-item"><i class="fas fa-check"></i><span>产品展示区块使用 <code>product_picker</code>。</span></div><div class="check-item"><i class="fas fa-check"></i><span>轮播图区块使用 <code>select</code> 选择已有轮播图。</span></div><div class="check-item"><i class="fas fa-check"></i><span>模板输出使用 <code>h()</code>、<code>url()</code>、<code>asset_url()</code>。</span></div><div class="check-item"><i class="fas fa-check"></i><span>产品列表和产品详情读取真实产品数据。</span></div><div class="check-item"><i class="fas fa-check"></i><span>产品详情支持阶梯价格、SKU 价格、价格区间和面谈价格。</span></div><div class="check-item"><i class="fas fa-check"></i><span>询盘按钮和联系表单能正常提交。</span></div><div class="check-item"><i class="fas fa-check"></i><span>Header 和 Footer 优先读取全局站点设置。</span></div><div class="check-item"><i class="fas fa-check"></i><span>手机端没有横向滚动和文字遮挡。</span></div><div class="check-item"><i class="fas fa-check"></i><span>主题不修改核心表结构，不删除用户区块配置。</span></div></div>
</section>
<section class="doc-section" id="后台功能验收清单">
<h2>后台功能验收清单</h2>
<div class="checklist"><div class="check-item"><i class="fas fa-check"></i><span>新增路由已注册。</span></div><div class="check-item"><i class="fas fa-check"></i><span>控制器做了登录和权限检查。</span></div><div class="check-item"><i class="fas fa-check"></i><span>POST 请求包含 CSRF。</span></div><div class="check-item"><i class="fas fa-check"></i><span>数据写入经过模型封装。</span></div><div class="check-item"><i class="fas fa-check"></i><span>用户输入已校验。</span></div><div class="check-item"><i class="fas fa-check"></i><span>错误提示对运营人员可理解。</span></div><div class="check-item"><i class="fas fa-check"></i><span>列表页支持必要的搜索、筛选或分页。</span></div><div class="check-item"><i class="fas fa-check"></i><span>删除操作有确认或防误触设计。</span></div><div class="check-item"><i class="fas fa-check"></i><span>新表结构通过迁移创建。</span></div><div class="check-item"><i class="fas fa-check"></i><span>更新后后台导航和权限映射一致。</span></div></div>
</section>
<section class="doc-section" id="常用排查命令">
<h2>常用排查命令</h2>
<figure class="code-block"><pre><code class="language-bash"># 查看产品价格模式相关代码
rg &quot;price_mode|product_skus|product_prices&quot; app themes

# 查看主题区块字段
rg &quot;product_picker|slider_slug|type' =&gt; 'select'&quot; themes/default/blocks.php

# 查看迁移文件
ls app/Migrations

# 查看后台路由
rg &quot;admin/&quot; app/routes.php

# 查看未转义输出风险
rg &quot;echo \\$|&lt;\\?= \\$&quot; themes app/views</code></pre></figure>
</section>
<section class="doc-section" id="开发原则">
<h2>开发原则</h2>
<ol><li>保持零构建、易部署的运行体验。</li><li>独立业务功能优先通过 Plugin API 扩展，核心功能遵循现有 MVC 和模型模式。</li><li>表结构变更必须走核心迁移或插件自己的命名空间迁移。</li><li>主题只做展示和配置，不侵入核心业务。</li><li>后台权限必须在控制器或插件路由层检查。</li><li>所有用户输入都需要校验，所有输出都需要转义。</li><li>商品、媒体、轮播、菜单尽量读取真实系统数据，不用假字段替代。</li><li>修改共享能力时补充最小可验证路径，例如前台页面、后台保存、迁移执行、插件启停和移动端检查。</li></ol>
</section>
