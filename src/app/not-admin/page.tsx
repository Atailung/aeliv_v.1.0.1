import {  buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";

export default function NotAdminPage() {
  return (
    <div className="min-h-screen  flex items-center justify-center ">
        <Card className="max-w-md w-full">
        <CardHeader className="text-center">
            <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
                <ShieldX className="size-16 text-destructive" />
            </div>
          <CardTitle className=" text-2xl">Access Restricted</CardTitle>
          <CardDescription className="mx-auto max-w-xs">Hey! You are not authorized to view this page. Your are not an admin, please contact site administrator if you believe this is an error.

          </CardDescription>
        </CardHeader>
        <CardContent>
           <Link href="/" className={buttonVariants({ className: "w-full" })}>
           <ArrowLeft className="mr-2 size-4" />
            Back to home
          
           </Link>
        </CardContent>
        </Card>
    </div>
  );
}

