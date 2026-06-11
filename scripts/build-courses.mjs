import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;

async function getSubdirs(root) {
  const entries = await readdir(root, { withFileTypes: true });
  return entries
    .filter(e => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules' && e.name !== 'scripts' && e.name !== 'assets')
    .map(e => e.name);
}

async function buildCourse(slug) {
  const dir = join(ROOT, slug);
  const indexPath = join(dir, 'index.html');
  const metaPath = join(dir, 'meta.json');

  try {
    await stat(indexPath);
  } catch {
    return null;
  }

  let meta = {};
  try {
    const raw = await readFile(metaPath, 'utf-8');
    meta = JSON.parse(raw);
  } catch {
    // fallback: use directory name as title
  }

  let updatedAt = meta.updatedAt || '';
  if (!updatedAt) {
    try {
      const st = await stat(indexPath);
      updatedAt = st.mtime.toISOString().slice(0, 10);
    } catch {}
  }

  const cover = meta.cover ? `${slug}/${meta.cover}` : '';

  return {
    slug,
    entry: `${slug}/index.html`,
    cover,
    title: meta.title || slug,
    description: meta.description || '',
    tags: meta.tags || [],
    author: meta.author || '',
    createdAt: meta.createdAt || '',
    updatedAt,
    slides: meta.slides || 0,
  };
}

async function main() {
  const slugs = await getSubdirs(ROOT);
  const courses = [];

  for (const slug of slugs) {
    const course = await buildCourse(slug);
    if (course) courses.push(course);
  }

  courses.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));

  const output = {
    generatedAt: new Date().toISOString(),
    courses,
  };

  const outPath = join(ROOT, 'courses.json');
  await writeFile(outPath, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`✓ Generated courses.json with ${courses.length} course(s)`);
  for (const c of courses) {
    console.log(`  - ${c.title} (${c.slug})`);
  }
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
