# OnChainHoodies HoodWallet signer profile

Use this profile when an agent trades or launches through the deterministic ERC-6551 account attached to an OnChainHoodies NFT.

## Sources

- OnChainHoodies API: `https://api.onchainhoodies.xyz`
- OpenAPI: `https://api.onchainhoodies.xyz/openapi.json`
- HoodWallet UI: `https://www.onchainhoodies.xyz/hoodwallet`
- Token owner: `GET /v1/token/{tokenId}/owner`
- Owner inventory: `GET /v1/wallet/{address}/hoodies`

## Required checks

1. Resolve the Hoodie token ID, current NFT owner, and deterministic HoodWallet address.
2. Verify the HoodWallet is deployed or that the supported execution path can deploy it deterministically.
3. Verify Robinhood Chain ID `4663` and use the HoodWallet address as the Hoodieswap `swapper`/recipient.
4. Quote and prepare through Hoodieswap without changing the returned target, value, calldata, token pair, amount, deadline, or minimum output.
5. For ERC-20 sells, check the HoodWallet's balance and allowance; prepare only the required approval before the swap.
6. Wrap the prepared transaction as an ERC-6551 account execution only after confirming that the requesting signer is the current NFT owner or an explicitly authorized controller.
7. Simulate the outer HoodWallet execution call when simulation is available.
8. Show the owner/controller both the inner Hoodieswap call and outer HoodWallet call before authorization.

## Agent policy

- Default to `prepare-only`. Do not broadcast automatically.
- An autonomous agent may broadcast only when its wallet runtime has explicit transaction authority, chain and contract allowlists, spend/slippage limits, and an auditable approval policy.
- Recheck NFT ownership immediately before execution because control of an ERC-6551 account follows the NFT.
- Never request or export an owner private key.
- Never infer authorization merely because an agent knows the HoodWallet address or owns an unrelated Hoodie.
- Report wallet rejection as cancellation and a failed simulation or reverted receipt as failure.

## Launch semantics

A HoodWallet may be the creator address when the launch transaction is executed by that ERC-6551 account. The creator fee beneficiary must equal the intended HoodWallet address in the reviewed simulation. Token supply, pair, fee split, and no-allocation rules remain unchanged.
