import { unstable_cache } from "next/cache"
import { createPublicClient } from "@/shared/lib/supabase/public"
import { createClient } from "@/shared/lib/supabase/server"
import { CACHE_TAGS } from "@/shared/lib/constants"
import type { CategoryWithTools, Category } from "@/shared/lib/supabase/types"

/**
 * Obtiene todas las categorías activas con sus herramientas activas.
 * Usado en el Portal público — ISR 1h.
 * RLS garantiza que anon solo ve is_active = true.
 */
export const getActiveCategories = unstable_cache(
  async (): Promise<CategoryWithTools[]> => {
    const supabase = createPublicClient()

    const { data, error } = await supabase
      .from("categories")
      .select(
        `
        *,
        tools (*)
      `
      )
      .eq("is_active", true)
      .eq("tools.is_active", true)
      .order("display_order", { ascending: true })
      .order("display_order", { referencedTable: "tools", ascending: true })

    if (error) {
      console.error("[getActiveCategories]", error.message)
      return []
    }

    return (data as CategoryWithTools[]) ?? []
  },
  ["active-categories"],
  {
    revalidate: 3600, // ISR: 1 hora
    tags: [CACHE_TAGS.CATEGORIES, CACHE_TAGS.TOOLS],
  }
)

/**
 * Obtiene TODAS las categorías (activas e inactivas) para el panel admin.
 * Sin caché — necesita datos frescos.
 */
export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) {
    console.error("[getAllCategories]", error.message)
    return []
  }

  return data ?? []
}

/**
 * Obtiene una categoría por ID.
 */
export async function getCategoryById(
  id: string
): Promise<Category | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return null
  return data
}
