import { randomUUID } from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/** Tope duro bajo los 10 GB gratis de R2. Cloudflare NO corta el cobro; lo cortamos nosotros. */
export const DEFAULT_GLOBAL_MAX_BYTES = 8_000_000_000;
export const DEFAULT_MAX_FILE_BYTES = 400 * 1024;

export function r2Configured() {
  return Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID
    && process.env.R2_ACCESS_KEY_ID
    && process.env.R2_SECRET_ACCESS_KEY
    && process.env.R2_BUCKET
    && process.env.R2_PUBLIC_BASE,
  );
}

export function globalMaxBytes() {
  const n = Number(process.env.R2_MAX_BYTES);
  return Number.isFinite(n) && n > 0 ? Math.min(n, DEFAULT_GLOBAL_MAX_BYTES) : DEFAULT_GLOBAL_MAX_BYTES;
}

export function maxFileBytes() {
  const n = Number(process.env.R2_MAX_FILE_BYTES);
  return Number.isFinite(n) && n > 0 ? Math.min(n, DEFAULT_MAX_FILE_BYTES) : DEFAULT_MAX_FILE_BYTES;
}

function s3() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

export async function putAcademyFile({ academiaId, filename, body, contentType }) {
  if (!r2Configured()) {
    const err = new Error('R2 no está configurado.');
    err.code = 'R2_NOT_CONFIGURED';
    throw err;
  }
  const key = `academias/${academiaId}/${filename}`;
  await s3().send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  const base = String(process.env.R2_PUBLIC_BASE).replace(/\/$/, '');
  return { key, url: `${base}/${key}`, bytes: Buffer.byteLength(body) };
}

export async function createPresignedPut({ academiaId, bytes, contentType }) {
  if (!r2Configured()) {
    const err = new Error('R2 no está configurado.');
    err.code = 'R2_NOT_CONFIGURED';
    throw err;
  }
  const id = randomUUID();
  const key = `academias/${academiaId}/${id}.jpg`;
  const type = contentType || 'image/jpeg';
  const cmd = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    ContentType: type,
    ContentLength: bytes,
    CacheControl: 'public, max-age=31536000, immutable',
  });
  const uploadURL = await getSignedUrl(s3(), cmd, { expiresIn: 60 });
  const base = String(process.env.R2_PUBLIC_BASE).replace(/\/$/, '');
  return {
    id,
    key,
    uploadURL,
    method: 'PUT',
    headers: { 'Content-Type': type },
    url: `${base}/${key}`,
  };
}
