import { Tag } from 'antd';
import { memo } from 'react';


export const BreadCrumbs = memo(() => {


  return (
    <div
      className='w-full shadow-sm'
    >

      <Tag
        color='blue'
      >
        1
      </Tag>
    </div>
  )
})

export const BreadCrumbsWrapper = memo(() => {


  return (
    <BreadCrumbs />
  )
})

export default BreadCrumbsWrapper;
