import { Loader2 } from 'lucide-react' //comes along with shadcns
import React from 'react'

const AdminLoading = () => {
  return (
    <div className='flex justify-center'><Loader2 className='size-24 animate-spin'></Loader2></div>
  )
}

export default AdminLoading