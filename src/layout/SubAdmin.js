import React from 'react'
import { SubAdminAppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const SubAdmin = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <SubAdminAppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default SubAdmin
