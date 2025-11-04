import { adminGetCourses } from '@/app/data/admin/admin-get-courses'
import {  buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

import React from 'react'
import { AdminCoursesCard } from './_components/AdminCoursesCard';

export default async function CoursesCreationPage() {

    const data = await adminGetCourses();
  return (
    <>
        <div className="flex items-center justify-between">
            <h1 className='text-2xl font-bold'>Courses</h1>



            <Link href="/admin/courses/create" className={buttonVariants({ variant: 'default' })}>
                Create a Course
            </Link>

        </div>

        <div className='grid grid-cols-1  sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7'>
          
            
                {data.map((course) => (
                    <AdminCoursesCard key={course.id} data={course} />
                    
                ))}
              

        </div>
    </>
  )
}

