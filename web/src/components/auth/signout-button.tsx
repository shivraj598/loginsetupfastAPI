"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleNotchIcon } from "@phosphor-icons/react/dist/ssr/CircleNotch";

import { ApiError, signOut } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    try {
      await signOut();
    } catch (err) {
      if (!(err instanceof ApiError && err.status === 0)) {
        // Even if the request fails, clear the local view and go home.
      }
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={pending}
      className="active:scale-[0.98]"
    >
      {pending ? (
        <CircleNotchIcon className="size-4 animate-spin" weight="bold" />
      ) : null}
      Sign out
    </Button>
  );
}
