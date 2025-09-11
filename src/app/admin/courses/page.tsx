import {  buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

import React from 'react'

function CoursesCreationPage() {
  return (
    <>
        <div className="flex items-center justify-between">
            <h1 className='text-2xl font-bold'>Courses</h1>



            <Link href="/admin/courses/create" className={buttonVariants({ variant: 'default' })}>
                Create a Course
            </Link>

        </div>

        <div>
            <h1>
                Here you will see all the courses.
            </h1>
        </div>
    </>
  )
}

export default CoursesCreationPage