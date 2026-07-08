# primate-vision-client

Open-source reference implementation of a [Primate Vision](https://primateintelligence.ai) video-analysis client. Built on [`@primate-intelligence/vision-react`](https://github.com/Primate-Intelligence/vision-react) and the Primate Vision public API v1.

> **Status: pre-release skeleton.** Being built in the open (Day-0 open-sourcing) alongside Public API v1. Roadmap below tracks the API program's phases.

## What this will be

Clone it, set **two environment variables**, and get a working video-QA web app against your own Primate Vision account:

| Runtime | Required | Optional (defaulted) |
|---|---|---|
| Token-mint server | `PRIMATE_API_KEY` | `PRIMATE_API_BASE_URL` (default `https://api.primateintelligence.ai`) |
| Client (browser) | — | `VITE_SHIM_BASE_URL` (default `/api/pv`) |

The browser never sees your secret key: a ~20-line server mints short-lived, scoped **client tokens** (`pvct_…`) and the SPA talks to Primate Vision directly.

## Roadmap

- [x] Repo skeleton: license, CI scans, token-mint server stub
- [ ] Minimal upload → analyze → result flow (API program P3)
- [ ] Client-token mint + direct-from-browser flow (P5)
- [ ] Real-time streaming view (P6)
- [ ] Full reference UI via `@primate-intelligence/vision-react` (P10)
- [ ] Clean-machine quickstart CI gate — clone → 2 env vars → `npm run dev` (GA)

## Token-mint server (design target)

```js
// server/mint.js — the entire server component
import express from "express";
const app = express();
app.post("/api/pv/client-token", async (_req, res) => {
  const r = await fetch(`${process.env.PRIMATE_API_BASE_URL ?? "https://api.primateintelligence.ai"}/v1/client_tokens`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.PRIMATE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ scopes: ["videos:write", "analyses:write", "analyses:read"], ttl_s: 300 })
  });
  res.status(r.status).json(await r.json());
});
app.listen(3001);
```

## License

Apache-2.0. See [NOTICE](./NOTICE) — the Primate marks and brand assets are **not** licensed; this app ships neutral styling.
