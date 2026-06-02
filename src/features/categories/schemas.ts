import { z } from "zod"

export const categorySchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder los 50 caracteres"),
  slug: z
    .string()
    .min(3, "El slug debe tener al menos 3 caracteres")
    .max(50, "El slug no puede exceder los 50 caracteres")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "El slug solo puede contener letras minúsculas, números y guiones medios"
    ),
  icon: z.string().min(1, "Debes seleccionar un ícono"),
  display_order: z.coerce
    .number()
    .int("El orden debe ser un número entero")
    .min(0, "El orden no puede ser negativo"),
  is_active: z.boolean().default(true),
})

export type CategorySchemaType = z.infer<typeof categorySchema>
