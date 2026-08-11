export type Address = `0x${string}`;
export type Transaction = { chainId?: 4663; to: Address; data: `0x${string}`; value: string };
export type QuoteRequest = { tokenIn: Address; tokenOut: Address; amount: string; formattedAmount: string; swapper?: Address; exactPool?: string; launchPoolRequired?: boolean };
export type ProviderQuote = { provider: "UNISWAP" | "ZEROX" | "RIALTO" | "DOPPLER_POOL"; outputAmount: string; quote?: Record<string, unknown>; transaction?: Transaction; approval?: { token: Address; spender: Address }; priceImpactBps?: number | null; settlement?: string };
export type QuoteResponse = { best: ProviderQuote; quotes: ProviderQuote[]; providers: Array<Record<string, unknown>>; checkedAt: string };
export type LaunchPayload = { source: "launchpad"; mode: "preflight"; dryRun: true; token: { chain: "robinhood"; name: string; ticker: string; description: string; imageUrl: string; metadataUrl?: string; website?: string; xAccount?: string; pair: { mode: "weth" } | { mode: "stock"; address: Address } }; creator: { walletAddress: Address; email: string } };
