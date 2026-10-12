import project from '../data/project.json';
import capabilities from '../data/capabilities.json';
import releases from '../data/releases.json';

export const prerender = true;

export function GET() {
  const latest = releases[0];
  const capabilityText = capabilities.groups.map((group) => {
    const items = group.items.map((item) => `- ${item.name}：${item.summary}`).join('\n');
    return `## ${group.name}\n\n${group.summary}\n\n${items}`;
  }).join('\n\n');

  const body = `# ${project.name}（${project.alternate_name}）\n\n${project.description}\n\n## Project facts\n\n- 当前稳定版：${latest.version}\n- 开源许可证：${project.license}\n- 运行环境：PHP 8.1+、SQLite3\n- 源码仓库：${project.repository}\n- 使用文档：${project.documentation.usage}\n- 开发文档：${project.documentation.developer}\n- 产品能力 JSON：https://shopagg.org/api/capabilities.json\n- 版本数据：https://shopagg.org/api/releases/latest.json\n\n${capabilityText}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
