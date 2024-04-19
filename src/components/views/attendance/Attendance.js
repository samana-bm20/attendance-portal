import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import './Attendance.css'
import Config from "../../../Config";
import { useSelector } from "react-redux";
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import axios from 'axios'
import Monthly from './Monthly'

const Attendance = () => {
  const user = useSelector((state) => state.UserReducer.user);
  const [calendarData, setCalendarData] = useState([]);
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [workingDays, setWorkingDays] = useState(0);
  const [presentDays, setPresentDays] = useState(0);
  const [absentDays, setAbsentDays] = useState(0);

  useEffect(() => {
    const fetchDayCount = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}/countdays?empid=${user?.empid}`);
        setWorkingDays(response.data.data[0].WorkingDays);
        setPresentDays(response.data.data[0].Present);
        setAbsentDays(response.data.data[0].Absent);
      } catch {
        console.error("error fetching days count.");
      }
    };
    fetchDayCount();
  }, [user?.empid]);

  useEffect(() => {
    const handleCalendarReport = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}/calendar?username=${user?.username}`);
        const updatedCalendarData = await Promise.all(response.data.data.map(async (record) => {
          if (record.time === null) {
            const allAbsent = await checkAllAbsent(record.date);
            return { ...record, time: allAbsent ? 'OFF' : 'Absent' };
          }
          return record;
        }));
        setCalendarData(updatedCalendarData);
      } catch (error) {
        console.error('Error fetching full report', error);
      }
    };
    handleCalendarReport();
  }, [user?.username]);

  const checkAllAbsent = async (date) => {
    try {
      const response = await axios.get(`${Config.apiUrl}/absent?date=${date}`);
      return response.data.data;
    } catch (error) {
      console.error('Error checking all absent', error);
      return false;
    }
  };

  useEffect(() => {
    const fetchLeaveRecord = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}/fetch?empname=${user?.name}`);
        setLeaveRecords(response.data.data);
      } catch {
        console.error("error fetching leave records.");
      }
    };
    fetchLeaveRecord();
  }, [user?.name]);


  const coloredDays = ({ date, view }) => {
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, '-');
    const record = calendarData.find(item => item.date === formattedDate);
    const leaveRecord = leaveRecords.find(record => (
      new Date(formattedDate) >= new Date(record.FromDate) &&
      new Date(formattedDate) <= new Date(record.ToDate
      )));

    if (leaveRecord) {
      const { Status } = leaveRecord;
      if (Status === 'Pending') {
        return 'pending';
      } else if (Status === 'Approved') {
        return 'approved';
      } else if (Status === 'Rejected') {
        return 'rejected';
      }
    } else if (record) {
      const { time } = record;
      if (time === 'OFF') {
        return 'off';
      } else if (time === 'Absent') {
        return 'absent';
      } else {
        if ((parseInt(time.split(':')[0]) === 9 && parseInt(time.split(':')[1]) >= 0) ||
          parseInt(time.split(':')[0]) > 9 ||
          time.split(':')[1].split(' ')[1] === 'PM') {
          return 'late';
        } else {
          return 'present';
        }
      }
    }

    return '';
  };

  setTimeout(() => {
    try {
      coloredDays();
    } catch (error) {
      console.log(error);
    }

  }, 1000);

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader />
        <CCardBody>
          <CRow>
            <CCol style={{ textAlign: 'center' }}>
              <div>
                <h4>{workingDays}</h4>
                <p>Working Days</p>
              </div>
            </CCol>
            <CCol style={{ textAlign: 'center' }}>
              <div>
                <h4>{presentDays}</h4>
                <p>Present</p>
              </div>
            </CCol>
            <CCol style={{ textAlign: 'center' }}>
              <div>
                <h4>{absentDays}</h4>
                <p>Absent</p>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CRow>
        <CCol xs={12} sm={6}>
          <CCard className="mb-4">
            <CCardHeader>Calendar</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  <Calendar tileClassName={coloredDays} />
                </CCol>
                <CCol>
                  <CCard className='p-2'>
                    <CRow className='p-2'>
                      <div>
                        <span
                          className='color-represent'
                          style={{ backgroundColor: 'lightgreen' }}>
                        </span>
                        <span className='color-meaning'>Present</span>
                      </div>
                    </CRow>
                    <CRow className='p-2'>
                      <div>
                        <span
                          className='color-represent'
                          style={{ backgroundColor: 'lightcoral' }}>
                        </span>
                        <span className='color-meaning'>Late</span>
                      </div>
                    </CRow>
                    <CRow className='p-2'>
                      <div>
                        <span
                          className='color-represent'
                          style={{ backgroundColor: 'rgb(255, 232, 105)' }}>
                        </span>
                        <span className='color-meaning'>Absent</span>
                      </div>
                    </CRow>
                    <CRow className='p-2'>
                      <div>
                        <span
                          className='color-represent'
                          style={{ backgroundColor: 'lightgray' }}>
                        </span>
                        <span className='color-meaning'>Off</span>
                      </div>
                    </CRow>
                    <CRow className='p-2'>
                      <div>
                        <span
                          className='color-represent'
                          style={{ backgroundColor: 'lightskyblue' }}>
                        </span>
                        <span className='color-meaning'>Leave</span>
                      </div>
                    </CRow>
                    <CRow className='p-2'>
                      <div>
                        <span
                          className='color-represent'
                          style={{ backgroundColor: 'sandybrown' }}>
                        </span>
                        <span className='color-meaning'>Rejected</span>
                      </div>
                    </CRow>
                    <CRow className='p-2'>
                      <div>
                        <span
                          className='color-represent'
                          style={{ backgroundColor: 'plum' }}>
                        </span>
                        <span className='color-meaning'>Pending</span>
                      </div>
                    </CRow>
                  </CCard>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6}>
          <Monthly />
        </CCol>
      </CRow>
    </>
  )
}

export default Attendance;
