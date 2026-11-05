/** Formats paise as rupees, e.g. 69900 → ₹699, 69950 → ₹699.50 */
export function formatPrice(paise: number) {
  const rupees = paise / 100;
  return `₹${rupees.toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(rupees) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Parses a rupee amount typed in a form into paise, or null if it isn't valid. */
export function rupeesToPaise(value: string) {
  const trimmed = value.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;
  const [whole, fraction = ""] = trimmed.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}

export function shippingFor(subtotal: number, fee: number, freeAbove: number) {
  if (subtotal === 0 || subtotal >= freeAbove) return 0;
  return fee;
}
