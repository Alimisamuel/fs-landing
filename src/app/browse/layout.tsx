"use client";

import type { ReactNode } from "react";

import ProtectedRoute from "@/routes/ProtectedRoute";

export default function BrowseLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute requireSelectedExperience>{children}</ProtectedRoute>
  );
}
