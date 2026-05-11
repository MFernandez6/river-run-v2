import { readFileSync, writeFileSync, existsSync } from "fs";
import { emptySiteContent, type SiteContent } from "@/lib/site-content/types";
import { parseSiteContentJson } from "@/lib/site-content/parse";
import { githubContentConfig, localSiteContentFile } from "@/lib/site-content/env";

const GH_ACCEPT = "application/vnd.github+json";
const GH_API = "https://api.github.com";
/** GitHub rejects API calls without a descriptive User-Agent (common on serverless). */
const GH_HEADERS_BASE = {
  Accept: GH_ACCEPT,
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "RiverRunCondo-site/1.0 (admin-content; +https://riverrunmiami.com)",
} as const;

type GithubMeta = { sha?: string; text: string };

function githubErrorMessage(status: number, bodyText: string): string {
  let detail = bodyText.slice(0, 400).trim();
  try {
    const j = JSON.parse(bodyText) as { message?: string; errors?: unknown };
    if (typeof j.message === "string") detail = j.message;
  } catch {
    /* keep raw slice */
  }
  return `GitHub ${status}: ${detail || "(no body)"}`;
}

async function fetchGithubFile(): Promise<GithubMeta> {
  const cfg = githubContentConfig();
  if (!cfg) throw new Error("GitHub content is not configured");

  const pathInUrl = cfg.filePath
    .split("/")
    .map((s) => encodeURIComponent(s))
    .join("/");
  const url = `${GH_API}/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(
    cfg.repo,
  )}/contents/${pathInUrl}?ref=${encodeURIComponent(cfg.branch)}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      ...GH_HEADERS_BASE,
      Authorization: `Bearer ${cfg.token}`,
    },
  });

  if (res.status === 404) {
    return { sha: undefined, text: JSON.stringify(emptySiteContent(), null, 2) };
  }
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`GitHub read failed — ${githubErrorMessage(res.status, t)}`);
  }

  const json = (await res.json()) as {
    sha?: string;
    content?: string;
    encoding?: string;
  };
  if (typeof json.content !== "string" || json.encoding !== "base64") {
    throw new Error("Unexpected GitHub contents response");
  }
  const text = Buffer.from(json.content, "base64").toString("utf8");
  return { sha: json.sha, text };
}

async function putGithubFile(body: string, sha: string | undefined) {
  const cfg = githubContentConfig();
  if (!cfg) throw new Error("GitHub content is not configured");

  const pathInUrl = cfg.filePath
    .split("/")
    .map((s) => encodeURIComponent(s))
    .join("/");
  const url = `${GH_API}/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(
    cfg.repo,
  )}/contents/${pathInUrl}`;
  const content = Buffer.from(body, "utf8").toString("base64");
  const payload: Record<string, string> = {
    message: "chore(site): update board & announcements [admin]",
    content,
    branch: cfg.branch,
  };
  if (sha) payload.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    cache: "no-store",
    headers: {
      ...GH_HEADERS_BASE,
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`GitHub write failed — ${githubErrorMessage(res.status, t)}`);
  }
}

export async function readSiteContent(): Promise<SiteContent> {
  const gh = githubContentConfig();
  if (gh) {
    const { text } = await fetchGithubFile();
    return parseSiteContentJson(text);
  }

  const local = localSiteContentFile();
  if (!existsSync(local)) return emptySiteContent();
  const text = readFileSync(local, "utf8");
  return parseSiteContentJson(text);
}

export async function writeSiteContent(next: SiteContent) {
  const body = `${JSON.stringify(next, null, 2)}\n`;
  const gh = githubContentConfig();
  if (gh) {
    const { sha } = await fetchGithubFile();
    await putGithubFile(body, sha);
    return;
  }

  if (process.env.VERCEL === "1") {
    throw new Error(
      "Admin save requires GitHub: set GITHUB_CONTENT_TOKEN, GITHUB_REPO_OWNER, and GITHUB_REPO_NAME in Vercel (see README).",
    );
  }

  writeFileSync(localSiteContentFile(), body, "utf8");
}
