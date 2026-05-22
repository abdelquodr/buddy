"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/Button";
import Image from "next/image";

export default function VerifiedPage() {
  const router = useRouter();

  useEffect(() => {
    // Optional: Redirect to dashboard after a delay
    // const timer = setTimeout(() => router.push('/dashboard'), 3000);
    // return () => clearTimeout(timer);
  }, [router]);

  return (
    <section className="relative flex w-full items-center justify-center bg-[#f7f8fc] px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04),transparent_60%)]" />
      <div className="relative z-10 w-full max-w-md rounded-lg border border-[#e5e7eb] bg-white p-13 shadow-[0_16px_30px_rgba(15,23,42,0.06)]">
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <Image
              src="/icons/verified-email.svg"
              alt="check-mail"
              width={64}
              height={64}
              className="h-20 w-20"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-[-0.04em] text-[#2b2f38]">
              Email verified !
            </h1>
            <p className="mx-auto max-w-60 text-xs leading-5 text-[#8a96a3]">
              The verified email address will be associated with your account.
              Click on the button below to continue.
            </p>
          </div>

          <Link href="/login" className="block">
            <Button variant="primary" size="lg">
              Continue
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
