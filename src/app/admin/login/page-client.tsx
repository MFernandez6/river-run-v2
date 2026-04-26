"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoginClientPage() {
  const params = useSearchParams();
  const router = useRouter();
  const next = params.get("next") ?? "/admin";

  const [email, setEmail] = useState("rrcboardemail@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Board Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/30 bg-white/80 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-300"
                type="email"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/30 bg-white/80 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-300"
                type="password"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              className="w-full rounded-xl bg-amber-700 hover:bg-amber-800"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                setError(null);
                try {
                  const res = await fetch("/api/admin/login", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ email, password }),
                  });
                  if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data?.error ?? "Login failed");
                  }
                  router.push(next);
                  router.refresh();
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Login failed");
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Access is restricted to{" "}
              <span className="font-semibold">rrcboardemail@gmail.com</span>.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

