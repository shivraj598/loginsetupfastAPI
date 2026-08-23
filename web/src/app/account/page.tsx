import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SealCheckIcon } from "@phosphor-icons/react/dist/ssr/SealCheck";

import { getMeWithToken } from "@/lib/api";
import { BrandMark } from "@/components/brand-mark";
import { SignOutButton } from "@/components/auth/signout-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Your account",
};

function formatMemberSince(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/signin");

  const user = await getMeWithToken(token);
  if (!user) redirect("/signin");

  const displayName = user.full_name?.trim() || user.email.split("@")[0];
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-4 sm:px-6">
          <BrandMark />
          <SignOutButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 md:py-16">
        <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl">
          Welcome back, {displayName}.
        </h1>
        <p className="mt-2 text-muted-foreground">
          This page is served only after the API validated your session
          cookie.
        </p>

        <div className="mt-10 rounded-xl border border-border bg-background p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-5">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-medium">{displayName}</p>
              <p className="truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
            <Badge
              variant="outline"
              className="ml-auto border-brand/30 bg-brand/10 text-brand"
            >
              <SealCheckIcon weight="fill" />
              Active customer
            </Badge>
          </div>

          <Separator className="my-6" />

          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Customer ID</dt>
              <dd className="mt-1 font-mono text-sm">{user.id}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Member since</dt>
              <dd className="mt-1 text-sm">{formatMemberSince(user.created_at)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Session</dt>
              <dd className="mt-1 text-sm">
                JWT in an HttpOnly cookie, refreshed on sign-in
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Password</dt>
              <dd className="mt-1 text-sm">Stored as a bcrypt hash</dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  );
}
