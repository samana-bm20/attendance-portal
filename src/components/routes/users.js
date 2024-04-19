import React from 'react'

const Dashboard = React.lazy(() => import('../views/dashboard/Dashboard'))
const Attendance = React.lazy(() => import('../views/attendance/Attendance'))
const EmployeeAttendance = React.lazy(() => import('../views/employeeReport/employee'))
const Leave = React.lazy(() => import('../views/leave/LeavePage'))
const Colors = React.lazy(() => import('../views/theme/colors/Colors'))
const Typography = React.lazy(() => import('../views/theme/typography/Typography'))


const supperadmin = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
 
  { path: '/attendance', name: 'Attendance', element: Attendance },
 
  { path: '/employee', name: 'Employee Attendance', element: EmployeeAttendance },
  { path: '/leave', name: 'Leave', element: Leave },
]

export default supperadmin
