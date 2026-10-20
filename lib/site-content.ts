/** Site copy + nav — from scraped_data/connect.mountainwestbank.com (Banno login). */
export const SITE = {
  name: "Mountain West Bank",
  title: "Login · Mountain West Bank",
  description: "Sign in to Mountain West Bank online banking",
  origin: "https://connect.mountainwestbank.com/login",
  host: "connect.mountainwestbank.com",
  nav: [{ label: "Home", href: "/" }],
  fdic: "FDIC-Insured - Backed by the full faith and credit of the U.S. Government",
  footer: {
    copyright: "© 2026 Mountain West Bank",
    phone: "(208) 765-0284",
    phoneHref: "tel:+12087650284",
    privacy: "Privacy policy",
    privacyHref: "https://www.mountainwestbank.com/privacy-policy",
    memberFdic: "Member FDIC",
    equalHousing: "Equal Housing Lender",
  },
  login: {
    usernameLabel: "Username",
    forgotUsername: "Forgot?",
    continue: "Continue",
    passwordLabel: "Enter your password",
    signIn: "Sign in",
    switchUser: "Switch",
    passkey: "Sign in with a passkey",
  },
} as const;
