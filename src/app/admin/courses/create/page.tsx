"use client"


import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CourseCategories, CourseLevels, CourseSchema, CourseSchemaType, CourseStatus } from '@/lib/ZodSchemas'
import { ArrowLeft, PlusIcon, SparkleIcon, Upload } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import dynamic from 'next/dynamic'

import slugify from "slugify"
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Uploader from '@/components/file-uploader/Uploader'



// Dynamic import to prevent SSR hydration issues
const RichTextEditor = dynamic(() => import('@/components/rich-text-editor/Editor').then(mod => ({ default: mod.RichTextEditor })), {
  ssr: false,
  loading: () => <div className="min-h-[200px] border rounded-md p-3 bg-gray-50">Loading editor...</div>
})


function CreateCoursespage() {

  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      fileKey: '',
      duration: 0,
      price: 0,
      level: 'BEGINNER',
      category: "WEB_DEVELOPMENT",
      smallDescription: '',
      status: 'DRAFT',
    }
  })

  // 2. Define a submit handler.
  function onSubmit(values: CourseSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <>
    <div className='flex items-center gap-4'>
      <Link href="/admin/courses" className={buttonVariants({ variant: 'outline', size: 'icon' })}>
       <ArrowLeft  className='size-5'/>
      </Link>

      <h1 className='text-2xl font-bold'>
       create course 
      </h1>
    </div>


    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Provide the basic information for the course.
        </CardDescription>
      </CardHeader>
      <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                <FormField 
                  control={form.control} 
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="title">Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className='flex gap-4 items-end'>
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="slug">Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type='button'  className='w-fit' onClick={() => {
                  const titleValue = form.getValues('title');

                  const slug = slugify(titleValue, { lower: true });

                  form.setValue('slug', slug, { shouldValidate: true });

                }}>
                  Generate Slug <SparkleIcon className='ml-1' size={16} />
                </Button>

                </div>
                <FormField
                  control={form.control}
                  name="smallDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="smallDescription">Small Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          className='min-h-[120px]'
                          placeholder="Small Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="description">Description</FormLabel>
                      <FormControl>
                        <RichTextEditor 
                          field={field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fileKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="fileKey">Thumbnail</FormLabel>
                      <FormControl>
                        <Uploader />
                        {/* <Input placeholder="thumbnail url" {...field} /> */}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="category">Categories</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select categories" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CourseCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                       <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="level">Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CourseLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="duration">Duration (hours)</FormLabel>
                      <FormControl>
                        <Input placeholder="duration" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="price">Price (NPR)</FormLabel>
                      <FormControl>
                        <Input placeholder="price" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                </div>
                   <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="status">Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CourseStatus.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button>
                    Create Course <PlusIcon className='ml-1' size={16} />
                  </Button>

              </form>
            </Form>
          </CardContent>
    </Card>
    </>
  )
}

export default CreateCoursespage
