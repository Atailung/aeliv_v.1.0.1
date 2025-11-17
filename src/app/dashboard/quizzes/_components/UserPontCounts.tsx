import { IconCoins } from '@tabler/icons-react'
import React from 'react'

function UserPontCounts() {
  return (
    <div className='p-2 px-5 rounded-m border-primary flex items-center gap-2'>
      <div className='size-8 bg-primary/10 flex justify-center items-center rounded-full text-primary' >
        <IconCoins size={24} className='text-yellow-500'/>
      </div>
      <span>20</span>
      <span className='text-sm text-muted-foreground'>Points</span>
    </div>
  )
}

export default UserPontCounts
