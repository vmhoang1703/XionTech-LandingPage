/** CVs live under this prefix in the private Blob store. */
export const CV_PATH_PREFIX = "cv/";

/**
 * The server-only Blob token, read on each request. Throws an error that names
 * the variable, never its value.
 */
export function getBlobToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN is not set");
  return token;
}

/**
 * The Blob store id and the webhook public key, read on each request. Throws
 * an error that names the first missing variable, never a value.
 */
export function getBlobConfig(): { storeId: string; webhookPublicKey: string } {
  const storeId = process.env.BLOB_STORE_ID;
  if (!storeId) throw new Error("BLOB_STORE_ID is not set");
  const webhookPublicKey = process.env.BLOB_WEBHOOK_PUBLIC_KEY;
  if (!webhookPublicKey) throw new Error("BLOB_WEBHOOK_PUBLIC_KEY is not set");
  return { storeId, webhookPublicKey };
}
