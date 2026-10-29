<p>这份文档面向二次开发者、插件作者、主题作者和维护人员。它说明 SHOPAGG CMS 的目录结构、请求生命周期、核心模块、数据库迁移、插件运行时、主题区块、安全边界和常见扩展方式。</p>
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
<div class="callout "><strong>当前版本</strong><p>本文档按 <code>SHOPAGG CMS v1.3.4</code> 编写。当前源码包含 22 个迁移文件、完整的 Plugin API 1.0、4 种商品价格模式和基于 Google Translate 的 249 种语言能力。</p></div>

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
