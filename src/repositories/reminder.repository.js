import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()



export function getAllReminders(userId) {
    return prisma.reminder.findMany({
        where: { userId },
        orderBy: [
            { important: 'desc' },
            { createdAt: 'asc' }
        ]
    });
}


export function getReminderById(id, userId) {
    return prisma.reminder.findFirst({ where: { id, userId } });
}


export function createReminder(data, userId) {
    return prisma.reminder.create({
        data: {
            content: data.content,
            important: data.important,
            userId
        }
    });
}


export function updateReminder(id, userId, data) {
    return prisma.reminder.updateMany({
        where: { id, userId },
        data
    });
}


export function deleteReminder(id, userId) {
    return prisma.reminder.deleteMany({ where: { id, userId } });
}
