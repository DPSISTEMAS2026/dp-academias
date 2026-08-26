import { dataUrlToBlob, compressFileToBlob } from './compressImage';

export async function uploadAcademyImage(apiUrl: string, blob: Blob, filename = 'foto.jpg') {
  const signRes = await fetch(`${apiUrl}/api/media/sign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename,
      kind: 'image',
      bytes: blob.size,
      contentType: blob.type || 'image/jpeg',
    }),
  });
  const signed = await signRes.json().catch(() => ({}));
  if (!signRes.ok) {
    throw new Error(signed.error || 'No se pudo pedir el upload a R2.');
  }
  const headers = new Headers(signed.headers || { 'Content-Type': blob.type || 'image/jpeg' });
  const up = await fetch(signed.uploadURL, {
    method: signed.method || 'PUT',
    headers,
    body: blob,
  });
  if (!up.ok) throw new Error('R2 rechazó la foto.');
  return String(signed.url);
}

export async function uploadAcademyDataUrl(apiUrl: string, dataUrl: string) {
  const blob = await dataUrlToBlob(dataUrl);
  return uploadAcademyImage(apiUrl, blob);
}

export async function uploadAcademyFile(apiUrl: string, file: File) {
  const blob = await compressFileToBlob(file, 720, 0.72);
  return uploadAcademyImage(apiUrl, blob, file.name.replace(/\.[^.]+$/, '') + '.jpg');
}
