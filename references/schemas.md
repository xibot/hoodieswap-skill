# Hoodieswap v1 schemas

## Quote request

```json
{
  "tokenIn": "0x...",
  "tokenOut": "0x...",
  "amount": "10000000000000000",
  "formattedAmount": "0.01",
  "swapper": "0x...",
  "exactPool": "0x...",
  "launchPoolRequired": false
}
```

`amount` is the raw integer amount. `formattedAmount` is its human-readable decimal representation. `swapper` is optional for preview quoting but required before approvals and wallet execution. `exactPool` may be a V3 pool address or V4 pool ID discovered for a launch.

## Quote response

The response contains `best`, `quotes`, `providers`, and `checkedAt`. A provider quote can contain `provider`, `outputAmount`, `quote`, `transaction`, `approval`, `priceImpactBps`, and `settlement`.

## Approval request

Pass `provider`, `walletAddress`, `token`, `tokenOut`, `amount`, and the provider's `spender` when one is returned. The response contains one `approval` or an `approvals` array of unsigned transactions.

## Swap preparation request

Pass the selected quote's `provider`, `quote`, and `transaction`. The response contains `swap`, an unsigned `{ to, data, value }` transaction.

## Launch preflight request

```json
{
  "source": "launchpad",
  "mode": "preflight",
  "dryRun": true,
  "token": {
    "chain": "robinhood",
    "name": "Example Token",
    "ticker": "EXAMPLE",
    "description": "Example description",
    "imageUrl": "https://...",
    "metadataUrl": "https://...",
    "website": "https://...",
    "xAccount": "https://x.com/...",
    "pair": { "mode": "weth" }
  },
  "creator": { "walletAddress": "0x...", "email": "creator@example.com" }
}
```

For a stock pair use `{ "mode": "stock", "address": "0x..." }`, where the address must be returned by the canonical stock registry.
