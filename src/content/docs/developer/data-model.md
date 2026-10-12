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

<section class="doc-section" id="添加新数据表">
<h2>添加新数据表</h2>
<p>新增数据表必须写迁移，不要直接修改现有数据库文件。</p>
<p>步骤：</p>
<ol><li>在 <code>app/Migrations/</code> 创建时间戳文件。</li><li><code>up()</code> 中创建表、索引和默认数据。</li><li><code>down()</code> 中写回滚逻辑。</li><li>创建模型封装读写。</li><li>在控制器中调用模型。</li><li>登录后台程序更新页检查迁移状态。</li></ol>
<p>建议：</p>
<ul><li>SQLite 中新增列前先检查列是否存在。</li><li>表和索引使用 <code>IF NOT EXISTS</code>。</li><li>迁移要幂等，重复执行不应破坏数据。</li><li>不要在迁移里删除用户数据，除非功能明确要求且有备份。</li></ul>
</section>
