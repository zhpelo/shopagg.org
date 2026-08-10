import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'SHOPAGG 文档中心',
  description: 'SHOPAGG B2B Website 使用文档与开发文档',
  base: '/docs/',
  outDir: '../docs',
  lastUpdated: true,
  cleanUrls: false,
  head: [
    ['link', { rel: 'icon', href: '/assets/images/icon.webp' }],
    ['meta', { property: 'og:title', content: 'SHOPAGG B2B Website 文档中心' }],
    ['meta', { property: 'og:description', content: '面向运营、管理员、开发者和主题作者的 SHOPAGG 文档。' }],
    ['meta', { property: 'og:type', content: 'website' }]
  ],
  themeConfig: {
    logo: '/assets/images/icon.webp',
    logoLink: '../index.html',
    siteTitle: 'SHOPAGG 文档',
    nav: [
      { text: '官网首页', link: '../index.html' },
      { text: '使用文档', link: '/usage.html' },
      { text: '开发文档', link: '/developer.html' },
      { text: 'GitHub', link: 'https://github.com/zhpelo/shopagg-b2b-website' }
    ],
    sidebar: [
      {
        text: '使用文档',
        collapsed: false,
        items: [
          { text: '使用文档', link: '/usage.html' },
          { text: '安装部署', link: '/usage.html#install' },
          { text: '首次登录', link: '/usage.html#first-login' },
          { text: '后台导航', link: '/usage.html#admin' },
          { text: '产品中心', link: '/usage.html#content' },
          { text: '收件箱与询盘', link: '/usage.html#inbox' },
          { text: '外观区块', link: '/usage.html#appearance' },
          { text: '系统设置', link: '/usage.html#settings' },
          { text: '员工与权限', link: '/usage.html#permissions' },
          { text: '上线检查', link: '/usage.html#launch' }
        ]
      },
      {
        text: '开发文档',
        collapsed: false,
        items: [
          { text: '开发文档', link: '/developer.html' },
          { text: '技术栈', link: '/developer.html#stack' },
          { text: '请求生命周期', link: '/developer.html#architecture' },
          { text: '迁移系统', link: '/developer.html#migrations' },
          { text: '数据模型', link: '/developer.html#data-model' },
          { text: '路由扩展', link: '/developer.html#routes' },
          { text: '主题系统', link: '/developer.html#themes' },
          { text: '安全规范', link: '/developer.html#security' },
          { text: '验收清单', link: '/developer.html#checklist' }
        ]
      },
      {
        text: '常用入口',
        items: [
          { text: '云端部署', link: 'https://www.shopagg.com/dashboard/b2b-sites/create' },
          { text: '在线演示', link: 'https://demo.shopagg.org/' },
          { text: '源码仓库', link: 'https://github.com/zhpelo/shopagg-b2b-website' }
        ]
      }
    ],
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    search: {
      provider: 'local'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 SHOPAGG'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhpelo/shopagg-b2b-website' }
    ]
  },
  markdown: {
    lineNumbers: true
  }
})
