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
