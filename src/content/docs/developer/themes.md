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
Author: SHOPAGG
Version: 1.0.0
Description: Default SHOPAGG CMS B2B theme.
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
