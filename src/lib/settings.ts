import { db } from "@/lib/db";

// Used only if the settings rows are missing
const DEFAULT_FEE = 9900;
const DEFAULT_FREE_ABOVE = 149900;

export async function getShippingSettings() {
  const rows = await db.setting.findMany({
    where: { key: { in: ["shipping_fee", "free_shipping_above"] } },
  });
  const read = (key: string, fallback: number) => {
    const value = Number(rows.find((row) => row.key === key)?.value);
    return Number.isInteger(value) && value >= 0 ? value : fallback;
  };
  return {
    fee: read("shipping_fee", DEFAULT_FEE),
    freeAbove: read("free_shipping_above", DEFAULT_FREE_ABOVE),
  };
}
