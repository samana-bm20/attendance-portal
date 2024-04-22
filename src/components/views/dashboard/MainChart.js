import React, { useEffect, useState } from 'react'
import Config from "../../../Config";
import { useSelector } from "react-redux";
import { CChartDoughnut } from '@coreui/react-chartjs'
import axios from 'axios'

import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'

const MainChart = () => {
  const user = useSelector((state) => state.UserReducer.user);
  const [leavesUsed, setLeavesUsed] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [workingDays, setWorkingDays] = useState(0);
  const [offDays, setOffDays] = useState(0);
  const [presentDays, setPresentDays] = useState(0);
  const [absentDays, setAbsentDays] = useState(0);
  const [lateDays, setLateDays] = useState(0);

  useEffect(() => {
    const fetchDayCount = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}/countdays?empid=${user?.empid}`);
        setWorkingDays(response.data.data[0].WorkingDays);
        setOffDays(response.data.data[0].TotalOff);
        setPresentDays(response.data.data[0].Present);
        setAbsentDays(response.data.data[0].Absent);
        setLateDays(response.data.data[0].Late);
      } catch {
        console.error("error fetching days count.");
      }
    };
    fetchDayCount();
  }, [user?.empid]);

  useEffect(() => {
    const fetchLeaveCount = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}/count?empid=${user?.empid}`);
        for (let i = 0; i < response.data.data.length; i++) {
          if (response.data.data[i].Status === 'Approved') {
            setApprovedCount(response.data.data[i].Count);
          } else if (response.data.data[i].Status === 'Pending') {
            setPendingCount(response.data.data[i].Count);
          } else if (response.data.data[i].Status === 'Rejected') {
            setRejectedCount(response.data.data[i].Count);
          }
        }
      } catch {
        console.error("error fetching leave count.");
      }
    };
    fetchLeaveCount();
  }, [user?.empid]);

  useEffect(() => {
    const fetchLeaveRecord = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}/used?empid=${user?.empid}`);
        setLeavesUsed(response.data.data[0].Leaves);
      } catch {
        console.error("error fetching leave records.");
      }
    };
    fetchLeaveRecord();
  }, [user?.empid]);

  const chart1Data = {
    data: {
      labels: ['Working', 'Off'],
      datasets: [
        {
          backgroundColor: ['#54B4D3', '#adadad'],
          data: [workingDays, offDays],
        },
      ],
    },
    options: {
      aspectRatio: 1.5,
      cutout: 50,
      borderWidth: 1,
      maintainAspectRatio: true,
    }
  }

  const chart2Data = {
    data: {
      labels: ['Present', 'Absent', 'Late'],
      datasets: [
        {
          backgroundColor: ['#14A44D', '#E4A11B', '#adadad'],
          data: [presentDays, absentDays, lateDays],
        },
      ],
    },
    options: {
      aspectRatio: 1.5,
      cutout: 40,
      borderWidth: 1,
      maintainAspectRatio: true,
    }
  }

  const chart3Data = {
    data: {
      labels: ['Pending', 'Approved', 'Rejected'],
      datasets: [
        {
          backgroundColor: ['#adadad', '#3B71CA', '#DC4C64'],
          data: [pendingCount, approvedCount, rejectedCount],
        },
      ],
    },
    options: {
      aspectRatio: 1.5,
      cutout: 40,
      borderWidth: 1,
      maintainAspectRatio: true,
    }
  }

  const chart4Data = {
    data: {
      labels: ['Used', 'Left'],
      datasets: [
        {
          backgroundColor: ['#adadad', '#E4A11B'],
          data: [leavesUsed, (15 - leavesUsed)],
        },
      ],
    },
    options: {
      aspectRatio: 1.5,
      cutout: 50,
      borderWidth: 1,
      maintainAspectRatio: true,
    }
  }

  return (
    <>
      <CRow xs={{ gutter: 3 }}>
        <CCol sm={6} xl={3} xxl={3}>
          <CCard className="mb-4" >
            <CCardHeader style={{ backgroundColor: '#54B4D3' }}>
              <h6>Working Days</h6>
            </CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={chart1Data.data}
                options={chart1Data.options}
              />
            </CCardBody>
            <CCardFooter>
              <div style={{ fontSize: '13px' }}>
                <span style={{ marginRight: '10px' }}>Working: {chart1Data.data.datasets[0].data[0]}</span>
                <span>Off: {chart1Data.data.datasets[0].data[1]}</span>
              </div>
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol sm={6} xl={3} xxl={3}>
          <CCard className="mb-4">
            <CCardHeader style={{ backgroundColor: '#14A44D' }}>
              <h6>Monthly Log</h6>
            </CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={chart2Data.data}
                options={chart2Data.options}
              />
            </CCardBody>
            <CCardFooter>
              <div style={{ fontSize: '13px' }}>
                <span style={{ marginRight: '10px' }}>Present: {chart2Data.data.datasets[0].data[0]}</span>
                <span style={{ marginRight: '10px' }}>Absent: {chart2Data.data.datasets[0].data[1]}</span>
                <span>Late: {chart2Data.data.datasets[0].data[2]}</span>
              </div>
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol sm={6} xl={3} xxl={3}>
          <CCard className="mb-4">
            <CCardHeader style={{ backgroundColor: '#DC4C64' }}>
              <h6>Requests</h6>
            </CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={chart3Data.data}
                options={chart3Data.options}
              />
            </CCardBody>
            <CCardFooter>
              <div style={{ fontSize: '13px' }}>
                <span style={{ marginRight: '10px' }}>Pending: {chart3Data.data.datasets[0].data[0]}</span>
                <span style={{ marginRight: '10px' }}>Approved: {chart3Data.data.datasets[0].data[1]}</span>
                <span>Rejected: {chart3Data.data.datasets[0].data[2]}</span>
              </div>
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol sm={6} xl={3} xxl={3}>
          <CCard className="mb-4">
            <CCardHeader style={{ backgroundColor: '#E4A11B' }}>
              <h6>Leaves</h6>
            </CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={chart4Data.data}
                options={chart4Data.options}
              />
            </CCardBody>
            <CCardFooter>
              <div style={{ fontSize: '13px' }}>
                <span style={{ marginRight: '10px' }}>Used: {chart4Data.data.datasets[0].data[0]}</span>
                <span>Left: {chart4Data.data.datasets[0].data[1]}</span>
              </div>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default MainChart
