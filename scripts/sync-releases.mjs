import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repository = process.env.LIGHTHOUSE_CMS_REPOSITORY || 'zhpelo/shopagg-b2b-website';
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'lighthouse-cms-website-release-sync',
  'X-GitHub-Api-Version': '2022-11-28'
};

if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const response = await fetch(`https://api.github.com/repos/${repository}/releases?per_page=20`, { headers });
if (!response.ok) {
  throw new Error(`GitHub Releases 请求失败：${response.status} ${response.statusText}`);
}

const sourceReleases = await response.json();
const releases = sourceReleases
  .filter((release) => !release.draft && !release.prerelease)
  .map((release) => {
    const version = String(release.tag_name || '').replace(/^v/, '');
    const packageAsset = release.assets.find((asset) => /\.zip$/i.test(asset.name));
    return {
      version,
      tag: release.tag_name,
      channel: 'stable',
      published_at: release.published_at,
      release_url: release.html_url,
      package: {
        url: packageAsset?.browser_download_url || `https://github.com/${repository}/archive/refs/tags/${release.tag_name}.zip`,
        sha256: packageAsset?.digest?.replace(/^sha256:/, '') || null,
        size: packageAsset?.size || null
      }
    };
  })
  .filter((release) => release.version);

if (releases.length === 0) {
  throw new Error('没有找到可发布的稳定版本。');
}

await writeFile(
  path.join(root, 'src/data/releases.json'),
  `${JSON.stringify(releases, null, 2)}\n`
);

const compatibilityPath = path.join(root, 'src/data/compatibility.json');
const compatibility = JSON.parse(await readFile(compatibilityPath, 'utf8'));
compatibility.current.version = releases[0].version;
await writeFile(compatibilityPath, `${JSON.stringify(compatibility, null, 2)}\n`);

console.log(`已同步 ${releases.length} 个稳定版本，最新版本为 ${releases[0].version}。`);
