import express from "express";

const PORT = process.env.PORT ?? 3000;

const app = express();
const users = [
  {
    username: "admin",
    name: "Gustavo Alfredo Marín Sáez",
    password:
      "1b6ce880ac388eb7fcb6bcaf95e20083:341dfbbe86013c940c8e898b437aa82fe575876f2946a2ad744a0c51501c7dfe6d7e5a31c58d2adc7a7dc4b87927594275ca235276accc9f628697a4c00b4e01", // certamen123
  },
];

app.use(express.static("public"));
// Escriba su código a partir de aquí

import crypto from 'node:crypto';
const { randomUUID } = crypto;

let reminders = [];



app.use(express.json());


/**********************************************************************\
               Autenticación
\**********************************************************************/

/* Endpoint de login */
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  /* Validar formato de username y password */
  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Formato incorrecto' });
  }


  /* Verificar si el usuario existe */
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Usuario no existe' });


  /* Desencriptar contraseña para ver si es correcta */
  const [salt, key] = user.password.split(':');
  const hashedBuffer = crypto.scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, 'hex');

  if (!crypto.timingSafeEqual(hashedBuffer, keyBuffer)) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }


  /* Generar el token nuevo */
  const token = crypto.randomBytes(48).toString('hex');
  user.token = token;


  /* Retornar objeto con la data del user */
  res.json({
    username: user.username,
    name: user.name,
    token: token
  });
});


/* Middleware para para protejer endpoints con token */
const authMiddleware = (req, res, next) => {
  const token = req.header('X-Authorization');
  if (!token) return res.status(401).json({ error: 'Falta token' });

  const user = users.find(u => u.token === token);
  if (!user) return res.status(401).json({ error: 'Token inválido' });

  next();
};






/**********************************************************************\
              ¡¡¡ENDPOINT DE LOS REMINDERS!!!
\**********************************************************************/

/* Obtener reminders */
app.get('/api/reminders', authMiddleware, (req, res) => {
  const sorted = [...reminders].sort((a, b) => {
    if (a.important && !b.important) return -1;
    if (!a.important && b.important) return 1;
    return a.createdAt - b.createdAt;
  });
  res.json(sorted);
});


/* Agregar nuevo reminder */
app.post('/api/reminders', authMiddleware, (req, res) => {
  const { content, important = false } = req.body;

  if (typeof content !== 'string' || content.trim() === '' || content.length > 120 || typeof important !== 'boolean') {
    return res.status(400).json({ error: 'Entrada inválida' });
  }

  const newReminder = {
    id: randomUUID(),
    content: content.trim(),
    createdAt: Date.now(),
    important
  };

  reminders.push(newReminder);
  res.json(newReminder);
});


/* Actualizar reminder */
app.patch('/api/reminders/:id', authMiddleware, (req, res) => {
  const reminder = reminders.find(r => r.id === req.params.id);
  if (!reminder) return res.status(404).json({ error: 'No encontrado' });

  const { content, important } = req.body;

  if (content !== undefined) {
    if (typeof content !== 'string' || content.trim() === '' || content.length > 120) {
      return res.status(400).json({ error: 'Content inválido' });
    }
    reminder.content = content.trim();
  }

  if (important !== undefined) {
    if (typeof important !== 'boolean') {
      return res.status(400).json({ error: 'Important inválido' });
    }
    reminder.important = important;
  }

  res.json(reminder);
});


/* Eliminar reminder */
app.delete('/api/reminders/:id', authMiddleware, (req, res) => {
  const index = reminders.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'No encontrado' });

  reminders.splice(index, 1);
  res.status(204).send();
});


// Hasta aquí

app.listen(PORT, (error) => {
  if (error) {
    console.error(`No se puede ocupar el puerto ${PORT} :(`);
    return;
  }

  console.log(`Escuchando en el puerto ${PORT}`);
});
