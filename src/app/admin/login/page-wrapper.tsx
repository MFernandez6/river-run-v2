"use client";

import { Suspense } from "react";
import AdminLoginClientPage from "./page-client";

export default function AdminLoginPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 flex items-center justify-center p-4">
          <div className="glass rounded-2xl px-6 py-4 text-sm text-gray-700 shadow-lg">
            Loading…
          </div>
        </div>
      }
    >
      <AdminLoginClientPage />
    </Suspense>
  );
}

