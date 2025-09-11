"use client"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { GithubIcon, Loader, Send } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'


export function LoginForm(){
  const router = useRouter();
  const [githubPending, startGithubTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();

  const [email, setEmail] = useState(" ");

  async function signInWithGithub() {
   startGithubTransition(() => {
     authClient.signIn.social({
       provider: "github",
       callbackURL : "/",
       fetchOptions: {
         onSuccess: () => {
           toast.success("Successfully signed in with GitHub!");
         },
         onError: (error) => {
           toast.error(error.error.message || "Failed to sign in with GitHub.");
         }
       }
     })
   });
  }

  function signInWithEmail() {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            router.push(`/verify-request?email=${email}`);
            toast.success("Successfully sent email verification!");
          },
          onError: (error) => {
            toast.error(error.error.message || "Failed to send email verification.");
          }
        }
      })
    })
  }


  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">Welcome Back !</CardTitle>
          <CardDescription className="text-sm text-center">Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <CardContent>


            <Button
              className="w-full" 
              variant="outline"
              onClick={signInWithGithub}
              disabled={githubPending}
              >
                {githubPending ? (
                  <>
                  <Loader className='size-4 animate-spin' />
                  <span>Signing in...</span>
                  </>
                ): (
                  <>
                  <GithubIcon className="size-6" />
                  Sign In With GitHub
                  </>
                )}
            </Button>
            
           
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:items-center after:border-t after:border-border">
              <span className='relative z-10 bg-card px-2 text-muted-foreground'>Or continue with</span>
            </div>
          </CardContent>



          <div className="flex flex-col gap-6"></div>
          <form action="">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email"   className="text-sm">Email</Label>
                <Input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                id="email" 
                type="email" 
                placeholder="email@example.com" />
              </div>
              <Button className="w-full" onClick={signInWithEmail} disabled={emailPending}>
                
                {
                  emailPending ? (
                    <>
                      <Loader className='size-4 animate-spin' />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className='size-4' />
                      <span>Continue with Email</span>
                    </>
                  )
                }

              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

)
}