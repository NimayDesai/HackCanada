export function parseString(input: string): string {
  return input
    .substring(3, input.length - 2)
    .replace(/", "/g, " ")
    .replace(/", \n"/g, " ");
}
