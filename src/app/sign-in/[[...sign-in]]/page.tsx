import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12">
      <Suspense
        fallback={<div className="text-neutral-400">Loading sign-in...</div>}
      >
        <SignIn />
      </Suspense>
    </div>
  );
}
