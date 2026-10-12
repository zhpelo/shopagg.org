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
