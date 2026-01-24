// lib/site-url.ts
export function getSiteUrl(): string {
  // 1) 明示指定（最優先）
  const fromPublic = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromPublic) return fromPublic.replace(/\/$/, "");

  // 2) Vercel のシステム環境変数（存在する場合）
  const vercelEnv = process.env.VERCEL_ENV?.trim(); // "production" | "preview" | "development" など
  const prodHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const branchHost = process.env.VERCEL_BRANCH_URL?.trim();
  const anyHost = process.env.VERCEL_URL?.trim();

  // production は production URL を優先、preview は branch URL を優先
  const host =
    (vercelEnv === "production" && prodHost) ? prodHost :
    (vercelEnv !== "production" && branchHost) ? branchHost :
    anyHost || prodHost;

  if (host) return `https://${host.replace(/\/$/, "")}`;

  // 3) 最後の砦
  return "http://localhost:3000";
}

export function isProduction(): boolean {
  return (process.env.VERCEL_ENV ?? process.env.NODE_ENV) === "production";
}
