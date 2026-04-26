"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Announcement, BoardMember } from "@/lib/admin-data";
import { motion } from "framer-motion";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [board, setBoard] = useState<BoardMember[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

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

  async function saveAll() {
    setSaving(true);
    try {
      const res = await Promise.all([
        fetch("/api/admin/board", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ items: board }),
        }),
        fetch("/api/admin/announcements", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ items: announcements }),
        }),
      ]);
      const bad = res.find((r) => !r.ok);
      if (bad) throw new Error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin</h1>
            <p className="text-sm text-gray-600">
              Update board members and recent announcements.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={loading}
              onClick={() => {
                downloadJson("river-run-backup.json", {
                  exportedAt: new Date().toISOString(),
                  board,
                  announcements,
                });
              }}
            >
              Export backup
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                window.location.href = "/admin/login";
              }}
            >
              Sign out
            </Button>
            <Button
              className="rounded-xl bg-amber-700 hover:bg-amber-800"
              disabled={saving || loading}
              onClick={saveAll}
            >
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>

        {loading ? (
          <Card className="glass border-0 shadow-xl">
            <CardContent className="p-6 text-gray-700">Loading…</CardContent>
          </Card>
        ) : (
          <>
            {!hasData && (
              <Card className="glass border-0 shadow-xl">
                <CardContent className="p-6 text-gray-700">
                  No saved data yet. Add items below and click{" "}
                  <span className="font-semibold">Save changes</span>.
                </CardContent>
              </Card>
            )}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card className="glass border-0 shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle>Board members</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() =>
                        setBoard((prev) => [
                          ...prev,
                          {
                            id: uid(),
                            name: "",
                            position: "",
                            email: "",
                            phone: "",
                          },
                        ])
                      }
                    >
                      Add member
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {board.map((m, idx) => (
                      <div
                        key={m.id}
                        className="rounded-2xl border border-white/30 bg-white/70 p-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            value={m.name}
                            onChange={(e) => {
                              const v = e.target.value;
                              setBoard((prev) =>
                                prev.map((x, i) =>
                                  i === idx ? { ...x, name: v } : x
                                )
                              );
                            }}
                            placeholder="Name"
                            className="rounded-xl border border-white/30 bg-white/80 px-3 py-2 text-sm"
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
                            className="rounded-xl border border-white/30 bg-white/80 px-3 py-2 text-sm"
                          />
                          <input
                            value={m.email}
                            onChange={(e) => {
                              const v = e.target.value;
                              setBoard((prev) =>
                                prev.map((x, i) =>
                                  i === idx ? { ...x, email: v } : x
                                )
                              );
                            }}
                            placeholder="Email"
                            className="rounded-xl border border-white/30 bg-white/80 px-3 py-2 text-sm"
                          />
                          <input
                            value={m.phone ?? ""}
                            onChange={(e) => {
                              const v = e.target.value;
                              setBoard((prev) =>
                                prev.map((x, i) =>
                                  i === idx ? { ...x, phone: v } : x
                                )
                              );
                            }}
                            placeholder="Phone (optional)"
                            className="rounded-xl border border-white/30 bg-white/80 px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={() =>
                              setBoard((prev) => prev.filter((_, i) => i !== idx))
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-0 shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle>Recent announcements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() =>
                        setAnnouncements((prev) => [
                          ...prev,
                          {
                            id: uid(),
                            title: "",
                            content: "",
                            date: "",
                            type: "Update",
                          },
                        ])
                      }
                    >
                      Add announcement
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {announcements.map((a, idx) => (
                      <div
                        key={a.id}
                        className="rounded-2xl border border-white/30 bg-white/70 p-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            value={a.title}
                            onChange={(e) => {
                              const v = e.target.value;
                              setAnnouncements((prev) =>
                                prev.map((x, i) =>
                                  i === idx ? { ...x, title: v } : x
                                )
                              );
                            }}
                            placeholder="Title"
                            className="rounded-xl border border-white/30 bg-white/80 px-3 py-2 text-sm sm:col-span-2"
                          />
                          <input
                            value={a.date}
                            onChange={(e) => {
                              const v = e.target.value;
                              setAnnouncements((prev) =>
                                prev.map((x, i) =>
                                  i === idx ? { ...x, date: v } : x
                                )
                              );
                            }}
                            placeholder="Date (e.g. March 5, 2026)"
                            className="rounded-xl border border-white/30 bg-white/80 px-3 py-2 text-sm"
                          />
                          <input
                            value={a.type}
                            onChange={(e) => {
                              const v = e.target.value;
                              setAnnouncements((prev) =>
                                prev.map((x, i) =>
                                  i === idx ? { ...x, type: v } : x
                                )
                              );
                            }}
                            placeholder="Type (e.g. Meeting)"
                            className="rounded-xl border border-white/30 bg-white/80 px-3 py-2 text-sm"
                          />
                          <textarea
                            value={a.content}
                            onChange={(e) => {
                              const v = e.target.value;
                              setAnnouncements((prev) =>
                                prev.map((x, i) =>
                                  i === idx ? { ...x, content: v } : x
                                )
                              );
                            }}
                            placeholder="Content"
                            rows={5}
                            className="rounded-xl border border-white/30 bg-white/80 px-3 py-2 text-sm sm:col-span-2"
                          />
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={() =>
                              setAnnouncements((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

