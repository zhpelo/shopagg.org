---
title: "使用文档 - 灯塔 CMS（Lighthouse CMS）"
description: "灯塔 CMS v1.3.4 使用文档，覆盖部署、后台管理、商品维护、询盘处理、主题区块、应用商店、插件管理和上线检查。"
version: "1.3.4"
modifiedTime: "2026-10-12T00:00:00+08:00"
---

<p>这份文档面向网站管理员、运营人员、商品维护人员和销售跟单人员。目标是让团队不用阅读源码，也能完成灯塔 CMS 的部署、后台配置、内容维护、询盘处理、插件管理和上线检查。</p>
<div class="doc-metric-grid">
  <div class="doc-metric"><strong>1.3.4</strong><span>当前源码版本</span></div>
  <div class="doc-metric"><strong>249</strong><span>Google Translate 在线翻译语言</span></div>
  <div class="doc-metric"><strong>22</strong><span>版本化数据库迁移</span></div>
  <div class="doc-metric"><strong>0</strong><span>运行期外部 PHP 包依赖</span></div>
</div>
<div class="callout "><strong>适用范围</strong><p>本文档按 <code>灯塔 CMS v1.3.4</code> 编写。后台入口通常是 <code>/admin/login</code>，演示环境常见初始账号为 <code>admin</code> / <code>admin123</code>。生产环境首次登录后必须立即修改默认密码。</p></div>
<section class="doc-section" id="角色与阅读路线">
<h2>角色与阅读路线</h2>
<p>不同岗位关注点不同，可以按下面路线阅读：</p>
<div class="table-wrap"><table><thead><tr><th>角色</th><th>重点章节</th><th>目标</th></tr></thead><tbody><tr><td>管理员</td><td>安装部署、首次登录、系统设置、员工权限、上线检查</td><td>完成站点初始化、账号安全、权限和基础配置。</td></tr><tr><td>运营人员</td><td>产品中心、内容管理、外观区块、菜单和轮播</td><td>持续维护产品、文章、案例、页面和首页展示。</td></tr><tr><td>销售跟单</td><td>收件箱与询盘、产品价格模式、日常流程</td><td>快速识别客户需求，准备报价和后续跟进。</td></tr><tr><td>站点维护人员</td><td>程序更新、备份、迁移状态、常见问题</td><td>保持系统可更新、可回滚、可排查。</td></tr></tbody></table></div>
</section>
<section class="doc-section" id="install">
<h2>安装部署</h2>
<p>灯塔 CMS 的部署设计接近传统 PHP 虚拟主机体验，不需要 Composer、Node.js 或前端构建工具。准备好 PHP 和 SQLite 扩展后，上传源码并访问站点即可触发初始化。</p>
<h3 id="运行环境要求">运行环境要求</h3>
<div class="table-wrap"><table><thead><tr><th>项目</th><th>最低要求</th><th>说明</th></tr></thead><tbody><tr><td>PHP</td><td><code>8.1+</code></td><td>推荐使用当前稳定的 PHP 8.x 版本。</td></tr><tr><td>PHP 扩展</td><td><code>sqlite3</code>、<code>mbstring</code>、<code>fileinfo</code></td><td>SQLite 数据库、字符串处理、上传 MIME 校验依赖这些扩展。</td></tr><tr><td>Web 服务器</td><td>Apache 或 Nginx</td><td>Apache 需要启用 <code>mod_rewrite</code>；Nginx 使用 <code>try_files</code> 转发到 <code>index.php</code>。</td></tr><tr><td>写入目录</td><td><code>storage/</code>、<code>uploads/</code></td><td>数据库、区块配置、上传文件、备份和更新日志会写入这两个目录。</td></tr><tr><td>HTTPS</td><td>生产环境必备</td><td>表单、后台登录和客户询盘都应通过 HTTPS 提交。</td></tr></tbody></table></div>
<h3 id="三种部署方式">三种部署方式</h3>
<figure class="code-block"><figcaption>Git Clone</figcaption><pre><code class="language-bash">git clone https://github.com/zhpelo/shopagg-b2b-website.git
cd shopagg-b2b-website
chmod -R 755 storage uploads</code></pre></figure>
<figure class="code-block"><figcaption>ZIP 源码包</figcaption><pre><code class="language-bash">wget https://github.com/zhpelo/shopagg-b2b-website/archive/refs/heads/main.zip
unzip main.zip
mv shopagg-b2b-website-main shopagg-b2b-website
chmod -R 755 shopagg-b2b-website/storage shopagg-b2b-website/uploads</code></pre></figure>
<figure class="code-block"><figcaption>云端部署</figcaption><pre><code class="language-text">打开 https://www.shopagg.com/dashboard/b2b-sites/create
按页面提示填写站点信息
无需配置服务器、上传代码或手动初始化数据库</code></pre></figure>
<h3 id="apache-配置要点">Apache 配置要点</h3>
<p>源码内置 <code>.htaccess</code>，常规 Apache 环境只需要确保站点目录允许重写：</p>
<figure class="code-block"><pre><code class="language-apache">AllowOverride All
Options FollowSymLinks</code></pre></figure>
<p>部署完成后访问首页。如果系统发现数据库不存在，会自动创建 <code>storage/site.db</code>，执行迁移并写入默认数据。</p>
<h3 id="nginx-配置要点">Nginx 配置要点</h3>
<p>Nginx 环境需要把不存在的路径转发到 <code>index.php</code>：</p>
<figure class="code-block"><pre><code class="language-nginx">location / {
    try_files $uri $uri/ /index.php?$query_string;
}

location ~ ^/(storage|app|Documents)/ {
    deny all;
}</code></pre></figure>
<div class="callout callout-warning"><strong>生产环境注意</strong><p>不要让浏览器直接访问 <code>storage/</code>、<code>app/</code>、<code>Documents/</code>、<code>.env</code> 和数据库文件。上线后建议立即测试 <code>https://你的域名/storage/site.db</code> 是否被拒绝访问。</p></div>
</section>
<section class="doc-section" id="first-login">
<h2>首次登录与初始化</h2>
<p>首次安装后访问 <code>/admin/login</code>。登录成功后先不要急着录入大量内容，建议按下面顺序完成基础配置。</p>
<div class="doc-step-grid">
  <div class="doc-step"><h3>1. 修改密码</h3><p>替换默认管理员密码，使用足够长度的强密码。</p></div>
  <div class="doc-step"><h3>2. 设置公司资料</h3><p>填写网站名称、Logo、联系方式、公司简介和 SEO 信息。</p></div>
  <div class="doc-step"><h3>3. 测试表单</h3><p>从前台提交联系留言和产品询盘，确认后台能收到。</p></div>
</div>
<h3 id="初始化检查清单">初始化检查清单</h3>
<ul><li>确认后台右下角或更新页显示版本为 <code>v1.3.4</code>。</li><li>确认 <code>storage/</code> 和 <code>uploads/</code> 可写。</li><li>确认当前主题已启用，前台首页能正常打开。</li><li>确认默认货币代码，例如 <code>USD</code>、<code>EUR</code>、<code>CNY</code>。</li><li>确认 Google Translate 翻译入口是否按业务需要显示。</li><li>确认后台员工账号只有必要权限。</li></ul>
</section>
<section class="doc-section" id="admin">
<h2>后台导航说明</h2>
<p>后台菜单按日常运营流程组织。管理员可以看到全部模块，员工账号看到的菜单取决于授权。</p>
<div class="table-wrap"><table><thead><tr><th>菜单</th><th>用途</th><th>常见使用者</th></tr></thead><tbody><tr><td>仪表盘</td><td>查看商品、内容、询盘、留言、近期活动和安全提示。</td><td>管理员、运营</td></tr><tr><td>收件箱</td><td>处理联系留言和商品询单，查看客户需求和来源。</td><td>销售、客服</td></tr><tr><td>商品</td><td>维护商品、分类、图片、标签、供应商、价格模式和 SEO。</td><td>商品运营</td></tr><tr><td>内容</td><td>发布文章、案例、独立页面，管理媒体库。</td><td>内容运营</td></tr><tr><td>外观</td><td>管理网站模板、模板区块、菜单和轮播图。</td><td>管理员、设计运营</td></tr><tr><td>扩展</td><td>浏览应用商店，安装、启停、升级和配置插件。</td><td>管理员、维护人员</td></tr><tr><td>系统</td><td>管理站点资料、翻译、自定义代码、员工、备份和更新。</td><td>管理员、维护人员</td></tr></tbody></table></div>
<h3 id="仪表盘怎么用">仪表盘怎么用</h3>
<p>仪表盘适合每天登录后快速判断站点状态：</p>
<ul><li>产品总数、已发布产品数量。</li><li>文章、案例、页面数量。</li><li>新留言和新询盘数量。</li><li>最近提交的客户信息。</li><li>安全检查提示，例如数据库文件权限、敏感目录访问规则。</li><li>程序更新、迁移和备份状态入口。</li></ul>
<p>如果你看到询盘或留言数量异常增长，应优先检查来源 IP、表单内容和是否存在垃圾提交。</p>
</section>
<section class="doc-section" id="content">
<h2>产品中心</h2>
<p>产品中心是 B2B 官网的核心模块。一个可销售、可被搜索、可被询盘的产品通常需要完整标题、分类、图片、详情、价格模式、SEO 和询盘入口。</p>
<h3 id="新增产品">新增产品</h3>
<p>进入「产品中心 → 产品列表」，点击添加产品。建议按下面顺序填写：</p>
<ol><li>产品标题：使用客户会搜索的产品名称。</li><li>Slug：使用英文小写、数字和连字符。</li><li>产品分类：确保产品进入正确分类，方便筛选和导航。</li><li>摘要：用于列表页和详情页开头，控制在两三句话内。</li><li>产品描述：写清规格、材料、用途、包装、认证、交期等信息。</li><li>图片：至少上传主图，重要产品建议添加多张细节图。</li><li>价格模式：选择阶梯价格、SKU 价格、价格区间或面谈价格。</li><li>SEO：填写 SEO 标题、关键词、描述。</li><li>状态：确认内容完整后再发布。</li></ol>
<h3 id="slug-规则">Slug 规则</h3>
<p>Slug 用于生成前台网址，例如：</p>
<figure class="code-block"><pre><code class="language-text">/product/stainless-steel-pipe
/product/industrial-ball-valve</code></pre></figure>
<p>系统会自动处理大小写和非法字符。推荐做法：</p>
<ul><li>使用简短英文。</li><li>单词之间用 <code>-</code>。</li><li>不要频繁修改已经被搜索引擎收录的 Slug。</li><li>不要把日期、内部编号或临时促销词写进核心产品 Slug。</li></ul>
<h3 id="产品分类">产品分类</h3>
<p>产品分类影响前台筛选、导航和 SEO。建议先建立一级和二级分类，再录入产品。</p>
<div class="table-wrap"><table><thead><tr><th>分类设计</th><th>示例</th></tr></thead><tbody><tr><td>按产品线</td><td>Valves、Pipes、Fasteners</td></tr><tr><td>按应用行业</td><td>Construction、Energy、Agriculture</td></tr><tr><td>按材料</td><td>Stainless Steel、Carbon Steel、Plastic</td></tr></tbody></table></div>
<p>不要把过多产品堆在一个分类里，也不要为每个单品创建单独分类。</p>
<h3 id="价格模式">价格模式</h3>
<p><code>v1.3.4</code> 的商品价格支持四种展示方式，前台统一读取系统设置里的全局货币。</p>
<div class="table-wrap"><table><thead><tr><th>模式</th><th>适用场景</th><th>后台填写重点</th></tr></thead><tbody><tr><td>阶梯价格</td><td>数量越多单价越低的标准品</td><td>起订量、最大数量、价格。</td></tr><tr><td>多规格 SKU</td><td>同一产品有不同规格、型号、尺寸</td><td>SKU 名称、起订量、价格和排序。</td></tr><tr><td>价格区间</td><td>价格随参数浮动，但不适合列出全部明细</td><td>最低价、最高价。</td></tr><tr><td>面谈价格</td><td>定制产品或需要按项目报价</td><td>保持产品说明清楚，引导用户提交询盘。</td></tr></tbody></table></div>
<div class="callout "><strong>货币设置</strong><p>产品价格行里的历史 <code>currency</code> 字段不再作为前台显示依据。请在「系统设置 → 基础设置」维护 <code>site_currency</code>，例如 <code>USD</code>、<code>EUR</code>、<code>CNY</code>。</p></div>
<h3 id="产品发布建议">产品发布建议</h3>
<ul><li>重点产品至少准备 5 张图片：主图、细节图、应用场景、包装、资质或工厂图。</li><li>详情页不要只放参数表，应补充采购关心的问题：MOQ、交期、定制范围、样品政策。</li><li>如果产品可定制，使用面谈价格并在详情中写清可定制项。</li><li>如果价格稳定，优先使用阶梯价格或 SKU 价格，减少销售重复沟通成本。</li><li>每次大批量更新后，从前台打开产品列表和详情页确认图片、价格、询盘按钮都正常。</li></ul>
</section>
<section class="doc-section" id="content-management">
<h2>内容管理</h2>
<p>内容管理包含文章、案例、页面和媒体库。它们共同支撑网站可信度、SEO 和客户转化。</p>
<h3 id="文章管理">文章管理</h3>
<p>文章适合发布：</p>
<ul><li>行业资讯。</li><li>产品采购指南。</li><li>展会新闻。</li><li>常见问题解答。</li><li>公司动态。</li></ul>
<p>文章建议保持持续更新。标题应该贴近客户搜索词，正文中自然补充产品链接和相关案例，不要堆砌关键词。</p>
<h3 id="案例管理">案例管理</h3>
<p>案例适合展示交付能力：</p>
<ul><li>客户行业和地区。</li><li>项目背景。</li><li>使用的产品或解决方案。</li><li>交付周期、包装、运输方式。</li><li>结果和客户反馈。</li></ul>
<p>案例不一定透露客户名称，但要提供足够真实的应用场景，让潜在客户判断你是否有类似经验。</p>
<h3 id="页面管理">页面管理</h3>
<p>页面适合放固定内容：</p>
<ul><li>关于我们。</li><li>联系我们。</li><li>服务能力。</li><li>质量控制。</li><li>FAQ。</li><li>隐私政策。</li></ul>
<p>页面通常会通过菜单加入顶部导航或页脚导航。发布页面后记得进入「外观区块 → 菜单管理」添加入口。</p>
<h3 id="媒体库">媒体库</h3>
<p>媒体库用于集中管理图片、视频和附件。</p>
<p>建议：</p>
<ul><li>用文件夹区分产品图、公司图、证书、博客图和案例图。</li><li>上传前压缩超大图片，避免前台加载过慢。</li><li>图片文件名使用英文，例如 <code>factory-workshop.webp</code>。</li><li>删除媒体前确认没有被产品、页面、区块或轮播引用。</li></ul>
</section>
<section class="doc-section" id="inbox">
<h2>收件箱与询盘</h2>
<p>收件箱分为联系留言和产品询单。联系留言通常来自联系页；产品询单通常来自产品详情页，包含更明确的采购上下文。</p>
<h3 id="联系留言">联系留言</h3>
<p>联系留言常见字段：</p>
<ul><li>姓名。</li><li>邮箱。</li><li>电话。</li><li>公司。</li><li>国家或地区。</li><li>留言内容。</li><li>提交时间和来源 IP。</li></ul>
<p>处理建议：</p>
<ol><li>先判断是否垃圾信息。</li><li>对有效留言标记跟进状态。</li><li>将重要客户同步到 CRM、表格或内部销售系统。</li><li>回复前确认客户时区和语种。</li></ol>
<h3 id="产品询单">产品询单</h3>
<p>产品询单通常包含：</p>
<ul><li>目标产品。</li><li>采购数量。</li><li>客户联系方式。</li><li>公司名称。</li><li>留言说明。</li><li>来源产品详情页。</li></ul>
<p>销售跟进时建议先打开对应产品，确认当前价格模式、MOQ、图片和规格说明，再回复客户。对于面谈价格产品，应尽快补充关键问题，例如材质、尺寸、数量、包装和目的港。</p>
<h3 id="询盘状态建议">询盘状态建议</h3>
<div class="table-wrap"><table><thead><tr><th>状态</th><th>推荐含义</th><th>操作建议</th></tr></thead><tbody><tr><td>待处理</td><td>新询盘，还未开始跟进。</td><td>当天内分配销售。</td></tr><tr><td>已联系</td><td>已通过邮件、电话或聊天工具联系客户。</td><td>记录客户反馈。</td></tr><tr><td>已报价</td><td>已发送报价或形式发票。</td><td>设置下一次跟进时间。</td></tr><tr><td>已关闭</td><td>无效、重复或已完成。</td><td>保留记录，避免误删重要历史。</td></tr></tbody></table></div>
</section>
<section class="doc-section" id="appearance">
<h2>外观区块</h2>
<p>外观区块决定前台展示。管理员可以在后台更换主题、编辑模板区块、维护菜单和轮播图。</p>
<h3 id="网站模版">网站模版</h3>
<p>进入「外观区块 → 网站模版」后，系统会读取 <code>/themes</code> 目录下的主题。</p>
<p>可执行操作：</p>
<ul><li>查看已安装主题。</li><li>查看主题封面图。</li><li>上传 zip 主题包。</li><li>启用指定主题。</li></ul>
<p>主题上传包必须满足：</p>
<ul><li>压缩包里只能有一套主题。</li><li>主题根目录必须包含 <code>style.css</code>。</li><li><code>style.css</code> 顶部必须包含主题元数据，至少包含 <code>Theme Name</code>。</li><li>不应包含破坏性脚本或覆盖用户数据的逻辑。</li></ul>
<h3 id="模板区块">模板区块</h3>
<p>模板区块让运营人员不用改代码也能换文字、图片、按钮、产品和展示数量。</p>
<p>常见字段：</p>
<div class="table-wrap"><table><thead><tr><th>字段类型</th><th>用途</th></tr></thead><tbody><tr><td><code>text</code></td><td>标题、按钮文字、短文案。</td></tr><tr><td><code>textarea</code></td><td>多行说明、简介。</td></tr><tr><td><code>richtext</code></td><td>富文本内容。</td></tr><tr><td><code>image</code></td><td>图片选择。</td></tr><tr><td><code>media</code></td><td>图片或视频选择。</td></tr><tr><td><code>product_picker</code></td><td>产品选择弹窗。</td></tr><tr><td><code>select</code></td><td>选项开关、轮播图选择、布局模式。</td></tr></tbody></table></div>
<p>保存区块后如果前台没有变化，优先检查：</p>
<ol><li>当前启用主题是否正确。</li><li>修改的区块是否属于当前主题。</li><li>前台页面是否缓存。</li><li>区块字段是否被模板实际读取。</li></ol>
<h3 id="菜单管理">菜单管理</h3>
<p>菜单支持多个菜单、多级菜单和拖拽排序。常见 Slug：</p>
<div class="table-wrap"><table><thead><tr><th>Slug</th><th>用途</th></tr></thead><tbody><tr><td><code>main-nav</code></td><td>顶部主导航。</td></tr><tr><td><code>footer</code></td><td>页脚导航。</td></tr><tr><td><code>product-nav</code></td><td>产品分类或产品中心导航。</td></tr></tbody></table></div>
<p>菜单项可以链接到页面、分类、产品、文章或自定义 URL。上线前务必逐个点击检查链接是否有效。</p>
<h3 id="轮播图">轮播图</h3>
<p>轮播图适合维护首页首屏、活动 Banner 或页面顶部视觉区域。</p>
<p>每组轮播通常包含：</p>
<ul><li>轮播图名称。</li><li>Slug。</li><li>多张图片。</li><li>标题。</li><li>描述。</li><li>按钮文字和链接。</li><li>排序和状态。</li></ul>
<p>建议所有轮播图片保持同一比例，避免前台切换时页面跳动。</p>
</section>
<section class="doc-section" id="apps">
<h2>应用商店与插件</h2>
<p>「扩展」分组集中管理应用商店、已安装插件和商店账户。管理员可以在统一列表中浏览主题与插件，也可以上传本地 ZIP 插件包。</p>
<h3 id="安装插件">安装插件</h3>
<ol><li>进入「扩展 → 应用商店」，按类型、分类、价格或关键词筛选。</li><li>打开插件详情，确认版本、环境要求、权限和供应商信息。</li><li>从商店下载安装，或进入「插件管理」上传 ZIP 包。</li><li>安装完成后启用插件，并按需要填写插件设置。</li><li>检查后台是否出现新的业务菜单，再从前台验证对应页面或流程。</li></ol>
<h3 id="插件生命周期">插件生命周期</h3>
<div class="table-wrap"><table><thead><tr><th>操作</th><th>说明</th></tr></thead><tbody><tr><td>启用 / 停用</td><td>切换插件运行状态；系统会重建 Manifest 缓存和后台动态菜单。</td></tr><tr><td>升级</td><td>安装新版本并运行插件自己的版本化迁移。</td></tr><tr><td>版本切换</td><td>代码回滚到已保留版本；数据库迁移不会反向删除。</td></tr><tr><td>卸载</td><td>移除插件代码；默认保留业务数据，避免误删。</td></tr><tr><td>任务</td><td>查看、执行、重试或取消插件的定时任务和分片任务。</td></tr></tbody></table></div>
<div class="callout callout-warning"><strong>安装前检查</strong><p>插件可以注册路由、写入数据库、加载前后台资源并调用外部服务。只安装可信来源的插件，并在升级前备份 <code>storage/site.db</code> 和 <code>storage/plugins/</code>。</p></div>
</section>
<section class="doc-section" id="settings">
<h2>系统设置</h2>
<p>系统设置包含全站基础配置、公司信息、翻译、自定义代码和程序更新。</p>
<div class="table-wrap"><table><thead><tr><th>设置页</th><th>说明</th></tr></thead><tbody><tr><td>基础设置</td><td>网站名称、标语、启用主题、Logo、Favicon、OG 图、SEO 和全局货币。</td></tr><tr><td>公司简介</td><td>主营产品、公司介绍、员工人数、厂房面积、资质和业务能力。</td></tr><tr><td>联系方式</td><td>邮箱、电话、地址、社媒链接和联系表单展示信息。</td></tr><tr><td>展示图片</td><td>公司、工厂、证书、团队等通用图片。</td></tr><tr><td>翻译设置</td><td>Google Translate 在线翻译入口和语种配置，支持 249 种语言。</td></tr><tr><td>自定义代码</td><td>统计代码、客服代码、验证代码等。</td></tr><tr><td>程序更新</td><td>检查版本、安装更新、查看备份、迁移状态和更新日志。</td></tr></tbody></table></div>
<h3 id="翻译设置">翻译设置</h3>
<p>灯塔 CMS 的多语言能力基于 Google Translate 在线翻译功能实现。后台可配置前台翻译入口和语言选项。</p>
<p>使用建议：</p>
<ul><li>根据目标市场选择常用语言，不必一次展示全部语种。</li><li>如果面向欧美市场，优先配置英语、西班牙语、法语、德语、意大利语、葡萄牙语。</li><li>如果面向中东和东南亚市场，补充阿拉伯语、土耳其语、越南语、泰语、印尼语等。</li><li>翻译依赖 Google 在线服务，客户网络环境可能影响加载速度。</li></ul>
<h3 id="自定义代码">自定义代码</h3>
<p>自定义代码适合添加：</p>
<ul><li>Google Analytics。</li><li>Search Console 验证。</li><li>第三方客服插件。</li><li>广告转化跟踪。</li><li>站点统计脚本。</li></ul>
<p>不要在自定义代码里粘贴来源不明的脚本。任何会读取表单、重定向页面、弹出登录框或加载远程可执行代码的脚本，都应先经过技术人员审核。</p>
<h3 id="程序更新与备份">程序更新与备份</h3>
<p>程序更新页通常用于：</p>
<ul><li>查看当前版本。</li><li>检查远程版本。</li><li>安装更新包。</li><li>查看数据库迁移状态。</li><li>手动执行待处理迁移。</li><li>查看备份和更新日志。</li></ul>
<p>更新前建议：</p>
<ol><li>备份 <code>storage/site.db</code>。</li><li>备份 <code>uploads/</code>。</li><li>确认当前主题是否有自定义修改。</li><li>在低峰时间执行更新。</li><li>更新后检查首页、产品详情、后台登录、询盘提交和媒体上传。</li></ol>
</section>
<section class="doc-section" id="permissions">
<h2>员工与权限</h2>
<p>员工管理用于创建非管理员账号，并按职责分配模块权限。</p>
<h3 id="角色区别">角色区别</h3>
<div class="table-wrap"><table><thead><tr><th>角色</th><th>能力</th></tr></thead><tbody><tr><td>管理员</td><td>拥有全部权限，包括员工管理、外观区块、系统设置和程序更新。</td></tr><tr><td>员工</td><td>只能访问被授权的后台模块。</td></tr></tbody></table></div>
<h3 id="权限建议">权限建议</h3>
<div class="table-wrap"><table><thead><tr><th>岗位</th><th>建议权限</th></tr></thead><tbody><tr><td>内容运营</td><td>内容管理、媒体库。</td></tr><tr><td>产品运营</td><td>产品中心、媒体库。</td></tr><tr><td>销售跟单</td><td>收件箱、产品查看。</td></tr><tr><td>设计运营</td><td>外观区块、媒体库。</td></tr><tr><td>技术维护</td><td>系统设置、程序更新。</td></tr></tbody></table></div>
<p>遵循“够用即可”的原则。不要为了省事把所有员工都设置为管理员。</p>
</section>
<section class="doc-section" id="日常操作流程">
<h2>日常操作流程</h2>
<p>建议每天或每周按固定流程检查站点：</p>
<ol><li>登录后台查看仪表盘。</li><li>处理新留言和新询盘。</li><li>更新产品、文章或案例。</li><li>整理媒体库新增图片。</li><li>检查首页区块、菜单和轮播是否需要调整。</li><li>查看程序更新和迁移状态。</li><li>定期下载数据库和上传文件备份。</li></ol>
</section>
<section class="doc-section" id="launch">
<h2>上线前检查清单</h2>
<div class="checklist"><div class="check-item"><i class="fas fa-check"></i><span>已修改默认管理员密码。</span></div><div class="check-item"><i class="fas fa-check"></i><span>网站名称、Logo、Favicon、SEO、OG 图已设置。</span></div><div class="check-item"><i class="fas fa-check"></i><span>全局货币 <code>site_currency</code> 已设置正确。</span></div><div class="check-item"><i class="fas fa-check"></i><span>至少发布了核心产品、文章、案例和基础页面。</span></div><div class="check-item"><i class="fas fa-check"></i><span>产品价格模式展示正常。</span></div><div class="check-item"><i class="fas fa-check"></i><span>产品详情页询盘按钮可用。</span></div><div class="check-item"><i class="fas fa-check"></i><span>联系表单可提交，后台能收到留言。</span></div><div class="check-item"><i class="fas fa-check"></i><span>菜单、轮播图和首页区块已配置。</span></div><div class="check-item"><i class="fas fa-check"></i><span>当前主题正确启用，手机端展示正常。</span></div><div class="check-item"><i class="fas fa-check"></i><span>Google Translate 语言入口按市场配置。</span></div><div class="check-item"><i class="fas fa-check"></i><span>员工权限已按职责分配。</span></div><div class="check-item"><i class="fas fa-check"></i><span><code>storage/</code>、<code>app/</code>、<code>.env</code> 等敏感路径不能直接访问。</span></div><div class="check-item"><i class="fas fa-check"></i><span><code>storage/site.db</code> 和 <code>uploads/</code> 已备份。</span></div><div class="check-item"><i class="fas fa-check"></i><span>站点已启用 HTTPS。</span></div><div class="check-item"><i class="fas fa-check"></i><span>robots.txt 和 sitemap.xml 可访问。</span></div></div>
</section>
<section class="doc-section" id="常见问题">
<h2>常见问题</h2>
<h3 id="为什么上传主题后不能启用">为什么上传主题后不能启用？</h3>
<p>常见原因：</p>
<ul><li>zip 包里包含多个主题目录。</li><li>主题根目录缺少 <code>style.css</code>。</li><li><code>style.css</code> 没有主题元数据。</li><li>压缩包结构多套了一层无关目录。</li><li>上传包被服务器大小限制拦截。</li></ul>
<h3 id="为什么主题没有封面图">为什么主题没有封面图？</h3>
<p>后台优先读取主题目录里的 <code>screenshot.jpg</code>。如果主题没有这个文件，主题列表会显示无预览图，但不一定影响启用。</p>
<h3 id="为什么产品别名会被自动改成小写">为什么产品别名会被自动改成小写？</h3>
<p>Slug 用于 URL，系统会统一过滤和标准化，避免中文、空格、特殊符号导致链接不稳定。</p>
<h3 id="当前支持多少种翻译语言">当前支持多少种翻译语言？</h3>
<p>当前多语言功能基于 Google Translate 在线翻译能力实现，后台语言目录支持 249 种语言。官网、后台和文档都应以 249 种语言作为统一口径。</p>
<h3 id="为什么保存模板区块后前台没变化">为什么保存模板区块后前台没变化？</h3>
<p>先确认当前启用主题，再确认修改的是当前主题对应区块。如果仍然无效，检查主题模板是否调用了该区块字段。</p>
<h3 id="更新失败后怎么办">更新失败后怎么办？</h3>
<p>不要重复点击更新。先查看更新日志和备份文件，确认数据库是否完整，再恢复备份或交给维护人员处理。</p>
</section>
