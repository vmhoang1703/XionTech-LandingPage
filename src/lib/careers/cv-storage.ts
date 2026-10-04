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
