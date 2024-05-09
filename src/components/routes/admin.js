import React from 'react'

const Dashboard = React.lazy(() => import('../views/dashboard/Dashboard'))
const Attendance = React.lazy(() => import('../views/attendance/Attendance'))
const EmployeeAttendance = React.lazy(() => import('../views/employeeReport/employee'))
const Leave = React.lazy(() => import('../views/leave/LeavePage')) 

const admin = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/attendance', name: 'Attendance', element: Attendance },
 { path: '/employee-attendance', name: 'Employee Attendance', element: EmployeeAttendance },
  { path: '/leave', name: 'Leave', element: Leave },
]

export default admin
