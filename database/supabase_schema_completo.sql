CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
  full_name TEXT,
  avatar_url TEXT,
  instrument TEXT,
  level TEXT NOT NULL DEFAULT 'beginner',
  bio TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: public select"
ON public.profiles FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "profiles: user update own row"
ON public.profiles FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);


-- ========================
-- 2) TRIGGER AUTO-PERFIL
-- ========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ========================
-- 3) LESSONS (Clases)
-- ========================
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  max_students INTEGER NOT NULL DEFAULT 1 CHECK (max_students >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_time >= start_time)
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lessons: public select"
ON public.lessons FOR SELECT TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS lessons_teacher_id_idx ON public.lessons(teacher_id);


-- ========================
-- 4) BOOKINGS (Reservas)
-- ========================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id),
  student_id UUID NOT NULL REFERENCES public.profiles(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (lesson_id, student_id)
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookings: user select own"
ON public.bookings FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = student_id);

CREATE POLICY "bookings: user insert own"
ON public.bookings FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = student_id);

CREATE INDEX IF NOT EXISTS bookings_lesson_id_idx ON public.bookings(lesson_id);
CREATE INDEX IF NOT EXISTS bookings_student_id_idx ON public.bookings(student_id);


-- ========================
-- 5) COURSES (Cursos)
-- ========================
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instrument TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all')) DEFAULT 'all',
  price NUMERIC(10,2),
  duration_weeks INTEGER,
  max_students INTEGER DEFAULT 10,
  teacher_id UUID REFERENCES public.profiles(id),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "courses: public select"
ON public.courses FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "courses: admin/teacher insert"
ON public.courses FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

CREATE POLICY "courses: admin/teacher update"
ON public.courses FOR UPDATE TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

CREATE INDEX IF NOT EXISTS courses_instrument_idx ON public.courses(instrument);
CREATE INDEX IF NOT EXISTS courses_level_idx ON public.courses(level);


-- ========================
-- 6) ENROLLMENTS (Inscripciones a cursos)
-- ========================
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('active', 'completed', 'dropped')) DEFAULT 'active',
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(course_id, student_id)
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "enrollments: student select own"
ON public.enrollments FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = student_id);

CREATE POLICY "enrollments: teacher select their courses"
ON public.enrollments FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND teacher_id = auth.uid())
);

CREATE POLICY "enrollments: student insert own"
ON public.enrollments FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = student_id);

CREATE INDEX IF NOT EXISTS enrollments_student_idx ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS enrollments_course_idx ON public.enrollments(course_id);


-- ========================
-- 7) ADMISSION REQUESTS (Formulario /enroll del sitio)
-- ========================
CREATE TABLE public.admission_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  instrument TEXT,
  experience TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admission_requests ENABLE ROW LEVEL SECURITY;

-- Cualquier visitante puede enviar su solicitud
CREATE POLICY "admission: anyone insert"
ON public.admission_requests FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Solo admins gestionan las solicitudes
CREATE POLICY "admission: admin select"
ON public.admission_requests FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "admission: admin update"
ON public.admission_requests FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS admission_status_idx ON public.admission_requests(status);


-- ========================
-- 8) STUDENT PROGRESS (Progreso del alumno)
-- ========================
CREATE TABLE public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  teacher_id UUID REFERENCES public.profiles(id),
  notes TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "progress: student select own"
ON public.student_progress FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = student_id);

CREATE POLICY "progress: teacher insert"
ON public.student_progress FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = teacher_id);

CREATE POLICY "progress: teacher update"
ON public.student_progress FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = teacher_id);

CREATE INDEX IF NOT EXISTS progress_student_idx ON public.student_progress(student_id);


-- ========================
-- 9) POSTS (Noticias y Eventos)
-- ========================
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  type TEXT CHECK (type IN ('news', 'event', 'recital')) DEFAULT 'news',
  event_date TIMESTAMPTZ,
  author_id UUID REFERENCES public.profiles(id),
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts: public select published"
ON public.posts FOR SELECT TO anon, authenticated USING (is_published = true);

CREATE POLICY "posts: admin select all"
ON public.posts FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "posts: admin all"
ON public.posts FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS posts_type_idx ON public.posts(type);
CREATE INDEX IF NOT EXISTS posts_published_idx ON public.posts(is_published);
