import React, { useState, useEffect } from 'react'
import axios from 'axios';
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilClock,
  cilCheckCircle,
  cilXCircle,
  cilUser,
  cilBan,
} from '@coreui/icons'

import Config from "../../../Config";
import MainChart from './MainChart'
import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((state) => state.UserReducer.user);
  const [loginTime, setLoginTime] = useState([]);
  const [futureLeaves, setFutureLeaves] = useState([]);
  const [todayLeaves, setTodayLeaves] = useState([]);

  useEffect(() => {
    const fetchLoginTime = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}/time?username=${user?.username}`);
        setLoginTime(response.data.data);
      } catch (error) {
        console.error('Error fetching login time', error);
      }
    };

    fetchLoginTime();
  }, [user?.username]);

  useEffect(() => {
    const upcomingLeaves = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}/future?empid=${user?.empid}`);
        setFutureLeaves(response.data.data);
      } catch (error) {
        console.error('Error fetching login time', error);
      }
    };

    upcomingLeaves();
  }, [user?.empid]);

  useEffect(() => {
    const onLeaveToday = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}/todayleave`);
        setTodayLeaves(response.data.data);
      } catch (error) {
        console.error('Error fetching login time', error);
      }
    };

    onLeaveToday();
  }, []);

  
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="py-1">
          <h5>Login Time</h5>
        </CCardHeader>
        <CCardBody>
          <CRow className="py-1">
            <h6>{loginTime}</h6>
          </CRow>
        </CCardBody>
      </CCard>
      <MainChart />
      <CRow xs={{ gutter: 3 }}>
        <CCol sm={9} xl={6} xxl={9}>
          <CCard className="mb-4">
            <CCardHeader>Leave Requests</CCardHeader>
            <CCardBody>
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
                    {/* <CTableHeaderCell className="bg-body-tertiary text-center">
                      Pullback
                    </CTableHeaderCell> */}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {futureLeaves && futureLeaves.map((item, index) => (
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
                      <CTableDataCell className="text-center"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.Status === 'Pending' && (
                          <CCard>
                            <CCardBody className='p-0' style={{ backgroundColor: 'rgba(255, 255, 50, 0.4)' }}>
                              <CRow >
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
                            <CCardBody className='p-0' style={{ backgroundColor: 'rgba(50, 255, 50, 0.4)' }}>
                              <CRow >
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
                            <CCardBody className='p-0' style={{ backgroundColor: 'rgba(255, 50, 50, 0.4)' }}>
                              <CRow >
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
                            <CCardBody className='p-0' style={{ backgroundColor: '#b3b3b3' }}>
                              <CRow >
                                <CCol>
                                  {item.Status}
                                  <CIcon icon={cilBan} />
                                </CCol>
                              </CRow>
                            </CCardBody>
                          </CCard>
                        )}
                      </CTableDataCell>
                      {/* <CTableDataCell className="text-center">
                        <div>{item.Status === 'Pending' && (
                          <CIcon icon={cilDelete} style={{color: 'red'}} onClick={() => alert("hello")} />
                        )}</div>
                      </CTableDataCell> */}
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={3} xl={2} xxl={3}>
          <CCard className="mb-2">
            <CCardHeader>Who's on Leave</CCardHeader>
            <CCardBody>
              <CRow className="mb-4">
                <CCol>On Leave: {todayLeaves.length}</CCol></CRow>
              {todayLeaves && todayLeaves.map((record, index) => (
                <CRow key={index}>
                  <CCol style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'flex-start'
                  }}>
                    <CIcon icon={cilUser} style={{ color: 'blue' }} />
                    <div className='p-2'>
                      {record.empid} - {record.name}
                    </div>
                  </CCol>
                </CRow>
              ))}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
