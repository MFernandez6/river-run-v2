import type { Announcement, BoardMember } from "@/lib/admin-types";

export type SiteContent = {
  version: 1;
  announcements: Announcement[];
  board: BoardMember[];
};

export function emptySiteContent(): SiteContent {
  return { version: 1, announcements: [], board: [] };
}
