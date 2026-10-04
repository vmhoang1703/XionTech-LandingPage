/** The parsed body, or undefined when it is not JSON (judged as a bad body). */
export async function readBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

/** The SMTP error code (EAUTH, ETIMEDOUT...) when the error has a string one. */
function errorCode(error: unknown): string | undefined {
  if (!(error instanceof Error) || !("code" in error)) return undefined;
  return typeof error.code === "string" ? error.code : undefined;
}

/** The error class and code for a log line, never a message. */
export function describeError(error: unknown): string {
  const name = error instanceof Error ? error.name : "unknown";
  const code = errorCode(error);
  return code ? `${name} ${code}` : name;
}
