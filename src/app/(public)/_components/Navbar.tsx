"use client"


import { buttonVariants } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import UserDropdown from './UserDropdown';

const navigationItems= [
{ name : " Home", href: "/" },
{ name : " Courses", href: "/courses" },
{ name : " Dashboard", href: "/dashboard" }
];


const Navbar = () => {
    const {data: session, isPending } = authClient.useSession()
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60'>
        <div className='container flex min-h-16 items-center max-w-7xl mx-auto px-4 md:px-6 lg:px-8'>
            <Link href="/" className='flex items-center space-x-2 mr-2'>
             <Image src='/logo.jpg' alt="Logo"  width={100} height={100} />
             Aeliv
            </Link>

           {/* Desktop Navigation */}
           <nav className='hidden md:flex md:justify-between md:items-center md:flex-1'>
            <div className='flex items-center space-x-4'>
                {navigationItems.map((item) => (
                    <Link key={item.name} href={item.href} className='text-sm font-medium transition-colors hover:text-primary'>
                        {item.name}
                    </Link>
                ))}
            </div>

            <div className='flex items-center space-x-4 '>
                {isPending ? null :  session ? (
                    <>

                    <UserDropdown name={session.user.name} email={session.user.email} image={session.user.image || " "} />
                    </>
                ) : (
                <>
                    <Link href="/login" className={buttonVariants({variant:'secondary'})}>
                        Sign In
                    </Link>
                    <Link href="/register" className={buttonVariants()}>
                        Get Started
                    </Link>
                </>
                )}
            </div>
           </nav>
        </div>
    </header>
  )
}

export default Navbar