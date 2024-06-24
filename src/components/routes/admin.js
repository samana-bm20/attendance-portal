// change on 07/06/2024
import React from 'react'

const Dashboard = React.lazy(() => import('../views/dashboard/Dashboard'))
const Attendance = React.lazy(() => import('../views/attendance/Attendance'))
const EmployeeAttendance = React.lazy(() => import('../views/employeeReport/employee'))
const Leave = React.lazy(() => import('../views/leave/LeavePage')) 
const Employee = React.lazy(() => import('../views/employee/Employee')) 
//code change start
const OfficialDutyWFH = React.lazy(() => import('../views/od-wfh/OfficialDuty')) 
const Report = React.lazy(() => import('../views/report/Report')) 
const Troubleshoot = React.lazy(() => import('../views/troubleshoot/Troubleshoot')) 
//code change end

const admin = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/employee', name: 'Employee', element: Employee },
  { path: '/attendance', name: 'Attendance', element: Attendance },
  { path: '/employee-attendance', name: 'Employee Attendance', element: EmployeeAttendance },
  { path: '/leave', name: 'Leave', element: Leave },
  //code change start
  { path: '/od-wfh', name: 'Official Duty / WFH', element: OfficialDutyWFH },
  { path: '/report', name: 'Summary Report', element: Report },
  { path: '/troubleshoot', name: 'Troubleshoot', element: Troubleshoot },
  //code change end
]

export default admin
