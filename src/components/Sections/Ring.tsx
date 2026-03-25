import React, { ReactNode } from 'react';

interface RingProps {
children:ReactNode,
space?:string;
width?:string;

}

const Ring: React.FC<RingProps> = ({children, space , width,}) => {
  return (
    <div className={`${space} rounded-full flex flex-row justify-center items-center card_gradient`}>
      <div style={{background:'#A5A5A566', backdropFilter:'blur(4px)'}} className={`!bg-[#A5A5A5] rounded-full flex flex-row justify-center items-center w-[${width}] h-[${width}] overflow-hidden`}>
{children}
      </div>
    </div>
  )
}

export default Ring