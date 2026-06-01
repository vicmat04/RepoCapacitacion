-- ============================================================
-- Facilitadores Control Center — Initial Schema
-- Migración 001: Tablas + Indexes + RLS + Triggers
-- TAD §5 — Database Schema
-- ============================================================

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL,
  icon          TEXT NOT NULL DEFAULT 'Folder',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT categories_name_unique UNIQUE (name),
  CONSTRAINT categories_slug_unique UNIQUE (slug),
  CONSTRAINT categories_name_length CHECK (char_length(name) >= 3 AND char_length(name) <= 50),
  CONSTRAINT categories_display_order_positive CHECK (display_order >= 0)
);

-- ============================================================
-- TOOLS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tools (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  description   TEXT,
  url           TEXT NOT NULL,
  icon          TEXT NOT NULL DEFAULT 'ExternalLink',
  category_id   UUID NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  opens_new_tab BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT tools_name_unique UNIQUE (name),
  CONSTRAINT tools_name_length CHECK (char_length(name) >= 3 AND char_length(name) <= 60),
  CONSTRAINT tools_url_format CHECK (url ~* '^https?://'),
  CONSTRAINT tools_display_order_positive CHECK (display_order >= 0),
  CONSTRAINT tools_category_fk FOREIGN KEY (category_id)
    REFERENCES public.categories(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_categories_active_order
  ON public.categories(is_active, display_order ASC)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_tools_category_id
  ON public.tools(category_id);

CREATE INDEX IF NOT EXISTS idx_tools_active_order
  ON public.tools(is_active, display_order ASC)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_tools_category_active
  ON public.tools(category_id, is_active);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER set_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_tools_updated_at
  BEFORE UPDATE ON public.tools
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- TAD §5 + SDD §1.15, §3.15, §4.15
-- ============================================================

-- CATEGORIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Lectura pública: solo categorías activas
CREATE POLICY "categories_public_read_active"
  ON public.categories
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Lectura admin: todas las categorías (activas e inactivas)
CREATE POLICY "categories_authenticated_read_all"
  ON public.categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Escritura admin: solo usuarios autenticados
CREATE POLICY "categories_authenticated_insert"
  ON public.categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "categories_authenticated_update"
  ON public.categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "categories_authenticated_delete"
  ON public.categories
  FOR DELETE
  TO authenticated
  USING (true);

-- TOOLS
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- Lectura pública: solo herramientas activas
CREATE POLICY "tools_public_read_active"
  ON public.tools
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Lectura admin: todas las herramientas
CREATE POLICY "tools_authenticated_read_all"
  ON public.tools
  FOR SELECT
  TO authenticated
  USING (true);

-- Escritura admin: solo usuarios autenticados
CREATE POLICY "tools_authenticated_insert"
  ON public.tools
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "tools_authenticated_update"
  ON public.tools
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "tools_authenticated_delete"
  ON public.tools
  FOR DELETE
  TO authenticated
  USING (true);
