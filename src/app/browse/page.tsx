import BrowsePage from '@/features/Browse'
import ProtectedRoute from '@/routes/ProtectedRoute'
import React from 'react'

const page = () => {
  return (
    <ProtectedRoute>
   <BrowsePage/>
    </ProtectedRoute>
  )
}

export default page
