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
