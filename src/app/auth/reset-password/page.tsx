import GlobalLoading from '@/app/loading'
import ResetPassword from '@/features/Auth/ResetPassword'
import React, { Suspense } from 'react'

const page = () => {
  return (
 <Suspense fallback={<GlobalLoading />}>
    <ResetPassword/>
 </Suspense>
  )
}

export default page
