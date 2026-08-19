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
| DOJO RANAS | `qbimxygcjjmosifsqbko.supabase.co` | Producción, en uso |
| Copia / backup | `xtcxbxvbtxnmuaylrhmr.supabase.co` | Respaldo, no tocar |
| Demo DP Sistemas | `prihphytqvpkrrwptali.supabase.co` | Este repo |

1. Crea un **tercer** proyecto en [Supabase](https://supabase.com), por ejemplo `dp-sistemas-demo`.
2. Copia `.env.example` a `.env` y pega `SUPABASE_URL` y `SUPABASE_ANON_KEY` de ese proyecto nuevo.
3. En SQL Editor ejecuta, en este orden:
   - `supabase/schema.sql`
   - `supabase/seed.sql`

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
