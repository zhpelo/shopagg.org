import project from '../data/project.json';
import capabilities from '../data/capabilities.json';
import releases from '../data/releases.json';
import docs from '../data/docs.json';

export const prerender = true;

export function GET() {
  const latest = releases[0];
  const capabilityText = capabilities.groups.map((group) => {
    const items = group.items.map((item) => `- ${item.name}：${item.summary}`).join('\n');
    return `## ${group.name}\n\n${group.summary}\n\n${items}`;
  }).join('\n\n');
  const documentationText = docs.documents.flatMap((document) => {
    const lines = [`- ${document.title}：${document.url}`];
    if ('pages' in document && Array.isArray(document.pages)) {
      lines.push(...document.pages.map((page) => `  - ${page.title}：${page.url}`));
    }
    return lines;
  }).join('\n');

  const body = `# ${project.name}（${project.chinese_name}）\n\n${project.description}\n\n## Brand\n\n- 主品牌：${project.alternate_name}\n- 中文名称：${project.chinese_name}\n- 开源程序正式名称：${project.name}\n- 程序日常简称：${project.alternate_name}\n- 托管平台：${project.platform_name}\n\n## Project facts\n\n- 当前稳定版：${latest.version}\n- 开源许可证：${project.license}\n- 运行环境：PHP 8.1+、SQLite3\n- 源码仓库：${project.repository}\n- 官方推荐自动部署：${project.deployment.recommended}\n- 自动部署与网站后台视频教程：${project.deployment.video_course}\n- 产品能力 JSON：https://shopagg.org/api/capabilities.json\n- 版本数据：https://shopagg.org/api/releases/latest.json\n\n## Documentation\n\n${documentationText}\n\n${capabilityText}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
