# DP Sistemas y Automatizaciones — Plataforma para academias

Software de gestión para academias: alumnos, mensualidades, horarios, asistencia, eventos y sitio público. Multi-tenant (`academia_id`).

- Producto: [academias.dpsistemas.cl](https://academias.dpsistemas.cl)
- Empresa: [dpsistemas.cl](https://dpsistemas.cl)

## Arranque local

1. Copia `.env.example` a `.env` y completa las variables del **proyecto de producto** (Supabase, `JWT_SECRET`, R2). No commitees `.env`.
2. Instala y levanta:

```bash
npm run install-all
npm run dev
```

Cliente: http://localhost:5173  
API: http://localhost:3002

La API solo arranca contra el proyecto de producto. Si `SUPABASE_URL` apunta a otro, se niega a partir.

### Acceso de demostración (academia DPDEMO)

| Rol    | Correo                 | Clave    |
|--------|------------------------|----------|
| Admin  | contacto@dpsistemas.cl | admin26  |
| Alumno | contacto@dpsistemas.cl | alumno26 |

En `academias.dpsistemas.cl/acceso` entra esa academia demo. Un dominio propio (`tuacademia.cl`) entra a esa academia.

## Qué incluye

- Panel de administración y vista de alumno
- Landing comercial de DP (Plan Academia)
- Sitio público de cada academia (noticias, horario, galería)
- Fotos en Cloudflare R2 (no en Postgres)

Alta de una academia nueva: `POST /api/internal/academias` con `INTERNAL_KEY`.
