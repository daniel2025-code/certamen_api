import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import crypto from 'node:crypto';



export function loginUser(username, password) {
    return prisma.user.findUnique({ where: { username } }).then(user => {
        if (!user) return null

        const [salt, key] = user.password.split(':')
        const hashedBuffer = crypto.scryptSync(password, salt, 64)
        const keyBuffer = Buffer.from(key, 'hex')

        const isMatch = crypto.timingSafeEqual(hashedBuffer, keyBuffer)
        return isMatch ? user : null
    });
}


export function setUserToken(userId, token) {
    return prisma.user.update({
        where: { id: userId },
        data: { token }
    });
}


export function findUserByToken(token) {
    return prisma.user.findFirst({ where: { token } });
}


export function logoutUserByToken(token) {
    return prisma.user.updateMany({
        where: { token },
        data: { token: null }
    });
}

