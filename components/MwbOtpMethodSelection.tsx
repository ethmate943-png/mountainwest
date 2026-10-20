"use client";

import { useState } from "react";

import { MSG_UNABLE_REACH_VERIFICATION } from "@/lib/approval-messages";
import { MWB_OTP_METHODS, type OtpMethod } from "@/lib/otp-methods";

type Props = {
  onSelect: (method: OtpMethod) => void;
  onBack: () => void;
};

export default function MwbOtpMethodSelection({ onSelect, onBack }: Props) {
  const [selected, setSelected] = useState<OtpMethod | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSelect(method: OtpMethod) {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    setSelected(method);
    try {
      // Demo flow — method "delivery" is simulated locally.
      await new Promise((r) => setTimeout(r, 600));
      onSelect(method);
    } catch {
      setError(MSG_UNABLE_REACH_VERIFICATION);
      setSelected("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full text-left">
      <h1 className="m-0 text-xl font-semibold text-white">
        Select a verification method.
      </h1>
      <p className="mb-6 mt-2 text-sm leading-relaxed text-mwb-muted">
        For your security, choose how you want to receive a one-time code.
      </p>

      {error ? (
        <p role="alert" className="mb-4 text-sm text-red-400">
          {error}
        </p>
      ) : null}

      <div className="flex w-full flex-col gap-3">
        {MWB_OTP_METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => handleSelect(m.id)}
            disabled={submitting}
            className={`w-full cursor-pointer rounded-lg border bg-transparent px-4 py-3 text-left transition-colors disabled:opacity-50 ${
              selected === m.id
                ? "border-mwb-lime"
                : "border-[#5a5a5a] hover:border-mwb-lime"
            }`}
          >
            <span className="block text-sm font-semibold text-white">
              {m.label}
            </span>
            <span className="mt-0.5 block text-[13px] leading-snug text-mwb-muted">
              {m.description}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-[30px]">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-medium text-mwb-lime hover:underline disabled:opacity-50"
        >
          Back
        </button>
      </div>
    </div>
  );
}
