/**
 * Tipos de base de datos — sincronizados con el schema SQL.
 * TAD §5 — Database Schema
 * Fuente de verdad: supabase/migrations/001_initial_schema.sql
 */

export type Category = {
  id: string
  name: string
  slug: string
  icon: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Tool = {
  id: string
  name: string
  description: string | null
  url: string
  icon: string
  category_id: string
  display_order: number
  is_active: boolean
  opens_new_tab: boolean
  created_at: string
  updated_at: string
}

/** Category con sus tools anidados (para el portal) */
export type CategoryWithTools = Category & {
  tools: Tool[]
}

/** Tool con su categoría (para el admin) */
export type ToolWithCategory = Tool & {
  categories: Pick<Category, "name"> | null
}

/** Payloads para crear/editar — sin campos generados por DB */
export type CreateCategoryPayload = Pick<
  Category,
  "name" | "slug" | "icon" | "display_order" | "is_active"
>

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>

export type CreateToolPayload = Pick<
  Tool,
  "name" | "description" | "url" | "icon" | "category_id" | "display_order" | "is_active" | "opens_new_tab"
>

export type UpdateToolPayload = Partial<CreateToolPayload>
