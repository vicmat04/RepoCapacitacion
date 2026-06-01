-- ============================================================
-- Seed data — Facilitadores Control Center DEV
-- Datos de demostración para desarrollo local
-- TAD §4 — Folder Structure (supabase/seed.sql)
-- ============================================================

-- Categorías de ejemplo
INSERT INTO public.categories (id, name, slug, icon, display_order, is_active)
VALUES
  (
    'a1b2c3d4-0001-0001-0001-000000000001',
    'Capacitación',
    'capacitacion',
    'GraduationCap',
    1,
    true
  ),
  (
    'a1b2c3d4-0001-0001-0001-000000000002',
    'Reportes',
    'reportes',
    'BarChart2',
    2,
    true
  ),
  (
    'a1b2c3d4-0001-0001-0001-000000000003',
    'Gestión',
    'gestion',
    'ClipboardList',
    3,
    true
  ),
  (
    'a1b2c3d4-0001-0001-0001-000000000004',
    'Comunicación',
    'comunicacion',
    'Megaphone',
    4,
    false -- inactiva: para probar que no aparece en el portal
  )
ON CONFLICT (slug) DO NOTHING;

-- Herramientas de ejemplo
INSERT INTO public.tools (name, description, url, icon, category_id, display_order, is_active, opens_new_tab)
VALUES
  (
    'Portal de Capacitaciones',
    'Sistema de gestión de capacitaciones y cursos para facilitadores AIP',
    'https://capacitaciones.infoplazas.gob.pa',
    'BookOpen',
    'a1b2c3d4-0001-0001-0001-000000000001',
    1,
    true,
    true
  ),
  (
    'Moodle Infoplazas',
    'Plataforma LMS para cursos en línea y material formativo',
    'https://moodle.infoplazas.gob.pa',
    'GraduationCap',
    'a1b2c3d4-0001-0001-0001-000000000001',
    2,
    true,
    true
  ),
  (
    'Panel de Reportes',
    'Dashboard de indicadores y métricas operativas del programa',
    'https://reportes.infoplazas.gob.pa',
    'BarChart2',
    'a1b2c3d4-0001-0001-0001-000000000002',
    1,
    true,
    true
  ),
  (
    'Sistema de Gestión',
    'Herramienta principal de gestión administrativa de Infoplazas AIP',
    'https://sistema.infoplazas.gob.pa',
    'Settings',
    'a1b2c3d4-0001-0001-0001-000000000003',
    1,
    true,
    true
  ),
  (
    'Herramienta Inactiva',
    'Esta herramienta está deshabilitada — no debe aparecer en el portal',
    'https://inactiva.infoplazas.gob.pa',
    'Monitor',
    'a1b2c3d4-0001-0001-0001-000000000003',
    99,
    false, -- inactiva: valida AC 1.3
    true
  )
ON CONFLICT (name) DO NOTHING;
