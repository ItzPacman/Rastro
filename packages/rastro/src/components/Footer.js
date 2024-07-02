import React from 'react'
import { FaGithub } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";




const Footer = () => {
  return (
    <div className='bg-[#f3f4f7] mt-20 flex space-x-4 justify-center items-center'>
        <FaGithub  size={20} color='#2c749d'/>
        <FaDiscord size={20} color='#2c749d'/>
        <FaTwitter size={20} color='#2c749d'/>
      
    </div>
  )
}

export default Footer
