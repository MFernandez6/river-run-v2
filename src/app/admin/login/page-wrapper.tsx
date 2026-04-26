"use client";

import { Suspense } from "react";
import AdminLoginClientPage from "./page-client";

export default function AdminLoginPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 flex items-center justify-center p-4 text-gray-700">
          Loading…
        </div>
      }
    >
      <AdminLoginClientPage />
    </Suspense>
  );
}

