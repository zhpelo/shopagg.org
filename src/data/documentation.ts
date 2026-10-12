export interface DocumentationPage {
  slug: string;
  title: string;
  summary: string;
  icon: string;
  toc: Array<{ id: string; label: string }>;
}

export const usageDocumentation: DocumentationPage[] = [
  {
    slug: 'getting-started',
    title: '安装与入门',
    summary: '运行环境、部署方式、首次登录和后台导航。',
    icon: 'fas fa-rocket',
    toc: [
      { id: '角色与阅读路线', label: '角色与阅读路线' },
      { id: 'install', label: '安装部署' },
      { id: 'first-login', label: '首次登录与初始化' },
      { id: 'admin', label: '后台导航说明' }
    ]
  },
  {
    slug: 'product-management',
    title: '产品管理',
    summary: '产品、分类、图片、价格模式、SKU 和发布规范。',
    icon: 'fas fa-boxes-stacked',
    toc: [{ id: 'content', label: '产品中心' }]
  },
  {
    slug: 'content-and-appearance',
    title: '内容与外观',
    summary: '文章、案例、页面、媒体库、主题区块、菜单和轮播。',
    icon: 'fas fa-palette',
    toc: [
      { id: 'content-management', label: '内容管理' },
      { id: 'appearance', label: '外观区块' }
    ]
  },
  {
    slug: 'inquiries',
    title: '询盘与日常运营',
    summary: '联系留言、产品询盘、销售跟进和日常操作流程。',
    icon: 'fas fa-inbox',
    toc: [
      { id: 'inbox', label: '收件箱与询盘' },
      { id: '日常操作流程', label: '日常操作流程' }
    ]
  },
  {
    slug: 'settings-and-extensions',
    title: '扩展、设置与权限',
    summary: '应用商店、插件、系统配置、员工账号和权限分配。',
    icon: 'fas fa-sliders',
    toc: [
      { id: 'apps', label: '应用商店与插件' },
      { id: 'settings', label: '系统设置' },
      { id: 'permissions', label: '员工与权限' }
    ]
  },
  {
    slug: 'launch-and-faq',
    title: '上线检查与常见问题',
    summary: '上线前验收清单、备份要求和常见问题处理。',
    icon: 'fas fa-circle-check',
    toc: [
      { id: 'launch', label: '上线前检查清单' },
      { id: '常见问题', label: '常见问题' }
    ]
  }
];

export const developerDocumentation: DocumentationPage[] = [
  {
    slug: 'architecture',
    title: '架构与核心模块',
    summary: '技术栈、目录结构、请求生命周期和核心模块职责。',
    icon: 'fas fa-sitemap',
    toc: [
      { id: 'stack', label: '技术栈' },
      { id: '目录结构', label: '目录结构' },
      { id: 'architecture', label: '请求生命周期' },
      { id: '核心模块', label: '核心模块' }
    ]
  },
  {
    slug: 'data-model',
    title: '数据模型与迁移',
    summary: 'SQLite 数据结构、价格模型和数据库迁移规范。',
    icon: 'fas fa-database',
    toc: [
      { id: 'data-model', label: '数据库设计' },
      { id: '添加新数据表', label: '添加新数据表' }
    ]
  },
  {
    slug: 'application-development',
    title: '功能开发',
    summary: '添加前台页面、后台模块以及 FAQ 扩展示例。',
    icon: 'fas fa-code',
    toc: [
      { id: 'routes', label: '添加前台页面' },
      { id: '添加后台功能', label: '添加后台功能' },
      { id: '扩展示例faq-模块', label: 'FAQ 扩展示例' }
    ]
  },
  {
    slug: 'plugins',
    title: '插件开发',
    summary: 'Manifest、运行时能力、CLI、服务契约和安全边界。',
    icon: 'fas fa-plug',
    toc: [{ id: 'plugins', label: '插件系统' }]
  },
  {
    slug: 'themes',
    title: '主题开发',
    summary: '主题结构、模板区块、代码规范、菜单和轮播模型。',
    icon: 'fas fa-paintbrush',
    toc: [
      { id: 'themes', label: '主题系统' },
      { id: '模板区块系统', label: '模板区块系统' },
      { id: '主题代码规范', label: '主题代码规范' },
      { id: '菜单与轮播模型', label: '菜单与轮播模型' }
    ]
  },
  {
    slug: 'security',
    title: '认证与安全',
    summary: '后台认证、员工权限、CSRF、上传和输出安全。',
    icon: 'fas fa-shield-halved',
    toc: [
      { id: '认证与权限', label: '认证与权限' },
      { id: 'security', label: '安全规范' }
    ]
  },
  {
    slug: 'operations',
    title: '部署、更新与验收',
    summary: '更新备份、部署、主题与后台验收、排查命令和开发原则。',
    icon: 'fas fa-gears',
    toc: [
      { id: '程序更新与备份', label: '程序更新与备份' },
      { id: '部署说明', label: '部署说明' },
      { id: 'checklist', label: '主题开发验收清单' },
      { id: '后台功能验收清单', label: '后台功能验收清单' },
      { id: '常用排查命令', label: '常用排查命令' },
      { id: '开发原则', label: '开发原则' }
    ]
  }
];
