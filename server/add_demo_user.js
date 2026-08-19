import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_PASS = 'admin26';
const STUDENT_PASS = 'alumno26';

function nameFromEmail(email) {
    const local = String(email).split('@')[0].replace(/[._-]+/g, ' ').trim();
    return local.replace(/\b\w/g, (c) => c.toUpperCase()) || 'Alumno Demo';
}

async function nextStudentId() {
    const { data } = await supabase.from('students').select('id');
    const taken = (data || []).map((e) => parseInt(e.id, 10)).filter((n) => !Number.isNaN(n));
    let n = 1;
    while (taken.includes(n)) n += 1;
    return String(n);
}

async function upsertAdmin(email) {
    const { data: existing, error } = await supabase.from('admins').select('*').eq('email', email).maybeSingle();
    if (error) throw error;
    if (existing) {
        const { error: upd } = await supabase.from('admins')
            .update({ password_hash: ADMIN_PASS, role: 'superadmin', sede_id: null })
            .eq('id', existing.id);
        if (upd) throw upd;
        console.log(`Admin actualizado: ${email} / ${ADMIN_PASS}`);
        return;
    }
    const { error: ins } = await supabase.from('admins').insert({
        email,
        password_hash: ADMIN_PASS,
        role: 'superadmin',
        sede_id: null,
    });
    if (ins) throw ins;
    console.log(`Admin creado: ${email} / ${ADMIN_PASS}`);
}

async function upsertStudent(email) {
    const name = nameFromEmail(email);
    const ficha = {
        tutorName: 'Tutor Demo',
        tutorEmail: email,
        tutorPhone: '+56987654321',
        tutorRelation: 'Madre',
        emergencyName: 'Contacto de emergencia',
        emergencyPhone: '+56911112222',
        emergencyRelation: 'Padre',
        allergies: 'Ninguna',
        discipline: 'Jiu Jitsu',
    };
    const row = {
        name,
        email,
        password: STUDENT_PASS,
        phone: '+56912345678',
        belt: 'WHITE',
        classesattended: 12,
        classestonextbelt: 40,
        lastpaymentmonth: '2026-08',
        lastpaymentdate: '2026-08-05',
        ispaid: true,
        plan: '3',
        monthlyfee: 35000,
        birthdate: '1998-05-14',
        history: [{ date: '2026-08-05', status: 'Completado', amount: 35000 }],
        scheduledclasses: [],
        joindate: '2025-03-01',
        lastgrade: 'Blanco',
        graduationdate: '2025-03-01',
        sede_id: 1,
        terms_accepted: true,
        weight: 72,
        gender: 'MALE',
        ficha,
    };

    const { data: existing, error } = await supabase.from('students').select('id').ilike('email', email).limit(1).maybeSingle();
    if (error) throw error;
    if (existing) {
        const { error: upd } = await supabase.from('students').update(row).eq('id', existing.id);
        if (upd) throw upd;
        console.log(`Alumno actualizado (${existing.id}): ${email} / ${STUDENT_PASS} · ${name}`);
        return;
    }
    const id = await nextStudentId();
    const { error: ins } = await supabase.from('students').insert({ id, ...row });
    if (ins) throw ins;
    console.log(`Alumno creado (${id}): ${email} / ${STUDENT_PASS} · ${name}`);
}

async function run() {
    const email = (process.env.CONTACT_EMAIL || process.argv[2] || '').trim().toLowerCase();
    if (!email || !email.includes('@')) {
        console.error('Uso: CONTACT_EMAIL=correo@dominio.cl node add_demo_user.js');
        process.exit(1);
    }
    if (!supabaseUrl || /qbimxygcjjmosifsqbko|xtcxbxvbtxnmuaylrhmr/.test(supabaseUrl)) {
        console.error('Refusing: falta SUPABASE_URL o apunta a Ranas.');
        process.exit(1);
    }
    await upsertAdmin(email);
    await upsertStudent(email);
}

run().catch((e) => {
    console.error(e);
    process.exit(1);
});
