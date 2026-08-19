/** Identidad alineada a dpsistemas.cl */

export function asset(path: string) {
  const base = import.meta.env.BASE_URL || '/';
  const clean = path.replace(/^\//, '');
  return `${base}${clean}`;
}

export function appPath(path: string) {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

export const BRAND = {
  company: 'DP Sistemas y Automatizaciones',
  companyShort: 'DP Sistemas',
  academy: 'Academia Demo',
  shortName: 'DP',
  product: 'Plataforma de gestión a medida para academias',
  url: 'https://dpsistemas.cl',
  email: 'contacto@dpsistemas.cl',
  whatsapp: '56974342276',
  whatsappMessage: 'quisiera acceder al demo de academias',
  instagram: 'https://dpsistemas.cl',
  logo: asset('logo-dp.png'),
  logoLight: asset('logo-dp-on-white.png'),
  logoMark: asset('logo-dp-icon.png'),
  mascot: asset('mascota-dp.png'),
  mascotGuide: asset('mascota-dp-guia.png'),
  mascotAvatar: asset('mascota-dp-avatar.png'),
  icon: asset('icon-512.png'),
  mpLogo: asset('mercadopago.svg'),
  mpLogoWhite: asset('mercadopago-white.svg'),
  mpLogoMark: asset('mercadopago-mark.svg'),
  mpNavy: '#0a0080',
  color: '#006970',
  teal: '#006970',
  ink: '#050811',
  demoAdmin: { email: 'contacto@dpsistemas.cl', password: 'admin123' },
  demoStudent: { email: 'matias.soto@demo.cl', password: 'demo123' },
} as const;

export function whatsappHref(message = BRAND.whatsappMessage) {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function avatarSrc(avatar?: string | null, apiUrl = '') {
  if (!avatar || avatar === BRAND.mascot || avatar.endsWith('mascota-dp.png')) return BRAND.mascotAvatar;
  if (avatar.startsWith('http') || avatar.startsWith('data:') || avatar.includes('/mascota') || avatar.includes('/logo')) return avatar;
  return apiUrl ? `${apiUrl}${avatar}` : avatar;
}
