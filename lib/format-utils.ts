/**
 * Format a number consistently on both server and client
 * Uses US locale format (comma separator) to ensure SSR/client hydration match
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format currency values with appropriate decimals
 */
export function formatCurrency(num: number, decimals = 2): string {
  const rounded = Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
