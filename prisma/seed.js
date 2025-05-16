import { PrismaClient } from '@prisma/client';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const key = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${key}`;
}

async function main() {
    const password = hashPassword('certamen123');

    await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            name: 'Gustavo Alfredo Marín Sáez',
            password
        }
    });
}

main().finally(() => prisma.$disconnect());