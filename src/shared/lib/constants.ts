/**
 * Constantes globales de la aplicación.
 * TAD §3 (TP7 — Explicit over Implicit)
 */

// Rutas de la aplicación
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ADMIN: "/admin",
  ADMIN_TOOLS: "/admin/tools",
  ADMIN_TOOLS_NEW: "/admin/tools/new",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_CATEGORIES_NEW: "/admin/categories/new",
} as const

// Cache tags para ISR revalidation
export const CACHE_TAGS = {
  TOOLS: "tools",
  CATEGORIES: "categories",
  PORTAL_DATA: "portal-data",
} as const

// Límites de validación (sincronizados con Zod schemas)
export const VALIDATION = {
  CATEGORY_NAME_MIN: 3,
  CATEGORY_NAME_MAX: 50,
  TOOL_NAME_MIN: 3,
  TOOL_NAME_MAX: 60,
  SEARCH_MAX_LENGTH: 100,
} as const

// Iconos curados para categorías (16 íconos del ámbito educativo/operativo)
// SDD §3.4 — Selector de Íconos
export const CATEGORY_ICONS = [
  "Folder",
  "BookOpen",
  "GraduationCap",
  "Users",
  "BarChart2",
  "ClipboardList",
  "Globe",
  "Megaphone",
  "Settings",
  "FileText",
  "Database",
  "Monitor",
  "Calendar",
  "MessageSquare",
  "Link",
  "Star",
] as const

export type CategoryIcon = (typeof CATEGORY_ICONS)[number]
