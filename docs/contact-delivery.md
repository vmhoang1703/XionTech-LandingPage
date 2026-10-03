# Contact delivery

The `/demo` form sends each request as one mail to the contact inbox. This page is for the team.
It says where the code lives, how to set up, what happens when something fails, and what the free plans allow.

## What lives where

| Path                                      | What it does                                                                                                         |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `src/app/api/contact/route.ts`            | `POST /api/contact`. Runs the steps in order (see "What the route does"). `maxDuration` is 10 seconds.               |
| `src/lib/contact/submission.ts`           | `parseSubmission`: checks the body, reads the honeypot, runs the shared rules.                                       |
| `src/lib/contact/contact-rules.ts`        | The shared rules and error text. The browser and the server use the same file.                                       |
| `src/lib/contact/delivery.ts`             | Reads the five variables, builds the rate-limit key, checks the limit in Upstash, sends the mail through Gmail SMTP. |
| `src/components/contact/contact-form.tsx` | The client form. It posts JSON with `fetch` and waits at most 15 seconds.                                            |
| `e2e/smoke.spec.ts`                       | The `@smoke` test posts a filled honeypot to `/api/contact` and expects 200. It needs no secrets.                    |
| `.env.example`                            | The five variable names. Copy it to `.env.local`.                                                                    |

## Variables

All five are server-only. Never use `NEXT_PUBLIC_*` for them. Never put a value in the repo, in chat or in a log.

| Name                 | What it is                                                                   |
| -------------------- | ---------------------------------------------------------------------------- |
| `CONTACT_INBOX`      | The inbox that receives every request. It is the lead's company email.       |
| `GMAIL_USER`         | The Gmail account that sends the mail.                                       |
| `GMAIL_APP_PASSWORD` | An App Password of that Gmail account (not the normal password).             |
| `KV_REST_API_URL`    | The Upstash Redis REST URL. The Vercel Upstash integration adds this name.   |
| `KV_REST_API_TOKEN`  | The Upstash Redis REST token. The Vercel Upstash integration adds this name. |

The route reads them on each request, not at build time. A build check would make every teammate's `npm run build` and smoke test need the Gmail and Upstash secrets.

Decision (lead, 2026-10-03): `CONTACT_INBOX` is the lead's company email in Development, Preview and Production. It is the same value in every environment. The address is never written in the repo.

## Local setup for a teammate

1. Copy `.env.example` to `.env.local`.
2. Only the lead needs the real values for a real send. Ask the lead. Put them in `.env.local` only.
3. Without the values, `npm run dev`, `npm run build` and `npm run test:smoke` still work. A real request gets a 500 and the form shows "We could not send your request. Please try again." This is expected. The log line names the missing variable.

Unit tests mock Gmail and Upstash. They never send mail.

## Account steps (the lead does steps 1 to 4 before merge, and step 5 after)

1. The Gmail account used as sender (`GMAIL_USER`): turn on 2-Step Verification. Then create an App Password (myaccount.google.com, then Security, then App passwords). Google shows it once. Put it only in Vercel and `.env.local` as `GMAIL_APP_PASSWORD`.
2. In Vercel, open the project, then Storage, then Create, then Marketplace, then Upstash Redis (free). Connect it to `xion-tech-landing-page` for Production and Preview. Check that the project now has `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
3. In Vercel, open Environment Variables. Set these for Production and Preview, and mark them Sensitive: `CONTACT_INBOX` (the lead's company email, the same value in Production and Preview), `GMAIL_USER` and `GMAIL_APP_PASSWORD`.
4. Copy the same five into `.env.local` for local runs.
5. After merge: send one real Product demo request on https://xiontech-dev.vercel.app/demo. The mail must arrive at the inbox with every field, and Reply-To must be the visitor. Then send quickly six times with one email. The sixth must show the rate-limit message.

## What the route does

The route runs these steps in order. It stops at the first one that fails.

| Step | Check                                                                                                                              | Answer                                   |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| 1    | Body is not a JSON object, `type` is not `demo` or `project`, or a value no form can send (for example a role over 200 characters) | 400 `{ "error": "send" }`                |
| 2    | Honeypot field `website` is not empty                                                                                              | 200 `{ "ok": true }`. Nothing else runs. |
| 3    | One of the five variables is not set                                                                                               | 500 `{ "error": "send" }`                |
| 4    | A field breaks the shared rules                                                                                                    | 400 `{ "errors": { field: text } }`      |
| 5    | More than 5 sends in 10 minutes for the same key                                                                                   | 429 `{ "error": "rate" }`                |
| 6    | The mail fails to send                                                                                                             | 502 `{ "error": "send" }`                |
| 7    | The mail is sent                                                                                                                   | 200 `{ "ok": true }`                     |

Notes:

- The honeypot answer is 200 on purpose. A bot gets no sign that it was caught. No mail is sent and no rate-limit call is made. The smoke test uses this step, so it needs no secrets.
- The mail is plain text. The subject is "Product demo request: <school or company>" or "Outsourcing project request: <school or company>". CR and LF are removed from the subject. Reply-To is the visitor's email.
- In the form, 400 with field errors shows inline. Any other failure, and a 15 second timeout, shows the send message above the button. 429 shows the rate-limit message. The visitor keeps every value and presses "Send request" again.

## Rate limit

- The limit is 5 sends in 10 minutes (sliding window) for one IP plus one email. The same IP with another email still passes.
- The key is a SHA-256 hash of the IP and the lower-cased email. The raw IP and email never reach Upstash. In Upstash the keys start with `contact`.
- The IP comes from `ipAddress` in `@vercel/functions`. When there is no IP (for example in a local run), the key uses the word "unknown" with the email.
- There is no cache or counter in the app process. The state lives only in Upstash.
- Limit of this rule: it does not cap the total. A sender who changes the email each time is not stopped by it. The honeypot and the Gmail daily limit are the other guards.

## When something is down or slow

- **Upstash is down, slow or returns an error:** the route fails open. It sends the mail anyway and answers 200. It writes one log line, "rate limit unavailable". The store call times out after 3 seconds.
- **Gmail refuses or is slow:** the SMTP connection, greeting and socket each time out after 5 seconds. The route answers 502. The form shows the send message and keeps the values.
- **Slow path:** the route's `maxDuration` is 10 seconds. A worst-case slow run can pass it. Then the platform ends the call. The form shows the send error with the values kept, the same as for a 502.
- **Logs:** a log line names the step and the error class only, for example "Contact delivery: send failed" and the class name. It never holds a name, an email, a message, a key or a secret.

## Free plan limits

Gmail (the sender):

- About 500 recipients per rolling 24 hours for a free Gmail account. This number comes from third-party sources. Google states no number for consumer accounts. Treat it as an estimate.
- Each request is one mail with one recipient, so this is about 500 requests a day.

Upstash Redis (the rate-limit store, free plan, from the story spec of 2026-10-02):

- 500K commands per month
- 256 MB of data
- 10 GB bandwidth
- 1 database

What would force a paid plan:

- Gmail: more than about 500 requests in 24 hours. Gmail then refuses the mail, and the form shows the send error. This needs a different sender, for example a Google Workspace account or a mail service made for sending. That means a change in `src/lib/contact/delivery.ts` and a paid plan.
- Upstash: more than 500K commands in a month, more than 256 MB of data, more than 10 GB of bandwidth, or a need for a second database. The form uses one database and a few small keys, and the keys expire. We did not measure how many commands one send uses. Check the Upstash usage page after the first tests.
- If Upstash refuses the calls, the route fails open. Mail still goes out, but the rate limit stops working until the limit resets or the plan changes.

We did not check what Upstash does exactly at its limit. Check this before Demo day. The numbers can change, so read the Gmail and Upstash pricing pages again before Demo day.
