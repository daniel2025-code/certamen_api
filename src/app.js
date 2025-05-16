import express from 'express';
import { login, logout } from './controllers/auth.controller.js';
import {
    createReminder,
    deleteReminder,
    getReminderById,
    listReminders,
    updateReminder
} from './controllers/reminders.controller.js';

import { authMiddleware } from './middlewares/auth.middleware.js';
import { validate } from './middlewares/validate.middleware.js';
import { loginSchema } from './schemas/login.schema.js';
import { createReminderSchema, updateReminderSchema } from './schemas/reminder.schema.js';

export const app = express();

app.use(express.static('public'));
app.use(express.json());

/* Rutas paras auth */
app.post('/api/auth/login', validate(loginSchema), login);
app.post('/api/auth/logout', authMiddleware, logout);

/* Rutas para los reminders */
app.get('/api/reminders', authMiddleware, listReminders);
app.get('/api/reminders/:id', authMiddleware, getReminderById);
app.post('/api/reminders', authMiddleware, validate(createReminderSchema), createReminder);
app.patch('/api/reminders/:id', authMiddleware, validate(updateReminderSchema), updateReminder);
app.delete('/api/reminders/:id', authMiddleware, deleteReminder);



