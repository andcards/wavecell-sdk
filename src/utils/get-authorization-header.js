function getAuthorizationHeader(accountConfig) {
  if (!accountConfig) {
    return undefined;
  }
  const { accountId, accountPassword, apiKey } = accountConfig;
  if (apiKey) {
    return `Bearer ${apiKey}`;
  }
  if (accountId && accountPassword) {
    const buffer = Buffer.from(`${accountId}:${accountPassword}`);
    return `Basic ${buffer.toString("base64")}`;
  }
  return undefined;
}

export default getAuthorizationHeader;
