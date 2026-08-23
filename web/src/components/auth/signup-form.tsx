"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleNotchIcon } from "@phosphor-icons/react/dist/ssr/CircleNotch";

import { ApiError, signIn, signUp } from "@/lib/api";
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

const EMAIL_PATTERN = /.+@.+\..+/;

export function SignUpForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const emailValid = EMAIL_PATTERN.test(email);
  const passwordLengthOk = password.length >= 8;
  const passwordsMatch = password === confirmPassword;

  const errors = useMemo(() => {
    if (!submitted) return {};
    return {
      email: !emailValid ? "Enter a valid email address." : undefined,
      password: !passwordLengthOk
        ? "Use at least 8 characters."
        : undefined,
      confirmPassword: !passwordsMatch ? "Passwords do not match." : undefined,
    };
  }, [submitted, emailValid, passwordLengthOk, passwordsMatch]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setError(null);

    if (!emailValid || !passwordLengthOk || !passwordsMatch) return;

    setPending(true);
    try {
      await signUp({
        email,
        full_name: fullName.trim() || undefined,
        password,
      });
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
        <Field>
          <FieldLabel htmlFor="signup-name">
            Full name <span className="text-muted-foreground">(optional)</span>
          </FieldLabel>
          <Input
            id="signup-name"
            type="text"
            autoComplete="name"
            placeholder="Amara Osei"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Field>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="signup-email">Email</FieldLabel>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email ? <FieldError>{errors.email}</FieldError> : null}
        </Field>
        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="signup-password">Password</FieldLabel>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password ? (
            <FieldError>{errors.password}</FieldError>
          ) : (
            <FieldDescription>Stored as a bcrypt hash.</FieldDescription>
          )}
        </Field>
        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="signup-confirm">Confirm password</FieldLabel>
          <Input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword ? (
            <FieldError>{errors.confirmPassword}</FieldError>
          ) : null}
        </Field>
        <Button
          type="submit"
          disabled={pending}
          className="w-full active:scale-[0.98]"
        >
          {pending ? (
            <>
              <CircleNotchIcon className="size-4 animate-spin" weight="bold" />
              Creating account
            </>
          ) : (
            "Create account"
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-medium text-brand underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
}
