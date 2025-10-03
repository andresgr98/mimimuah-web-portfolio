import { readdirSync } from 'fs';
import { join } from 'path';
import { db } from './src/lib/db';
import { categories, categoryImages } from './src/lib/db/schema';
import { eq } from 'drizzle-orm';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

async function importImages(categorySlug: string) {
  // Get category from DB
  const category = await db.select().from(categories).where(eq(categories.slug, categorySlug)).get();

  if (!category) {
    console.error(`❌ Category "${categorySlug}" not found in database`);
    return;
  }

  const categoryPath = join(process.cwd(), 'public', 'images', 'categories', categorySlug);

  try {
    const files = readdirSync(categoryPath);
    const imageFiles = files.filter(file =>
      IMAGE_EXTENSIONS.some(ext => file.toLowerCase().endsWith(ext))
    );

    if (imageFiles.length === 0) {
      console.log(`⚠️  No images found in public/images/categories/${categorySlug}/`);
      return;
    }

    console.log(`📸 Found ${imageFiles.length} images in ${categorySlug}`);

    // Insert images
    for (let i = 0; i < imageFiles.length; i++) {
      const imagePath = `/images/categories/${categorySlug}/${imageFiles[i]}`;
      await db.insert(categoryImages).values({
        categoryId: category.id,
        imagePath,
        order: i,
      });
      console.log(`  ✓ Imported: ${imageFiles[i]}`);
    }

    console.log(`✅ Successfully imported ${imageFiles.length} images to "${category.name}"`);
  } catch (error) {
    console.error(`❌ Error reading directory public/images/categories/${categorySlug}/:`, error);
  }
}

// Get category slug from command line argument
const categorySlug = process.argv[2];

if (!categorySlug) {
  console.log('Usage: npx tsx import-images.ts <category-slug>');
  console.log('Example: npx tsx import-images.ts campanas');
  process.exit(1);
}

importImages(categorySlug).catch(console.error);
