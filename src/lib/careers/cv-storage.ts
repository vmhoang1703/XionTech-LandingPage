/** CVs live under this prefix in the private Blob store. */
export const CV_PATH_PREFIX = "cv/";

/**
 * The Blob store id and the webhook public key, read on each request. Throws
 * an error that names the first missing variable, never a value.
 */
export function getBlobConfig(): { storeId: string; webhookPublicKey: string } {
  const storeId = getBlobStoreId();
  const webhookPublicKey = process.env.BLOB_WEBHOOK_PUBLIC_KEY;
  if (!webhookPublicKey) throw new Error("BLOB_WEBHOOK_PUBLIC_KEY is not set");
  return { storeId, webhookPublicKey };
}

/** The Blob store id alone (enough to delete a CV). Throws naming the variable. */
export function getBlobStoreId(): string {
  const storeId = process.env.BLOB_STORE_ID;
  if (!storeId) throw new Error("BLOB_STORE_ID is not set");
  return storeId;
}
