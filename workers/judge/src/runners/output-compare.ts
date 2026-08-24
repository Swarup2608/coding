export function normalizeOutput(value: string): string {
  return value.replace(/\r\n/g, "\n").trim();
}

export function outputsMatch(actual: string, expected: string): boolean {
  return normalizeOutput(actual) === normalizeOutput(expected);
}
