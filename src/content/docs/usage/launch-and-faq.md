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
