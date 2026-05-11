import type { Announcement, BoardMember } from "@/lib/admin-types";
import { emptySiteContent, type SiteContent } from "@/lib/site-content/types";

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function normalizeAnnouncement(raw: unknown): Announcement | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = asString(o.id);
  if (!id) return null;
  return {
    id,
    title: asString(o.title),
    content: asString(o.content),
    dateLabel: asString(o.dateLabel),
    type: asString(o.type, "Update"),
    createdAt: asString(o.createdAt),
  };
}

function normalizeBoardMember(raw: unknown): BoardMember | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = asString(o.id);
  if (!id) return null;
  return {
    id,
    name: asString(o.name),
    position: asString(o.position),
    email: asString(o.email),
    phone: typeof o.phone === "string" || o.phone === null ? o.phone : null,
    photoUrl:
      typeof o.photoUrl === "string" || o.photoUrl === null ? o.photoUrl : null,
    createdAt: asString(o.createdAt),
  };
}

export function parseSiteContentJson(raw: string): SiteContent {
  try {
    const j = JSON.parse(raw) as unknown;
    if (!j || typeof j !== "object") return emptySiteContent();
    const root = j as Record<string, unknown>;
    const announcements = Array.isArray(root.announcements)
      ? root.announcements
          .map(normalizeAnnouncement)
          .filter(Boolean) as Announcement[]
      : [];
    const board = Array.isArray(root.board)
      ? root.board.map(normalizeBoardMember).filter(Boolean) as BoardMember[]
      : [];
    return {
      version: 1,
      announcements: announcements.slice(0, 20),
      board: board.slice(0, 40),
    };
  } catch {
    return emptySiteContent();
  }
}
