import { db } from './src/lib/db';
import { categories } from './src/lib/db/schema';

async function seed() {
  console.log('Seeding database...');

  // Insert categories
  await db.insert(categories).values([
    { slug: 'bodas', name: 'Bodas', order: 1, isProjectCategory: false },
    { slug: 'eventos', name: 'Eventos', order: 2, isProjectCategory: false },
    { slug: 'campanas', name: 'Campañas', order: 3, isProjectCategory: false },
    { slug: 'proyectos', name: 'Proyectos', order: 4, isProjectCategory: true },
  ]);

  console.log('✅ Categories seeded successfully!');
}

seed().catch(console.error);
