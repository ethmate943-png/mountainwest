"use client";

import type { ReactNode } from "react";
import ReffererProvider from "@/ReffererProvider";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <ReffererProvider>{children}</ReffererProvider>;
}
