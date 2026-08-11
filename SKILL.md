---
name: hoodieswap-skill
description: Discover Robinhood Chain crypto and stock tokens, request Hoodieswap quotes, prepare approvals and unsigned swaps, and dry-run Doppler token launches with an EOA or OnChainHoodies ERC-6551 HoodWallet. Use when an agent needs to research or prepare a Hoodieswap trade or launch while preserving self-custody and requiring explicit wallet review and authorized signature.
---

# Hoodieswap Skill

Use Hoodieswap as a non-custodial execution preparation layer on Robinhood Chain (chain ID `4663`). Discover assets and routes, show the user the material terms, then prepare unsigned transactions for the connected wallet. Never request, store, or use a private key.

## Choose the workflow

- For asset lookup or market discovery, call `GET /tokens` or `GET /stocks`.
- For a trade preview, call `POST /quote`. A wallet is optional for preview quotes.
- For an ERC-20 input, call `POST /approval` after the user selects a route and wallet.
- To obtain the final unsigned swap payload, call `POST /swap/prepare`.
- For a token launch, call `POST /launch/preflight` with `dryRun: true`. Stop after returning the simulation and unsigned Airlock transaction.
- Read [references/safety.md](references/safety.md) before preparing any transaction.
- Read [references/schemas.md](references/schemas.md) for request and response fields.
- Read [references/robinhood-chain.md](references/robinhood-chain.md) for canonical network values.
- Read [references/hoodwallet.md](references/hoodwallet.md) when the signing account is an OnChainHoodies ERC-6551 HoodWallet.

## Choose the signer profile

- `eoa`: prepare the transaction for a conventional externally owned wallet.
- `och-hoodwallet`: resolve the Hoodie owner and deterministic ERC-6551 account through OnChainHoodies, quote with the HoodWallet address as `swapper`, then pass the prepared call to the HoodWallet's authorized execution method.
- Never treat a token-bound account as having a standalone private key. Its current NFT owner or another explicitly authorized controller must approve and execute the call.
- The OnChainHoodies public API provides identity, ownership, and wallet context. It does not itself authorize or sign a HoodWallet transaction.

## Trade workflow

1. Resolve the requested assets by symbol, name, or contract address.
2. Confirm both assets are on Robinhood Chain and identify decimals. Treat native ETH as `0x0000000000000000000000000000000000000000`.
3. Convert the human input to a raw integer amount without floating-point arithmetic.
4. Run `node scripts/quote.mjs --token-in ... --token-out ... --amount ... --decimals ... [--swapper ...]` or call `/quote` directly.
5. Show the selected provider, input, expected output, price impact if present, pool constraint if present, and any warnings. Do not describe a quote as guaranteed.
6. Require the user to explicitly approve preparation.
7. If the input is ERC-20 and the quote reports an approval, prepare the required approval transaction(s). Do not silently approve unlimited spending.
8. Run `node scripts/prepare-swap.mjs --quote-file quote.json` or call `/swap/prepare` with the selected provider quote.
9. Verify chain ID, target, value, calldata presence, token pair, and amount again.
10. Return the unsigned transaction to the selected signer adapter for explicit review. For `och-hoodwallet`, wrap only the exact prepared target, value, and calldata in the HoodWallet execution call after verifying current Hoodie ownership.
11. Never broadcast it from the agent unless the user has separately enabled an authorized wallet tool or policy and approved the exact action.

## Launch workflow

1. Collect the required name, ticker, description, public image URL, creator email, creator wallet, and pair mode.
2. If pairing with a stock token, resolve the address from `GET /stocks`; never accept an arbitrary stock-pair address.
3. Submit the canonical preflight payload with `source: "launchpad"`, `mode: "preflight"`, and `dryRun: true`.
4. Present the predicted token and pool, total supply, fee, full beneficiary split, pair, safety properties, gas estimate, and transaction target.
5. Stop for user review. The preflight is not authorization to launch.
6. Only the creator account may authorize and send the returned Airlock transaction. A HoodWallet creator must execute it through the authorized ERC-6551 account path.

## Determinism and error handling

- Use raw integer amounts in API calls and preserve them as strings.
- Do not invent token decimals, addresses, pool IDs, quotes, balances, or route availability.
- A `404` from `/quote` means no executable route was found; do not fabricate a fallback.
- A provider marked `NO ROUTE` or `NOT CONFIGURED` is unavailable for that request.
- Requote immediately before transaction preparation if the prior quote is stale or the amount changes.
- Treat all prepared transactions as expired when their quote or deadline expires.
- Surface user rejection as cancellation, not transaction failure.

## API and client

- Production base URL: `https://hoodieswap.xyz/api/v1`
- OpenAPI: `https://hoodieswap.xyz/api/v1/openapi.json`
- Repository specification: [openapi/hoodieswap-v1.yaml](openapi/hoodieswap-v1.yaml)
- TypeScript client: [src/client.ts](src/client.ts)
- Capability discovery: `GET /capabilities`

Hoodieswap prepares routes and transactions. The wallet remains the signing boundary and Hoodieswap never takes custody.
