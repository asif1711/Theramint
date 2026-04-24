import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db',
    },
  },
});

async function main() {
  const email = 'asif17111998@gmail.com';
  console.log(`Setting admin role for ${email}...`);
  
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
    console.log('Success:', user);
  } catch (err) {
    console.error('User not found or error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
