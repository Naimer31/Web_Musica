-- ============================================================
-- VIRTUOSO ACADEMY — Fix for Lessons Table
-- Ejecuta esto en: Supabase > SQL Editor > New Query
-- ============================================================

-- 1. Añadir la columna student_id a la tabla lessons (si no existe)
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES public.profiles(id);

-- 2. Actualizar las políticas para que los estudiantes puedan reservar y ver sus clases
DROP POLICY IF EXISTS "Profesores/admins crean lecciones" ON public.lessons;
CREATE POLICY "Profesores/admins crean lecciones" ON public.lessons FOR INSERT WITH CHECK (auth.uid() = teacher_id OR auth.uid() = student_id);

DROP POLICY IF EXISTS "Profesores/admins editan lecciones" ON public.lessons;
CREATE POLICY "Profesores/admins editan lecciones" ON public.lessons FOR UPDATE USING (auth.uid() = teacher_id OR auth.uid() = student_id);

-- Opcional: Asegurarnos de que el esquema está en su lugar para la vista si hubo algún problema con el id del estudiante
