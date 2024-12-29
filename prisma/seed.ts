import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export const readVendorList = async () => {
  const csvFilePath = path.join(__dirname, 'vendor-list.csv');
  const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
  const records = parse(fileContent, {
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
    console.log('Vendors table is empty. Starting to seed vendors...');
    const vendors = await readVendorList();

    // Create vendors
    const createdVendors = await Promise.all(
      vendors.map((vendor: { Engine: string; Email: string; URL: string }) =>
        prisma.vendor.create({
          data: {
            name: vendor.Engine,
            email: vendor.Email || null,
            url: vendor.URL || null,
          },
        })
      )
    );

    console.log(`✅ Successfully seeded ${createdVendors.length} vendors`);
  } else {
    console.log('Vendors table is not empty. Skipping seed...');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('⚠️  Seeding failed', e);
    await prisma.$disconnect();
    process.exit(1);
  });
