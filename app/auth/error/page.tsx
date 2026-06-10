import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AuthErrorPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-32 text-center">
      <span className="font-heading text-5xl text-linen">Oops</span>
      <h1 className="mt-4 font-heading text-2xl text-charcoal">Authentication failed</h1>
      <p className="mt-3 text-sm text-warm-gray">
        Something went wrong during sign in. Please try again or use a different method.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/auth/login" variant="secondary">Try again</Button>
        <Button href="/" variant="outline">Go home</Button>
      </div>
    </div>
  );
}
