import type { LaunchPayload, QuoteRequest, QuoteResponse } from "./types.js";

export class HoodieswapClient {
  constructor(readonly baseUrl = "https://hoodieswap.xyz/api/v1") {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, { ...init, headers: { "content-type": "application/json", ...init?.headers } });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || `Hoodieswap API returned ${response.status}`);
    return body as T;
  }

  capabilities() { return this.request<Record<string, unknown>>("/capabilities"); }
  tokens() { return this.request<Record<string, unknown>>("/tokens"); }
  stocks() { return this.request<Record<string, unknown>>("/stocks"); }
  quote(input: QuoteRequest) { return this.request<QuoteResponse>("/quote", { method: "POST", body: JSON.stringify(input) }); }
  approval(input: Record<string, unknown>) { return this.request<Record<string, unknown>>("/approval", { method: "POST", body: JSON.stringify(input) }); }
  prepareSwap(input: Record<string, unknown>) { return this.request<Record<string, unknown>>("/swap/prepare", { method: "POST", body: JSON.stringify(input) }); }
  preflightLaunch(input: LaunchPayload) { return this.request<Record<string, unknown>>("/launch/preflight", { method: "POST", body: JSON.stringify(input) }); }
}
