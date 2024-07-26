import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpreadsheet,
  cilAddressBook, 
  cilPeople,
  cilCalendar,
  cilCalendarCheck, 
  cilSpeedometer,
  cilLocationPin,
  cilPuzzle,
  cilChartLine,
  cilHappy,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Attendance',
    to: '/attendance',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Employee Data',
    to: '/employee',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Employee Attendance',
    to: '/employee-attendance',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Leave',
    to: '/leave',
    icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Official Duty / WFH',
    to: '/od-wfh',
    icon: <CIcon icon={cilLocationPin} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Personal Details',
    to: '/info',
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Analytics',
    to: '/report',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Troubleshoot',
    to: '/troubleshoot',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Holidays',
    to: '/Holidays',
    icon: <CIcon icon={cilHappy} customClassName="nav-icon" />,
  },
]

export default _nav
