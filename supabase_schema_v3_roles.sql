-- ============================================================
-- VIRTUOSO ACADEMY — Schema Roles v3
-- Ejecuta esto en: Supabase > SQL Editor > New Query
-- ============================================================

-- Asegura que profiles tiene columna 'instrument' y 'avatar_url'
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS instrument TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Tabla de Clases/Lecciones (Lessons)
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.profiles(id),
  student_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 60,
  is_completed BOOLEAN DEFAULT false,
  meeting_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Lecciones visibles autenticados" ON public.lessons FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY IF NOT EXISTS "Profesores/admins crean lecciones" ON public.lessons FOR INSERT WITH CHECK (auth.uid() = teacher_id OR auth.uid() = student_id);
CREATE POLICY IF NOT EXISTS "Profesores/admins editan lecciones" ON public.lessons FOR UPDATE USING (auth.uid() = teacher_id OR auth.uid() = student_id);

-- Tabla de progreso por lección (para % real)
CREATE TABLE IF NOT EXISTS public.lesson_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  notes TEXT,
  UNIQUE(lesson_id, student_id)
);

ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Estudiantes ven sus completadas" ON public.lesson_completions FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY IF NOT EXISTS "Profesores ven completadas de sus clases" ON public.lesson_completions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.lessons WHERE id = lesson_id AND teacher_id = auth.uid())
);
CREATE POLICY IF NOT EXISTS "Profesores marcan completadas" ON public.lesson_completions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.lessons WHERE id = lesson_id AND teacher_id = auth.uid())
);

-- Agregar progress_percent a enrollments
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS progress_percent INTEGER DEFAULT 0;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE;

-- Políticas admin para ver todo
CREATE POLICY IF NOT EXISTS "Admins ven todas las inscripciones" ON public.enrollments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY IF NOT EXISTS "Admins ven todos los perfiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY IF NOT EXISTS "Profesores ven sus inscripciones" ON public.enrollments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND teacher_id = auth.uid())
);

-- Vista para progreso del estudiante
CREATE OR REPLACE VIEW public.student_course_progress AS
SELECT 
  e.student_id,
  e.course_id,
  e.progress_percent,
  e.status,
  e.enrolled_at,
  c.title AS course_title,
  c.instrument,
  c.level,
  c.teacher_id,
  p.full_name AS teacher_name,
  COUNT(l.id) AS total_lessons,
  COUNT(lc.id) AS completed_lessons
FROM public.enrollments e
JOIN public.courses c ON e.course_id = c.id
LEFT JOIN public.profiles p ON c.teacher_id = p.id
LEFT JOIN public.lessons l ON l.course_id = c.id
LEFT JOIN public.lesson_completions lc ON lc.lesson_id = l.id AND lc.student_id = e.student_id
GROUP BY e.student_id, e.course_id, e.progress_percent, e.status, e.enrolled_at,
         c.title, c.instrument, c.level, c.teacher_id, p.full_name;