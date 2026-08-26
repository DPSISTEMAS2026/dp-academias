/** Evita guardar fotos en Postgres como PNG/base64 de varios MB (eso reventó el Free). */

export function compressDataUrl(dataUrl: string, maxSize = 480, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas'));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Imagen inválida'));
    img.src = dataUrl;
  });
}

export function compressImageFile(file: File, maxSize = 480, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      compressDataUrl(String(reader.result || ''), maxSize, quality).then(resolve).catch(reject);
    };
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.readAsDataURL(file);
  });
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

const MAX_UPLOAD_BYTES = 400 * 1024;

export async function compressFileToBlob(file: File, maxSize = 720, quality = 0.72): Promise<Blob> {
  let size = maxSize;
  let q = quality;
  for (let i = 0; i < 5; i++) {
    const dataUrl = await compressImageFile(file, size, q);
    const blob = await dataUrlToBlob(dataUrl);
    if (blob.size <= MAX_UPLOAD_BYTES) return blob;
    q = Math.max(0.4, q - 0.12);
    size = Math.max(256, Math.round(size * 0.8));
  }
  throw new Error('La foto sigue pesando más de 400 KB. Usa otra más liviana.');
}
