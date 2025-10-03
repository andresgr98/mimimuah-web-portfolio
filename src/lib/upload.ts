import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';

interface UploadResult {
  path: string;
  filename: string;
}

export async function uploadAndOptimizeImage(
  file: File,
  category: string
): Promise<UploadResult> {
  // Generate unique filename
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${randomBytes(8).toString('hex')}.${ext}`;

  // Create directory if doesn't exist
  const uploadDir = join(process.cwd(), 'public', 'images', 'categories', category);
  await mkdir(uploadDir, { recursive: true });

  const filepath = join(uploadDir, filename);

  // Read file buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Optimize and compress image with sharp
  await sharp(buffer)
    .resize(2400, 3200, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 85,
      progressive: true,
    })
    .toFile(filepath);

  return {
    path: `/images/categories/${category}/${filename}`,
    filename,
  };
}
