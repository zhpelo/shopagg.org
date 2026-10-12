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
