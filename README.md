This is [Vertex](../AGENTS.md), an AI-powered learning platform. The repo has two standalone workspaces:

- `studio/` — the Sanity Studio (content authoring), run with Vite via the Sanity CLI.
- `web/` — the Next.js app that reads content and renders the site.

## Getting Started

Install and run each workspace from its own folder, in two terminals:

```bash
cd studio && npm install && npm run dev   # http://localhost:3333
cd web && npm install && npm run dev      # http://localhost:3000
```

Copy [.env.example](.env.example) to `web/.env.local` and fill in the Clerk and Sanity values. Mirror `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` into `studio/.env` as `SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET`.

The first time you run the Studio locally, allow the web app's origin to call Sanity's API:

```bash
cd studio && npx sanity cors add http://localhost:3000 --credentials
```

After editing the schema or a GROQ query, regenerate types for the web app:

```bash
cd studio && npm run typegen
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
