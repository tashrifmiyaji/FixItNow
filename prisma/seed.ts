import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seed...');

  // Check if --fresh flag is passed to force re-seed
  const isFreshSeed = process.argv.includes('--fresh');

  // Check if data already exists
  const existingCategories = await prisma.category.count();
  
  if (existingCategories > 0 && !isFreshSeed) {
    console.log('Database already has data. Skipping seed to preserve existing records.');
    console.log(`   Found ${existingCategories} categories in the database.`);
    console.log('\n💡 Tip: Use --fresh flag to reset and re-seed (e.g., "npm run db:seed -- --fresh")');
    return;
  }

  if (isFreshSeed && existingCategories > 0) {
    console.log('--fresh flag detected. Clearing existing data...');
    await prisma.review.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.service.deleteMany();
    await prisma.technicianProfile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();
    console.log('Old data cleared.');
  }

  console.log('🧹 Database is empty. Creating seed data...');

  // Seed categories
  console.log('📁 Creating categories...');
  const plumbing = await prisma.category.create({
    data: {
      name: 'Plumbing',
      description: 'Professional plumbing services including repairs, installations, and maintenance',
    },
  });

  const electrical = await prisma.category.create({
    data: {
      name: 'Electrical',
      description: 'Expert electrical installation, repairs, and troubleshooting services',
    },
  });

  const hvac = await prisma.category.create({
    data: {
      name: 'HVAC',
      description: 'Heating, ventilation, and air conditioning services',
    },
  });

  const carpentry = await prisma.category.create({
    data: {
      name: 'Carpentry',
      description: 'Custom carpentry, furniture repair, and woodwork services',
    },
  });

  const painting = await prisma.category.create({
    data: {
      name: 'Painting',
      description: 'Interior and exterior painting services',
    },
  });

  // Seed users
  console.log('👤 Creating users...');
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@fixitnow.com',
      password: hashedPassword,
      phone: '+880-1700-000001',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  // Customer users
  const customer1 = await prisma.user.create({
    data: {
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      password: hashedPassword,
      phone: '+880-1700-000002',
      role: 'CUSTOMER',
      status: 'ACTIVE',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Fatima Begum',
      email: 'fatima@example.com',
      password: hashedPassword,
      phone: '+880-1700-000003',
      role: 'CUSTOMER',
      status: 'ACTIVE',
    },
  });

  // Technician users
  const tech1User = await prisma.user.create({
    data: {
      name: 'Mohammad Ali',
      email: 'mohammad@fixitnow.com',
      password: hashedPassword,
      phone: '+880-1700-000004',
      role: 'TECHNICIAN',
      status: 'ACTIVE',
    },
  });

  const tech2User = await prisma.user.create({
    data: {
      name: 'Karim Khan',
      email: 'karim@fixitnow.com',
      password: hashedPassword,
      phone: '+880-1700-000005',
      role: 'TECHNICIAN',
      status: 'ACTIVE',
    },
  });

  const tech3User = await prisma.user.create({
    data: {
      name: 'Rony Ahmed',
      email: 'rony@fixitnow.com',
      password: hashedPassword,
      phone: '+880-1700-000006',
      role: 'TECHNICIAN',
      status: 'ACTIVE',
    },
  });

  // Seed technician profiles
  console.log(' Creating technician profiles...');
  const tech1 = await prisma.technicianProfile.create({
    data: {
      userId: tech1User.id,
      bio: 'Expert plumber with 8 years of experience in residential and commercial work',
      experience: 8,
      location: 'Dhaka, Bangladesh',
      averageRating: 4.8,
      completedJobs: 156,
    },
  });

  const tech2 = await prisma.technicianProfile.create({
    data: {
      userId: tech2User.id,
      bio: 'Licensed electrician specializing in installations and emergency repairs',
      experience: 10,
      location: 'Dhaka, Bangladesh',
      averageRating: 4.9,
      completedJobs: 203,
    },
  });

  const tech3 = await prisma.technicianProfile.create({
    data: {
      userId: tech3User.id,
      bio: 'Professional HVAC technician with expertise in air conditioning systems',
      experience: 6,
      location: 'Dhaka, Bangladesh',
      averageRating: 4.7,
      completedJobs: 98,
    },
  });

  // Seed services
  console.log(' Creating services...');
  const service1 = await prisma.service.create({
    data: {
      title: 'Pipe Repair & Maintenance',
      description: 'Fix leaks, repair damaged pipes, and perform regular maintenance',
      price: '50.00',
      categoryId: plumbing.id,
      technicianId: tech1.id,
    },
  });

  const service2 = await prisma.service.create({
    data: {
      title: 'Electrical Installation',
      description: 'Professional installation of electrical outlets, switches, and fixtures',
      price: '75.00',
      categoryId: electrical.id,
      technicianId: tech2.id,
    },
  });

  const service3 = await prisma.service.create({
    data: {
      title: 'AC Maintenance & Repair',
      description: 'Regular maintenance and emergency repair of air conditioning units',
      price: '60.00',
      categoryId: hvac.id,
      technicianId: tech3.id,
    },
  });

  const service4 = await prisma.service.create({
    data: {
      title: 'Sink Installation',
      description: 'Professional installation of kitchen and bathroom sinks',
      price: '45.00',
      categoryId: plumbing.id,
      technicianId: tech1.id,
    },
  });

  const service5 = await prisma.service.create({
    data: {
      title: 'Ceiling Fan Installation',
      description: 'Install and wire ceiling fans with proper electrical connections',
      price: '40.00',
      categoryId: electrical.id,
      technicianId: tech2.id,
    },
  });

  // Seed bookings
  console.log(' Creating bookings...');
  const booking1 = await prisma.booking.create({
    data: {
      customerId: customer1.id,
      technicianId: tech1.id,
      serviceId: service1.id,
      bookingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      status: 'ACCEPTED',
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      customerId: customer2.id,
      technicianId: tech2.id,
      serviceId: service2.id,
      bookingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      status: 'REQUESTED',
    },
  });

  const booking3 = await prisma.booking.create({
    data: {
      customerId: customer1.id,
      technicianId: tech3.id,
      serviceId: service3.id,
      bookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: 'COMPLETED',
    },
  });

  // Seed payments
  console.log(' Creating payments...');
  await prisma.payment.create({
    data: {
      bookingId: booking1.id,
      amount: '50.00',
      provider: 'STRIPE',
      transactionId: 'pi_stripe_test_001',
      status: 'COMPLETED',
      paidAt: new Date(),
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: booking2.id,
      amount: '75.00',
      provider: 'STRIPE',
      transactionId: 'pi_stripe_test_002',
      status: 'PENDING',
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: booking3.id,
      amount: '60.00',
      provider: 'STRIPE',
      transactionId: 'pi_stripe_test_003',
      status: 'COMPLETED',
      paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  // Seed reviews
  console.log(' Creating reviews...');
  await prisma.review.create({
    data: {
      bookingId: booking3.id,
      customerId: customer1.id,
      technicianId: tech3.id,
      rating: 5,
      comment: 'Excellent service! Mohammad was professional and fixed my AC quickly.',
    },
  });

  console.log('✅ Database seed completed successfully!');
  console.log('\n📋 Seed Data Summary:');
  console.log(`   • Categories: 5`);
  console.log(`   • Users (1 Admin, 2 Customers, 3 Technicians): 6`);
  console.log(`   • Services: 5`);
  console.log(`   • Bookings: 3`);
  console.log(`   • Payments: 3`);
  console.log(`   • Reviews: 1`);
  console.log('\n🔑 Test Credentials:');
  console.log(`   • Admin: admin@fixitnow.com / Password123!`);
  console.log(`   • Customer: ahmed@example.com / Password123!`);
  console.log(`   • Technician: mohammad@fixitnow.com / Password123!`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
