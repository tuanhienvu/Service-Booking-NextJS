import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let client: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  client = new PrismaClient();
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error', 'warn'],
    });
  }
  client = globalThis.prisma;
}

// Test the connection
client
  .$connect()
  .then(() => {
    // Connection successful
  })
  .catch((error) => {
    // Connection failed - this will be handled by the application
  });

export default client;
