import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'asif17111998@gmail.com';
  const newPassword = 'admin123';

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: {
      passwordHash: hashedPassword,
    },
  });

  console.log('Password reset done');
  await prisma.$disconnect();
}

main();