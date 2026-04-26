import { kv } from "@vercel/kv";

export type Announcement = {
  id: string;
  title: string;
  content: string;
  date: string;
  type: string;
};

export type BoardMember = {
  id: string;
  name: string;
  position: string;
  email: string;
  phone?: string;
  initials?: string;
};

const KEY_ANNOUNCEMENTS = "rr:announcements";
const KEY_BOARD = "rr:board";

export async function getAnnouncements(): Promise<Announcement[]> {
  const data = await kv.get<Announcement[]>(KEY_ANNOUNCEMENTS);
  return Array.isArray(data) ? data : [];
}

export async function setAnnouncements(items: Announcement[]) {
  await kv.set(KEY_ANNOUNCEMENTS, items);
}

export async function getBoard(): Promise<BoardMember[]> {
  const data = await kv.get<BoardMember[]>(KEY_BOARD);
  return Array.isArray(data) ? data : [];
}

export async function setBoard(items: BoardMember[]) {
  await kv.set(KEY_BOARD, items);
}

