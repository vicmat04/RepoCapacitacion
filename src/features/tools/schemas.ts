import { z } from "zod"

export const toolSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().optional().nullable(),
  url: z.string().url("Debe ser una URL válida (ej. https://...)"),
  icon: z.string().min(1, "Debes seleccionar un ícono"),
  category_id: z.string().uuid("Debes seleccionar una categoría válida"),
  display_order: z.coerce.number().int().min(0, "El orden debe ser mayor o igual a 0"),
  is_active: z.boolean().default(true),
  opens_new_tab: z.boolean().default(true),
})

export type ToolSchemaType = z.infer<typeof toolSchema>
