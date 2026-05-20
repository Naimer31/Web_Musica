-- ============================================================
-- COMPLETAR tabla "Lessons" (mayúscula) en Supabase
-- Esta tabla fue creada manualmente y solo tiene id + created_at
-- Ejecuta en: Supabase > SQL Editor > New Query
-- ============================================================

-- PASO 1: Agregar todas las columnas que faltan a "Lessons"
ALTER TABLE public."Lessons"
  ADD COLUMN IF NOT EXISTS title          TEXT NOT NULL DEFAULT 'Sin título',
  ADD COLUMN IF NOT EXISTS description    TEXT,
  ADD COLUMN IF NOT EXISTS course_id      UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS teacher_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS student_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS scheduled_at   TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60,
  ADD COLUMN IF NOT EXISTS is_completed   BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS meeting_url    TEXT,
  ADD COLUMN IF NOT EXISTS notes          TEXT,
  ADD COLUMN IF NOT EXISTS rating         INTEGER CHECK (rating BETWEEN 1 AND 5);

-- PASO 2: Habilitar RLS (Row Level Security)
ALTER TABLE public."Lessons" ENABLE ROW LEVEL SECURITY;

-- PASO 3: Políticas de seguridad
-- Usuarios autenticados pueden ver las lecciones
CREATE POLICY "Lecciones visibles para autenticados"
  ON public."Lessons" FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Profesores pueden crear sus lecciones
CREATE POLICY "Profesores crean lecciones"
  ON public."Lessons" FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

-- Profesores editan sus propias lecciones
CREATE POLICY "Profesores editan sus lecciones"
  ON public."Lessons" FOR UPDATE
  USING (auth.uid() = teacher_id);

-- Admins pueden hacer todo
CREATE POLICY "Admins gestionan todas las lecciones"
  ON public."Lessons" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- PASO 4: Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_lessons_course    ON public."Lessons"(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_teacher   ON public."Lessons"(teacher_id);
CREATE INDEX IF NOT EXISTS idx_lessons_student   ON public."Lessons"(student_id);
CREATE INDEX IF NOT EXISTS idx_lessons_scheduled ON public."Lessons"(scheduled_at);

-- ============================================================
-- OPCIONAL: Insertar lecciones de ejemplo para probar
-- Reemplaza los UUIDs con los reales de tus cursos/profesores
-- ============================================================
-- INSERT INTO public."Lessons" (title, description, course_id, teacher_id, scheduled_at, duration_minutes)
-- SELECT 
--   'Clase 1: Introducción al Piano',
--   'Primera sesión: postura, escalas de Do Mayor y técnica básica.',
--   c.id,
--   c.teacher_id,
--   NOW() + INTERVAL '1 day',
--   60
-- FROM public.courses c
-- WHERE c.instrument = 'piano'
-- LIMIT 1;

-- ============================================================
-- VERIFICAR: Ver la tabla completa
-- ============================================================
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'Lessons' AND table_schema = 'public'
-- ORDER BY ordinal_position;
