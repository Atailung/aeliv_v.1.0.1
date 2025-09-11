"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export default function Verification() {
  const [otp, setOtp] = useState(""); 
  const params = useSearchParams();
  const email = params.get("email");
  const router = useRouter();
  const isOtpCompleted = otp.length === 6;
  const [emailPending, startEmailTransition] = useTransition();

  // Validate email before allowing OTP submission
  const isEmailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function verifyOtp() {
    if (!isEmailValid) {
      toast.error("Invalid or missing email address.");
      router.push("/login");
      return;
    }

    startEmailTransition(async () => {
      await authClient.signIn.emailOtp({
        email,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Successfully verified email!");
            router.push("/");
          },
          onError: (error) => {
            toast.error(error.error.message || "Failed to verify email.");
            router.push("/login");
          },
        },
      });
    });
  }

  // Show error if email is missing or invalid
  if (!isEmailValid) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">Verification Error</CardHeader>
        <CardContent>
          <p className="text-center text-red-500">
            Invalid or missing email address. Please try logging in again.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push("/login")} className="w-full">
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">Verify Your Email</CardHeader>
      <CardDescription className="text-center">
        Please check your email for the verification code.
      </CardDescription>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4">
          <InputOTP
            value={otp}
            onChange={(value) => setOtp(value)}
            maxLength={6}
            className="justify-center gap-2"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-center text-muted-foreground">
            Enter the verification code sent to {email}.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={verifyOtp}
          disabled={emailPending || !isOtpCompleted || !isEmailValid}
          type="submit"
          className="w-full"
        >
          {emailPending ? (
            <>
              <Loader className="mr-2 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <span>Verify Account</span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}