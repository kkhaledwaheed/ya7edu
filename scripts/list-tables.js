const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listTables() {
  const result = await prisma.$queryRawUnsafe(`SHOW TABLES;`);
  console.log('Tables in ya7edu_db on VPS:', result);
  await prisma.$disconnect();
}
listTables();

