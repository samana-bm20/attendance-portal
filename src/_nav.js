import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilAddressBook,
  cilCalendar,
  cilCalendarCheck, 
  cilSpeedometer, 
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
]

export default _nav
