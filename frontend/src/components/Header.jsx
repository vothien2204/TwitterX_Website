import React from 'react'
import Banner from '../assets/img/home-bg.jpg'

const Header = () => {
  return (
    <div className="relative">
      <div className="relative">
        <img src={Banner} alt="" className='w-full h-[500px] object-cover' />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-bold text-white text-center">BLOG CÁ NHÂN NHÓM-3</h1> 
        <p className="text-white text-center">CHIA SẺ NHỮNG ĐIỀU MỚI MỖI NGÀY</p>
      </div>
    </div>
  )
}

export default Header
