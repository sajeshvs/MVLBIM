import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a default tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Demo Construction Company',
      slug: 'demo-construction',
      email: 'admin@demo.com',
      phone: '+1-555-0123',
      address: '123 Construction Ave, Builder City, BC 12345',
      settings: {
        currency: 'USD',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
      },
    },
  });

  // Create a default admin user
  const hashedPassword = await hash('admin123', 12);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Admin',
      phone: '+1-555-0123',
      role: 'ADMIN',
    },
  });

  // Create tenant membership for admin
  await prisma.tenantMember.create({
    data: {
      userId: adminUser.id,
      tenantId: tenant.id,
      role: 'OWNER',
    },
  });

  // Create subscription for tenant
  await prisma.tenantSubscription.create({
    data: {
      tenantId: tenant.id,
      plan: 'PROFESSIONAL',
      status: 'ACTIVE',
      startDate: new Date(),
      features: {
        maxProjects: 50,
        maxUsers: 25,
        storage: '100GB',
        apiAccess: true,
        advancedReporting: true,
      },
    },
  });

  // Create default categories
  const categories = [
    { name: 'Site Work', code: '01', description: 'Site preparation and earthwork' },
    { name: 'Concrete', code: '03', description: 'Concrete and masonry work' },
    { name: 'Masonry', code: '04', description: 'Brick, block, and stone work' },
    { name: 'Metals', code: '05', description: 'Structural and miscellaneous metals' },
    { name: 'Wood & Plastics', code: '06', description: 'Rough and finish carpentry' },
    { name: 'Thermal & Moisture', code: '07', description: 'Insulation and waterproofing' },
    { name: 'Doors & Windows', code: '08', description: 'Doors, windows, and hardware' },
    { name: 'Finishes', code: '09', description: 'Flooring, wall, and ceiling finishes' },
    { name: 'Specialties', code: '10', description: 'Lockers, signage, and accessories' },
    { name: 'Equipment', code: '11', description: 'Fixed and movable equipment' },
    { name: 'Furnishings', code: '12', description: 'Furniture and window treatments' },
    { name: 'Special Construction', code: '13', description: 'Pools, courts, and special structures' },
    { name: 'Conveying Systems', code: '14', description: 'Elevators and moving systems' },
    { name: 'Mechanical', code: '15', description: 'HVAC and plumbing systems' },
    { name: 'Electrical', code: '16', description: 'Electrical and low voltage systems' },
  ];

  for (const category of categories) {
    await prisma.category.create({
      data: {
        ...category,
        tenantId: tenant.id,
      },
    });
  }

  // Create a sample project
  const project = await prisma.project.create({
    data: {
      name: 'Downtown Office Building',
      description: 'A 12-story mixed-use office building in the downtown core',
      code: 'DOB-2024-001',
      type: 'COMMERCIAL',
      status: 'ACTIVE',
      budget: 12500000.00,
      currency: 'USD',
      location: '456 Business Blvd, Downtown, BC 54321',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-12-31'),
      tenantId: tenant.id,
      createdBy: adminUser.id,
      settings: {
        trackTime: true,
        requireApprovals: true,
        autoCalculateTotals: true,
      },
    },
  });

  // Create project phases
  const phases = [
    { name: 'Pre-Construction', order: 1, status: 'COMPLETED' as const },
    { name: 'Foundation', order: 2, status: 'COMPLETED' as const },
    { name: 'Structure', order: 3, status: 'ACTIVE' as const },
    { name: 'MEP Rough-in', order: 4, status: 'PLANNED' as const },
    { name: 'Finishes', order: 5, status: 'PLANNED' as const },
    { name: 'Final', order: 6, status: 'PLANNED' as const },
  ];

  for (const phase of phases) {
    await prisma.phase.create({
      data: {
        ...phase,
        projectId: project.id,
        budget: 2000000.00,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📧 Admin email: ${adminUser.email}`);
  console.log(`🔑 Admin password: admin123`);
  console.log(`🏢 Tenant: ${tenant.name} (${tenant.slug})`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
