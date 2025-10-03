import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';
import { categoryImages, categories } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { unlink } from 'fs/promises';
import { join } from 'path';

export const POST: APIRoute = async ({ request, redirect }) => {
  const url = new URL(request.url);
  const imageId = parseInt(url.searchParams.get('id') || '');

  if (!imageId) {
    return redirect('/admin/categories');
  }

  try {
    // Get image info
    const image = await db
      .select({
        id: categoryImages.id,
        imagePath: categoryImages.imagePath,
        categoryId: categoryImages.categoryId,
      })
      .from(categoryImages)
      .where(eq(categoryImages.id, imageId))
      .get();

    if (image) {
      // Get category slug
      const category = await db
        .select({ slug: categories.slug })
        .from(categories)
        .where(eq(categories.id, image.categoryId))
        .get();

      // Delete file from filesystem
      const filepath = join(process.cwd(), 'public', image.imagePath);
      try {
        await unlink(filepath);
      } catch (e) {
        console.error('Error deleting file:', e);
      }

      // Delete from database
      await db.delete(categoryImages).where(eq(categoryImages.id, imageId));

      if (category) {
        return redirect(`/admin/categories/${category.slug}`);
      }
    }
  } catch (e) {
    console.error('Error deleting image:', e);
  }

  return redirect('/admin/categories');
};
