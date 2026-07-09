// server/mint.js — the ENTIRE server component of this reference app.
//
// Mints short-lived, scoped client tokens (pvct_…) so the browser can talk
// to the Primate Vision API directly without ever seeing your secret key.
// ~20 lines of logic, on purpose — this is the whole "backend" you need.
import express from "express";

const API = process.env.PRIMATE_API_BASE_URL ?? "https://api.primateintelligence.ai";
const KEY = process.env.PRIMATE_API_KEY;
if (!KEY) {
  console.error("Set PRIMATE_API_KEY (get a free test key: curl -X POST " + API + "/v1/sandbox)");
  process.exit(1);
}

const app = express();

app.post("/api/token", async (_req, res) => {
  const r = await fetch(`${API}/v1/client_tokens`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      scopes: ["videos:write", "analyses:read", "analyses:write"],
      ttl_s: 900,
    }),
  });
  res.status(r.status).json(await r.json());
});

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => console.log(`token-mint server on :${port} → ${API}`));
