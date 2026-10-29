<section class="doc-section" id="plugins">
<h2>插件系统</h2>
<p>SHOPAGG CMS v1.3 提供进程内模块化插件运行时，兼容普通 PHP 共享主机。插件由 <code>plugin.json</code> Manifest 描述，启用或停用时编译为 PHP 缓存，正常请求无需扫描插件目录。</p>
<h3 id="插件能力">扩展能力</h3>
<div class="table-wrap"><table><thead><tr><th>能力</th><th>用途</th></tr></thead><tbody><tr><td><code>routes</code></td><td>注册前台、后台、API 或 Webhook 路由，支持 standalone、theme 和 admin 布局。</td></tr><tr><td><code>events</code> / <code>filters</code></td><td>监听表单、询盘等事件，或修改商品列表、详情和表单数据。</td></tr><tr><td><code>slots</code></td><td>向页面 head、body、内容前后和 footer 注入可控输出。</td></tr><tr><td><code>services</code></td><td>通过服务注册表提供或消费订单、支付、会员、通知、积分、购物车等业务能力。</td></tr><tr><td><code>jobs</code></td><td>执行定时任务、重试任务和可分片的长任务。</td></tr><tr><td><code>admin_menu</code> / <code>permissions</code></td><td>把插件页面加入后台业务分组，并为 Staff 动态增加权限。</td></tr><tr><td><code>assets</code></td><td>按路由或视图加载插件自己的 CSS、JavaScript 和 ES Module。</td></tr><tr><td><code>settings</code></td><td>生成插件设置表单并隔离保存配置。</td></tr></tbody></table></div>
<h3 id="插件目录结构">插件目录结构</h3>
<figure class="code-block"><pre><code class="language-text">plugin-dev/shopagg-commerce/
├── plugin.json
├── src/
│   └── Plugin.php
├── assets/
├── views/
└── migrations/</code></pre></figure>
<p>Manifest 至少声明 Schema 版本、插件 ID、名称、供应商、语义化版本、环境要求和 PSR-4 自动加载。插件 ID 仅使用小写字母、数字和中间连字符。</p>
<h3 id="插件-cli">插件 CLI</h3>
<figure class="code-block"><pre><code class="language-bash">php shopagg plugin:make shopagg-commerce
php shopagg plugin:validate plugin-dev/shopagg-commerce
php shopagg plugin:test plugin-dev/shopagg-commerce
php shopagg plugin:pack plugin-dev/shopagg-commerce
php shopagg plugin:install shopagg-commerce.zip
php shopagg plugin:enable shopagg-commerce
php shopagg plugin:jobs 20</code></pre></figure>
<h3 id="插件安全边界">安全边界</h3>
<ul><li>所有管理路由继续执行管理员认证和 CSRF 校验；插件权限使用动态 Staff 权限。</li><li>插件数据表使用插件命名空间，并通过插件迁移管理版本。</li><li>插件设置、Session、日志、静态资源和 HTTP 调用由运行时提供隔离封装。</li><li>卸载默认保留数据；版本切换不会反向删除数据库迁移。</li><li>路由、文件路径、依赖、冲突和环境要求会在安装或启用前校验。</li></ul>
<div class="callout "><strong>服务契约</strong><p>核心当前提供 14 类插件契约，包括购物车、订单、支付、退款、会员、积分、通知、表单类型、数据采集、导入导出和文件转换。插件之间应通过服务注册表协作，避免直接依赖对方内部类。</p></div>
</section>
