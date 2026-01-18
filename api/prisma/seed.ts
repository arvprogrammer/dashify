import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: pool });

async function main() {
    const saltRounds = 10;

    const adminPassword = await bcrypt.hash('Admin123!', saltRounds);
    const userPassword = await bcrypt.hash('User123!', saltRounds);

    // Create Admin User
    await prisma.user.upsert({
        where: { email: 'admin@dashify.com' },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@dashify.com',
            password: adminPassword,
            role: 'ADMIN',
        },
    });

    // Create Normal User
    await prisma.user.upsert({
        where: { email: 'user@dashify.com' },
        update: {},
        create: {
            name: 'User',
            email: 'user@dashify.com',
            password: userPassword,
            role: 'USER',
        },
    });

    console.log('Seed finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
