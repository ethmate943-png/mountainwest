import type { ReactNode } from "react";

import { BRAND } from "@/lib/icons";
import { SITE } from "@/lib/site-content";

export default function CardShell({ children }: { children: ReactNode }) {
  return (
    <div className="w-full rounded-[10px] bg-mwb-card px-6 py-8 shadow-[0_3px_12px_0_rgba(0,0,0,0.15)] sm:px-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BRAND.logo}
        alt={SITE.name}
        height={80}
        className="mx-auto mb-2 h-20 w-auto"
      />

      <div className="mb-6 flex items-center gap-2 px-1 py-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="17"
          fill="none"
          viewBox="0 0 60 17"
          role="img"
          aria-label={SITE.fdic}
          className="shrink-0"
        >
          <path
            fill="#fff"
            fillRule="evenodd"
            d="M8.8.7h5.1c4.6 0 7.6 3 7.6 7.6 0 5.2-3.3 7.7-8.5 7.7H8.8V.7Zm4.8 3.5h-.7v8.3c2.6 0 4.6-1 4.6-4.2 0-2.8-1.7-4.1-4-4.1h.1ZM37.4 5.1v-4c-1-.5-2.2-.7-3.3-.7-2 0-4 .7-5.5 2.2a8.1 8.1 0 0 0-2.2 5.7c0 4.5 3.4 7.8 7.6 7.8a5 5 0 0 0 3.4-1v-4c-1 .7-2 1-3.2 1.1-1 0-2-.4-2.7-1.2a4 4 0 0 1-1-2.9c-.1-1 .3-2.1 1-3 .7-.7 1.7-1.1 2.7-1.1 1.2 0 2.2.4 3.2 1.1ZM0 .7V16h4v-5.8h4V6.6H4V4.2h4.2V.7H0ZM22 16h4V.7h-4V16Z"
            clipRule="evenodd"
          />
        </svg>
        <p className="m-0 text-xs italic text-white">{SITE.fdic}</p>
      </div>

      {children}
    </div>
  );
}
