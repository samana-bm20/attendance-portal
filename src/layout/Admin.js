import React from 'react'
import { AdminAppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const Admin = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AdminAppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default Admin
