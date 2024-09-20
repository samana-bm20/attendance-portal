import React from 'react'

const Dashboard = React.lazy(() => import('../views/dashboard/Dashboard'))
const Attendance = React.lazy(() => import('../views/attendance/Attendance'))
const EmployeeAttendance = React.lazy(() => import('../views/employeeReport/employee'))
const Leave = React.lazy(() => import('../views/leave/LeavePage')) 
const Employee = React.lazy(() => import('../views/employee/Employee')) 
const OfficialDutyWFH = React.lazy(() => import('../views/od-wfh/OfficialDuty')) 
const PersonalDetails = React.lazy(() => import('../views/personalDetails/PersonalDetails')) 
const Report = React.lazy(() => import('../views/report/Report')) 
const Log = React.lazy(() => import('../views/log/Log')) 
const Holidays = React.lazy(()=>import('../views/Holiday/Holiday'))

const admin = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/employee', name: 'Employee', element: Employee },
  { path: '/attendance', name: 'Attendance', element: Attendance },
  { path: '/employee-attendance', name: 'Employee Attendance', element: EmployeeAttendance },
  { path: '/leave', name: 'Leave', element: Leave },
  { path: '/od-wfh', name: 'Official Duty / WFH', element: OfficialDutyWFH },
  { path: '/info', name: 'Personal Details', element: PersonalDetails },
  { path: '/report', name: 'Summary Report', element: Report },
  { path: '/log', name: 'Log', element: Log },
  { path: '/Holidays', name: 'Holidays', element: Holidays },
]

export default admin
