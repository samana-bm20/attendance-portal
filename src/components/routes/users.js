import React from 'react'
const Dashboard = React.lazy(() => import('../views/dashboard/Dashboard'))
const Attendance = React.lazy(() => import('../views/attendance/Attendance'))
const Leave = React.lazy(() => import('../views/leave/LeavePage'))
const OfficialDutyWFH = React.lazy(() => import('../views/od-wfh/OfficialDuty')) 
const PersonalDetails = React.lazy(() => import('../views/personalDetails/PersonalDetails')) 
const Holidays = React.lazy(()=>import('../views/Holiday/Holiday'))

const supperadmin = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/attendance', name: 'Attendance', element: Attendance },
  { path: '/leave', name: 'Leave', element: Leave },
  { path: '/od-wfh', name: 'Official Duty / WFH', element: OfficialDutyWFH },
  { path: '/info', name: 'Personal Details', element: PersonalDetails },
  { path: '/Holidays', name: 'Holidays', element: Holidays },
];
export default supperadmin
