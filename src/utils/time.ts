export function secondAsTimer(seconds: number): string {
  const minute = Math.floor(seconds / 60);
  const second = Math.floor(seconds % 60);

  const minuteStr = minute ? `${minute}m` : "";
  const secondStr = `${second}s`;

  return `${minuteStr} ${secondStr}`;
}
