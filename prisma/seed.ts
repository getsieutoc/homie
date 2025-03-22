import { parse } from 'csv-parse/sync';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs';

type Vendor = {
  Engine: string;
  Email: string;
  URL: string;
};

const readVendorList = async () => {
  const csvFilePath = path.join(__dirname, 'vendor-list.csv');
  const fileContent = fs.readFileSync(csvFilePath, 'utf-8');

  const records: Vendor[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  return records;
};

async function main() {
  const count = await prisma.vendor.count({
    where: {
      tenantId: null,
    },
  });

  if (count === 0) {
    console.info('Vendors table is empty. Starting to seed vendors...');
    const vendors = await readVendorList();

    // Create vendors
    const createdVendors = await Promise.all(
      vendors.map((vendor) =>
        prisma.vendor.create({
          data: {
            engineName: vendor.Engine,
            email: vendor.Email || null,
            url: vendor.URL || null,
          },
        })
      )
    );

    console.info(`✅ Successfully seeded ${createdVendors.length} vendors`);
  } else {
    console.info('Vendors table is not empty. Skipping seed...');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error('⚠️  Seeding failed', err);
    await prisma.$disconnect();
    process.exit(1);
  });
