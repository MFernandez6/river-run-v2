import { kv } from "@vercel/kv";

export type Announcement = {
  id: string;
  title: string;
  content: string;
  date: string;
  type: string;
  updatedAt?: string;
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

function kvConfigured() {
  return Boolean(
    process.env.KV_REST_API_URL ||
      process.env.UPSTASH_REDIS_REST_URL ||
      process.env.KV_URL ||
      process.env.REDIS_URL
  );
}

type MemoryState = {
  board: unknown;
  announcements: unknown;
};

function memoryState(): MemoryState {
  const g = globalThis as unknown as { __rr_admin_data_mem__?: MemoryState };
  if (!g.__rr_admin_data_mem__) g.__rr_admin_data_mem__ = { board: [], announcements: [] };
  return g.__rr_admin_data_mem__;
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const data = kvConfigured()
    ? await kv.get<Announcement[]>(KEY_ANNOUNCEMENTS)
    : (memoryState().announcements as Announcement[]);
  return Array.isArray(data) ? data : [];
}

export async function setAnnouncements(items: Announcement[]) {
  if (kvConfigured()) await kv.set(KEY_ANNOUNCEMENTS, items);
  else memoryState().announcements = items;
}

export async function getBoard(): Promise<BoardMember[]> {
  const data = kvConfigured()
    ? await kv.get<BoardMember[]>(KEY_BOARD)
    : (memoryState().board as BoardMember[]);
  return Array.isArray(data) ? data : [];
}

export async function setBoard(items: BoardMember[]) {
  if (kvConfigured()) await kv.set(KEY_BOARD, items);
  else memoryState().board = items;
}

