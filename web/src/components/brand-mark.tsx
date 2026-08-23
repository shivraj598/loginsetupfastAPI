import Link from "next/link";
import { StorefrontIcon } from "@phosphor-icons/react/dist/ssr/Storefront";

export function BrandMark({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight"
    >
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <StorefrontIcon className="size-4" weight="fill" />
      </span>
      Cartelle
    </Link>
  );
}
