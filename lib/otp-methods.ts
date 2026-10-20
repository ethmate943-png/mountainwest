export type OtpMethod = "sms" | "email";

export type OtpMethodOption = {
  id: OtpMethod;
  label: string;
  description: string;
};

export const MWB_OTP_METHODS: OtpMethodOption[] = [
  {
    id: "sms",
    label: "Text me a code",
    description: "Send a one-time code to the phone number on file.",
  },
  {
    id: "email",
    label: "Email me a code",
    description: "Send a one-time code to the email address on file.",
  },
];

export function otpMethodDeliveryLabel(method: OtpMethod): string {
  return method === "email" ? "email" : "text message";
}

export function otpMethodVerifySubtitle(method: OtpMethod): string {
  return `We sent a one-time code by ${otpMethodDeliveryLabel(method)}.`;
}
