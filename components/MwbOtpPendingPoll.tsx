"use client";

import { useEffect } from "react";

import { DEMO_APPROVAL_MS } from "@/lib/approval-messages";

export default function MwbOtpPendingPoll({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, DEMO_APPROVAL_MS);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 py-10 text-center">
      <div
        aria-hidden="true"
        className="h-10 w-10 animate-spin rounded-full border-4 border-[#5a5a5a] border-t-mwb-lime"
      />
      <p className="m-0 text-sm text-mwb-muted">Verifying your code…</p>
    </div>
  );
}
