import React from 'react'
import { SupperAdminAppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const SupperAdmin = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <SupperAdminAppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default SupperAdmin
