"use client"

import dynamic from 'next/dynamic'
import { CircularProgress, Box, Button, Grid } from '@mui/material'

// Dynamic import to avoid SSR issues with react-paystack
const Donation = dynamic(() => import('@/features/Donation'), {
  ssr: false,
  loading: () => (
    <div className="text-black">
      <div className='flex items-center justify-between'>
        <div>
          <p className="text-[18px] font-bold">GIVE</p>
          <p className="text-[#667085] text-[14px] mt-1">
            Your support keeps the mission alive
          </p>
        </div>
        <Button>Last Seven Days</Button>
      </div>
      <Box sx={{height:'198px', background:`url("/images/donation.png")`, backgroundSize:'cover', mt:4, borderRadius:'8px'}} />
      <div className='mt-3'>
        <Grid container spacing={2}>
          <Grid size={8}>
            <div className='border border-[#E4E9F199] rounded-[8px] p-[24px]' style={{boxShadow: "0px 1px 2px 0px #1018280F"}}>
              <div className="flex justify-center items-center py-20">
                <CircularProgress />
              </div>
            </div>
          </Grid>
          <Grid size={4}>
            <div className='border border-[#E4E9F199] rounded-[8px] p-[24px]' style={{boxShadow: "0px 1px 2px 0px #1018280F"}}>
              {/* Right side content can be added here */}
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  )
})

const page = () => {
  return <Donation />
}

export default page
