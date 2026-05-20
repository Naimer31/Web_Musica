-- ============================================================
-- VIRTUOSO ACADEMY - Tablas Adicionales v2
-- Ejecutar en: Supabase > SQL Editor > New Query
-- ============================================================

-- 4. Tabla de Cursos (Courses)
-- Catálogo completo de programas de estudio
CREATE TABLE public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instrument TEXT,                          -- piano, violin, guitar, vocals, etc.
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all')) DEFAULT 'all',
  price NUMERIC(10,2),
  duration_weeks INTEGER,                   -- duración en semanas
  max_students INTEGER DEFAULT 10,
  teacher_id UUID REFERENCES public.profiles(id),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cursos visibles para todos" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Solo admins/profesores pueden crear cursos" ON public.courses FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);
CREATE POLICY "Solo admins/profesores pueden editar cursos" ON public.courses FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- 5. Tabla de Inscripciones a Cursos (Enrollments)
-- Registro de qué estudiantes están en qué cursos
CREATE TABLE public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('active', 'completed', 'dropped')) DEFAULT 'active',
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW()) NOT NULL,
  UNIQUE(course_id, student_id)
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Estudiantes ven sus inscripciones" ON public.enrollments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Profesores ven inscripciones de sus cursos" ON public.enrollments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND teacher_id = auth.uid())
);
CREATE POLICY "Estudiantes pueden inscribirse" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Estudiantes pueden cancelar su inscripción" ON public.enrollments FOR UPDATE USING (auth.uid() = student_id);

-- 6. Tabla de Solicitudes de Matrícula (Admission Requests)
-- Formulario del front-end /enroll
CREATE TABLE public.admission_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  instrument TEXT,
  experience TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  notes TEXT,                               -- notas del admin
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.admission_requests ENABLE ROW LEVEL SECURITY;
-- Cualquiera puede enviar una solicitud (no necesita estar autenticado)
CREATE POLICY "Cualquiera puede enviar solicitud" ON public.admission_requests FOR INSERT WITH CHECK (true);
-- Solo admins pueden ver y gestionar solicitudes
CREATE POLICY "Solo admins ven solicitudes" ON public.admission_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Solo admins pueden actualizar solicitudes" ON public.admission_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 7. Tabla de Progreso del Estudiante (Student Progress)
CREATE TABLE public.student_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  teacher_id UUID REFERENCES public.profiles(id),
  notes TEXT,                               -- observaciones del profesor
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Estudiantes ven su propio progreso" ON public.student_progress FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Profesores pueden registrar progreso" ON public.student_progress FOR INSERT WITH CHECK (auth.uid() = teacher_id);
CREATE POLICY "Profesores pueden actualizar progreso" ON public.student_progress FOR UPDATE USING (auth.uid() = teacher_id);

-- 8. Tabla de Noticias / Eventos (Posts)
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT CHECK (type IN ('news', 'event', 'recital')) DEFAULT 'news',
  event_date TIMESTAMP WITH TIME ZONE,
  author_id UUID REFERENCES public.profiles(id),
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts publicados visibles para todos" ON public.posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admins ven todos los posts" ON public.posts FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins pueden crear/editar posts" ON public.posts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- ÍNDICES para mejor rendimiento
-- ============================================================
CREATE INDEX idx_courses_instrument ON public.courses(instrument);
CREATE INDEX idx_courses_level ON public.courses(level);
CREATE INDEX idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX idx_admission_requests_status ON public.admission_requests(status);
CREATE INDEX idx_progress_student ON public.student_progress(student_id);
CREATE INDEX idx_posts_type ON public.posts(type);

-- ============================================================
-- Actualizar tabla de profiles: agregar campo bio y phone
-- ============================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW());
