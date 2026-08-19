-- Datos ficticios alineados a los mockups de DP Sistemas.
-- Ejecutar DESPUÉS de schema.sql.

insert into public.sedes (id, name, address, status) values
  (1, 'Sede Centro', 'Sede de ejemplo', 'Activa'),
  (2, 'Sede Norte', 'Sede de ejemplo', 'Activa'),
  (3, 'Sede Sur', 'Sede de ejemplo', 'Activa')
on conflict (id) do update set
  name = excluded.name,
  address = excluded.address,
  status = excluded.status;

select setval(pg_get_serial_sequence('public.sedes', 'id'), 3, true);

insert into public.admins (email, password_hash, role, sede_id) values
  ('contacto@dpsistemas.cl', 'admin123', 'superadmin', null)
on conflict (email) do update set
  password_hash = excluded.password_hash,
  role = excluded.role,
  sede_id = excluded.sede_id;

insert into public.students (
  id, name, email, password, phone, belt, classesattended, classestonextbelt,
  lastpaymentmonth, lastpaymentdate, ispaid, plan, monthlyfee, birthdate,
  history, scheduledclasses, joindate, lastgrade, graduationdate, sede_id,
  terms_accepted, weight, gender
) values
  (
    '1', 'Matías Soto', 'matias.soto@demo.cl', 'demo123', +1-555-0014',
    'WHITE', 34, 40, '2026-08', '2026-08-05', true, '3', 35000, '2008-03-12',
    '[{"date":"2026-08-05","status":"Completado","amount":35000,"method":"Transferencia","transaction_id":"1842"}]'::jsonb,
    '[]'::jsonb, '2025-01-10', '3 grados', '2025-01-10', 1, true, 68, 'MALE'
  ),
  (
    '2', 'Camila Rojas', 'camila.rojas@demo.cl', 'demo123', +1-555-0015',
    'BLUE', 22, 40, null, null, false, '2', 25000, '1999-11-04',
    '[]'::jsonb, '[]'::jsonb, '2024-06-01', '0 grados', '2025-06-20', 1, true, 62, 'FEMALE'
  ),
  (
    '3', 'Diego Pereira', 'diego.pereira@demo.cl', 'demo123', +1-555-0030',
    'WHITE', 18, 40, '2026-08', '2026-08-03', true, 'Ilimitado', 45000, '1995-07-22',
    '[{"date":"2026-08-03","status":"Completado","amount":45000,"method":"Mercado Pago","transaction_id":"1840"}]'::jsonb,
    '[]'::jsonb, '2025-03-01', '1er grado', '2025-03-01', 2, true, 80, 'MALE'
  ),
  (
    '4', 'Sofía Muñoz', 'sofia.munoz@demo.cl', 'demo123', +1-555-0034',
    'GRAY', 12, 30, '2026-08', '2026-08-01', true, '2', 25000, '2014-05-12',
    '[{"date":"2026-08-01","status":"Completado","amount":25000,"method":"Transferencia","transaction_id":"1833"}]'::jsonb,
    '[]'::jsonb, '2025-03-15', 'Blanco', '2025-03-15', 1, true, 42, 'FEMALE'
  )
on conflict (id) do update set
  name = excluded.name,
  email = excluded.email,
  password = excluded.password,
  ispaid = excluded.ispaid,
  plan = excluded.plan,
  monthlyfee = excluded.monthlyfee,
  sede_id = excluded.sede_id;

update public.students set ficha = jsonb_build_object(
  'tutorName', 'Daniela Muñoz',
  'tutorRelation', 'Madre',
  'tutorPhone', '+56987654321',
  'tutorEmail', 'daniela.munoz@demo.cl',
  'emergencyName', 'María Muñoz',
  'emergencyRelation', 'Abuela',
  'emergencyPhone', '+56955550004',
  'allergies', 'Ninguna',
  'discipline', 'Jiu Jitsu Kids'
) where id = '4';

insert into public.news (id, title, body, img, link, label, date, stats, sede_id) values
  (
    1,
    'Torneo Interacademias: 120 cupos abiertos',
    'Inscribe a tus alumnos o invita a otras academias. Categorías por edad, peso y grado, con pago de inscripción en línea.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
    null,
    'Eventos',
    '24 Oct, 2026',
    '[{"label":"Cupos","text":"120"},{"label":"Inscripción","text":"$15.000"},{"label":"Sede","text":"Centro"}]'::jsonb,
    1
  ),
  (
    2,
    'Nuevo horario de Jiu Jitsu y Kickboxing',
    'Cambias horarios y cupos en el panel: el horario se actualiza y queda listo para una historia de Instagram.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
    null,
    'Horarios',
    '18 Ago, 2026',
    '[{"label":"Sedes","text":"3"},{"label":"Disciplinas","text":"BJJ · KB · MMA"}]'::jsonb,
    1
  ),
  (
    3,
    'Biblioteca técnica: Armbar desde guardia',
    'Publica videos y PDFs por cinturón. El alumno ve progreso y el profesor hace seguimiento.',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200',
    null,
    'Material',
    '12 Ago, 2026',
    '[{"label":"Formato","text":"Video"},{"label":"Grados","text":"Blanco y Azul"}]'::jsonb,
    1
  )
on conflict (id) do update set title = excluded.title, body = excluded.body, img = excluded.img;

delete from public.students where id not in ('1', '2', '3', '4');
update public.students set avatar = '/mascota-dp.png';
update public.sedes set mp_access_token = null, mp_public_key = null;
delete from public.admins where email <> 'contacto@dpsistemas.cl';

delete from public.gallery;
insert into public.gallery (img, size, sede_id) values
  ('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200', 'large', 1),
  ('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'small', 1),
  ('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800', 'small', 1),
  ('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 'tall', 1),
  ('https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'wide', 1);

insert into public.videos (id, title, description, url, thumbnail, beltlevel, category, sede_id) values
  (
    'v1',
    'Armbar desde guardia',
    'Técnica base de Jiu Jitsu para cinturón blanco y azul.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    'WHITE',
    'Técnicas',
    1
  )
on conflict (id) do update set thumbnail = excluded.thumbnail;

insert into public.events (
  id, slug, title, description, photo, rules_url, rules_name,
  event_date, start_time, end_time, address, capacity, paid, price, status, categories
) values (
  'ev1',
  'torneo-interacademias',
  'Torneo Interacademias',
  'Este es un evento de ejemplo. Alumnos e invitados se inscriben aquí. El pago entra por Mercado Pago: la pasarela confirma el cobro y deja inscrito a quien pagó.',
  'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1600',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'Bases Torneo Interacademias.pdf',
  '2026-10-24', '09:00', '18:00', 'Sede de ejemplo', 120, true, 15000, 'published',
  '[
    {"id":"c-kids","name":"Kids","minAge":6,"maxAge":15,"minWeight":null,"maxWeight":null,"gender":"ANY","belts":["GRAY","WHITE"],"price":10000},
    {"id":"c-white","name":"Adulto blanco","minAge":16,"maxAge":99,"minWeight":null,"maxWeight":null,"gender":"ANY","belts":["WHITE"],"price":15000},
    {"id":"c-blue","name":"Adulto azul","minAge":16,"maxAge":99,"minWeight":null,"maxWeight":null,"gender":"ANY","belts":["BLUE"],"price":15000},
    {"id":"c-fem","name":"Femenino","minAge":12,"maxAge":99,"minWeight":null,"maxWeight":null,"gender":"FEMALE","belts":[],"price":15000}
  ]'::jsonb
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  photo = excluded.photo,
  status = excluded.status,
  categories = excluded.categories,
  event_date = excluded.event_date,
  address = excluded.address;

insert into public.event_registrations (
  id, event_id, kind, student_id, name, email, phone, document_id, birth_date, age, weight, gender, belt, academy,
  category_id, category_name, amount, status, method
) values
  ('er1', 'ev1', 'student', '1', 'Matías Soto', 'matias.soto@demo.cl', '+56911111111', '20.111.111-1', '2008-03-12', 18, 68, 'MALE', 'WHITE', 'Academia Demo', 'Adulto • Cinturón Blanco • Masculino • Feather / Pena (≤ 70.00 kg)', 'Adulto • Cinturón Blanco • Masculino • Feather / Pena (≤ 70.00 kg)', 15000, 'paid', 'Transferencia'),
  ('er2', 'ev1', 'student', '2', 'Camila Rojas', 'camila.rojas@demo.cl', '+56922222222', '15.222.222-2', '1999-11-04', 26, 62, 'FEMALE', 'BLUE', 'Academia Demo', 'Adulto • Cinturón Azul • Femenino • Light / Leve (≤ 64.00 kg)', 'Adulto • Cinturón Azul • Femenino • Light / Leve (≤ 64.00 kg)', 15000, 'pending', 'Transferencia'),
  ('er3', 'ev1', 'guest', null, 'Lucas Herrera', 'lucas.herrera@otra.cl', '+56944444444', '12.333.333-3', '1998-06-20', 28, 76, 'MALE', 'WHITE', 'Academia Cordillera', 'Adulto • Cinturón Blanco • Masculino • Light / Leve (≤ 76.00 kg)', 'Adulto • Cinturón Blanco • Masculino • Light / Leve (≤ 76.00 kg)', 15000, 'paid', 'Transferencia')
on conflict (id) do update set status = excluded.status, category_name = excluded.category_name;

select setval('news_id_seq', (select coalesce(max(id), 1) from public.news));
