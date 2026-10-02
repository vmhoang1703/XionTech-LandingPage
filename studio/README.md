# XionTech Studio

Sanity Studio for the News (`post`) and Careers (`job`) content. It is a separate package:
it has its own `package.json` and lockfile, and the Next.js app does not import it.

- Project ID `1khn3hf4`, dataset `production` (public values, set in `sanity.cli.ts` and `sanity.config.ts`).
- Studio host: `https://xiontech-landing.sanity.studio`.
- English and Vietnamese live in one document: each translated field is an object with `en` and `vi`.
- No application or CV fields. Do not store anything private in Sanity.

## Run locally

```bash
cd studio
npm install
npx sanity login
npm run dev   # http://localhost:3333
```

## Deploy

```bash
cd studio
npm install
npx sanity login
npx sanity deploy   # host: xiontech-landing
```

Add `http://localhost:3333` to the CORS origins in sanity.io/manage for local Studio use.
