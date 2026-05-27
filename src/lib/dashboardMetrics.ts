export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

export function ratioPercent(numerator: number, denominator: number): number | null {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) {
    return null;
  }
  return (numerator / denominator) * 100;
}

export function formatDashboardPercent(
  value: number | null | undefined,
  options: { decimals?: number; fallback?: string; highLabel?: "multiple" | "capped" } = {},
): string {
  const { decimals = 0, fallback = "N/A", highLabel = "multiple" } = options;
  if (value === null || value === undefined || !Number.isFinite(value)) return fallback;

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1000 && highLabel === "multiple") {
    return `${sign}${(absValue / 100).toFixed(1)}x`;
  }

  if (absValue >= 1000 && highLabel === "capped") {
    return `${sign}>999%`;
  }

  return `${value.toFixed(decimals)}%`;
}

export function formatDashboardDelta(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "No comparison";
  if (value >= 1000) return "New activity";
  if (value <= -99.9) return "No prior baseline";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function percentBarWidth(value: number | null | undefined): string {
  return `${clampPercent(value ?? 0)}%`;
}
