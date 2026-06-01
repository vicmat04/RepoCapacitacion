import { unstable_cache } from "next/cache"
import { createPublicClient } from "@/shared/lib/supabase/public"
import { createClient } from "@/shared/lib/supabase/server"
import { CACHE_TAGS } from "@/shared/lib/constants"
import type { Tool } from "@/shared/lib/supabase/types"

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
 */
export async function getAllTools(): Promise<Tool[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) {
    console.error("[getAllTools]", error.message)
    return []
  }

  return data ?? []
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
