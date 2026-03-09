export const formatPlugboard = (cables: Record<string, string>): string => {
  const pairs = Object.entries(cables)
    .filter(([key, value]) => key < value)
    .map(([key, value]) => `${key}↔${value}`);
  return pairs.length > 0 ? pairs.join(', ') : '—';
};
