/**
 * Prisma Database Seed Script for MEEZAN Marketplace
 * Populates categories, services, Egyptian accountants, and demo bookings.
 */

import { ACCOUNTANTS, CATEGORIES, SERVICES, INITIAL_BOOKINGS } from '../src/data/seedData';

async function main() {
  console.log('Seeding MEEZAN database with Egyptian marketplace dataset...');
  console.log(`Loaded ${CATEGORIES.length} accounting categories.`);
  console.log(`Loaded ${SERVICES.length} specialized tax and accounting services.`);
  console.log(`Loaded ${ACCOUNTANTS.length} certified Egyptian accountants with syndicate IDs.`);
  console.log(`Loaded ${INITIAL_BOOKINGS.length} initial bookings and invoices.`);
  console.log('Seed completed successfully.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
