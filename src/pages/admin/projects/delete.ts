import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';
import { projectImages } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { unlink } from 'fs/promises';
import { join } from 'path';

export const POST: APIRoute = async ({ request, redirect }) => {
  const url = new URL(request.url);
  const imageId = parseInt(url.searchParams.get('id') || '');
  const slug = url.searchParams.get('slug');

  if (!imageId || !slug) {
    return redirect('/admin/projects');
  }

  try {
    // Get image info
    const image = await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.id, imageId))
      .get();

    if (image) {
      // Delete file from filesystem
      const filepath = join(process.cwd(), 'public', image.imagePath);
      try {
        await unlink(filepath);
      } catch (e) {
        console.error('Error deleting file:', e);
      }

      // Delete from database
      await db.delete(projectImages).where(eq(projectImages.id, imageId));
    }
  } catch (e) {
    console.error('Error deleting image:', e);
  }

  return redirect(`/admin/projects/${slug}`);
};
