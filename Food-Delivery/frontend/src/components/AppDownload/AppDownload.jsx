import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/frontend_assets/assets'

const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
      <p>For Better Exprience Download <br/>GoRestro App</p>
      <div className="app-download-platforms">
        <img src={assets.coming} alt="" />
        {/* <img src={assets.app_store} alt="" /> */}
      </div>
    </div>
  )
}

export default AppDownload
