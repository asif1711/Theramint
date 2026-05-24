import { prisma } from './db.js';
import { hashPassword } from './auth.js';

async function seed() {

  // Create some Therapists
  const therapists = [
    {
      fullName: 'Dr. Sarah Wilson',
      email: 'sarah@theramint.com',
      specialization: 'Cognitive Behavioral Therapy (CBT)',
      experience: 12,
      bio: 'Expert in anxiety and depression with over 12 years of clinical experience.',
      qualifications: 'PhD in Clinical Psychology',
    },
    {
      fullName: 'Michael Chen',
      email: 'michael@theramint.com',
      specialization: 'Family & Marriage Counseling',
      experience: 8,
      bio: 'Helping families navigate complex relationships and dynamic changes.',
      qualifications: 'M.Sc. in Counseling Psychology',
    },
    {
      fullName: 'Elena Rodriguez',
      email: 'elena@theramint.com',
      specialization: 'Trauma-Informed Therapy',
      experience: 15,
      bio: 'Specializing in PTSD and complex trauma recovery for adults and adolescents.',
      qualifications: 'LCSW, Certified Trauma Specialist',
    }
  ];

  for (const t of therapists) {
    const pwd = await hashPassword('therapist123');
    const user = await prisma.user.upsert({
      where: { email: t.email },
      update: {},
      create: {
        fullName: t.fullName,
        email: t.email,
        passwordHash: pwd,
        role: 'THERAPIST',
      },
    });

    await prisma.therapist.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        specialization: t.specialization,
        experienceYears: t.experience,
        professionalBio: t.bio,
        qualifications: t.qualifications,
      },
    });
  }

  console.log('Seed completed!');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
