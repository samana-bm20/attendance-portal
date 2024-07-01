import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormLabel,
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilClock, cilCheckCircle, cilXCircle, cilUser, cilBirthdayCake, cilBan } from '@coreui/icons'
import { toast } from "react-toastify";

import Config from '../../../Config'
import MainChart from './MainChart'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user = useSelector((state) => state.user)
  const [loginTime, setLoginTime] = useState([])
  const [futureLeaves, setFutureLeaves] = useState([])
  const [todayLeaves, setTodayLeaves] = useState([])
  const [birthdays, setBirthdays] = useState([])
  const [inDisabled, setInDisabled] = useState(false)
  const [outDisabled, setOutDisabled] = useState(true)
  const [showOutTime, setShowOutTime] = useState(false);
  let toastId = null;

  useEffect(() => {
    const fetchLoginTime = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}/time?username=${user?.username}`)
        setLoginTime(response.data.data);
        if (response.data.data) {
          const record = await axios.get(`${Config.apiUrl}/logout?username=${user?.username}`)
          if (record.data.data) {
            setInDisabled(true);
            setOutDisabled(true);
          } else {
            setInDisabled(true);
            setOutDisabled(false);
          }
        } else {
          setInDisabled(false);
          setOutDisabled(true);
        }
      } catch (error) {
        console.error('Error fetching login time', error)
      }
    };
    fetchLoginTime();

  }, [user?.username]);

  const recordLogin = async () => {
    const userLatitude = 28.540499161562323;
    const userLongitude = 77.18584540547293;
    const radius = 1000; //range in meters

    //Haversine Formula
    const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of the earth in km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c * 1000; // Distance in meters
      return distance;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        const distance = getDistanceFromLatLonInMeters(userLat, userLon, userLatitude, userLongitude);

        if (distance <= radius) {
          let params = {
            username: user?.username,
            fullname: user?.name,
            empid: user?.empid,
          };
          try {
            const response = await axios.post(`${Config.apiUrl}/intime`, params);
            if (response.data.status === 'OK') {
              if (toastId) toast.dismiss(toastId);
              toastId = toast.success("Attendance recorded successfully.", { autoClose: 3000 });
              const record = await axios.get(`${Config.apiUrl}/time?username=${user?.username}`)
              setLoginTime(record.data.data);
              if (record.data.data) {
                setInDisabled(true);
                setOutDisabled(false);
              }
            }
          } catch (error) {
            console.error('Error fetching login time', error);
          }
        } else {
          if (toastId) toast.dismiss(toastId);
          toastId = toast.error("You are not within the required location range.", { autoClose: 3000 });
        }
      }, (error) => {
        console.error('Error getting location', error);
        if (toastId) toast.dismiss(toastId);
        toastId = toast.error("Unable to get your location.", { autoClose: 3000 });
      });
    } else {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Geolocation is not supported by this browser.", { autoClose: 3000 });
    }
  };


  const recordLogout = async () => {
    const userLatitude = 28.540499161562323;
    const userLongitude = 77.18584540547293;
    const radius = 1000; //range in meters

    //Haversine Formula
    const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of the earth in km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c * 1000; // Distance in meters
      return distance;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        const distance = getDistanceFromLatLonInMeters(userLat, userLon, userLatitude, userLongitude);

        if (distance <= radius) {
          try {
            const response = await axios.get(`${Config.apiUrl}/outtime?username=${user?.username}`);
            if (response.data.status === 'OK') {
              setShowOutTime(false);
              if (toastId) toast.dismiss(toastId);
              toastId = toast.success("Out time recorded successfully.", { autoClose: 3000 });
              const record = await axios.get(`${Config.apiUrl}/logout?username=${user?.username}`)
              if (record.data.data) {
                setOutDisabled(true);
              }
            }
          } catch (error) {
            setShowOutTime(false);
            if (toastId) toast.dismiss(toastId);
            toastId = toast.error('Error fetching logout time', { autoClose: 3000 });
          }
        } else {
          if (toastId) toast.dismiss(toastId);
          toastId = toast.error("You are not within the required location range.", { autoClose: 3000 });
        }
      }, (error) => {
        console.error('Error getting location', error);
        if (toastId) toast.dismiss(toastId);
        toastId = toast.error("Unable to get your location.", { autoClose: 3000 });
      });
    } else {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Geolocation is not supported by this browser.", { autoClose: 3000 });
    }

  };

  useEffect(() => {
    const upcomingLeaves = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}/future?empid=${user?.empid}`)
        setFutureLeaves(response.data.data)
      } catch (error) {
        console.error('Error fetching login time', error)
      }
    }

    upcomingLeaves()
  }, [user?.empid])

  useEffect(() => {
    const onLeaveToday = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}/todayleave`)
        setTodayLeaves(response.data.data)
      } catch (error) {
        console.error('Error fetching absentees', error)
      }
    }

    onLeaveToday();
  }, []);

  useEffect(() => {
    const upcomingBirthdays = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}/bday`)
        setBirthdays(response.data.data)
      } catch (error) {
        console.error('Error fetching upcoming birthdays', error)
      }
    }

    upcomingBirthdays();
  }, []);

  return (
    <>
      <CRow xs={{ gutter: 3 }}>
        <CCol md={6} xl={6}>
          <CCard className="mb-4">
            <CCardHeader className="py-1">
              <h5>Attendance</h5>
            </CCardHeader>
            <CCardBody>
              <CRow className="py-1">
                <h6>{loginTime ? loginTime : "Not recorded yet"}</h6>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6} xl={6}>
          <CCard className="mb-4">
            <CCardHeader className="py-1">
              <h5>In/Out Time</h5>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol style={{ display: 'flex', justifyContent: 'center' }}>
                  <CTooltip
                    content="Mark attendance"
                    trigger={['hover']}
                  >
                    <CButton 
                    color="success" 
                    disabled={inDisabled} 
                    style={{ width: 'max-content', marginBottom: '5px' }} 
                    onClick={recordLogin}>
                      Mark In Time
                      </CButton>
                  </CTooltip>
                </CCol>
                <CCol style={{ display: 'flex', justifyContent: 'center' }}>
                  <CTooltip
                    content="Mark logout time"
                    trigger={['hover']}
                  >
                    <CButton 
                    color="warning" 
                    disabled={outDisabled}
                    style={{ width: 'max-content', marginBottom: '5px' }} 
                    onClick={() => {
                      setShowOutTime(!showOutTime);
                    }}>
                      Mark Out Time
                      </CButton>
                  </CTooltip>
                </CCol>
              </CRow>
              <CModal visible={showOutTime} onClose={() => setShowOutTime(false)}>
                <CModalHeader>
                  <CModalTitle> Out Time </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CForm>
                    <div className="mb-3">
                      <CFormLabel htmlFor="exampleFormControlTextarea1">
                        Do you want to mark logout time? </CFormLabel>
                    </div>
                  </CForm>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setShowOutTime(false)}>
                    No
                  </CButton>
                  <CButton color="primary" onClick={recordLogout}>Yes</CButton>
                </CModalFooter>
              </CModal>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <MainChart />
      <CRow xs={{ gutter: 3 }}>
        <CCol sm={12} xl={6} xxl={6}>
          <CCard className="mb-4">
            <CCardHeader>Your Upcoming Leaves</CCardHeader>
            <CCardBody style={{ overflowY: 'scroll', maxHeight: '200px', minHeight: '200px' }}>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      From Date
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      To Date
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Days
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Status
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {futureLeaves &&
                    futureLeaves.map((item, index) => (
                      <CTableRow v-for="item in tableItems" key={index}>
                        <CTableDataCell className="text-center">
                          <div>{item.FromDate}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div>{item.ToDate}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div>{item.Days}</div>
                        </CTableDataCell>
                        <CTableDataCell
                          className="text-center"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {item.Status === 'Pending' && (
                            <CCard>
                              <CCardBody
                                className="p-0"
                                style={{ backgroundColor: 'rgba(255, 255, 50, 0.4)' }}
                              >
                                <CRow>
                                  <CCol>
                                    {item.Status}
                                    <CIcon icon={cilClock} />
                                  </CCol>
                                </CRow>
                              </CCardBody>
                            </CCard>
                          )}
                          {item.Status === 'Approved' && (
                            <CCard>
                              <CCardBody
                                className="p-0"
                                style={{ backgroundColor: 'rgba(50, 255, 50, 0.4)' }}
                              >
                                <CRow>
                                  <CCol>
                                    {item.Status}
                                    <CIcon icon={cilCheckCircle} />
                                  </CCol>
                                </CRow>
                              </CCardBody>
                            </CCard>
                          )}
                          {item.Status === 'Rejected' && (
                            <CCard>
                              <CCardBody
                                className="p-0"
                                style={{ backgroundColor: 'rgba(255, 50, 50, 0.4)' }}
                              >
                                <CRow>
                                  <CCol>
                                    {item.Status}
                                    <CIcon icon={cilXCircle} />
                                  </CCol>
                                </CRow>
                              </CCardBody>
                            </CCard>
                          )}
                          {item.Status === 'Pullback' && (
                            <CCard>
                              <CCardBody className="p-0" style={{ backgroundColor: '#b3b3b3' }}>
                                <CRow>
                                  <CCol>
                                    {item.Status}
                                    <CIcon icon={cilBan} />
                                  </CCol>
                                </CRow>
                              </CCardBody>
                            </CCard>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={12} xl={3} xxl={3}>
          <CCard className="mb-2">
            <CCardHeader>Who's on Leave Today</CCardHeader>
            <CCardBody style={{ overflowY: 'scroll', maxHeight: '200px', minHeight: '200px' }}>
              <CRow className="mb-4">
                <CCol>On Leave: {todayLeaves.length}</CCol>
              </CRow>
              {todayLeaves &&
                todayLeaves.map((record, index) => (
                  <CRow key={index}>
                    <CCol
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                      }}
                    >
                      <CIcon icon={cilUser} style={{ color: 'steelblue' }} />
                      <div className="p-2">
                        {record.EmpID} - {record.EmpName}
                      </div>
                    </CCol>
                  </CRow>
                ))}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={12} xl={3} xxl={3}>
          <CCard className="mb-2">
            <CCardHeader>Upcoming Birthdays</CCardHeader>
            <CCardBody style={{ overflowY: 'scroll', maxHeight: '200px', minHeight: '200px' }}>
              {birthdays ?
                (birthdays.map((record, index) => (
                  <CRow key={index}>
                    <CCol
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                      }}
                    >
                      <CIcon icon={cilBirthdayCake} style={{ color: 'steelblue' }} />
                      <div className="p-2">
                        {record.name} - {record.UpcomingBirthday}
                      </div>
                    </CCol>
                  </CRow>
                ))) : 'No upcoming birthday'}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
