---
title: 开发文档
description: SHOPAGG B2B Website v1.2.3 开发文档，覆盖 PHP MVC 架构、路由、SQLite 迁移、模型、主题、区块、安全和扩展规范。
---

# 开发文档

这份文档面向二次开发者、主题作者和维护人员。它说明 SHOPAGG B2B Website 的目录结构、请求生命周期、核心模块、数据库迁移、主题区块、安全边界和常见扩展方式。

<div class="doc-intro-grid">
  <div class="doc-card">
    <h3>技术定位</h3>
    <p>纯 PHP MVC + SQLite3，不依赖 Composer 包，部署体验接近传统 PHP 网站。</p>
  </div>
  <div class="doc-card">
    <h3>扩展重点</h3>
    <p>控制器、模型、迁移、主题模板和 blocks.php 是主要扩展面。</p>
  </div>
</div>

::: tip 当前版本
本文档按 `SHOPAGG B2B Website v1.2.3` 编写。当前源码包含 17 个迁移文件、17 张核心数据表、4 种产品价格模式和基于 Google Translate 的 249 种语言能力。
:::

## 技术栈 {#stack}

| 层次 | 技术 | 说明 |
| --- | --- | --- |
| 后端 | PHP 8.1+ | 纯 PHP 实现，不依赖 Composer。 |
| 数据库 | SQLite3 | 文件数据库，默认位于 `storage/site.db`，支持自动迁移。 |
| 架构 | MVC + Router | 单入口、集中路由、控制器、模型、视图分层。 |
| 前台主题 | PHP 模板 + Tailwind CDN | 默认主题使用 Tailwind 类名组织前台视觉。 |
| 后台界面 | PHP 视图 + JavaScript | 后台视图位于 `app/views/admin/`，脚本集中在 `assets/admin/`。 |
| 富文本与交互 | Jodit、SortableJS、Font Awesome | 用于富文本、拖拽排序、图标和后台编辑能力。 |

## 目录结构

核心目录如下：

```text
shopagg-b2b-website/
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
│   │   └── MediaManager.php
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
│   └── site.db
├── uploads/
└── Documents/
```

### 目录职责

| 目录 | 职责 | 扩展建议 |
| --- | --- | --- |
| `app/Controllers` | 前后台请求处理。 | 新页面、新后台功能从这里扩展。 |
| `app/Core` | 路由、数据库、迁移、认证、媒体等基础能力。 | 非必要不要改核心类，优先通过模型和控制器扩展。 |
| `app/Models` | SQLite 数据访问。 | 新表应配套新模型，不要在控制器里直接写大量 SQL。 |
| `app/Migrations` | 数据库结构版本化。 | 表结构变更必须写迁移。 |
| `app/views/admin` | 后台页面。 | 保持后台布局和组件风格一致。 |
| `themes/{theme}` | 前台主题模板。 | 主题只处理展示和可配置区块，不应改核心数据结构。 |
| `storage` | 数据库、区块配置、备份和日志。 | 生产环境必须禁止 Web 直接访问。 |
| `uploads` | 用户上传文件。 | 通过媒体库和 `asset_url()` 访问。 |

## 请求生命周期 {#architecture}

一次前台产品详情请求的大致流程如下：

```text
GET /product/stainless-steel-pipe
  -> Web 服务器重写到 index.php
  -> index.php 定义常量、启动 Session、注册自动加载
  -> 加载 app/Helpers/Helpers.php
  -> Database::getInstance()
  -> Migrator 执行待处理迁移
  -> 加载 app/routes.php
  -> Router 匹配 /product/:slug
  -> SiteController::productDetail($slug)
  -> Product::getBySlug($slug)
  -> BaseController::renderSite()
  -> 加载 themes/{theme}/functions.php
  -> 渲染 product_detail.php
```

后台请求与前台类似，但会先经过认证和权限检查。未登录用户访问 `/admin/*` 会被重定向到登录页；员工账号只能进入被授权的模块。

## 核心模块

### 入口文件 `index.php`

入口文件负责：

- 定义 `APP_ROOT`、`APP_VERSION`、`APP_BASE_PATH` 等常量。
- 设置错误处理和安全响应头。
- 启动 Session。
- 注册 `App\` 命名空间自动加载。
- 加载全局辅助函数。
- 初始化数据库连接并触发迁移。
- 加载路由表并分发请求。

`APP_VERSION` 是后台更新和资源版本号的统一来源。当前源码版本为 `1.2.3`。

### 路由系统 `Router`

路由集中注册在 `app/routes.php`。前台、后台、媒体、主题、区块、菜单、轮播、更新、robots 和 sitemap 都在这里定义。

```php
$router->add('GET', '/', [SiteController::class, 'home']);
$router->add('GET', '/product/:slug', [SiteController::class, 'productDetail']);
$router->add('POST', '/contact', [SiteController::class, 'contact']);
$router->add('GET', '/admin/products', [AdminController::class, 'products']);
```

路由扩展建议：

- 前台展示页面放在 `SiteController`。
- 后台管理页面放在 `AdminController`。
- POST 路由必须检查 CSRF。
- 需要权限控制的后台功能必须走 `AuthManager`。
- 不要把业务逻辑写在 `routes.php` 里。

### 数据库层 `Database`

`Database` 是 SQLite 单例连接入口。系统初始化数据库时会：

1. 创建或打开 `storage/site.db`。
2. 设置 SQLite 运行参数。
3. 确保迁移表存在。
4. 执行待处理迁移。

生产环境建议：

- `storage/site.db` 文件权限控制在 Web 用户可读写范围内。
- 配合 Web 服务器规则禁止下载数据库文件。
- 定期备份数据库文件。

### 迁移系统 `Migrator` {#migrations}

迁移文件放在 `app/Migrations/`，按时间戳顺序执行。每个迁移只执行一次，执行记录写入 `migrations` 表。

```php
return new class {
    public function up(SQLite3 $db): void
    {
        $db->exec('CREATE TABLE IF NOT EXISTS faqs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            sort_order INTEGER DEFAULT 0,
            created_at TEXT NOT NULL
        )');
    }

    public function down(SQLite3 $db): void
    {
        $db->exec('DROP TABLE IF EXISTS faqs');
    }
};
```

迁移命名规范：

```text
YYYYMMDDHHMMSS_description.php
20260731000000_add_product_price_range_fields.php
```

### 控制器层

控制器层分为三层：

| 类 | 职责 |
| --- | --- |
| `Controller` | 基础渲染、JSON 输出、跳转。 |
| `BaseController` | 前台公共数据加载，读取站点设置和当前主题。 |
| `SiteController` | 前台页面、产品、文章、案例、页面、询盘和 sitemap。 |
| `AdminController` | 后台全部管理功能。 |

建议把数据读写交给模型，把请求参数整理和业务协调放在控制器，把 HTML 输出放在视图或主题模板。

### 模型层

所有模型继承 `BaseModel`，通过预处理语句访问 SQLite。模型负责封装常用查询、创建、更新、删除和列表检索。

| 模型 | 表 | 说明 |
| --- | --- | --- |
| `User` | `users` | 管理员和员工账号，包含角色与权限。 |
| `Setting` | `settings` | Key-Value 配置，包含 `site_currency` 全局货币。 |
| `Product` | `products`、`product_prices`、`product_skus` | 产品、阶梯价格、SKU 价格。 |
| `PostModel` | `posts` | 文章、案例、页面共用内容表。 |
| `Category` | `categories` | 产品和内容分类。 |
| `Inquiry` | `inquiries` | 产品询盘。 |
| `Message` | `messages` | 联系留言。 |
| `Menu` | `menus`、`menu_items` | 多菜单和多级菜单。 |
| `Slider` | `sliders`、`slider_items` | 轮播图分组和轮播项。 |
| `Updater` | `update_logs` | 程序更新、备份和迁移状态。 |

## 数据库设计 {#data-model}

当前版本围绕外贸官网业务包含 17 张核心表。表结构由 17 个迁移文件维护。

### 核心业务表

| 表 | 用途 | 关键字段 |
| --- | --- | --- |
| `settings` | 全站设置 | `key`、`value`，包含 `site_currency`。 |
| `users` | 后台账号 | `role`、`permissions`、`password_hash`。 |
| `categories` | 分类 | `type`、`slug`、`parent_id`。 |
| `products` | 产品 | `slug`、`images_json`、`price_mode`、`price_range_min`、`price_range_max`。 |
| `product_prices` | 阶梯价格 | `min_qty`、`max_qty`、`price`。 |
| `product_skus` | 多规格 SKU | `sku_name`、`min_qty`、`price`、`sort_order`。 |
| `posts` | 文章、案例、页面 | `post_type`、`slug`、`content`、`seo_*`。 |
| `messages` | 联系留言 | 联系人、邮箱、电话、留言内容。 |
| `inquiries` | 产品询盘 | 产品、数量、客户信息、状态。 |
| `media` | 媒体库 | 文件路径、类型、大小、文件夹。 |
| `menus` / `menu_items` | 导航菜单 | Slug、层级、排序、链接。 |
| `sliders` / `slider_items` | 轮播图 | Slug、图片、标题、按钮链接。 |
| `theme_installs` | 主题安装 | 主题包、版本、安装记录。 |
| `update_logs` | 更新日志 | 版本、状态、日志、备份信息。 |
| `migrations` | 迁移记录 | 已执行迁移版本。 |

### 产品价格模式

`products.price_mode` 控制详情页显示方式：

| 值 | 前台含义 | 关联数据 |
| --- | --- | --- |
| `tier` | 阶梯价格 | `product_prices` |
| `sku` | 多规格 SKU 价格 | `product_skus` |
| `range` | 价格区间 | `products.price_range_min`、`products.price_range_max` |
| `negotiable` | 面谈价格 | 不展示固定价格，引导询盘 |

辅助函数负责标准化模式：

```php
function product_price_modes(): array {
    return ['tier', 'sku', 'range', 'negotiable'];
}

function normalize_product_price_mode(string $mode, string $fallback = 'tier'): string {
    return in_array($mode, product_price_modes(), true) ? $mode : $fallback;
}
```

::: warning 兼容提醒
`product_prices.currency` 是历史字段。当前价格展示统一读取 `settings.site_currency`，避免同一站点不同产品显示混乱。
:::

## 添加前台页面 {#routes}

新增前台页面通常需要三步：注册路由、添加控制器方法、创建主题模板。

::: code-group

```php [app/routes.php]
$router->add('GET', '/faq', [SiteController::class, 'faq']);
```

```php [SiteController.php]
public function faq(): void
{
    $this->renderSite('faq', [
        'seo' => [
            'title' => 'FAQ',
            'description' => 'Frequently asked questions'
        ]
    ]);
}
```

```php [themes/default/faq.php]
<?php include __DIR__ . '/header.php'; ?>
<main class="container mx-auto px-4 py-12">
    <h1><?= h($seo['title'] ?? 'FAQ') ?></h1>
</main>
<?php include __DIR__ . '/footer.php'; ?>
```

:::

扩展原则：

- 路由只负责声明路径和控制器。
- 控制器负责组装数据，不直接输出 HTML。
- 模板负责展示，所有动态文本使用 `h()` 转义。
- 需要后台可编辑的文案应放入主题 `blocks.php`。

## 添加新数据表

新增数据表必须写迁移，不要直接修改现有数据库文件。

步骤：

1. 在 `app/Migrations/` 创建时间戳文件。
2. `up()` 中创建表、索引和默认数据。
3. `down()` 中写回滚逻辑。
4. 创建模型封装读写。
5. 在控制器中调用模型。
6. 登录后台程序更新页检查迁移状态。

建议：

- SQLite 中新增列前先检查列是否存在。
- 表和索引使用 `IF NOT EXISTS`。
- 迁移要幂等，重复执行不应破坏数据。
- 不要在迁移里删除用户数据，除非功能明确要求且有备份。

## 添加后台功能

后台功能通常涉及路由、控制器、视图、权限和导航。

```text
1. app/routes.php 注册 /admin/example 路由
2. AdminController 增加方法
3. 方法开头执行登录和权限检查
4. app/views/admin/example/index.php 创建视图
5. 如需数据表，先写迁移和模型
6. 在后台导航或权限映射里加入模块
```

后台扩展要求：

- POST 请求必须带 CSRF。
- 员工可访问模块必须经过权限判断。
- 表单错误要有明确提示。
- 批量删除、更新、上传等操作要做输入校验。
- 不要在视图里写复杂 SQL。

## 主题系统 {#themes}

主题目录位于 `themes/{theme}`。主题只负责前台展示和可配置内容，不应修改核心控制器、模型或数据库结构。

### 主题目录规范

```text
themes/default/
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
└── page_detail.php
```

`style.css` 顶部必须包含主题元数据：

```css
/*
Theme Name: Default
Theme URI: https://www.shopagg.com
Author: SHOPAGG
Version: 1.0.0
Description: Default SHOPAGG B2B theme.
*/
```

### 主题渲染机制

`Controller::render()` 会根据系统设置中的当前主题加载模板。如果目标主题不存在，系统回退到 `themes/default/`。

模板可调用：

- 全局辅助函数，例如 `h()`、`url()`、`asset_url()`。
- 主题辅助函数，例如产品卡片、媒体渲染、轮播读取。
- 主题区块函数，例如 `block()` 和 `block_all()`。

## 模板区块系统

模板区块是主题可维护能力的核心。开发主题时，凡是客户需要改的文字、图片、按钮、颜色、产品、轮播、显示数量，都应暴露到 `blocks.php`。

### blocks.php 基本结构

```php
return [
    'home_hero' => [
        'label' => '首页 - 首屏',
        'group' => 'home',
        'group_label' => '首页',
        'fields' => [
            'label' => [
                'type' => 'text',
                'label' => '区块小标签',
                'default' => 'B2B Manufacturer'
            ],
            'title' => [
                'type' => 'text',
                'label' => '主标题',
                'default' => 'Premium Quality Industrial Products'
            ],
            'featured_products' => [
                'type' => 'product_picker',
                'label' => '推荐产品',
                'default' => []
            ]
        ]
    ]
];
```

模板读取：

```php
$title = block('home_hero', 'title', 'Premium Quality Industrial Products');
$products = block('home_hero', 'featured_products', []);
```

### 字段类型规范

| 字段类型 | 用途 | 建议 |
| --- | --- | --- |
| `text` | 标题、按钮文字、短文案。 | 单行文本。 |
| `textarea` | 简介、多行说明。 | 不要放复杂 HTML。 |
| `richtext` | 需要格式的正文。 | 用于关于、服务等长内容。 |
| `image` | 单张图片。 | 输出前用 `asset_url()`。 |
| `media` | 图片或视频。 | 适合 Banner、背景媒体。 |
| `product_picker` | 产品选择弹窗。 | 产品展示区块必须优先使用。 |
| `select` | 下拉选项。 | 适合布局、开关、轮播图选择。 |
| `hidden` | 技术兜底字段。 | 不作为运营主要配置项。 |

### 产品区块规则

产品展示区块必须使用 `product_picker`，不要用 `item1_title`、`item1_image`、`item1_url` 伪造产品卡片。

原因：

- 后台无法复用产品选择弹窗。
- 产品详情、价格、图片、分类和询盘入口会与真实数据脱节。
- 运营改产品时需要同时改多处假数据。
- SEO 和前台详情链接不稳定。

### 轮播区块规则

首页首屏轮播、Banner 轮播等模块应读取「外观区块 → 轮播图」里的真实轮播图数据。模板区块只配置使用哪个轮播图 Slug。

```php
'hero_slider_slug' => [
    'type' => 'select',
    'label' => '选择轮播图区块',
    'default' => 'home-hero',
    'options' => $sliderOptions
]
```

禁止在 `blocks.php` 中逐张配置：

```php
'slide1_image' => ['type' => 'image'],
'slide2_image' => ['type' => 'image'],
'slide3_image' => ['type' => 'image'],
```

旧主题为了兼容可以保留隐藏字段，但后台可见维护入口应使用轮播图管理。

## 主题代码规范

### 安全输出

模板输出必须转义：

```php
<h1><?= h($product['title'] ?? '') ?></h1>
<a href="<?= h(url('/products')) ?>">Products</a>
<img src="<?= h(asset_url($image)) ?>" alt="<?= h($product['title'] ?? '') ?>">
```

规则：

- 普通文本和属性使用 `h()`。
- 系统内部链接使用 `url()`。
- 上传文件路径使用 `asset_url()`。
- 富文本只输出经过后台编辑器保存、可控来源的字段。
- 不把 `$_GET`、`$_POST` 原始值直接输出到页面。

### 主题辅助函数

重复逻辑放在 `functions.php`：

- 产品卡片。
- 媒体渲染。
- 轮播读取。
- 图片兜底。
- 价格展示。
- 菜单渲染。

不要在多个模板复制同一段产品卡片 HTML，后续改版会很难维护。

### Tailwind 使用建议

默认主题使用 Tailwind CDN。新主题应尽量用 Tailwind 类名完成布局和响应式，`style.css` 保留：

- 主题元数据。
- Tailwind 不方便表达的少量补充样式。
- 特定动画或第三方组件覆盖。

不要把整个主题视觉都堆进 `style.css`，否则后台切换主题和后续维护成本会变高。

## 菜单与轮播模型

### 菜单

前台主题通常通过 `Menu` 模型读取菜单：

```php
$menuModel = new \App\Models\Menu();
$navItems = $menuModel->getMenuItems('main-nav');
$footerLinks = $menuModel->getMenuItems('footer');
```

常用菜单 Slug：

| Slug | 用途 |
| --- | --- |
| `main-nav` | 头部主导航。 |
| `footer` | 页脚菜单。 |
| `product-nav` | 产品中心或分类菜单。 |

### 轮播

轮播数据由 `sliders` 和 `slider_items` 管理。主题应读取激活轮播项，不要硬编码轮播图片。

建议主题辅助函数返回统一结构：

```php
[
    'title' => 'Slide title',
    'description' => 'Slide description',
    'image' => '/uploads/...',
    'button_text' => 'Learn More',
    'button_url' => '/products'
]
```

## 认证与权限

后台认证由 `AuthManager` 管理。权限以模块为粒度，管理员拥有全部权限，员工按授权访问。

开发后台功能时需要确认：

- 路由是否需要登录。
- 是否只允许管理员访问。
- 是否需要模块权限，例如产品、内容、询盘、外观、设置。
- 导航是否根据权限显示或隐藏。
- 直接访问 URL 是否仍然会被拦截。

权限控制不能只做前端隐藏，控制器必须二次检查。

## 安全规范 {#security}

系统包含多层安全措施：

| 层次 | 说明 |
| --- | --- |
| Web 服务器 | `.htaccess` 或 Nginx 规则阻止敏感目录访问。 |
| 入口文件 | 设置安全响应头和基础错误处理。 |
| 后台认证 | Session、角色、权限检查。 |
| 表单提交 | CSRF Token。 |
| 文件上传 | MIME、扩展名和目录校验。 |
| 输出渲染 | `h()`、`url()`、`asset_url()`。 |
| 安全检查 | Dashboard 检查数据库权限和访问规则。 |

### 开发时禁止事项

- 禁止直接输出未转义用户输入。
- 禁止在主题里写删除文件、重置配置、写数据库等破坏性逻辑。
- 禁止绕过 `AuthManager` 写后台入口。
- 禁止让上传路径可执行 PHP。
- 禁止在迁移中无提示删除用户数据。
- 禁止把 API Key、密码、Token 写入主题或前台模板。

## 程序更新与备份

`Updater` 模型负责程序更新相关能力：

- 获取当前版本。
- 检查远程更新。
- 下载更新包。
- 创建备份。
- 安装更新。
- 查看迁移状态。
- 执行待处理迁移。
- 写入更新日志。

维护人员在修改更新逻辑时必须考虑：

1. 更新前备份是否可靠。
2. 更新失败能否给出清楚错误。
3. 是否会覆盖用户上传文件。
4. 是否会覆盖用户自定义主题。
5. 数据库迁移是否可重复检测。
6. 更新日志是否能帮助排查。

## 部署说明

### 根目录部署

常规部署只需要把源码放在网站根目录，Web 服务器入口指向该目录。访问首页后系统会自动初始化数据库。

### 子目录部署

系统支持二级目录部署，`APP_BASE_PATH` 会根据请求路径计算。主题模板里的内部链接应使用 `url()`，不要手写绝对路径。

```php
<a href="<?= h(url('/products')) ?>">Products</a>
```

这样无论部署在根目录还是 `/b2b` 子目录，链接都能保持正确。

### 敏感目录保护

生产环境必须禁止直接访问：

- `app/`
- `storage/`
- `Documents/`
- `.env`
- 数据库文件。
- 备份文件。
- 更新包。

## 扩展示例：FAQ 模块

如果要添加 FAQ 模块，可以按这个步骤拆分：

1. 写迁移创建 `faqs` 表。
2. 创建 `Faq` 模型。
3. 在 `SiteController` 添加前台 FAQ 页面。
4. 在 `AdminController` 添加 FAQ 管理。
5. 在 `app/views/admin/faqs/` 添加列表和表单。
6. 在 `app/routes.php` 注册前后台路由。
7. 在权限映射中添加 `faqs` 模块。
8. 在主题中创建 `faq.php` 模板。
9. 在菜单管理中添加 FAQ 页面链接。

最小迁移示例：

```php
return new class {
    public function up(SQLite3 $db): void
    {
        $db->exec('CREATE TABLE IF NOT EXISTS faqs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT "published",
            sort_order INTEGER DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )');
        $db->exec('CREATE INDEX IF NOT EXISTS idx_faqs_status_sort ON faqs(status, sort_order)');
    }

    public function down(SQLite3 $db): void
    {
        $db->exec('DROP TABLE IF EXISTS faqs');
    }
};
```

## 主题开发验收清单 {#checklist}

- [ ] 主题目录包含 `style.css`、`blocks.php`、`functions.php`、`header.php`、`footer.php`。
- [ ] `style.css` 顶部包含主题元数据。
- [ ] `blocks.php` 可以被 `include` 并返回数组。
- [ ] 客户需要编辑的文案、图片、按钮、颜色、数量和链接都已暴露到区块。
- [ ] 产品展示区块使用 `product_picker`。
- [ ] 轮播图区块使用 `select` 选择已有轮播图。
- [ ] 模板输出使用 `h()`、`url()`、`asset_url()`。
- [ ] 产品列表和产品详情读取真实产品数据。
- [ ] 产品详情支持阶梯价格、SKU 价格、价格区间和面谈价格。
- [ ] 询盘按钮和联系表单能正常提交。
- [ ] Header 和 Footer 优先读取全局站点设置。
- [ ] 手机端没有横向滚动和文字遮挡。
- [ ] 主题不修改核心表结构，不删除用户区块配置。

## 后台功能验收清单

- [ ] 新增路由已注册。
- [ ] 控制器做了登录和权限检查。
- [ ] POST 请求包含 CSRF。
- [ ] 数据写入经过模型封装。
- [ ] 用户输入已校验。
- [ ] 错误提示对运营人员可理解。
- [ ] 列表页支持必要的搜索、筛选或分页。
- [ ] 删除操作有确认或防误触设计。
- [ ] 新表结构通过迁移创建。
- [ ] 更新后后台导航和权限映射一致。

## 常用排查命令

```bash
# 查看产品价格模式相关代码
rg "price_mode|product_skus|product_prices" app themes

# 查看主题区块字段
rg "product_picker|slider_slug|type' => 'select'" themes/default/blocks.php

# 查看迁移文件
ls app/Migrations

# 查看后台路由
rg "admin/" app/routes.php

# 查看未转义输出风险
rg "echo \\$|<\\?= \\$" themes app/views
```

## 开发原则

1. 保持零构建、易部署的运行体验。
2. 新功能优先遵循现有 MVC 和模型模式。
3. 表结构变更必须走迁移。
4. 主题只做展示和配置，不侵入核心业务。
5. 后台权限必须在控制器层检查。
6. 所有用户输入都需要校验，所有输出都需要转义。
7. 产品、媒体、轮播、菜单尽量读取真实系统数据，不用假字段替代。
8. 修改共享能力时补充最小可验证路径，例如前台页面、后台保存、迁移执行和移动端检查。
