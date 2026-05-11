import { readFileSync, writeFileSync, existsSync } from "fs";
import { emptySiteContent, type SiteContent } from "@/lib/site-content/types";
import { parseSiteContentJson } from "@/lib/site-content/parse";
import { githubContentConfig, localSiteContentFile } from "@/lib/site-content/env";

const GH_ACCEPT = "application/vnd.github+json";
const GH_API = "https://api.github.com";

type GithubMeta = { sha?: string; text: string };

async function fetchGithubFile(): Promise<GithubMeta> {
  const cfg = githubContentConfig();
  if (!cfg) throw new Error("GitHub content is not configured");

  const url = `${GH_API}/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(
    cfg.filePath,
  )}?ref=${encodeURIComponent(cfg.branch)}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: GH_ACCEPT,
      Authorization: `Bearer ${cfg.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (res.status === 404) {
    return { sha: undefined, text: JSON.stringify(emptySiteContent(), null, 2) };
  }
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`GitHub read failed (${res.status}): ${t.slice(0, 200)}`);
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

  const url = `${GH_API}/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(
    cfg.filePath,
  )}`;
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
      Accept: GH_ACCEPT,
      Authorization: `Bearer ${cfg.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`GitHub write failed (${res.status}): ${t.slice(0, 300)}`);
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
