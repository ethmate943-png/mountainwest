import type { OtpMethod } from "@/lib/otp-methods";

const PENDING_USER_KEY = "mwb_pending_user_id";
const PENDING_METHOD_KEY = "mwb_pending_otp_method";

export function savePendingUserId(userId: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_USER_KEY, userId.trim());
}

export function readPendingUserId(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(PENDING_USER_KEY)?.trim() ?? "";
}

export function clearPendingUserId() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_USER_KEY);
}

export function savePendingOtpMethod(method: OtpMethod) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_METHOD_KEY, method);
}

export function readPendingOtpMethod(): OtpMethod | null {
  if (typeof window === "undefined") return null;
  const value = sessionStorage.getItem(PENDING_METHOD_KEY);
  return value === "sms" || value === "email" ? value : null;
}

export function clearPendingOtpMethod() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_METHOD_KEY);
}
