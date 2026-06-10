import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-32 text-center">
      <span className="font-heading text-8xl text-linen">404</span>
      <h1 className="mt-4 font-heading text-3xl text-charcoal">Page not found</h1>
      <p className="mt-4 max-w-md text-warm-gray">
        This page doesn&apos;t exist or may have moved. Explore the marketplace or return home.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button href="/" variant="primary">Go home</Button>
        <Button href="/marketplace" variant="outline">Browse marketplace</Button>
      </div>
    </div>
  );
}
