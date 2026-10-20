import SiteFooter from "@/components/SiteFooter";

export default function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url(/images/brand/mountain-west-bank-background-landscape.png)",
          backgroundPosition: "center top",
          backgroundSize: "cover",
        }}
      />
      <main className="relative flex flex-1 flex-col items-center justify-center px-0 py-0 sm:px-4 sm:py-10">
        <div className="w-full max-w-none sm:max-w-[480px]">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
