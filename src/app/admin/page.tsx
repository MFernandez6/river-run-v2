"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Bell, Building2, LogOut, Plus, Save, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Announcement, BoardMember } from "@/lib/admin-types";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<"ok" | "err" | null>(null);

  const [board, setBoard] = useState<BoardMember[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const canSave = useMemo(() => !loading && !saving, [loading, saving]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [b, a] = await Promise.all([
        fetch("/api/admin/board", { credentials: "same-origin" }).then((r) =>
          r.json()
        ),
        fetch("/api/admin/announcements", { credentials: "same-origin" }).then((r) =>
          r.json()
        ),
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

  async function saveAll() {
    setSaving(true);
    setBanner(null);
    try {
      const res = await Promise.all([
        fetch("/api/admin/board", {
          method: "PUT",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ items: board }),
        }),
        fetch("/api/admin/announcements", {
          method: "PUT",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ items: announcements.slice(0, 4) }),
        }),
      ]);
      if (res.some((r) => !r.ok)) throw new Error("Save failed");
      setBanner("ok");
      router.refresh();
    } catch {
      setBanner("err");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200">
      <header className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

          <nav className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-amber-200/80 bg-white/50 text-gray-800 hover:bg-amber-50"
              onClick={async () => {
                await fetch("/api/admin/logout", {
                  method: "POST",
                  credentials: "same-origin",
                });
                window.location.assign("/admin/login");
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
            <Button
              size="sm"
              className="rounded-full bg-amber-700 hover:bg-amber-800 text-white shadow-md"
              disabled={!canSave}
              onClick={saveAll}
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {banner === "ok" ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900 shadow-sm"
          >
            Saved successfully.
          </motion.div>
        ) : null}
        {banner === "err" ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-sm">
            Save failed. Please try again.
          </div>
        ) : null}

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
                    Add, edit, or remove board members.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="rounded-full shrink-0 bg-amber-700 hover:bg-amber-800 text-white"
                  onClick={() =>
                    setBoard((prev) => [
                      ...prev,
                      {
                        id: uid(),
                        name: "",
                        position: "",
                        email: "rrcboardemail@gmail.com",
                        phone: "",
                        photoUrl: null,
                        createdAt: new Date().toISOString(),
                      },
                    ])
                  }
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              <AnimatePresence initial={false}>
                {board.map((m, idx) => (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="rounded-2xl border border-white/40 bg-white/55 shadow-sm backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-2 border-b border-white/30">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-semibold flex items-center justify-center shrink-0 overflow-hidden">
                          {m.photoUrl ? (
                            <Image
                              src={m.photoUrl}
                              alt={m.name}
                              width={32}
                              height={32}
                              className="w-8 h-8 object-cover"
                            />
                          ) : (
                            initialsFromName(m.name)
                          )}
                        </div>
                        <span className="text-sm font-semibold text-gray-800 truncate">
                          {m.name.trim() || `Member ${idx + 1}`}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                        onClick={() =>
                          setBoard((prev) => prev.filter((_, i) => i !== idx))
                        }
                        aria-label="Remove board member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        value={m.name}
                        onChange={(e) => {
                          const v = e.target.value;
                          setBoard((prev) =>
                            prev.map((x, i) => (i === idx ? { ...x, name: v } : x))
                          );
                        }}
                        placeholder="Name"
                        className="w-full rounded-xl border border-white/40 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300/80"
                      />
                      <input
                        value={m.position}
                        onChange={(e) => {
                          const v = e.target.value;
                          setBoard((prev) =>
                            prev.map((x, i) =>
                              i === idx ? { ...x, position: v } : x
                            )
                          );
                        }}
                        placeholder="Position"
                        className="w-full rounded-xl border border-white/40 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300/80"
                      />
                      <input
                        value={m.email}
                        onChange={(e) => {
                          const v = e.target.value;
                          setBoard((prev) =>
                            prev.map((x, i) => (i === idx ? { ...x, email: v } : x))
                          );
                        }}
                        placeholder="Email"
                        className="w-full rounded-xl border border-white/40 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300/80 sm:col-span-2"
                      />
                      <input
                        value={m.phone ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setBoard((prev) =>
                            prev.map((x, i) => (i === idx ? { ...x, phone: v } : x))
                          );
                        }}
                        placeholder="Phone (optional)"
                        className="w-full rounded-xl border border-white/40 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300/80 sm:col-span-2"
                      />
                      <input
                        value={m.photoUrl ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setBoard((prev) =>
                            prev.map((x, i) =>
                              i === idx ? { ...x, photoUrl: v } : x
                            )
                          );
                        }}
                        placeholder="Photo URL (optional)"
                        className="w-full rounded-xl border border-white/40 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300/80 sm:col-span-2"
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {board.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">
                  No board members yet.
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
                    Up to four cards show publicly (newest first).
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="rounded-full shrink-0 bg-amber-700 hover:bg-amber-800 text-white"
                  onClick={() =>
                    setAnnouncements((prev) => [
                      {
                        id: uid(),
                        title: "",
                        content: "",
                        dateLabel: "",
                        type: "Update",
                        createdAt: new Date().toISOString(),
                      },
                      ...prev,
                    ])
                  }
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              <AnimatePresence initial={false}>
                {announcements.slice(0, 4).map((a, idx) => (
                  <motion.div
                    key={a.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
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
                          setAnnouncements((prev) => prev.filter((x) => x.id !== a.id))
                        }
                        aria-label="Remove announcement"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        value={a.title}
                        onChange={(e) => {
                          const v = e.target.value;
                          setAnnouncements((prev) =>
                            prev.map((x) => (x.id === a.id ? { ...x, title: v } : x))
                          );
                        }}
                        placeholder="Title"
                        className="w-full rounded-xl border border-white/40 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300/80 sm:col-span-2"
                      />
                      <input
                        value={a.dateLabel}
                        onChange={(e) => {
                          const v = e.target.value;
                          setAnnouncements((prev) =>
                            prev.map((x) =>
                              x.id === a.id ? { ...x, dateLabel: v } : x
                            )
                          );
                        }}
                        placeholder="Date (e.g. March 5, 2026)"
                        className="w-full rounded-xl border border-white/40 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300/80"
                      />
                      <input
                        value={a.type}
                        onChange={(e) => {
                          const v = e.target.value;
                          setAnnouncements((prev) =>
                            prev.map((x) => (x.id === a.id ? { ...x, type: v } : x))
                          );
                        }}
                        placeholder="Type (Meeting, Update...)"
                        className="w-full rounded-xl border border-white/40 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300/80"
                      />
                      <textarea
                        value={a.content}
                        onChange={(e) => {
                          const v = e.target.value;
                          setAnnouncements((prev) =>
                            prev.map((x) =>
                              x.id === a.id ? { ...x, content: v } : x
                            )
                          );
                        }}
                        placeholder="Content"
                        rows={5}
                        className="w-full rounded-xl border border-white/40 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300/80 sm:col-span-2 resize-y"
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {announcements.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">
                  No announcements yet.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

