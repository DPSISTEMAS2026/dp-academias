# DP Sistemas y Automatizaciones — Demo de plataforma para academias

Clon de la plataforma de gestión (origen: Dojo Las Ranas) para **mostrar el producto a otros clientes**. No usa la base ni los alumnos de producción.

- Marca: **DP Sistemas y Automatizaciones**
- Academia de muestra: **Academia Demo** (sedes Centro, Norte y Sur)
- Landing de producto → login de la demo

## Arranque local

### 1. Base de datos nueva (obligatorio)

**No uses estos proyectos** (ya existen y no son la demo):

| Proyecto | URL | Qué es |
|---|---|---|
| DOJO RANAS | `qbimxygcjjmosifsqbko.supabase.co` | Producción del dojo, no se toca |
| Copia / backup | `xtcxbxvbtxnmuaylrhmr.supabase.co` | Respaldo de Ranas, no tocar |
| Demo DP Sistemas | `ydbefwfqkimznydpybss.supabase.co` | Este repo |
| DEMOACADEMIAS (viejo) | `prihphytqvpkrrwptali.supabase.co` | Over quota; no usar |

1. Crea un **proyecto nuevo** en [Supabase](https://supabase.com) (si la org Academias está over quota, usa **otra organización**). No uses:
   - `qbimxygcjjmosifsqbko` (Las Ranas)
   - `xtcxbxvbtxnmuaylrhmr` (backup)
   - `prihphytqvpkrrwptali` (DEMOACADEMIAS viejo)
2. Copia `.env.example` a `.env` y pega `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_DB_PASSWORD` del proyecto nuevo.
3. Crea las tablas y el seed:

```bash
npm run migrate-demo
```

O en SQL Editor, en este orden: `supabase/schema.sql` y luego el seed de `server/migrate_demo.js`.

### 2. Servidor y cliente

```bash
npm run install-all
npm run dev
```

Cliente: http://localhost:5173  
API: http://localhost:3002

### Accesos de la demo

| Rol    | Correo                    | Clave    |
|--------|---------------------------|----------|
| Admin  | contacto@dpsistemas.cl    | admin123 |
| Alumno | matias.soto@demo.cl       | demo123  |

## Qué hay en este repo

- Panel admin + app de alumno (el sistema clonado)
- Landing comercial de DP Sistemas (no el sitio de una academia real)
- Datos ficticios (Matías, Camila, Diego, Sofía)
- Paleta y logo DP

Los mockups en `MOCKUPS/` son la referencia visual de módulos (horarios, cupos, material, eventos, QR, apoderados, reportes, sitio público). Se van implementando sobre esta base.
