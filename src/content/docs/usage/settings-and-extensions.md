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
<p>SHOPAGG CMS 的多语言能力基于 Google Translate 在线翻译功能实现。后台可配置前台翻译入口和语言选项。</p>
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
