import { Card } from '@/components/ui/card';
import React from 'react'

function StatCard({ value, label }: { value: number | string; label: string } ) {
  return (
   <Card className='shadow-none p-3'>
    <div className='flex flex-col gap-1'>
        <span className='text-lg font-semibold'>{value}</span>
        <span className='text-sm text-muted-foreground text-[13px]'>{label}</span>
    </div>
   </Card>
  )
}

export default StatCard
