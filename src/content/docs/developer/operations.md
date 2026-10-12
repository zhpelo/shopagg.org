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
