import path from "path";

export function siteContentPathInRepo() {
  return process.env.SITE_CONTENT_PATH?.trim() || "data/site-content.json";
}

export function localSiteContentFile() {
  return path.join(process.cwd(), siteContentPathInRepo());
}

export function githubContentConfig() {
  const token = process.env.GITHUB_CONTENT_TOKEN?.trim();
  const owner = process.env.GITHUB_REPO_OWNER?.trim();
  const repo = process.env.GITHUB_REPO_NAME?.trim();
  const branch = process.env.GITHUB_CONTENT_BRANCH?.trim() || "main";
  const filePath = siteContentPathInRepo();
  if (!token || !owner || !repo) return null;
  return { token, owner, repo, branch, filePath };
}
