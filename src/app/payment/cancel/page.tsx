"use client";


import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, MoveLeft, XIcon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

export default function PaymentCancelled() {
    const [ispending] = useTransition()
  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <div className="w-full flex justify-center">
            <XIcon className="size-12 p-2 bg-red-500/30 text-red-50 rounded-full"/>
        </div>

        <CardHeader className="  text-center justify-center">
          <CardTitle>Payment Cancelled</CardTitle>
          <CardDescription>
            Your payment was not completed. You can try again or contact support
            if you need assistance.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center">
          <p className="text-sm text-muted-foreground text-center">
            If you have any questions or need help, please reach out to our
            support team.
          </p>
          <Link
            href="/"
            className={buttonVariants({
              variant: "default",
              className: "w-full mt-4 justify-center",
            })}
          >
            {ispending ? (<><Loader2 className="animate-spin" /> Backing....</>) : (<><MoveLeft /> Go to Homepage</>)}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
