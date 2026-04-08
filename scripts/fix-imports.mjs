import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const srcDir = join(__dirname, '..', 'src');

let updated = 0;

async function fixImports(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'assets') {
      await fixImports(fullPath);
    } else if (['.jsx', '.js', '.tsx', '.ts'].includes(extname(entry.name))) {
      let content = await readFile(fullPath, 'utf-8');
      // Replace .png imports with .webp (only for asset imports)
      const newContent = content.replace(
        /from\s+['"]([^'"]*\/assets\/[^'"]*?)\.png['"]/g,
        "from '$1.webp'"
      );
      if (newContent !== content) {
        await writeFile(fullPath, newContent, 'utf-8');
        const changes = (content.match(/\.png/g) || []).length - (newContent.match(/\.png/g) || []).length;
        console.log(`✓ ${entry.name} — ${changes} imports updated`);
        updated++;
      }
    }
  }
}

console.log('Updating imports from .png → .webp...\n');
await fixImports(srcDir);
console.log(`\n✅ Updated ${updated} files`);
