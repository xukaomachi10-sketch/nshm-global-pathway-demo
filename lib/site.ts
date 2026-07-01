function normalizeUrl(value: string | undefined): URL | undefined {
  if (!value) return undefined;

  const candidate = value.startsWith("http") ? value : `https://${value}`;

  try {
    return new URL(candidate);
  } catch {
    return undefined;
  }
}

export function getSiteUrl(): URL | undefined {
  return normalizeUrl(
    process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
  );
}
