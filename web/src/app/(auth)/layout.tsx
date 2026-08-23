import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-muted/30">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,oklch(0.51_0.1_163/0.08),transparent)]"
      />
      <header className="relative z-10 mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-6">
        <BrandMark />
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-[420px]">{children}</div>
      </main>
      <footer className="relative z-10 pb-6 text-center text-xs text-muted-foreground">
        <p>
          Secured by bcrypt and HttpOnly cookie sessions.{" "}
          <Link href="/" className="underline-offset-4 hover:underline">
            Back to home
          </Link>
        </p>
      </footer>
    </div>
  );
}
