import type { Metadata } from "next";

import AppShell from "@/components/AppShell";
import MwbVerifyFlow from "@/components/MwbVerifyFlow";

export const metadata: Metadata = {
  title: "Verify · Mountain West Bank",
  description: "Verify your identity to continue signing in",
  alternates: {
    canonical: "/verify",
  },
};

export default function VerifyPage() {
  return (
    <AppShell>
      <MwbVerifyFlow />
    </AppShell>
  );
}
