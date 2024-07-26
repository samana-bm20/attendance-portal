import React from 'react'
import { UserAppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const User = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <UserAppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default User
