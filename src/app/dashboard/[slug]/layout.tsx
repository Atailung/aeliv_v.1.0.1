import React, { ReactNode } from 'react'
import CourseSideBar from '../_compontents/CourseSideBar'
import { getCourseSidebarData } from '@/app/data/course/get-course-sidebar-data';

interface iAppProps {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}

async function CourseLayout({ children, params }: iAppProps) {
  const { slug } = await params;
  //server-side data fetching
  const course = await getCourseSidebarData(slug);

  return (
    <div className='flex flex-1'>
        {/* sider - 30% */}
        <div className='w-80 border-r border-border shrink-0'>
            <CourseSideBar course={course.course} />
        </div>
        <div className='flex-1 overflow-hidden'>{children}</div>
    </div>
  )
}

export default CourseLayout
