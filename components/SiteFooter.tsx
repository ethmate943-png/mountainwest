import { SITE } from "@/lib/site-content";

export default function SiteFooter() {
  const f = SITE.footer;
  return (
    <footer className="relative bg-mwb-card px-5 py-4 text-center text-xs leading-relaxed text-mwb-muted">
      <p className="m-0">
        {f.copyright} <span className="mx-1.5">•</span> <span>{f.phone}</span>{" "}
        <span className="mx-1.5 max-[490px]:hidden">•</span>
        <br className="hidden max-[490px]:block" />{" "}
        <a href={f.privacyHref} className="text-mwb-lime hover:underline">
          {f.privacy}
        </a>{" "}
        <span className="mx-1.5">•</span> {f.memberFdic}{" "}
        <span className="mx-1.5 max-[490px]:hidden">•</span>
        <br className="hidden max-[490px]:block" />{" "}
        <span className="inline-flex items-center gap-1">
          <svg
            width="16"
            height="11"
            viewBox="0 0 10 7"
            aria-hidden="true"
            className="inline-block fill-current"
          >
            <path d="M4.96.222.337 2.588v.962l.511.007v3.448h8.186L9.03 3.55h.55v-.962L4.959.222zm3.163 5.872H1.76V3.028l3.2-1.65 3.163 1.65v3.066zm-4.677-2.26h2.999v-.828H3.446v.828zm0 1.489h2.985v-.828H3.446v.828z" />
          </svg>
          {f.equalHousing}
        </span>
      </p>
    </footer>
  );
}
