-- ============================================================
-- DATOS DE EJEMPLO — Virtuoso Academy
-- Ejecuta DESPUÉS de registrar al menos 1 usuario real
-- ============================================================

-- PASO 1: Promover al primer usuario como ADMIN
-- Reemplaza 'TU_USER_ID' con el UUID de tu usuario de Supabase
-- Lo encuentras en: Authentication > Users > copia el UUID

-- UPDATE public.profiles 
-- SET role = 'admin', full_name = 'Admin Principal'
-- WHERE id = 'TU_USER_ID';

-- ============================================================
-- PASO 2: Insertar cursos de ejemplo en la DB
-- ============================================================
INSERT INTO public.courses (title, description, instrument, level, price, duration_weeks, max_students, is_active)
VALUES
  ('Maestría en Piano Clásico', 'Inmersión profunda en técnicas del romanticismo. Chopin, Liszt y técnica avanzada de pedal.', 'piano', 'intermediate', 450.00, 16, 8, true),
  ('Guitarra Eléctrica Contemporánea', 'Domina el diapasón con blues moderno y jazz fusión. Técnicas de improvisación.', 'guitar', 'beginner', 380.00, 12, 10, true),
  ('Improvisación Vocal y Jazz', 'Perfecciona tu textura vocal y scatting. Trabaja con vocalistas profesionales.', 'vocals', 'advanced', 520.00, 20, 6, true),
  ('Teoría Musical Aplicada', 'Desde notación básica hasta análisis armónico y orquestación completa.', 'theory', 'all', 300.00, 8, 15, true),
  ('Cello Orquestal', 'Tono sonoro y precisión en arco. Repertorio solista y orquestal.', 'cello', 'intermediate', 480.00, 16, 6, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- PASO 3: Después de tener profesores registrados,
-- asignarlos a los cursos:
-- UPDATE public.courses SET teacher_id = 'UUID_DEL_PROFESOR' WHERE instrument = 'piano';

-- PASO 4: Inscribir estudiantes a cursos (ejemplo):
-- INSERT INTO public.enrollments (course_id, student_id, progress_percent, status)
-- SELECT c.id, 'UUID_DEL_ESTUDIANTE', 45, 'active'
-- FROM public.courses c WHERE c.instrument = 'piano'
-- ON CONFLICT DO NOTHING;

-- ============================================================
-- VERIFICAR: Ver todos los perfiles y sus roles
-- ============================================================
-- SELECT id, full_name, email, role FROM public.profiles ORDER BY role;
-- SELECT title, instrument, level FROM public.courses;
-- SELECT * FROM public.enrollments;
