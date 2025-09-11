
import {buttonVariants } from '@/components/ui/button';

import React from 'react'


import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';


interface FeatureProps {
    title: string;
    description: string;
    icon: string;
}

const features: FeatureProps[] = [
    {
        title: "Comprehensive Course ",
        description: 
        "Access a wide range of carefully curated courses designed to enhance your skills and knowledge.",
        icon: "📚"
    },
    {
        title: "Interactive Course",
        description: "Engage with interactive content, quizzes, and hands-on projects to deepen your understanding.",
        icon: "🎓"
    },
    {
        title: "Progress Tracking",
        description: "Monitor your progress and achievements with detailed analytics and personalized dashboards.",
        icon: "📈"
    },
    {
        title: "Community Support",
        description: "Connect with a vibrant community of learners and instructors for support and collaboration.",
        icon: "🤝"
    }
];



export default function Homepage() {
 

  
  return (
    

    <>
    <section className='relative py-20'>
        <div className="flex flex-col text-center space-y-8 items-center">
            <Badge variant = "outline">
              The Future of online Education
            </Badge>
            <h1 className='text-4xl font-bold md:text-6xl tracking-tight'>Elevate Your Learning Experience</h1>
            <p className='max-w-[700px] text-muted-foreground '>Join our platform to access a world of knowledge, connect with expert instructors, and unlock your full potential. Whether you're looking to acquire new skills, advance your career, or explore new hobbies, we have the courses and resources to help you succeed.</p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                <Link href="/courses" className={buttonVariants({size: "lg"})}>
                    Explore Courses
                </Link>
                 <Link href="/login" className={buttonVariants({size: "lg", variant: "outline"})}>
                    Sign In
                </Link>
            </div>
        </div>
    </section>


    <section className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32'>
       {features.map((feature, index) => (
          <Card key={index} className='hover:shadow-lg transition-shadow'>
            <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className='text-xl font-semibold mb-2'>{feature.title}</h3>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
       ))}
    </section>
    </>
  )
}


