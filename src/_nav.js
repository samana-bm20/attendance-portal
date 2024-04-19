import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilAddressBook,
  cilCalculator,
  cilCalendar,
  cilCalendarCheck,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

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
    to: '/employee',
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
