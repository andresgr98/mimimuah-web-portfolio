import { readdirSync } from 'fs';
import { join } from 'path';
import { db } from './src/lib/db';
import { projects, projectImages } from './src/lib/db/schema';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

async function seedProjects() {
  // Get all images from /all directory
  const allImagesPath = join(process.cwd(), 'public', 'images', 'all');
  const files = readdirSync(allImagesPath);
  const imageFiles = files.filter(file =>
    IMAGE_EXTENSIONS.some(ext => file.toLowerCase().endsWith(ext))
  );

  console.log(`📸 Found ${imageFiles.length} images in /all`);

  // Define projects
  const projectsData = [
    {
      slug: 'boda-adriana-carlos',
      title: 'Boda Adriana & Carlos',
      description: 'Maquillaje elegante y sofisticado para una boda de ensueño en la costa. Look natural con toques dorados que resaltaron la belleza de la novia.',
      numImages: 12
    },
    {
      slug: 'sesion-moda-primavera',
      title: 'Sesión de Moda Primavera 2024',
      description: 'Colaboración con diseñadora local para su nueva colección. Maquillajes frescos y coloridos inspirados en la naturaleza primaveral.',
      numImages: 15
    },
    {
      slug: 'editorial-vogue',
      title: 'Editorial Vogue España',
      description: 'Trabajo editorial de alta moda con looks dramáticos y avant-garde. Experimentación con texturas y colores intensos.',
      numImages: 10
    },
    {
      slug: 'campana-loreal',
      title: 'Campaña L\'Oréal Professional',
      description: 'Campaña publicitaria para nueva línea de productos. Maquillajes impecables que destacan la calidad profesional de la marca.',
      numImages: 13
    },
  ];

  let imageIndex = 0;

  for (const projectData of projectsData) {
    console.log(`\n📁 Creating project: ${projectData.title}`);

    // Check if we have enough images
    if (imageIndex >= imageFiles.length) {
      console.log(`  ⚠️  No more images available, skipping project`);
      continue;
    }

    // Insert project
    const coverImage = imageFiles[imageIndex];
    const [project] = await db.insert(projects).values({
      slug: projectData.slug,
      title: projectData.title,
      description: projectData.description,
      coverImagePath: `/images/all/${coverImage}`,
    }).returning();

    console.log(`  ✓ Project created with cover: ${coverImage}`);
    imageIndex++;

    // Insert project images
    let addedImages = 0;
    for (let i = 0; i < projectData.numImages && imageIndex < imageFiles.length; i++) {
      const imagePath = `/images/all/${imageFiles[imageIndex]}`;
      await db.insert(projectImages).values({
        projectId: project.id,
        imagePath,
        order: i,
      });
      imageIndex++;
      addedImages++;
    }

    console.log(`  ✓ Added ${addedImages} images to project`);
  }

  console.log('\n✅ All projects seeded successfully!');
}

seedProjects().catch(console.error);
