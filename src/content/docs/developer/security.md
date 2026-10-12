<section class="doc-section" id="认证与权限">
<h2>认证与权限</h2>
<p>后台认证由 <code>AuthManager</code> 管理。权限以模块为粒度，管理员拥有全部权限，员工按授权访问。</p>
<p>开发后台功能时需要确认：</p>
<ul><li>路由是否需要登录。</li><li>是否只允许管理员访问。</li><li>是否需要模块权限，例如产品、内容、询盘、外观、设置。</li><li>导航是否根据权限显示或隐藏。</li><li>直接访问 URL 是否仍然会被拦截。</li></ul>
<p>权限控制不能只做前端隐藏，控制器必须二次检查。</p>
</section>

<section class="doc-section" id="security">
<h2>安全规范</h2>
<p>系统包含多层安全措施：</p>
<div class="table-wrap"><table><thead><tr><th>层次</th><th>说明</th></tr></thead><tbody><tr><td>Web 服务器</td><td><code>.htaccess</code> 或 Nginx 规则阻止敏感目录访问。</td></tr><tr><td>入口文件</td><td>设置安全响应头和基础错误处理。</td></tr><tr><td>后台认证</td><td>Session、角色、权限检查。</td></tr><tr><td>表单提交</td><td>CSRF Token。</td></tr><tr><td>文件上传</td><td>MIME、扩展名和目录校验。</td></tr><tr><td>输出渲染</td><td><code>h()</code>、<code>url()</code>、<code>asset_url()</code>。</td></tr><tr><td>安全检查</td><td>Dashboard 检查数据库权限和访问规则。</td></tr></tbody></table></div>
<h3 id="开发时禁止事项">开发时禁止事项</h3>
<ul><li>禁止直接输出未转义用户输入。</li><li>禁止在主题里写删除文件、重置配置、写数据库等破坏性逻辑。</li><li>禁止绕过 <code>AuthManager</code> 写后台入口。</li><li>禁止让上传路径可执行 PHP。</li><li>禁止在迁移中无提示删除用户数据。</li><li>禁止把 API Key、密码、Token 写入主题或前台模板。</li></ul>
</section>
