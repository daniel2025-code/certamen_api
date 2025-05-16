import { object, string, boolean, optional, maxLength } from 'valibot';



export const createReminderSchema = object({
    content: string([
        maxLength(120, 'Máximo 120 caracteres'),
        (input) => input.trim() !== '' || 'Contenido requerido'
    ]),
    important: optional(boolean())
});


export const updateReminderSchema = object({
    content: optional(
        string([
            maxLength(120, 'Máximo 120 caracteres'),
            (input) => input.trim() !== '' || 'Contenido no puede estar vacío'
        ])
    ),
    important: optional(boolean())
});


