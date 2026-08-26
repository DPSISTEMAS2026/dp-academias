import { fetchPublicJson } from './publicCache';

export type PublicAcademy = {
  marketing?: boolean;
  id?: number;
  slug?: string;
  name?: string;
  logoUrl?: string;
  color?: string;
  customDomain?: string;
};

export async function fetchPublicAcademy(apiUrl: string): Promise<PublicAcademy> {
  const data = await fetchPublicJson<PublicAcademy>(`${apiUrl}/api/public/academy`, 'academy');
  return data && typeof data === 'object' ? data : { marketing: true };
}

export function isTenantAcademy(a?: PublicAcademy | null): a is PublicAcademy & { id: number; slug: string; name: string } {
  return Boolean(a && !a.marketing && a.id && a.slug && a.name);
}
