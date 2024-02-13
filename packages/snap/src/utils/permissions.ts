export function isTrustedDapp(origin: string, trustedDapps: string[]) {
  return trustedDapps.includes(new URL(origin).hostname);
}
