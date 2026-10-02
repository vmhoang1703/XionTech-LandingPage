import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidateTag } from "next/cache";

import type { SanityTag } from "@/lib/sanity/client";

const ALLOWED_TYPES: readonly SanityTag[] = ["post", "job"];

function isSanityTag(value: unknown): value is SanityTag {
  return ALLOWED_TYPES.includes(value as SanityTag);
}

function readType(body: string): unknown {
  try {
    const parsed: unknown = JSON.parse(body);
    return typeof parsed === "object" && parsed !== null
      ? (parsed as { _type?: unknown })._type
      : undefined;
  } catch {
    return undefined;
  }
}

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    console.error(
      "Revalidate webhook rejected: SANITY_REVALIDATE_SECRET is not configured",
    );
    return new Response("Webhook not configured", { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER_NAME) ?? "";
  if (!(await isValidSignature(body, signature, secret))) {
    return new Response("Invalid signature", { status: 401 });
  }

  const type = readType(body);
  if (!isSanityTag(type)) {
    return new Response("Unknown document type", { status: 400 });
  }

  revalidateTag(type, "max");
  return Response.json({ revalidated: type });
}
