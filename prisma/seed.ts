import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// Function to generate random password
function generateRandomPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function main() {
  // Starting database seeding...

  // Create categories
  const categories = await prisma.category.createMany({
    data: [
      { title: 'Cleaning Services' },
      { title: 'Home Repairs' },
      { title: 'Painting' },
      { title: 'Gardening' },
      { title: 'Moving Services' },
      { title: 'Plumbing' },
      { title: 'Electrical' },
      { title: 'Carpentry' },
      { title: 'Landscaping' },
      { title: 'Housekeeping' },
      { title: 'Pet Care' },
      { title: 'Elderly Care' },
      { title: 'Child Care' },
      { title: 'Cooking' },
      { title: 'Delivery' },
      { title: 'Security' },
      { title: 'Maintenance' },
      { title: 'Installation' },
      { title: 'Repair' },
      { title: 'Consultation' },
    ],
    skipDuplicates: true,
  });

  // Get created categories
  const createdCategories = await prisma.category.findMany();

  // Create customers with passwords
  const customerPasswords = [
    'Admin@123', // For tuanhienvu@gmail.com
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
  ];

  const customers = await prisma.user.createMany({
    data: [
      {
        first_name: 'Tuan',
        last_name: 'Vu',
        email: 'tuanhienvu@gmail.com',
        role: 'super_admin',
        password: await hash('Admin@123', 12),
      },
      {
        first_name: 'Alice',
        last_name: 'Nguyen',
        email: 'alice@example.com',
        role: 'customer',
        password: await hash(customerPasswords[1], 12),
      },
      {
        first_name: 'Bob',
        last_name: 'Tran',
        email: 'bob@example.com',
        role: 'customer',
        password: await hash(customerPasswords[2], 12),
      },
      {
        first_name: 'Charlie',
        last_name: 'Le',
        email: 'charlie@example.com',
        role: 'customer',
        password: await hash(customerPasswords[3], 12),
      },
      {
        first_name: 'Diana',
        last_name: 'Pham',
        email: 'diana@example.com',
        role: 'customer',
        password: await hash(customerPasswords[4], 12),
      },
      {
        first_name: 'Eve',
        last_name: 'Hoang',
        email: 'eve@example.com',
        role: 'customer',
        password: await hash(customerPasswords[5], 12),
      },
      {
        first_name: 'Frank',
        last_name: 'Vu',
        email: 'frank@example.com',
        role: 'customer',
        password: await hash(customerPasswords[6], 12),
      },
      {
        first_name: 'Grace',
        last_name: 'Do',
        email: 'grace@example.com',
        role: 'customer',
        password: await hash(customerPasswords[7], 12),
      },
      {
        first_name: 'Henry',
        last_name: 'Bui',
        email: 'henry@example.com',
        role: 'customer',
        password: await hash(customerPasswords[8], 12),
      },
      {
        first_name: 'Ivy',
        last_name: 'Ngo',
        email: 'ivy@example.com',
        role: 'customer',
        password: await hash(customerPasswords[9], 12),
      },
      {
        first_name: 'Jack',
        last_name: 'Ly',
        email: 'jack@example.com',
        role: 'customer',
        password: await hash(customerPasswords[10], 12),
      },
      {
        first_name: 'Kate',
        last_name: 'Dang',
        email: 'kate@example.com',
        role: 'customer',
        password: await hash(customerPasswords[11], 12),
      },
      {
        first_name: 'Liam',
        last_name: 'Huynh',
        email: 'liam@example.com',
        role: 'customer',
        password: await hash(customerPasswords[12], 12),
      },
      {
        first_name: 'Mia',
        last_name: 'Truong',
        email: 'mia@example.com',
        role: 'customer',
        password: await hash(customerPasswords[13], 12),
      },
      {
        first_name: 'Noah',
        last_name: 'Phan',
        email: 'noah@example.com',
        role: 'customer',
        password: await hash(customerPasswords[14], 12),
      },
      {
        first_name: 'Olivia',
        last_name: 'Vo',
        email: 'olivia@example.com',
        role: 'customer',
        password: await hash(customerPasswords[15], 12),
      },
      {
        first_name: 'Paul',
        last_name: 'Lam',
        email: 'paul@example.com',
        role: 'customer',
        password: await hash(customerPasswords[16], 12),
      },
      {
        first_name: 'Quinn',
        last_name: 'Nguyen',
        email: 'quinn@example.com',
        role: 'customer',
        password: await hash(customerPasswords[17], 12),
      },
      {
        first_name: 'Ruby',
        last_name: 'Tran',
        email: 'ruby@example.com',
        role: 'customer',
        password: await hash(customerPasswords[18], 12),
      },
      {
        first_name: 'Sam',
        last_name: 'Le',
        email: 'sam@example.com',
        role: 'customer',
        password: await hash(customerPasswords[19], 12),
      },
      {
        first_name: 'Tina',
        last_name: 'Pham',
        email: 'tina@example.com',
        role: 'customer',
        password: await hash(customerPasswords[20], 12),
      },
      {
        first_name: 'Uma',
        last_name: 'Hoang',
        email: 'uma@example.com',
        role: 'customer',
        password: await hash(customerPasswords[21], 12),
      },
    ],
    skipDuplicates: true,
  });

  // Get created customers
  const createdCustomers = await prisma.user.findMany({ where: { role: 'customer' } });

  // Create service providers with passwords
  const serviceProviderPasswords = [
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
    generateRandomPassword(),
  ];

  const serviceProviders = await prisma.user.createMany({
    data: [
      {
        first_name: 'Maria',
        last_name: 'Garcia',
        email: 'maria@service.com',
        role: 'service_provider',
        phone: '+1234567890',
        address: 'Downtown, City Center',
        password: await hash(serviceProviderPasswords[0], 12),
      },
      {
        first_name: 'John',
        last_name: 'Smith',
        email: 'john@service.com',
        role: 'service_provider',
        phone: '+1234567891',
        address: 'Westside, Suburbs',
        password: await hash(serviceProviderPasswords[1], 12),
      },
      {
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah@service.com',
        role: 'service_provider',
        phone: '+1234567892',
        address: 'North District',
        password: await hash(serviceProviderPasswords[2], 12),
      },
      {
        first_name: 'Mike',
        last_name: 'Chen',
        email: 'mike@service.com',
        role: 'service_provider',
        phone: '+1234567893',
        address: 'Eastside, Green Area',
        password: await hash(serviceProviderPasswords[3], 12),
      },
      {
        first_name: 'Lisa',
        last_name: 'Wang',
        email: 'lisa@service.com',
        role: 'service_provider',
        phone: '+1234567894',
        address: 'Central Business District',
        password: await hash(serviceProviderPasswords[4], 12),
      },
      {
        first_name: 'David',
        last_name: 'Rodriguez',
        email: 'david@service.com',
        role: 'service_provider',
        phone: '+1234567895',
        address: 'South District',
        password: await hash(serviceProviderPasswords[5], 12),
      },
      {
        first_name: 'Emma',
        last_name: 'Wilson',
        email: 'emma@service.com',
        role: 'service_provider',
        phone: '+1234567896',
        address: 'Westside Industrial',
        password: await hash(serviceProviderPasswords[6], 12),
      },
      {
        first_name: 'Alex',
        last_name: 'Thompson',
        email: 'alex@service.com',
        role: 'service_provider',
        phone: '+1234567897',
        address: 'Northside Craftsman',
        password: await hash(serviceProviderPasswords[7], 12),
      },
      {
        first_name: 'Sophia',
        last_name: 'Lee',
        email: 'sophia@service.com',
        role: 'service_provider',
        phone: '+1234567898',
        address: 'Eastside Gardens',
        password: await hash(serviceProviderPasswords[8], 12),
      },
      {
        first_name: 'James',
        last_name: 'Brown',
        email: 'james@service.com',
        role: 'service_provider',
        phone: '+1234567899',
        address: 'Central Residential',
        password: await hash(serviceProviderPasswords[9], 12),
      },
    ],
    skipDuplicates: true,
  });

  // Get created service providers
  const createdServiceProviders = await prisma.user.findMany({ where: { role: 'service_provider' } });

  // Create service provider profiles
  const serviceProviderProfiles = await prisma.serviceProvider.createMany({
    data: [
      {
        price: 45.0,
        about:
          'Professional cleaning expert with 8+ years of experience. Specializes in deep cleaning and eco-friendly solutions.',
        location: 'Downtown, City Center',
        categoryId: createdCategories[0].id, // Cleaning Services
        isAvailable: true,
      },
      {
        price: 65.0,
        about: 'Skilled handyman with expertise in home repairs, maintenance, and small renovations.',
        location: 'Westside, Suburbs',
        categoryId: createdCategories[1].id, // Home Repairs
        isAvailable: true,
      },
      {
        price: 55.0,
        about: 'Professional painter with 10+ years of experience. Interior and exterior painting, color consultation.',
        location: 'North District',
        categoryId: createdCategories[2].id, // Painting
        isAvailable: true,
      },
      {
        price: 40.0,
        about: 'Experienced gardener specializing in landscape design, maintenance, and seasonal care.',
        location: 'Eastside, Green Area',
        categoryId: createdCategories[3].id, // Gardening
        isAvailable: true,
      },
      {
        price: 80.0,
        about: 'Professional moving service with full-service packing, moving, and unpacking.',
        location: 'Central Business District',
        categoryId: createdCategories[4].id, // Moving Services
        isAvailable: true,
      },
      {
        price: 70.0,
        about: 'Licensed plumber with emergency service availability and comprehensive plumbing solutions.',
        location: 'South District',
        categoryId: createdCategories[5].id, // Plumbing
        isAvailable: true,
      },
      {
        price: 75.0,
        about: 'Certified electrician specializing in residential and commercial electrical work.',
        location: 'Westside Industrial',
        categoryId: createdCategories[6].id, // Electrical
        isAvailable: true,
      },
      {
        price: 60.0,
        about: 'Skilled carpenter with custom woodworking and furniture restoration expertise.',
        location: 'Northside Craftsman',
        categoryId: createdCategories[7].id, // Carpentry
        isAvailable: true,
      },
      {
        price: 50.0,
        about: 'Landscape architect with creative design solutions and sustainable landscaping practices.',
        location: 'Eastside Gardens',
        categoryId: createdCategories[8].id, // Landscaping
        isAvailable: true,
      },
      {
        price: 35.0,
        about: 'Professional housekeeper with attention to detail and flexible scheduling options.',
        location: 'Central Residential',
        categoryId: createdCategories[9].id, // Housekeeping
        isAvailable: true,
      },
    ],
    skipDuplicates: true,
  });

  // Create sample orders
  const orders = await prisma.order.createMany({
    data: [
      {
        date: '2024-03-25',
        time: '09:00',
        location: 'Downtown Apartment',
        categoryId: createdCategories[0].id, // Cleaning Services
        customerId: createdCustomers[0].id,
        serviceProviderId: createdServiceProviders[0].id,
        amount: 45.0,
        status: 'Pending',
        notes: 'Deep cleaning needed for 2-bedroom apartment',
        scheduledDate: new Date('2024-03-25T09:00:00Z'),
      },
      {
        date: '2024-03-26',
        time: '14:00',
        location: 'Westside House',
        categoryId: createdCategories[1].id, // Home Repairs
        customerId: createdCustomers[1].id,
        serviceProviderId: createdServiceProviders[1].id,
        amount: 65.0,
        status: 'Confirmed',
        notes: 'Fix leaky faucet and repair kitchen cabinet',
        scheduledDate: new Date('2024-03-26T14:00:00Z'),
      },
      {
        date: '2024-03-27',
        time: '10:00',
        location: 'North District Office',
        categoryId: createdCategories[2].id, // Painting
        customerId: createdCustomers[2].id,
        serviceProviderId: createdServiceProviders[2].id,
        amount: 55.0,
        status: 'In Progress',
        notes: 'Paint conference room walls - neutral colors',
        scheduledDate: new Date('2024-03-27T10:00:00Z'),
      },
      {
        date: '2024-03-28',
        time: '08:00',
        location: 'Eastside Garden',
        categoryId: createdCategories[3].id, // Gardening
        customerId: createdCustomers[3].id,
        serviceProviderId: createdServiceProviders[3].id,
        amount: 40.0,
        status: 'Completed',
        notes: 'Spring garden cleanup and planting',
        scheduledDate: new Date('2024-03-28T08:00:00Z'),
        completedDate: new Date('2024-03-28T12:00:00Z'),
      },
      {
        date: '2024-03-29',
        time: '07:00',
        location: 'Central Business District',
        categoryId: createdCategories[4].id, // Moving Services
        customerId: createdCustomers[4].id,
        serviceProviderId: createdServiceProviders[4].id,
        amount: 80.0,
        status: 'Scheduled',
        notes: 'Office relocation - 5 workstations and furniture',
        scheduledDate: new Date('2024-03-29T07:00:00Z'),
      },
    ],
    skipDuplicates: true,
  });

  // Create order services
  const orderServices = await prisma.orderServices.createMany({
    data: [
      { orderId: 1, title: 'Deep House Cleaning', quantity: 1 },
      { orderId: 1, title: 'Kitchen Deep Clean', quantity: 1 },
      { orderId: 2, title: 'Plumbing Repair', quantity: 1 },
      { orderId: 3, title: 'Interior Painting', quantity: 1 },
      { orderId: 4, title: 'Garden Cleanup', quantity: 1 },
      { orderId: 5, title: 'Office Moving', quantity: 1 },
      { orderId: 2, title: 'Electrical Fix', quantity: 1 },
      { orderId: 3, title: 'Wall Preparation', quantity: 1 },
      { orderId: 4, title: 'Plant Installation', quantity: 1 },
      { orderId: 5, title: 'Furniture Assembly', quantity: 1 },
    ],
    skipDuplicates: true,
  });

  // Create reviews
  const reviews = await prisma.review.createMany({
    data: [
      {
        rating: 5.0,
        message: 'Excellent cleaning service! Very thorough and professional.',
        customerId: createdCustomers[0].id,
        serviceProviderId: createdServiceProviders[0].id,
        orderId: 1,
      },
      {
        rating: 4.5,
        message: 'Great repair work. Fixed the issues quickly and efficiently.',
        customerId: createdCustomers[1].id,
        serviceProviderId: createdServiceProviders[1].id,
        orderId: 2,
      },
      {
        rating: 5.0,
        message: 'Beautiful painting job. Colors are perfect and work was done on time.',
        customerId: createdCustomers[2].id,
        serviceProviderId: createdServiceProviders[2].id,
        orderId: 3,
      },
      {
        rating: 4.8,
        message: 'Amazing garden transformation. Very knowledgeable about plants.',
        customerId: createdCustomers[3].id,
        serviceProviderId: createdServiceProviders[3].id,
        orderId: 4,
      },
    ],
    skipDuplicates: true,
  });

  // Create notifications
  const notifications = await prisma.notification.createMany({
    data: [
      {
        type: 'booking_request',
        message: 'New booking request for Cleaning Services on March 25th',
        userId: createdServiceProviders[0].id,
        orderId: 1,
        isRead: false,
      },
      {
        type: 'booking_confirmed',
        message: 'Your booking for Home Repairs has been confirmed for March 26th',
        userId: createdCustomers[1].id,
        orderId: 2,
        isRead: false,
      },
      {
        type: 'booking_completed',
        message: 'Your gardening service has been completed. Please leave a review!',
        userId: createdCustomers[3].id,
        orderId: 4,
        isRead: false,
      },
      {
        type: 'review_received',
        message: 'You received a 5-star review from Alice Nguyen',
        userId: createdServiceProviders[0].id,
        orderId: 1,
        isRead: false,
      },
    ],
    skipDuplicates: true,
  });

  // Database seeding completed successfully!
  // Created: categories, customers, service providers, orders, order services, reviews, notifications

  // Login Credentials:
  // Super Admin: tuanhienvu@gmail.com / Admin@123
  // Customer and Service Provider passwords are generated randomly
}

main()
  .catch((e) => {
    // Error during seeding
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
