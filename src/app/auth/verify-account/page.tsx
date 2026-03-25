import GlobalLoading from '@/app/loading'
import VerifyAccountPage from '@/features/Auth/VerifyAccountPage'

import React, { Suspense } from 'react'

const page = () => {
  return (
     <Suspense fallback={<GlobalLoading />}>
        <VerifyAccountPage />
      </Suspense>
  )
}

export default page
