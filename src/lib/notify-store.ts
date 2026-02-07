import { promises as fs } from "node:fs";

type Store = {
  notifiedPaymentIds: string[];
};

function storePath() {
  return process.env.NOTIFY_STORE_PATH || "/tmp/mo-consult-notify.json";
}

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(storePath(), "utf8");
    const parsed = JSON.parse(raw) as Store;
    if (!parsed || !Array.isArray(parsed.notifiedPaymentIds)) {
      return { notifiedPaymentIds: [] };
    }
    return parsed;
  } catch {
    return { notifiedPaymentIds: [] };
  }
}

async function writeStore(store: Store) {
  await fs.writeFile(storePath(), JSON.stringify(store, null, 2), "utf8");
}

export async function wasPaymentNotified(paymentId: string) {
  const s = await readStore();
  return s.notifiedPaymentIds.includes(paymentId);
}

export async function markPaymentNotified(paymentId: string) {
  const s = await readStore();
  if (s.notifiedPaymentIds.includes(paymentId)) return;
  s.notifiedPaymentIds.push(paymentId);
  await writeStore(s);
}

