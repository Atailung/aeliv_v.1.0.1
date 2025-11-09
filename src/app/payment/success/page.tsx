import { CheckCircle2, ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ConfettiWrapper } from "./confetti-wrapper"

export default async function SuccessPage({}) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background p-4">
      <ConfettiWrapper>
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="p-4  rounded-full shadow-lg bg-gradient-to-b from-green-400 to-green-600">
                <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={1.5} />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-5xl font-bold text-foreground text-balance">You&apos;re all set!</h1>
              <p className="text-xl text-muted-foreground max-w-xl mx-auto text-balance">
                Welcome to your learning journey. You&apos;re now enrolled in the course and ready to start.
              </p>
            </div>
          </div>

          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardContent className="pt-8">
              <div className="space-y-6">
                {/* Success details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/10">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <p className="font-semibold text-foreground">Enrolled</p>
                  </div>
                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                    <p className="text-sm text-muted-foreground mb-1">What&apos;s next</p>
                    <p className="font-semibold text-foreground">Start learning</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      size: "lg",
                      className: "flex-1 gap-2",
                    })}
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/courses"
                    className={buttonVariants({
                      variant: "outline",
                      size: "lg",
                      className: "flex-1",
                    })}
                  >
                    Explore more courses
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optional: Quick tips section */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Questions? Check our{" "}
              <Link href="/help" className="underline hover:text-foreground transition-colors">
                help center
              </Link>
            </p>
          </div>
        </div>
      </ConfettiWrapper>
    </div>
  )
}
