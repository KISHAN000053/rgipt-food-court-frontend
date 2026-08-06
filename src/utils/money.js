// Every rupee amount shown in the UI goes through this, so totals never render
// as 100.30000000000001 or 6.7 instead of 6.70.
export function money(value) {
  const n = Number(value)
  if (!isFinite(n)) return '0.00'
  return n.toFixed(2)
}
