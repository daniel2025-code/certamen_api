import crypto from 'node:crypto';
import {
    loginUser,
    setUserToken,
    logoutUserByToken
} from '../repositories/user.repository.js';



export async function login(req, res) {
    const { username, password } = req.body;

    /* Logear usuario */
    const user = await loginUser(username, password);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' })

    /* Generar el token nuevo */
    const token = crypto.randomBytes(48).toString('hex');
    await setUserToken(user.id, token);

    /* Retornar objeto con la data del user */
    res.json({
        username: user.username,
        name: user.name,
        token
    });
}


export async function logout(req, res) {
    const token = req.header('X-Authorization');
    await logoutUserByToken(token);
    res.sendStatus(204);
}


