export const prerender = true;

const document = {
  openapi: '3.1.0',
  info: {
    title: 'SHOPAGG CMS 官网静态 API',
    version: '1.0.0',
    description: '在构建阶段生成的只读 JSON 接口，不依赖运行时服务。'
  },
  servers: [{ url: 'https://shopagg.org' }],
  paths: {
    '/api/project.json': { get: { summary: '读取项目基础信息', responses: { '200': { description: '项目资料' } } } },
    '/api/capabilities.json': { get: { summary: '读取产品能力清单', responses: { '200': { description: '按领域分组的能力列表' } } } },
    '/api/compatibility.json': { get: { summary: '读取运行环境和兼容性信息', responses: { '200': { description: '兼容性数据' } } } },
    '/api/docs/index.json': { get: { summary: '读取权威文档索引', responses: { '200': { description: '文档索引' } } } },
    '/api/releases/latest.json': { get: { summary: '读取最新稳定版本', responses: { '200': { description: '最新版本清单' } } } },
    '/api/releases/index.json': { get: { summary: '读取稳定版本历史', responses: { '200': { description: '版本历史' } } } }
  }
};

export function GET() {
  return new Response(JSON.stringify(document, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
