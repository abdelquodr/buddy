"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/app/components/Button";
import { verifyOTPSchema } from "@/app/utils/validation";
import { authApi, getAuthTokenFromResponse } from "@/app/lib/auth-api";
import { useAuth } from "@/app/lib/auth-context";

const OTPInput = dynamic(() =>
  import("@/app/components/OTPInput").then((mod) => mod.OTPInput),
);

export default function VerifyPage() {
  const router = useRouter();
  const { token, email, setToken } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOTPComplete = async (code: string) => {
    setError("");
    setIsLoading(true);
    let shouldResetOtp = false;

    try {
      verifyOTPSchema.parse({ code });

      if (!token) {
        throw new Error(
          "No authentication token found. Please register again.",
        );
      }

      const response = await authApi.verifyOtp({ otp: code }, token);
      const nextToken = getAuthTokenFromResponse(response);

      if (nextToken) {
        setToken(nextToken);
      }

      // Navigate to verified page
      router.push("/signup/verified");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Invalid OTP. Please try again.";
      setError(message);
      shouldResetOtp = true;
    } finally {
      setIsLoading(false);
      // Reset OTP on error
      if (shouldResetOtp) {
        setOtp("");
      }
    }
  };

  const handleManualVerify = async () => {
    if (otp.length !== 4) {
      setError("OTP must be exactly 4 digits");
      return;
    }
    await handleOTPComplete(otp);
  };

  return (
    <section className="relative flex w-full items-center justify-center bg-[#f7f8fc] px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04),transparent_60%)]" />
      <div className="relative z-10 w-full max-w-md rounded-lg border border-[#e5e7eb] bg-white p-13 shadow-[0_16px_30px_rgba(15,23,42,0.06)]">
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-[-0.04em] text-[#2b2f38]">
              Verify your email
            </h1>
            <p className="mx-auto max-w-64 text-xs leading-5 text-[#8a96a3]">
              A four digit OTP code has been sent to your email.
              <span className="text-brand-orange">
                {" "}
                {email ? ` ${email} ` : ""}{" "}
              </span>
            </p>
          </div>

          <Suspense fallback={<div>Loading...</div>}>
            <OTPInput
              value={otp}
              onChange={setOtp}
              onComplete={handleOTPComplete}
              error={error}
              length={4}
            />
          </Suspense>

          <Button
            variant="primary"
            size="lg"
            onClick={handleManualVerify}
            isLoading={isLoading}
            disabled={otp.length !== 4 || isLoading}
          >
            {isLoading ? "Verifying..." : "Confirm code"}
          </Button>

          <p className="text-xs text-[#8a96a3]">
            Didn&apos;t get the mail?{" "}
            <button className="text-brand-orange font-semibold hover:underline">
              Resend
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
