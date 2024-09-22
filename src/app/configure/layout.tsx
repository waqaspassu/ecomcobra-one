import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Steps from '@/components/steps'
import React, {  ReactNode } from 'react'

type LayoutProps = {
    children: ReactNode
}
const layout = ({children}:LayoutProps) => {
  return (
    <MaxWidthWrapper className='flex-1 flex flex-col'>
      <Steps/>
        {children}
    </MaxWidthWrapper>
  )
}

export default layout