import { handleUpload } from "@vercel/blob/client";
import { ipAddress } from "@vercel/functions";
import { CV_MAX_BYTES, CV_TYPES } from "@/lib/careers/application-rules";
import { CV_PATH_PREFIX, getBlobToken } from "@/lib/careers/cv-storage";
import { checkUploadLimit } from "@/lib/contact/delivery";
import { readBody } from "@/lib/http/route-helpers";

const SEND_FAILED = { error: "send" } as const;
const TOKEN_LIFETIME_MS = 10 * 60_000;
const GENERATE_TOKEN = "blob.generate-client-token";

interface TokenRequest {
  body: { type: typeof GENERATE_TOKEN; payload: { pathname: string } };
  extension: string;
}

/** The extension of an allowed `cv/application.<ext>` path, else undefined. */
function cvExtension(pathname: string): string | undefined {
  const start = `${CV_PATH_PREFIX}application.`;
  if (!pathname.startsWith(start)) return undefined;
  const extension = pathname.slice(start.length);
  return Object.hasOwn(CV_TYPES, extension) ? extension : undefined;
}

/** The token request when the body is a CV token request, else null. */
function parseTokenRequest(body: unknown): TokenRequest | null {
  if (typeof body !== "object" || body === null) return null;
  if (!("type" in body) || body.type !== GENERATE_TOKEN) return null;
  if (!("payload" in body)) return null;
  const { payload } = body;
  if (typeof payload !== "object" || payload === null) return null;
  if (!("pathname" in payload) || typeof payload.pathname !== "string") {
    return null;
  }
  const extension = cvExtension(payload.pathname);
  if (!extension) return null;
  return {
    body: { type: GENERATE_TOKEN, payload: { pathname: payload.pathname } },
    extension,
  };
}

/** The Blob token, or null after one log line naming the missing variable. */
function readToken(): string | null {
  try {
    return getBlobToken();
  } catch (error) {
    console.error("CV upload: not configured:", String(error));
    return null;
  }
}

export async function POST(request: Request): Promise<Response> {
  const parsed = parseTokenRequest(await readBody(request));
  if (!parsed) return Response.json(SEND_FAILED, { status: 400 });

  const token = readToken();
  if (!token) return Response.json(SEND_FAILED, { status: 500 });

  if (!(await checkUploadLimit(ipAddress(request)))) {
    return Response.json({ error: "rate" }, { status: 429 });
  }

  try {
    const result = await handleUpload({
      token,
      request,
      body: {
        ...parsed.body,
        payload: {
          ...parsed.body.payload,
          clientPayload: null,
          multipart: false,
        },
      },
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [CV_TYPES[parsed.extension]],
        maximumSizeInBytes: CV_MAX_BYTES,
        addRandomSuffix: true,
        validUntil: Date.now() + TOKEN_LIFETIME_MS,
      }),
    });
    return Response.json(result);
  } catch (error) {
    console.error(
      "CV upload: token failed",
      error instanceof Error ? error.name : "unknown",
    );
    return Response.json(SEND_FAILED, { status: 502 });
  }
}
