export function formatNumber(n: number): string {
  return n.toLocaleString(["pt-BR"], {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}
