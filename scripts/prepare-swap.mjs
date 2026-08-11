#!/usr/bin/env node

import { readFile } from "node:fs/promises";

const args = Object.fromEntries(process.argv.slice(2).flatMap((value, index, all) => value.startsWith("--") ? [[value.slice(2), all[index + 1]]] : []));
if (!args["quote-file"]) throw new Error("Missing --quote-file");
const stored = JSON.parse(await readFile(args["quote-file"], "utf8"));
const selected = stored.best || stored;
if (!selected.provider) throw new Error("Quote file does not contain a provider");
const response = await fetch(`${args.base || "https://hoodieswap.xyz/api/v1"}/swap/prepare`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ provider: selected.provider, quote: selected.quote, transaction: selected.transaction }),
});
const body = await response.json();
if (!response.ok) throw new Error(body.error || `Swap preparation failed with ${response.status}`);
if (!body.swap?.to || !body.swap?.data) throw new Error("API did not return a complete unsigned swap transaction");
process.stdout.write(`${JSON.stringify({ chainId: 4663, ...body }, null, 2)}\n`);
