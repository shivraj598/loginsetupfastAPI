import Link from "next/link";
import {
  ArrowRightIcon,
  ClockCounterClockwiseIcon,
  CookieIcon,
  LockKeyIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react/dist/ssr";

import { BrandMark } from "@/components/brand-mark";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const securityPractices = [
  {
    icon: LockKeyIcon,
    title: "Passwords never touch disk in plain text",
    body: "Every password runs through bcrypt hashing before storage. Verification compares hashes, never strings.",
  },
  {
    icon: CookieIcon,
    title: "Sessions live in HttpOnly cookies",
    body: "The access token is set with HttpOnly, SameSite=Lax flags, so browser JavaScript can never read it.",
  },
  {
    icon: ClockCounterClockwiseIcon,
    title: "Tokens expire on a clock",
    body: "Each JWT carries an expiry claim. Expired sessions fail closed and ask you to sign in again.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Identity checked on every request",
    body: "Protected routes decode the JWT, validate its signature and expiry, then load your record fresh from the database.",
  },
];

const flowSteps = [
  {
    title: "Create your account",
    body: "Email and password go to POST /signup. The password is hashed before anything is stored.",
  },
  {
    title: "Receive a session cookie",
    body: "POST /signin verifies your credentials and sets an HttpOnly access_token cookie on the response.",
  },
  {
    title: "Fetch your profile",
    body: "GET /customers/me reads the cookie, validates the JWT, and returns your customer record.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <BrandMark />
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#security" className="transition-colors hover:text-foreground">
              Security
            </a>
            <a href="#flow" className="transition-colors hover:text-foreground">
              How it works
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button size="sm" asChild className="active:scale-[0.98]">
              <Link href="/signup">Create account</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-6xl px-4 pt-16 pb-20 sm:px-6 md:pt-24 md:pb-28">
          <div className="grid items-center gap-12 lg:grid-cols-[7fr_5fr]">
            <Reveal>
              <h1 className="max-w-xl text-4xl font-semibold tracking-tighter text-balance sm:text-5xl md:text-6xl md:leading-[1.05]">
                Customer accounts, engineered properly.
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                A working login and sign-up flow backed by FastAPI: bcrypt
                hashing, HttpOnly cookies, and expiring JWTs.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button size="lg" asChild className="active:scale-[0.98]">
                  <Link href="/signup">
                    Create account
                    <ArrowRightIcon className="size-4" weight="bold" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/signin">Sign in</Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="rounded-xl border border-border bg-muted/40 p-5 font-mono text-[13px] leading-relaxed">
                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="rounded bg-primary px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-primary-foreground">
                      POST
                    </span>
                    <span>/signup</span>
                    <span className="text-muted-foreground">201</span>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-3 border-l-2 border-border pl-3">
                    <span className="rounded bg-primary px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-primary-foreground">
                      POST
                    </span>
                    <span>/signin</span>
                    <span className="col-span-full text-brand">
                      Set-Cookie: access_token; HttpOnly; SameSite=Lax
                    </span>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-3 border-l-2 border-border pl-3">
                    <span className="rounded border border-border px-1.5 py-0.5 text-[11px] font-semibold tracking-wide">
                      GET
                    </span>
                    <span>/customers/me</span>
                    <span className="text-muted-foreground">200</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                  Three routes carry the whole session. No third-party auth
                  service, no tokens in localStorage.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="border-t border-border/60 bg-muted/30">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[4fr_8fr]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="text-3xl font-semibold tracking-tighter sm:text-4xl">
                Hardened by default.
              </h2>
              <p className="mt-4 max-w-xs text-base leading-relaxed text-muted-foreground">
                The boring parts of authentication, done carefully and kept
                visible.
              </p>
            </div>
            <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
              {securityPractices.map((practice, index) => (
                <Reveal key={practice.title} delay={index * 0.06}>
                  <li className="max-w-sm">
                    <span className="mb-4 inline-flex size-9 items-center justify-center rounded-lg bg-background shadow-sm ring-1 ring-border">
                      <practice.icon className="size-5 text-brand" weight="duotone" />
                    </span>
                    <h3 className="font-medium">{practice.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {practice.body}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Flow */}
        <section id="flow" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <Reveal>
            <h2 className="max-w-md text-3xl font-semibold tracking-tighter sm:text-4xl">
              From first visit to signed-in customer.
            </h2>
          </Reveal>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {flowSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.08}>
                <li className="border-t-2 border-primary/70 pt-5">
                  <span className="font-mono text-xs text-brand">
                    0{index + 1}
                  </span>
                  <h3 className="mt-2 font-medium">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-border bg-muted/30 p-8 sm:flex-row sm:items-center md:p-12">
              <div>
                <h2 className="text-2xl font-semibold tracking-tighter sm:text-3xl">
                  Try the full flow yourself.
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Create an account, get your cookie, and see your profile
                  render from the protected route.
                </p>
              </div>
              <Button size="lg" asChild className="shrink-0 active:scale-[0.98]">
                <Link href="/signup">Create account</Link>
              </Button>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <BrandMark />
          <p>Interactive API docs at localhost:8000/docs while the demo runs.</p>
        </div>
      </footer>
    </div>
  );
}
