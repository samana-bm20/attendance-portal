// change on 07/06/2024
import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilAddressBook, 
  cilPeople,
  cilCalendar,
  cilCalendarCheck, 
  cilSpeedometer,
  cilLocationPin,
  cilPuzzle,
  cilChartLine,
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
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Leave',
    to: '/leave',
    icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
  },
  //code change start
  {
    component: CNavItem,
    name: 'Official Duty / WFH',
    to: '/od-wfh',
    icon: <CIcon icon={cilLocationPin} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Summary Report',
    to: '/report',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Troubleshoot',
    to: '/troubleshoot',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
    //code change end
]

export default _nav
