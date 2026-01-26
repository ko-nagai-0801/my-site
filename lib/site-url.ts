// lib/site-url.ts
export function getSiteUrl(): string {
  // 1) 明示指定（最優先）: ここが常に正
  const fromPublic = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromPublic) return fromPublic.replace(/\/$/, "");

  // 2) Netlify（存在する場合）
  // - production: URL
  // - deploy preview: DEPLOY_PRIME_URL
  const netlifyUrl =
    process.env.URL?.trim() ||
    process.env.DEPLOY_PRIME_URL?.trim();

  if (netlifyUrl) return netlifyUrl.replace(/\/$/, "");

  // 3) Vercel（存在する場合）
  const vercelEnv = process.env.VERCEL_ENV?.trim(); // "production" | "preview" | "development" など
  const prodHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const branchHost = process.env.VERCEL_BRANCH_URL?.trim();
  const anyHost = process.env.VERCEL_URL?.trim();

  const host =
    (vercelEnv === "production" && prodHost) ? prodHost :
    (vercelEnv !== "production" && branchHost) ? branchHost :
    anyHost || prodHost;

  if (host) return `https://${host.replace(/\/$/, "")}`;

  // 4) 最後の砦
  return "http://localhost:3000";
}

export function isProduction(): boolean {
  // Netlify: CONTEXT=production / deploy-preview / branch-deploy
  const netlifyCtx = process.env.CONTEXT?.trim();
  if (netlifyCtx) return netlifyCtx === "production";

  // Vercel or NODE_ENV
  return (process.env.VERCEL_ENV ?? process.env.NODE_ENV) === "production";
}
