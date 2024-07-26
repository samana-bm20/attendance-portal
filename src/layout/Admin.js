import React, { useContext, useEffect } from 'react'
import { AdminAppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

import UserContext from '../context/UserContext';

const Admin = () => {
  const { pendingLeave, fetchPendingLeaveRequests,
    pendingOD, fetchPendingODRequests } = useContext(UserContext)

  useEffect(() => {
    fetchPendingLeaveRequests();
    fetchPendingODRequests();
  }, [pendingLeave, pendingOD])
  
  setInterval(() => {
    fetchPendingLeaveRequests();
    fetchPendingODRequests();
  }, 6000);
  
  return (
    <div>
      <AppSidebar
        pendingLeaveCount={pendingLeave}
        pendingODCount={pendingOD}
      />
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
