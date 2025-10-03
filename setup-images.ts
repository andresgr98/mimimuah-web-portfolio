import { readdirSync, copyFileSync, renameSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { randomBytes } from 'crypto';
import { db } from './src/lib/db';
import { categoryImages } from './src/lib/db/schema';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

function generateShortId(): string {
  return randomBytes(4).toString('hex'); // 8 caracteres
}

async function setupImages() {
  const allImagesPath = join(process.cwd(), 'public', 'images', 'all');

  if (!existsSync(allImagesPath)) {
    console.error('❌ Directory public/images/all does not exist');
    return;
  }

  // 1. Renombrar imágenes en /all con UIDs cortos
  console.log('📝 Renaming images with short UIDs...');
  const files = readdirSync(allImagesPath);
  const imageFiles = files.filter(file =>
    IMAGE_EXTENSIONS.some(ext => file.toLowerCase().endsWith(ext))
  );

  const renamedFiles: string[] = [];
  for (const file of imageFiles) {
    const ext = extname(file);
    const newName = `${generateShortId()}${ext}`;
    const oldPath = join(allImagesPath, file);
    const newPath = join(allImagesPath, newName);
    renameSync(oldPath, newPath);
    renamedFiles.push(newName);
    console.log(`  ✓ ${file} → ${newName}`);
  }

  // 2. Copiar a todas las carpetas de categorías
  console.log('\n📁 Copying images to category folders...');
  const categories = ['campanas', 'bodas', 'eventos'];

  for (const category of categories) {
    const categoryPath = join(process.cwd(), 'public', 'images', 'categories', category);
    for (const file of renamedFiles) {
      const sourcePath = join(allImagesPath, file);
      const destPath = join(categoryPath, file);
      copyFileSync(sourcePath, destPath);
    }
    console.log(`  ✓ Copied ${renamedFiles.length} images to ${category}`);
  }

  // 3. Borrar imágenes existentes de la BD
  console.log('\n🗑️  Deleting existing images from database...');
  await db.delete(categoryImages);
  console.log('  ✓ Database cleared');

  console.log('\n✅ Setup complete! Now run:');
  console.log('  npx tsx import-images.ts campanas');
  console.log('  npx tsx import-images.ts bodas');
  console.log('  npx tsx import-images.ts eventos');
}

setupImages().catch(console.error);
