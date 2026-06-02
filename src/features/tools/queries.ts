import { unstable_cache } from "next/cache"
import { createPublicClient } from "@/shared/lib/supabase/public"
import { createClient } from "@/shared/lib/supabase/server"
import { CACHE_TAGS } from "@/shared/lib/constants"
import type { Tool, ToolWithCategory } from "@/shared/lib/supabase/types"

/**
 * Obtiene todas las herramientas activas.
 * ISR 1h — usado en portal y búsqueda.
 */
export const getActiveTools = unstable_cache(
  async (): Promise<Tool[]> => {
    const supabase = createPublicClient()

    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("[getActiveTools]", error.message)
      return []
    }

    return data ?? []
  },
  ["active-tools"],
  {
    revalidate: 3600,
    tags: [CACHE_TAGS.TOOLS],
  }
)

/**
 * Obtiene TODAS las herramientas para el panel admin (sin caché).
 * Incluye el nombre de la categoría vía JOIN (foreign key category_id).
 */
export async function getAllTools(): Promise<ToolWithCategory[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("tools")
    .select(`
      *,
      categories (
        name
      )
    `)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("[getAllTools]", error.message)
    return []
  }

  return (data as unknown as ToolWithCategory[]) ?? []
}

/**
 * Obtiene una herramienta por ID.
 */
export async function getToolById(id: string): Promise<Tool | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return null
  return data
}

/**
 * Obtiene herramientas filtradas por categoría.
 */
export async function getToolsByCategory(
  categoryId: string
): Promise<Tool[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("category_id", categoryId)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("[getToolsByCategory]", error.message)
    return []
  }

  return data ?? []
}

export async function getToolsCount(): Promise<number> {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from("tools")
    .select("*", { count: "exact", head: true })

  if (error) {
    console.error("[getToolsCount]", error.message)
    return 0
  }

  return count ?? 0
}
