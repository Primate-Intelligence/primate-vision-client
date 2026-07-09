# primate-vision-client

Open-source reference implementation of a [Primate Vision](https://primateintelligence.ai) video-analysis client. Built on [`@primate-intelligence/vision-react`](https://github.com/Primate-Intelligence/vision-react) and the Primate Vision public API v1.

Upload a video, ask a question in plain English, get a yes/no answer with confidence and clip timestamps.

## Quickstart

```bash
git clone https://github.com/Primate-Intelligence/primate-vision-client
cd primate-vision-client
npm install

# Get a free test key (fixture results, no GPU, no billing):
curl -X POST https://api.primateintelligence.ai/v1/sandbox

PRIMATE_API_KEY=pv_test_… npm run dev
# → web app on http://localhost:5173, token-mint server on :3001
```

Two environment variables, both on the server side:

| Variable | Required | Purpose |
|---|---|---|
| `PRIMATE_API_KEY` | yes | Your `pv_live_…` or `pv_test_…` secret key — **server only** |
| `PRIMATE_API_BASE_URL` | no | Defaults to `https://api.primateintelligence.ai` |

## How auth works (the part worth copying)

The browser **never sees your secret key**. The primary browser-auth path is
**ephemeral client tokens** (`pvct_…`):

1. The SPA calls `POST /api/token` on your server.
2. [`server/mint.js`](./server/mint.js) — the *entire* server, ~20 lines —
   exchanges your secret key for a short-lived, scope-limited client token
   via `POST /v1/client_tokens`.
3. The SPA hands that token to the official SDK (`new Primate({ authToken })`),
   which talks to the Primate Vision API directly.

Tokens are scoped (`videos:write`, `analyses:read`, `analyses:write`), live
15 minutes, and can be bound to a single video or stream. Revoking the parent
key revokes every token it minted.

## What's in the box

- `server/mint.js` — the token-mint server (express, ~20 lines)
- `src/main.tsx` — SDK client setup with token caching
- `src/App.tsx` — upload → analyze → results UI using
  `useVideoAnalysis`, `<AnalysisProgress />`, `<ClipsTimeline />`
- Neutral styling on purpose: this is a teaching artifact, not a brand asset

## Roadmap

- [x] Repo skeleton: license, CI scans, token-mint server stub
- [x] Minimal upload → analyze → result flow
- [x] Client-token mint + direct-from-browser flow (primary auth path)
- [x] Reference UI via `@primate-intelligence/vision-react`
- [ ] Real-time streaming view (`connectStream` from the SDK)
- [ ] Clean-machine quickstart CI gate against the live sandbox (GA)

> **Pre-GA note:** until the npm publishes land, the SDK and vision-react
> packages are vendored as tarballs in `vendor/` (packed from their public
> repos). At GA these become registry semver deps — same code.

## Support posture

Issues welcome; PRs reviewed best-effort; security reports to
security@primateintelligence.ai. This is a teaching artifact, not a supported
product — no SLA.

## License

Apache-2.0. See [NOTICE](./NOTICE) — the Primate marks and brand assets are **not** licensed; this app ships neutral styling.
