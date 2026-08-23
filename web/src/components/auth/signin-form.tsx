"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleNotchIcon } from "@phosphor-icons/react/dist/ssr/CircleNotch";

import { ApiError, signIn } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      await signIn({ email, password });
      router.replace("/account");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Something went wrong.";
      setError(message);
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <Field data-invalid={!!email && !/.+@.+\..+/.test(email)}>
          <FieldLabel htmlFor="signin-email">Email</FieldLabel>
          <Input
            id="signin-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!!email && !/.+@.+\..+/.test(email) && (
            <FieldError>Enter a valid email address.</FieldError>
          )}
        </Field>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="signin-password">Password</FieldLabel>
          </div>
          <Input
            id="signin-password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FieldDescription className="sr-only">
            The password you created when signing up.
          </FieldDescription>
        </Field>
        <Button
          type="submit"
          disabled={pending}
          className="w-full active:scale-[0.98]"
        >
          {pending ? (
            <>
              <CircleNotchIcon className="size-4 animate-spin" weight="bold" />
              Signing in
            </>
          ) : (
            "Sign in"
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          New to Cartelle?{" "}
          <Link
            href="/signup"
            className="font-medium text-brand underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
}
