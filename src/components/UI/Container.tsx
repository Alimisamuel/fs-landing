import { Box } from '@mui/material'
import React, { ReactNode } from 'react'

interface ContainerProps {
  children:ReactNode
}

const Container: React.FC <ContainerProps> = ({children}) => {
  return (
<Box sx={{ margin:'0 auto', width:{xl:"90vw", lg:'90vw', md:'90vw', sm:'90vw', xs:'95vw'}}}>
{children}
</Box>
  )
}

export default Container