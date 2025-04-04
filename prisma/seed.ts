import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define status strings based on the schema enum
const statusStrings = ['NEW', 'WAITING', 'NOT_SEND', 'SEND', 'DONE'];

async function main() {
  console.log('Start seeding...');

  // --- Find or Create Employee ---
  let employee1 = await prisma.employee.findUnique({
    where: { username: 'seed_user' },
  });

  if (!employee1) {
    console.log('Employee seed_user not found, creating...');
    employee1 = await prisma.employee.create({
      data: {
        username: 'seed_user',
        name: 'Seed',
        surname: 'User',
        password: 'password123', // Use a placeholder/hashed password in real scenarios
        email: 'seed_user@example.com',
      },
    });
    console.log(`Created employee: ${employee1.username}`);
  } else {
    console.log(`Found existing employee: ${employee1.username}`);
  }

  // --- Create Companies ---
  // Using manual IDs as 'id' is unique but not auto-incrementing in the schema.
  const company1 = await prisma.company.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Tech Solutions Seed Inc.',
    },
  });

  const company2 = await prisma.company.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Creative Designs Seed Co.',
    },
  });
  console.log(`Upserted companies: ${company1.name}, ${company2.name}`);

  // --- Create Designs ---
  const designData = [];
  const companies = [company1, company2];

  for (let i = 1; i <= 25; i++) {
    const companyIndex = i % companies.length;
    const statusIndex = i % statusStrings.length; // Use the defined strings array

    designData.push({
      companyId: companies[companyIndex].id, // Use company.id
      templateName: `Seed Template ${i}`, // Provide templateName
      status: statusStrings[statusIndex], // Assign the string status
      employeeId: employee1.id, // Assign to the created employee
      // partners: null, // Optional field
      // noteId: null,   // Optional field
    });
  }

  // Delete existing designs potentially created by this seed before to avoid conflicts
  // Be cautious with this in production environments
  // A more robust approach might involve checking existing records
  // For simplicity here, we clear previous seed designs assuming they follow the naming pattern
  await prisma.design.deleteMany({
    where: {
      templateName: {
        startsWith: 'Seed Template',
      },
    },
  });
  console.log('Deleted previous seed designs (if any).');


  // Use createMany for efficiency
  const createdDesigns = await prisma.design.createMany({
    data: designData,
    skipDuplicates: true, // Should not be needed after deleteMany, but safe to keep
  });

  console.log(`Created ${createdDesigns.count} designs.`);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error('Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
