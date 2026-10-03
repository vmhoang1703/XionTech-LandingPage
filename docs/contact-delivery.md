# Contact delivery

The `/demo` form sends each request as one mail to the contact inbox. This page is for the team.
It says where the code lives, how to set up, what happens when something fails, and what the free plans allow.

## What lives where

| Path                                      | What it does                                                                                                         |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `src/app/api/contact/route.ts`            | `POST /api/contact`. Runs the steps in order (see "What the route does"). `maxDuration` is 10 seconds.               |
| `src/lib/contact/submission.ts`           | `parseSubmission`: checks the body, reads the honeypot, runs the shared rules. Also reads the capture body.          |
| `src/components/contact/capture-band.tsx` | The email band. It posts a capture to the same route (see "Capture mails").                                          |
| `src/lib/contact/contact-rules.ts`        | The shared rules and error text. The browser and the server use the same file.                                       |
| `src/lib/contact/delivery.ts`             | Reads the five variables, builds the rate-limit keys, checks both limits in Upstash, sends the mail with Gmail SMTP. |
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

Decision (lead, 2026-10-03): `CONTACT_INBOX` is the lead's company email, the same value in every environment where it is set. The address is never written in the repo.

Decision (lead, 2026-10-03): `CONTACT_INBOX`, `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set in Vercel for Production and Preview (all preview branches). PR previews are for checking a deployment and the UI, and a send there goes to the same inbox. This is safe enough because every deployment shares one Upstash store and the same two limits, so one IP gets about 20 sends an hour in total. Development is not set in Vercel: local runs use `.env.local`, and a Sensitive value cannot be set for Development.

## Local setup for a teammate

1. Copy `.env.example` to `.env.local`.
2. Only the lead needs the real values for a real send. Ask the lead. Put them in `.env.local` only.
3. Without the values, `npm run dev`, `npm run build` and `npm run test:smoke` still work. A real request gets a 500 and the form shows "We could not send your request. Please try again." This is expected. The log line names the missing variable.

Unit tests mock Gmail and Upstash. They never send mail.

## Account steps (the lead does steps 1 to 4 before merge, step 5 after merge to `develop`, and step 6 after the first release PR to `main`)

1. The Gmail account used as sender (`GMAIL_USER`): turn on 2-Step Verification. Then create an App Password (myaccount.google.com, then Security, then App passwords). Google shows it once. Put it only in Vercel and `.env.local` as `GMAIL_APP_PASSWORD`.
2. In Vercel, open the project, then Storage, then Create, then Marketplace, then Upstash Redis (free). Connect it to `xion-tech-landing-page` for Production and Preview. Check that the project now has `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
3. In Vercel, open Environment Variables. Set these for Production and Preview, and mark them Sensitive: `CONTACT_INBOX` (the lead's company email, the same value in both), `GMAIL_USER` and `GMAIL_APP_PASSWORD`. Do not set them for Development. If they are team Shared variables, link them to `xion-tech-landing-page`.
4. Copy the same five into `.env.local` for local runs.
5. After merge to `develop`: send one real Product demo request on https://xiontech-dev.vercel.app/demo. The mail must arrive at the inbox with every field, and Reply-To must be the visitor. Then send six quickly, from one browser, with one email, counting the first real request. The sixth should show the rate-limit message. The window is an estimate (see "Rate limit"), so if the sixth passes, send one more.
6. After the first release PR to `main`: open https://xion-tech-landing-page.vercel.app/demo and send one real Product demo request. The mail must arrive at the inbox. Then open the Vercel logs of the Production deployment and check that there is no "not configured" line.

## What the route does

The route runs these steps in order. It stops at the first one that fails.

| Step | Check                                                                                                                                     | Answer                                   |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| 1    | Body is not a JSON object, or `type` is not `demo`, `project` or `capture`                                                                | 400 `{ "error": "send" }`                |
| 2    | Honeypot field `website` is not empty                                                                                                     | 200 `{ "ok": true }`. Nothing else runs. |
| 3    | Role is over 200 characters, or a select or products value is not an option in the form. For a capture: `kind` is not `demo` or `project` | 400 `{ "error": "send" }`                |
| 4    | One of the five variables is not set                                                                                                      | 500 `{ "error": "send" }`                |
| 5    | A field breaks the shared rules. For a capture: the email is empty, not valid or over 254 characters                                      | 400 `{ "errors": { field: text } }`      |
| 6    | About 5 sends in 10 minutes for the same IP and email                                                                                     | 429 `{ "error": "rate" }`                |
| 7    | About 20 sends in 1 hour for the same IP, whatever the email                                                                              | 429 `{ "error": "rate" }`                |
| 8    | The mail fails to send                                                                                                                    | 502 `{ "error": "send" }`                |
| 9    | The mail is sent                                                                                                                          | 200 `{ "ok": true }`                     |

Notes:

- The honeypot answer is 200 on purpose. A bot gets no sign that it was caught. No mail is sent and no rate-limit call is made. The honeypot is checked before the role and option checks (step 3), so a filled honeypot with a long role still gets 200. The smoke test uses this step, so it needs no secrets.
- The mail is plain text. The subject is "Product demo request: <school or company>" or "Outsourcing project request: <school or company>". CR and LF are removed from the subject. Reply-To is the visitor's email.
- In the form, 400 with field errors shows inline. Any other failure, and a 15 second timeout, shows the send message above the button. 429 shows the rate-limit message. The visitor keeps every value and presses "Send request" again.

## Capture mails

The email band (`src/components/contact/capture-band.tsx`) posts to the same `POST /api/contact`. There is no second route and no second sender. The body is `{ "type": "capture", "kind": "demo" | "project", "email": "...", "website": "" }`.

- The route runs the same steps as in the table above. The email is trimmed first, then it must pass `isValidEmail` and be at most 254 characters. A bad email gets 400 `{ "errors": { "email": text } }`. A bad `kind` gets 400 `{ "error": "send" }`.
- The honeypot, the config check and both rate limits are the same as for the form. A filled honeypot gets 200 and no mail.
- The subject is "Demo capture" or "Project capture". It has no personal data. CR and LF cannot appear in it.
- The body has two lines: `Kind: <kind>` and `Email: <email>`. Reply-To is the visitor's email.
- A capture counts as one send for the IP and email limit. The full form that the visitor then sends counts as a second one. So the visitor has about 3 more sends in the same 10 minutes.
- After a 200, the band keeps the email in session storage under `xt-capture-email` and opens `/demo#form` or `/demo#project`. `/demo` reads the key once, fills Work email only if it is empty, and removes the key. The email is never in a URL and never in a log line. If session storage throws, the visitor still lands on the right tab with no prefill.

## Rate limit

There are two limits. A request must pass both. If either one says no, the route answers 429 and sends no mail.

| Limit        | Counts                     | Size                   | Upstash key prefix | Key                                         |
| ------------ | -------------------------- | ---------------------- | ------------------ | ------------------------------------------- |
| IP and email | one IP plus one email      | about 5 per 10 minutes | `contact`          | SHA-256 of the IP and the lower-cased email |
| IP only      | one IP, whatever the email | about 20 per hour      | `contact-ip`       | SHA-256 of the IP                           |

- Both are sliding windows. A sliding window is an estimate: it adds the count of the current window to a share of the count of the previous window. So near the edge of a window a sixth send can pass, and a limit can also refuse a little early. Read "5 in 10 minutes" as "about 5 in 10 minutes", and "20 in 1 hour" as "about 20 in 1 hour".
- The same IP with another email still passes the first limit. The IP-only limit stops a script that changes the email each time. It also counts all visitors behind one IP, for example a school network, so they share the 20 sends per hour.
- The IP and email limit runs first. The IP-only limit runs only when the first one allowed the send. So a send that the first limit refused does not count against the IP-only limit.
- Every allowed send counts, also one whose mail then fails with 502. During a Gmail outage, five failed attempts with one email use the whole IP and email limit. The next attempt then shows the rate-limit message, for up to 10 minutes.
- The keys are SHA-256 hashes. The raw IP and email never reach Upstash.
- The IP comes from `ipAddress` in `@vercel/functions`. When there is no IP (for example in a local run), both keys use the word "unknown", so all such requests share one IP-only limit.
- There is no cache or counter in the app process. The state lives only in Upstash.
- Both limits fail open (see the next section). The Gmail daily limit is the last guard.

## When something is down or slow

- **Upstash is down, slow or returns an error:** the route fails open. It sends the mail anyway and answers 200. It writes one log line, "rate limit unavailable", with the error class or the word "timeout". When the IP and email check cannot reach the store, the IP-only check is skipped, so there is one log line and one wait. The store call times out after 3 seconds. If only the IP-only check fails, it also writes one log line and the send is allowed.
- **Gmail refuses or is slow:** the SMTP connection, greeting and socket each time out after 5 seconds. The route answers 502. The form shows the send message and keeps the values.
- **Slow path:** the route's `maxDuration` is 10 seconds. A worst-case slow run can pass it. Then the platform ends the call. The form shows the send error with the values kept, the same as for a 502.
- **Logs:** a log line names the step and the error class. For a failed send it also has the SMTP error code when the error carries one, for example "Contact delivery: send failed Error EAUTH". The class is "Error" for every nodemailer failure, so the code tells the causes apart: `EAUTH` is a wrong App Password or user, `ETIMEDOUT` and `ECONNECTION` are network problems. A line never holds the error message. The one exception is the missing-variable line: it names the variable, for example "GMAIL_USER is not set". No line holds a name, an email, a message, an IP, a key or a secret value.

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

- Gmail: more than about 500 requests in 24 hours. We did not verify what Gmail does then. We expect it to refuse the mail, so the route would answer 502 and the form would show the send error. A Google Workspace account still uses `service: "gmail"`, so it needs only new `GMAIL_USER` and `GMAIL_APP_PASSWORD` values and a paid plan, with no code change. A different mail service needs a change in `src/lib/contact/delivery.ts` and usually a paid plan.
- Upstash: more than 500K commands in a month, more than 256 MB of data, more than 10 GB of bandwidth, or a need for a second database. The form uses one database and a few small keys, and the keys expire. We did not measure how many commands one send uses. Check the Upstash usage page after the first tests.
- If Upstash refuses the calls, the route fails open. Mail still goes out, but the rate limit stops working until the limit resets or the plan changes.

We did not check what Upstash does exactly at its limit. Check this before Demo day. The numbers can change, so read the Gmail and Upstash pricing pages again before Demo day.
