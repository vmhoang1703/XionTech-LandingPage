import { issueSignedToken } from "@vercel/blob";
import { handleUploadPresigned } from "@vercel/blob/client";
import { ipAddress } from "@vercel/functions";
import { CV_MAX_BYTES, CV_TYPES } from "@/lib/careers/application-rules";
import { CV_PATH_PREFIX, getBlobConfig } from "@/lib/careers/cv-storage";
import { checkUploadLimit } from "@/lib/contact/delivery";
import { describeError, readBody } from "@/lib/http/route-helpers";

const SEND_FAILED = { error: "send" } as const;
const TOKEN_LIFETIME_MS = 10 * 60_000;
const GENERATE_URL = "blob.generate-presigned-url";

interface UploadRequest {
  body: {
    type: typeof GENERATE_URL;
    payload: {
      pathname: string;
      clientPayload: string | null;
      multipart: false;
    };
  };
  extension: string;
}

/** The extension of an allowed `cv/application.<ext>` path, else undefined. */
function cvExtension(pathname: string): string | undefined {
  const start = `${CV_PATH_PREFIX}application.`;
  if (!pathname.startsWith(start)) return undefined;
  const extension = pathname.slice(start.length);
  return Object.hasOwn(CV_TYPES, extension) ? extension : undefined;
}

/** The upload request when the body is a single-part CV request, else null. */
function parseUploadRequest(body: unknown): UploadRequest | null {
  if (typeof body !== "object" || body === null) return null;
  if (!("type" in body) || body.type !== GENERATE_URL) return null;
  if (!("payload" in body)) return null;
  const { payload } = body;
  if (typeof payload !== "object" || payload === null) return null;
  if (!("pathname" in payload) || typeof payload.pathname !== "string") {
    return null;
  }
  if ("multipart" in payload && payload.multipart === true) return null;
  const extension = cvExtension(payload.pathname);
  if (!extension) return null;
  return {
    body: {
      type: GENERATE_URL,
      payload: {
        pathname: payload.pathname,
        clientPayload: null,
        multipart: false,
      },
    },
    extension,
  };
}

/** The Blob settings, or null after one log line naming the missing variable. */
function readConfig(): ReturnType<typeof getBlobConfig> | null {
  try {
    return getBlobConfig();
  } catch (error) {
    console.error("CV upload: not configured:", String(error));
    return null;
  }
}

export async function POST(request: Request): Promise<Response> {
  const parsed = parseUploadRequest(await readBody(request));
  if (!parsed) return Response.json(SEND_FAILED, { status: 400 });

  const config = readConfig();
  if (!config) return Response.json(SEND_FAILED, { status: 500 });

  if (!(await checkUploadLimit(ipAddress(request)))) {
    // 200 with no presigned URL: the Blob SDK hides a 429 behind one generic
    // error, but throws "Missing presignedUrlPayload" for this body, so the
    // form can show the rate message.
    return Response.json({ error: "rate", presignedUrlPayload: null });
  }

  const allowedContentTypes = [CV_TYPES[parsed.extension]];
  try {
    const result = await handleUploadPresigned({
      request,
      body: parsed.body,
      webhookPublicKey: config.webhookPublicKey,
      getSignedToken: async (pathname) => {
        const validUntil = Date.now() + TOKEN_LIFETIME_MS;
        return {
          token: await issueSignedToken({
            pathname,
            operations: ["put"],
            allowedContentTypes,
            maximumSizeInBytes: CV_MAX_BYTES,
            validUntil,
            storeId: config.storeId,
          }),
          urlOptions: {
            addRandomSuffix: true,
            allowedContentTypes,
            maximumSizeInBytes: CV_MAX_BYTES,
            validUntil,
          },
        };
      },
    });
    return Response.json(result);
  } catch (error) {
    console.error("CV upload: token failed", describeError(error));
    return Response.json(SEND_FAILED, { status: 502 });
  }
}
