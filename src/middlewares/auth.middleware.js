import { findUserByToken } from '../repositories/user.repository.js';



export async function authMiddleware(req, res, next) {
    const token = req.header('X-Authorization');
    if (!token) return res.status(401).json({ error: 'Falta token' });

    const user = await findUserByToken(token);
    if (!user) return res.status(401).json({ error: 'Token inválido' });

    req.user = user;
    next();
}


