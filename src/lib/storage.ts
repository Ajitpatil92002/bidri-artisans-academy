import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const MAX_BYTES = 5 * 1024 * 1024;

/** Reads the file's real type from its first bytes, not from its name or browser label. */
function detectImageType(bytes: Uint8Array) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { ext: "jpg", mime: "image/jpeg" };
  }
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return { ext: "png", mime: "image/png" };
  }
  const tag = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  if (tag(0, 4) === "RIFF" && tag(8, 12) === "WEBP") return { ext: "webp", mime: "image/webp" };
  return null;
}

export class UploadError extends Error {}

/** Saves an image and returns its URL. */
export async function saveImage(file: File) {
  if (file.size === 0) throw new UploadError("The file is empty.");
  if (file.size > MAX_BYTES) throw new UploadError("Images must be 5 MB or smaller.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = detectImageType(bytes);
  if (!type) throw new UploadError("Use a JPG, PNG or WebP image.");

  const name = `${randomUUID()}.${type.ext}`;

  if (process.env.S3_BUCKET) {
    const client = new S3Client({
      endpoint: process.env.S3_ENDPOINT || undefined,
      region: process.env.S3_REGION || "auto",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
      },
    });
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: name,
        Body: bytes,
        ContentType: type.mime,
      })
    );
    return `${process.env.S3_PUBLIC_URL}/${name}`;
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}
