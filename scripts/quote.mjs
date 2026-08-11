#!/usr/bin/env node

const args = Object.fromEntries(process.argv.slice(2).flatMap((value, index, all) => value.startsWith("--") ? [[value.slice(2), all[index + 1]]] : []));
const required = ["token-in", "token-out", "amount", "decimals"];
for (const key of required) if (!args[key]) throw new Error(`Missing --${key}`);
if (!/^\d+(\.\d+)?$/.test(args.amount)) throw new Error("--amount must be a positive decimal string");
const decimals = Number(args.decimals);
if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255) throw new Error("--decimals must be an integer from 0 to 255");

function toRaw(value, places) {
  const [whole, fraction = ""] = value.split(".");
  if (fraction.length > places) throw new Error("--amount has more precision than --decimals");
  return (BigInt(whole) * 10n ** BigInt(places) + BigInt((fraction + "0".repeat(places)).slice(0, places) || "0")).toString();
}

const response = await fetch(`${args.base || "https://hoodieswap.xyz/api/v1"}/quote`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ tokenIn: args["token-in"], tokenOut: args["token-out"], amount: toRaw(args.amount, decimals), formattedAmount: args.amount, ...(args.swapper ? { swapper: args.swapper } : {}), ...(args.pool ? { exactPool: args.pool } : {}) }),
});
const body = await response.json();
if (!response.ok) throw new Error(body.error || `Quote failed with ${response.status}`);
process.stdout.write(`${JSON.stringify(body, null, 2)}\n`);
