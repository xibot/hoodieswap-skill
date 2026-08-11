# Transaction safety rules

1. Never ask for a seed phrase, private key, raw signing key, or custodial deposit.
2. Never sign on behalf of a user. Return unsigned transaction data only.
3. Never submit a swap or launch merely because the user requested a quote or simulation.
4. Before wallet handoff, show chain, asset addresses, human and raw amounts, expected output, provider, target, native value, and material warnings.
5. Reject any prepared transaction whose chain ID is not `4663`.
6. Reject unexpected transaction targets or calldata-free contract interactions.
7. For an ERC-20 approval, show the token and spender. Prefer the minimum required allowance when the caller can safely override an unlimited prepared allowance.
8. Do not claim a route is safe solely because an API returned it. Preserve provider and pool provenance.
9. Treat a wallet rejection as `CANCELLED_BY_USER`, not `FAILED`.
10. Never retry, replace, or increase gas after a rejection without fresh, explicit approval.
11. Requote after material delay, amount change, asset change, or route change.
12. For launches, require a successful dry-run preflight and display the entire beneficiary split before signing.

## Launch invariants

- Fixed supply: 100,000,000,000 tokens.
- Full supply enters the Doppler sale/pool path.
- No creator allocation, hidden allocation, burn allocation, vesting allocation, token admin, manual renounce, governance module, or migration module.
- Trading fee: 1%.
- Fee split: Doppler protocol 5%, creator 57%, Hoodieswap launchpad 19%, treasury 19%.
- The protocol beneficiary is resolved dynamically from the Doppler Airlock owner.
