import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const assetsDir = join(__dirname, '..', 'src', 'assets');

let totalOriginal = 0;
let totalConverted = 0;
let count = 0;

async function convertDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await convertDir(fullPath);
    } else if (extname(entry.name).toLowerCase() === '.png') {
      const info = await stat(fullPath);
      const originalKB = Math.round(info.size / 1024);
      totalOriginal += info.size;

      const outPath = fullPath.replace(/\.png$/i, '.webp');
      await sharp(fullPath)
        .webp({ quality: 75, effort: 6 })
        .toFile(outPath);

      const outInfo = await stat(outPath);
      const newKB = Math.round(outInfo.size / 1024);
      totalConverted += outInfo.size;
      count++;

      const saving = Math.round((1 - outInfo.size / info.size) * 100);
      console.log(`✓ ${basename(entry.name)} → ${originalKB}KB → ${newKB}KB (${saving}% smaller)`);
    }
  }
}

console.log('Converting PNG → WebP (quality: 75)...\n');
await convertDir(assetsDir);
console.log(`\n✅ Converted ${count} files`);
console.log(`📦 Total: ${Math.round(totalOriginal/1024)}KB → ${Math.round(totalConverted/1024)}KB`);
console.log(`💾 Saved: ${Math.round((totalOriginal - totalConverted)/1024)}KB (${Math.round((1 - totalConverted/totalOriginal)*100)}%)`);
