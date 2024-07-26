import React, { useState, useEffect } from 'react'
import UserContext from './UserContext'
import axios from 'axios'
import Config from '../Config'
import { useSelector } from "react-redux";

const UserContextProvider = ({ children }) => {
  const user = useSelector((state) => state.user)
  const [months, setMonths] = useState([])
  const [employeeNames, setEmployeeNames] = useState([])
  const [pendingLeave, setPendingLeave] = useState()
  const [pendingOD, setPendingOD] = useState()

  const fetchPendingLeaveRequests = async () => {
    try {
      const response = await axios.get(`${Config.apiUrl}/pending`, {
        params: {
          userType: user?.userType,
          empid: user?.empid
        }
      });

      const countPendingLeave = response.data.data.filter(leave => leave.Status == 'Pending');
      setPendingLeave(countPendingLeave.length)
    } catch (error) {
      console.error(error)
    }
  }
  
  const fetchPendingODRequests = async () => {
    try {
      const response = await axios.get(`${Config.apiUrl}/pendingOfficialDuty`, {
        params: {
          userType: user?.userType,
          empid: user?.empid
        }
      });

      const countPendingOD = response.data.data.filter(od => od.Status == 'Pending');
      setPendingOD(countPendingOD.length)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (user?.empid != null) {
      fetchPendingLeaveRequests();
      fetchPendingODRequests();
    } else {
      console.log('')
    }
  }, []);

  return (
    <UserContext.Provider value={{
      months, setMonths, employeeNames, setEmployeeNames,
      pendingLeave, setPendingLeave, fetchPendingLeaveRequests,
      pendingOD, setPendingOD, fetchPendingODRequests
      }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider