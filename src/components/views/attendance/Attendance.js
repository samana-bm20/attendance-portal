import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import './Attendance.css'
import Config from "../../../Config";
import { useSelector } from "react-redux";
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import axios from 'axios'
import Monthly from './Monthly'

const Attendance = () => {
  const user = useSelector((state) => state.user);
  const [calendarData, setCalendarData] = useState([]);
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [officialDuty, setOfficialDuty] = useState([]);
  const [workingDays, setWorkingDays] = useState(0);
  const [presentDays, setPresentDays] = useState(0);
  const [absentDays, setAbsentDays] = useState(0);
  const [lateDays, setLateDays] = useState(0);
  const [viewDate, setViewDate] = useState(new Date());

  const handleActiveStartDateChange = ({ activeStartDate }) => {
    setViewDate(activeStartDate);
  };

  //#region Statistics
  useEffect(() => {
    const fetchDayCount = async () => {
      try {
        const today = new Date();
        const firstDate = new Date(today.getFullYear(), today.getMonth(), 1);
        let startDate;
        if ((formatDate(viewDate) == formatDate(today))) {
          startDate = formatDate(firstDate);
        } else {
          startDate = formatDate(viewDate);
        }
        const response = await axios.get(`${Config.apiUrl}/monthwise?viewdate=${startDate}&empid=${user?.empid}`);
        setWorkingDays(response.data.data[0].WorkingDays);
        setPresentDays(response.data.data[0].Present);
        setAbsentDays(response.data.data[0].Absent);
        setLateDays(response.data.data[0].Late);
      } catch {
        console.error("error fetching days count.");
      }
    };
    fetchDayCount();
  }, [viewDate, user?.empid]);

  //#region Calendar
  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  // Function to check if all are absent
  const checkAllAbsent = async (date) => {
    try {
      const response = await axios.get(`${Config.apiUrl}/absent?date=${date}`);
      return response.data.data;
    } catch (error) {
      console.error("Error checking all absent:", error);
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const firstDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        let startDate, endDate;
        if ((formatDate(viewDate) == formatDate(today))) {
          startDate = formatDate(firstDate);
          endDate = formatDate(lastDate);
        } else {
          startDate = formatDate(viewDate);
          endDate = formatDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0));
        }

        const [calendarResponse, holidayResponse, leaveResponse, officialDutyResponse] =
          await Promise.all([
            axios.get(`${Config.apiUrl}/calendar?empid=${user?.empid}&startDate=${startDate}&endDate=${endDate}`),
            axios.get(`${Config.apiUrl}/monthHoliday?startDate=${startDate}&endDate=${endDate}`),
            axios.get(`${Config.apiUrl}/fetch?empid=${user?.empid}&startDate=${startDate}&endDate=${endDate}`),
            axios.get(`${Config.apiUrl}/fetchOfficialDuty?empid=${user?.empid}&startDate=${startDate}&endDate=${endDate}`),
          ]);

        const updatedCalendarData = await Promise.all(
          calendarResponse.data.data.map(async (record) => {
            if (record.time === null && new Date(record.date) <= new Date()) {
              const allAbsent = await checkAllAbsent(record.date);
              return { ...record, time: allAbsent ? "OFF" : "Absent" };
            }
            return record;
          })
        );
 
        setCalendarData(updatedCalendarData);
        setHolidays(holidayResponse.data.data);
        setLeaveRecords(leaveResponse.data.data);
        setOfficialDuty(officialDutyResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user?.empid, viewDate]);


  //#region Color Function

  const coloredDays = ({ date, view }) => {
    if (view == 'month') {
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).replace(/ /g, '-').replace('Sept', 'Sep');

      if (!calendarData || !holidays || !leaveRecords || !officialDuty) {
        return '';
      }

      const holidayRecord = holidays.find(holiday => holiday.Date === formattedDate);

      const leaveRecord = leaveRecords.find(record => (
        new Date(formattedDate) >= new Date(record.FromDate) &&
        new Date(formattedDate) <= new Date(record.ToDate) && record.Status === 'Approved'));

      const officialDutyRecord = officialDuty.find(record => (
        new Date(formattedDate) >= new Date(record.FromDate) &&
        new Date(formattedDate) <= new Date(record.ToDate)));

      const record = calendarData.find(item => item.date === formattedDate);

      if (holidayRecord) {
        return 'holiday';
      } else if (leaveRecord) {
        const { FirstHalf, SecondHalf, FromDate, ToDate } = leaveRecord;
        if (FirstHalf) {
          if (formattedDate == ToDate) {
            if (record) {
              const { time } = record;
              if (time == null) {
                return 'firsthalf';
              } else if (time == 'Absent') {
                return 'firstAbsent';
              } else if (time == 'Off') {
                return 'firstOff';
              } else if (parseInt(time.split(':')[0]) <= 2 || time.includes('AM')
                || parseInt(time.split(':')[0]) == 12) {
                return 'firstPresent';
              }
            } else {
              return 'firsthalf';
            }
          } else {
            return 'approved';
          }
        } else if (SecondHalf) {
          if (formattedDate == FromDate) {
            if (record) {
              const { time } = record;
              if (time == null) {
                return 'secondhalf';
              } else if (time == 'Absent') {
                return 'secondAbsent';
              } else if (time == 'Off') {
                return 'secondOff';
              } else if ((parseInt(time.split(':')[0]) <= 10 && time.includes('AM'))) {
                return 'secondPresent';
              }
            } else {
              return 'secondhalf';
            }
          } else {
            return 'approved';
          }
        } else {
          return 'approved';
        }
      } else if (officialDutyRecord) {
        const { Mode } = officialDutyRecord;
        return Mode === 'official-duty'? 'official-duty': 'work-from-home';
      } else if (record) {
        const { time } = record;
        if (time === 'OFF') {
          return 'off';
        } else if (time === 'Absent') {
          return 'absent';
        } else if (time == null) {
          return '';
        } else {
          if ((parseInt(time.split(':')[0]) === 9 && parseInt(time.split(':')[1]) > 0) ||
            parseInt(time.split(':')[0]) > 9 || time.includes('PM')) {
            return 'late';
          } else {
            return 'present';
          }
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

  //#endregion

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>Month Statistics</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol style={{ textAlign: 'center' }} xs={6} xl={3}>
              <div>
                <h4>{workingDays}</h4>
                <p>Working Days</p>
              </div>
            </CCol>
            <CCol style={{ textAlign: 'center' }} xs={6} xl={3}>
              <div>
                <h4>{presentDays}</h4>
                <p>Present</p>
              </div>
            </CCol>
            <CCol style={{ textAlign: 'center' }} xs={6} xl={3}>
              <div>
                <h4>{lateDays}</h4>
                <p>Late</p>
              </div>
            </CCol>
            <CCol style={{ textAlign: 'center' }} xs={6} xl={3}>
              <div>
                <h4>{absentDays}</h4>
                <p>Absent</p>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CRow>
        <CCol xs={12} sm={12} xl={12} xxl={12}>
          <CCard className="mb-4">
            <CCardHeader>Calendar</CCardHeader>
            <CCardBody>
              <CRow >
                <CCol xs={12} sm={8} xl={7} xxl={7} style={{ marginBottom: '5px', display: 'flex', justifyContent: 'center' }}>
                  <Calendar
                    tileClassName={coloredDays}
                    onActiveStartDateChange={handleActiveStartDateChange}
                  />
                </CCol>
                <CCol xs={12} sm={4} xl={5} xxl={5} style={{ display: 'flex', justifyContent: 'center' }}>
                  <CCard className='p-1 m-1' style={{ justifyContent: 'center', fontSize: 'small', minWidth: 'fit-content' }}>
                    <CRow className='p-1'>
                      <div>
                        <span
                          className='color-represent'
                          style={{ backgroundColor: 'lightgreen' }}>
                        </span>
                        <span className='color-meaning'>Present</span>
                      </div>
                    </CRow>
                    <CRow className='p-1'>
                      <div>
                        <span
                          className='color-represent'
                          style={{ backgroundColor: 'lightcoral' }}>
                        </span>
                        <span className='color-meaning'>Late</span>
                      </div>
                    </CRow>
                    <CRow className='p-1'>
                      <div>
                        <span
                          className='color-represent'
                          style={{ backgroundColor: 'rgb(255, 232, 105)' }}>
                        </span>
                        <span className='color-meaning'>Absent</span>
                      </div>
                    </CRow>
                    <CRow className='p-1'>
                      <div>
                        <span
                          className='color-represent'
                          style={{ backgroundColor: 'lightgray' }}>
                        </span>
                        <span className='color-meaning'>Off</span>
                      </div>
                    </CRow>
                  </CCard>
                  <CCard className='p-1 m-1' style={{ justifyContent: 'center', fontSize: 'small', minWidth: 'fit-content' }}>
                    <CRow className='p-1'>
                      <div>
                        <span
                          className='color-represent'
                          style={{ backgroundColor: 'lightskyblue' }}>
                        </span>
                        <span className='color-meaning'>Leave</span>
                      </div>
                    </CRow>
                    <CRow className='p-1'>
                      <div>
                        <span
                          className='color-represent'
                          style={{ backgroundColor: '#d981d9' }}>
                        </span>
                        <span className='color-meaning'>Holiday</span>
                      </div>
                    </CRow>
                    <CRow className='p-1'>
                      <div>
                        <span
                          className='color-represent'
                          style={{ backgroundColor: '#36ad8f' }}>
                        </span>
                        <span className='color-meaning'>OD</span>
                      </div>
                    </CRow>
                    <CRow className='p-1'>
                      <div>
                        <span
                          className='color-represent'
                          style={{ backgroundColor: '#C08B5C' }}>
                        </span>
                        <span className='color-meaning'>WFH</span>
                      </div>
                    </CRow>
                  </CCard>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={12} xl={12} xxl={12}>
          <Monthly />
        </CCol>
      </CRow>
    </>
  )
}

export default Attendance;
