import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Logo from "@/public/vercel.svg"

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col relative items-center justify-center">
        <Link href="/" className={buttonVariants({
          variant: 'outline',
          size: 'sm',
          className: 'absolute top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
        })}>
          <ArrowLeft/>
          Back
        </Link>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="text-center text-2xl font-bold">
          <Image src='/logo.jpg' alt='logo aeliv' width={100} height={100} className="mx-auto mb-4" />
          Aeliv
        </Link>
        {children}
        <div className='text-blance text-center text-xs text-foreground-muted hover:text-foreground'>
          By clicking Continue, you agree to our{" "}
          <span className='hover:text-primary hover:underline'>Terms of service </span>{" "}
          and {" "}

          <span className='hover:text-primary hover:underline hover:drop-shadow-6xl text-white'>
            Privacy Policy
          </span>

          
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
