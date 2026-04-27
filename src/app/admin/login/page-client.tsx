"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoginClientPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";

  const [email, setEmail] = useState("rrcboardemail@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 flex flex-col">
      <header className="glass border-b border-white/20">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 text-gray-800">
              <Building2 className="h-10 w-10 text-amber-700" />
              <div className="text-left leading-tight">
                <div className="text-lg font-bold">River Run</div>
                <div className="text-sm text-gray-600">Admin Portal</div>
              </div>
            </div>
          </div>

          <Card className="glass border-0 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="text-center pb-2 space-y-1">
              <CardTitle className="text-2xl text-gray-800">
                Board sign in
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  setError(null);
                  try {
                    const res = await fetch("/api/admin/login", {
                      method: "POST",
                      credentials: "same-origin",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({ email, password }),
                    });
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok) throw new Error(data?.error ?? "Login failed");
                    router.push(next);
                    router.refresh();
                  } catch (err) {
                    setError(
                      err instanceof Error ? err.message : "Login failed"
                    );
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/40 bg-white/90 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-300/80"
                    type="email"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/40 bg-white/90 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-300/80"
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
                  type="submit"
                  className="w-full rounded-xl h-11 bg-amber-700 hover:bg-amber-800 text-white shadow-md"
                  disabled={loading}
                >
                  {loading ? "Signing in…" : "Sign in"}
                </Button>

                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  Access is restricted to{" "}
                  <span className="font-semibold text-gray-700">
                    rrcboardemail@gmail.com
                  </span>
                  .
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

