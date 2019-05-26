function getAuthorizationHeader(accountConfig) {
  if (!accountConfig) {
    return undefined;
  }
  const { accountId, apiKey, password } = accountConfig;
  if (apiKey) {
    return `Bearer ${apiKey}`;
  }
  if (accountId && password) {
    const buffer = Buffer.from(`${accountId}:${password}`);
    return `Basic ${buffer.toString("base64")}`;
  }
  return undefined;
}

export default getAuthorizationHeader;
