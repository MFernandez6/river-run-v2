"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type SetStateAction,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Building2,
  ExternalLink,
  LogOut,
  Plus,
  Save,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Announcement, BoardMember } from "@/lib/admin-data";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveBanner, setSaveBanner] = useState<"ok" | "err" | null>(null);

  const [board, setBoard] = useState<BoardMember[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const boardTouchedRef = useRef(false);
  const announcementsTouchedRef = useRef(false);
  const [focusBoardId, setFocusBoardId] = useState<string | null>(null);
  const [focusAnnouncementId, setFocusAnnouncementId] = useState<
    string | null
  >(null);

  function patchBoard(updater: SetStateAction<BoardMember[]>) {
    boardTouchedRef.current = true;
    setBoard(updater);
  }

  function patchAnnouncements(updater: SetStateAction<Announcement[]>) {
    announcementsTouchedRef.current = true;
    setAnnouncements(updater);
  }

  const hasData = useMemo(
    () => board.length > 0 || announcements.length > 0,
    [board.length, announcements.length]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [b, a] = await Promise.all([
        fetch("/api/admin/board").then((r) => r.json()),
        fetch("/api/admin/announcements").then((r) => r.json()),
      ]);
      if (cancelled) return;
      setBoard(Array.isArray(b?.items) ? b.items : []);
      setAnnouncements(Array.isArray(a?.items) ? a.items : []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (saveBanner !== "ok") return;
    const t = setTimeout(() => setSaveBanner(null), 3200);
    return () => clearTimeout(t);
  }, [saveBanner]);

  async function saveAll() {
    setSaving(true);
    setSaveBanner(null);
    try {
      let annSource = announcements;
      if (!announcementsTouchedRef.current) {
        const r = await fetch("/api/admin/announcements");
        const j = await r.json();
        annSource = Array.isArray(j?.items) ? j.items : [];
      }
      let boardSource = board;
      if (!boardTouchedRef.current) {
        const r = await fetch("/api/admin/board");
        const j = await r.json();
        boardSource = Array.isArray(j?.items) ? j.items : [];
      }

      const normalizedAnnouncements = annSource
        .map((a) => ({
          ...a,
          updatedAt: a.updatedAt ?? new Date().toISOString(),
        }))
        .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
        .slice(0, 6);

      const res = await Promise.all([
        fetch("/api/admin/board", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ items: boardSource }),
        }),
        fetch("/api/admin/announcements", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ items: normalizedAnnouncements }),
        }),
      ]);
      const bad = res.find((r) => !r.ok);
      if (bad) throw new Error("Save failed");
      setAnnouncements(normalizedAnnouncements);
      setBoard(boardSource);
      announcementsTouchedRef.current = false;
      boardTouchedRef.current = false;
      setSaveBanner("ok");
      router.refresh();
    } catch {
      setSaveBanner("err");
    } finally {
      setSaving(false);
    }
  }

  function addBoardMember() {
    const id = uid();
    patchBoard((prev) => [
      ...prev,
      { id, name: "", position: "", email: "", phone: "" },
    ]);
    setFocusBoardId(id);
  }

  function addAnnouncement() {
    const id = uid();
    patchAnnouncements((prev) => [
      ...prev,
      { id, title: "", content: "", date: "", type: "Update" },
    ]);
    setFocusAnnouncementId(id);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200">
      <header className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 rounded-lg text-gray-800 hover:text-amber-800 transition-colors min-w-0"
            >
              <Building2 className="h-8 w-8 text-amber-700 shrink-0" />
              <span className="text-base sm:text-lg truncate">
                <span className="font-bold">River Run</span>
                <span className="text-gray-600 font-normal"> · Admin</span>
              </span>
            </Link>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full border-amber-200/80 bg-white/50 text-gray-800 hover:bg-amber-50"
            >
              <Link href="/" prefetch>
                <ExternalLink className="h-4 w-4" />
                View site
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full border-amber-200/80 bg-white/50 text-gray-800 hover:bg-amber-50"
            >
              <Link href="/#announcements" prefetch={false}>
                <Bell className="h-4 w-4" />
                News preview
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full border-amber-200/80 bg-white/50 text-gray-800 hover:bg-amber-50"
            >
              <Link href="/#board" prefetch={false}>
                <Users className="h-4 w-4" />
                Board preview
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-amber-200/80 bg-white/50"
              disabled={loading}
              onClick={() =>
                downloadJson("river-run-backup.json", {
                  exportedAt: new Date().toISOString(),
                  board,
                  announcements,
                })
              }
            >
              Export backup
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-amber-200/80 bg-white/50"
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                router.push("/admin/login");
                router.refresh();
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
            <Button
              size="sm"
              className="rounded-full bg-amber-700 hover:bg-amber-800 text-white shadow-md"
              disabled={saving || loading}
              onClick={saveAll}
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {saveBanner === "ok" && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900 shadow-sm"
          >
            Changes saved. Residents will see updates on the live site right
            away.
          </motion.div>
        )}
        {saveBanner === "err" && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-sm">
            Something went wrong while saving. Check your connection and try
            again.
            <Button
              variant="link"
              className="ml-2 h-auto p-0 text-red-900"
              onClick={() => setSaveBanner(null)}
            >
              Dismiss
            </Button>
          </div>
        )}

        <div className="glass border-0 shadow-xl rounded-2xl px-5 py-6 sm:px-8 sm:py-7">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            Content dashboard
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Update the board directory and homepage announcements in one place.
            Use{" "}
            <span className="font-semibold text-amber-900">Save changes</span>{" "}
            when you are ready to publish.
          </p>
        </div>

        {loading ? (
          <Card className="glass border-0 shadow-xl rounded-2xl">
            <CardContent className="p-8 text-center text-gray-600">
              Loading your saved content…
            </CardContent>
          </Card>
        ) : (
          <>
            {!hasData && (
              <Card className="glass border-0 shadow-xl rounded-2xl">
                <CardContent className="p-6 text-gray-700">
                  <p className="font-medium text-gray-800">Start here</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Add a board member or announcement below, then click{" "}
                    <span className="font-semibold">Save changes</span> to go
                    live.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <Card className="glass border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/30 bg-white/20 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                        <Users className="h-5 w-5 text-amber-700" />
                        Board members
                      </CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        Name, role, and contact as shown on the public site.
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="rounded-full shrink-0 bg-amber-700 hover:bg-amber-800 text-white"
                      onClick={addBoardMember}
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-5">
                  <AnimatePresence initial={false} mode="popLayout">
                    {board.map((m, idx) => (
                      <motion.div
                        key={m.id}
                        layout
                        initial={{ opacity: 0, y: 10, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.99 }}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 30,
                        }}
                        className="rounded-2xl border border-white/40 bg-white/55 shadow-sm backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-2 border-b border-white/30">
                          <span className="text-sm font-semibold text-gray-800 truncate">
                            {m.name.trim() || `Member ${idx + 1}`}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                            onClick={() =>
                              patchBoard((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            aria-label="Remove board member"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label className="block space-y-1">
                            <span className="text-xs font-medium text-gray-600">
                              Name
                            </span>
                            <input
                              value={m.name}
                              autoFocus={focusBoardId === m.id}
                              onBlur={() => {
                                if (focusBoardId === m.id) setFocusBoardId(null);
                              }}
                              onChange={(e) => {
                                const v = e.target.value;
                                patchBoard((prev) =>
                                  prev.map((x, i) =>
                                    i === idx ? { ...x, name: v } : x
                                  )
                                );
                              }}
                              placeholder="Full name"
                              className="w-full rounded-xl border border-white/40 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300/80"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-xs font-medium text-gray-600">
                              Position
                            </span>
                            <input
                              value={m.position}
                              onChange={(e) => {
                                const v = e.target.value;
                                patchBoard((prev) =>
                                  prev.map((x, i) =>
                                    i === idx ? { ...x, position: v } : x
                                  )
                                );
                              }}
                              placeholder="e.g. President"
                              className="w-full rounded-xl border border-white/40 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300/80"
                            />
                          </label>
                          <label className="block space-y-1 sm:col-span-2">
                            <span className="text-xs font-medium text-gray-600">
                              Email
                            </span>
                            <input
                              value={m.email}
                              onChange={(e) => {
                                const v = e.target.value;
                                patchBoard((prev) =>
                                  prev.map((x, i) =>
                                    i === idx ? { ...x, email: v } : x
                                  )
                                );
                              }}
                              placeholder="Email"
                              className="w-full rounded-xl border border-white/40 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300/80"
                            />
                          </label>
                          <label className="block space-y-1 sm:col-span-2">
                            <span className="text-xs font-medium text-gray-600">
                              Phone{" "}
                              <span className="font-normal text-gray-500">
                                (optional)
                              </span>
                            </span>
                            <input
                              value={m.phone ?? ""}
                              onChange={(e) => {
                                const v = e.target.value;
                                patchBoard((prev) =>
                                  prev.map((x, i) =>
                                    i === idx ? { ...x, phone: v } : x
                                  )
                                );
                              }}
                              placeholder="Phone"
                              className="w-full rounded-xl border border-white/40 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300/80"
                            />
                          </label>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {board.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-6">
                      No members yet. Tap{" "}
                      <span className="font-medium text-gray-700">Add</span> to
                      create one.
                    </p>
                  ) : null}
                </CardContent>
              </Card>

              <Card className="glass border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/30 bg-white/20 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                        <Bell className="h-5 w-5 text-amber-700" />
                        Recent announcements
                      </CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        Up to six items; newest appear first on the homepage.
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="rounded-full shrink-0 bg-amber-700 hover:bg-amber-800 text-white"
                      onClick={addAnnouncement}
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-5">
                  <AnimatePresence initial={false} mode="popLayout">
                    {announcements.map((a, idx) => (
                      <motion.div
                        key={a.id}
                        layout
                        initial={{ opacity: 0, y: 10, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.99 }}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 30,
                        }}
                        className="rounded-2xl border border-white/40 bg-white/55 shadow-sm backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-2 border-b border-white/30">
                          <span className="text-sm font-semibold text-gray-800 truncate">
                            {a.title.trim() || `Announcement ${idx + 1}`}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                            onClick={() =>
                              patchAnnouncements((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            aria-label="Remove announcement"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label className="block space-y-1 sm:col-span-2">
                            <span className="text-xs font-medium text-gray-600">
                              Title
                            </span>
                            <input
                              value={a.title}
                              autoFocus={focusAnnouncementId === a.id}
                              onBlur={() => {
                                if (focusAnnouncementId === a.id) {
                                  setFocusAnnouncementId(null);
                                }
                              }}
                              onChange={(e) => {
                                const v = e.target.value;
                                patchAnnouncements((prev) =>
                                  prev.map((x, i) =>
                                    i === idx ? { ...x, title: v } : x
                                  )
                                );
                              }}
                              placeholder="Headline"
                              className="w-full rounded-xl border border-white/40 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300/80"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-xs font-medium text-gray-600">
                              Date
                            </span>
                            <input
                              value={a.date}
                              onChange={(e) => {
                                const v = e.target.value;
                                patchAnnouncements((prev) =>
                                  prev.map((x, i) =>
                                    i === idx ? { ...x, date: v } : x
                                  )
                                );
                              }}
                              placeholder="e.g. March 5, 2026"
                              className="w-full rounded-xl border border-white/40 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300/80"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-xs font-medium text-gray-600">
                              Type
                            </span>
                            <input
                              value={a.type}
                              onChange={(e) => {
                                const v = e.target.value;
                                patchAnnouncements((prev) =>
                                  prev.map((x, i) =>
                                    i === idx ? { ...x, type: v } : x
                                  )
                                );
                              }}
                              placeholder="Meeting, Update…"
                              className="w-full rounded-xl border border-white/40 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300/80"
                            />
                          </label>
                          <label className="block space-y-1 sm:col-span-2">
                            <span className="text-xs font-medium text-gray-600">
                              Content
                            </span>
                            <textarea
                              value={a.content}
                              onChange={(e) => {
                                const v = e.target.value;
                                patchAnnouncements((prev) =>
                                  prev.map((x, i) =>
                                    i === idx ? { ...x, content: v } : x
                                  )
                                );
                              }}
                              placeholder="Body text shown on the card"
                              rows={5}
                              className="w-full rounded-xl border border-white/40 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300/80 resize-y min-h-[120px]"
                            />
                          </label>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {announcements.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-6">
                      No announcements yet. Tap{" "}
                      <span className="font-medium text-gray-700">Add</span> to
                      write one.
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
