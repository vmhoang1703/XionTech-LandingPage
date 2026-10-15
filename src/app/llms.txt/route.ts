import { llmsTxt } from "@/lib/seo/llms-txt";

// /llms.txt for AI assistants (audit M7). Outside [locale], and the proxy
// matcher skips paths with a dot, so it is never redirected.
export function GET(): Response {
  return new Response(llmsTxt(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
