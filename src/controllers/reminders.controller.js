import {
    getAllReminders,
    getReminderById as getReminder,
    createReminder as create,
    updateReminder as update,
    deleteReminder as remove
} from '../repositories/reminder.repository.js';



/* Obtener reminders */
export async function listReminders(req, res) {
    const user = req.user;
    const reminders = await getAllReminders(user.id);
    res.json(reminders);
}


/* Obtener reminder por su ID */
export async function getReminderById(req, res) {
    const user = req.user;
    const reminder = await getReminder(req.params.id, user.id);

    if (!reminder) return res.status(404).json({ error: 'No encontrado' });
    res.json(reminder);
}


/* Agregar nuevo reminder */
export async function createReminder(req, res) {
    const user = req.user;
    const reminder = await create(req.body, user.id);
    res.status(201).json(reminder);
}


/* Actualizar reminder */
export async function updateReminder(req, res) {
    const user = req.user;
    const id = req.params.id;

    const result = await update(id, user.id, req.body);
    if (result.count === 0) return res.status(404).json({ error: 'No encontrado o sin permiso' });

    const updated = await getReminder(id, user.id);
    res.json(updated);
}


/* Eliminar reminder */
export async function deleteReminder(req, res) {
    const user = req.user;
    const id = req.params.id;

    const result = await remove(id, user.id);
    if (result.count === 0) return res.status(404).json({ error: 'No encontrado o sin permiso' });

    res.sendStatus(204);
}


