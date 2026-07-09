import React from 'react';
import { createRoot } from 'react-dom/client';
import { Primate } from '@primate-intelligence/sdk/browser';
import { PrimateProvider } from '@primate-intelligence/vision-react';
import { App } from './App';

/**
 * Browser auth — the client-tokens path (primary, recommended):
 * short-lived pvct_ tokens minted by server/mint.js. The secret pv_ key
 * never reaches the browser. Tokens are cached until ~60s before expiry.
 */
let cached: { token: string; expiresAt: number } | null = null;
async function mintToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt - 60_000) return cached.token;
  const res = await fetch('/api/token', { method: 'POST' });
  if (!res.ok) throw new Error(`Token mint failed: ${res.status} — is server/mint.js running with PRIMATE_API_KEY set?`);
  const body = (await res.json()) as { token: string; expires_at: string };
  cached = { token: body.token, expiresAt: new Date(body.expires_at).getTime() };
  return body.token;
}

const client = new Primate({
  baseUrl: (import.meta as unknown as { env: Record<string, string | undefined> }).env.VITE_PRIMATE_API_BASE_URL ?? 'https://api.primateintelligence.ai',
  authToken: mintToken,
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrimateProvider client={client}>
      <App />
    </PrimateProvider>
  </React.StrictMode>,
);
