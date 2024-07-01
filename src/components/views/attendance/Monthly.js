import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from "react-redux";
import * as ExcelJS from 'exceljs';
import axios from 'axios'
import Config from "../../../Config";

import {
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CButton,
    CTooltip,
} from '@coreui/react'

import UserContext from '../../../context/UserContext';

const Monthly = () => {
    const user = useSelector((state) => state.user);
    const { months } = useContext(UserContext);
    const username = localStorage.getItem('user');
    const empid = localStorage.getItem('empid');
    const fullName = localStorage.getItem('name');
    const [selectedMonthYear, setSelectedMonthYear] = useState('');
    const [reportMonth, setReportMonth] = useState((new Date().getMonth()) + 1);
    const [reportYear, setReportYear] = useState(new Date().getFullYear());
    const [attendanceData, setAttendanceData] = useState([]);
    const [leaveRecords, setLeaveRecords] = useState([]);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [valueFirstLoad, setValueFirstLoad] = useState(true);

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

    useEffect(() => {
        const fetchLeaveRecord = async () => {
            try {
                const startDate = new Date(reportYear, reportMonth - 1, 1);
                const endDate = new Date(reportYear, reportMonth, 0);
                const response = await axios.get(`${Config.apiUrl}/fetch?empname=${user?.name}&startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`);
                setLeaveRecords(response.data.data);

            } catch {
                console.error("error fetching leave records.");
            }
        };
        fetchLeaveRecord();
    }, [user?.name, reportMonth, reportYear]);

    useEffect(() => {
        const valuesMonthYear = () => {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const currentMonth = new Date().getMonth();
            const selectedMonth = months[currentMonth];
            const currentYear = new Date().getFullYear();
            setSelectedMonthYear(selectedMonth + ", " + currentYear);

            setReportYear(currentYear);
            setReportMonth(new Date(`${selectedMonth} 1, ${currentYear}`).getMonth() + 1);
        };
        if (valueFirstLoad) {
            valuesMonthYear();
            setValueFirstLoad(false);
        }
    }, [selectedMonthYear, reportYear, valueFirstLoad]);

    const handleMonthChange = (event) => {
        setSelectedMonthYear(event.target.text);
        const selectedMonth = event.target.text.split(',');

        let strMonth = selectedMonth[0].trim();
        setReportYear(parseInt(selectedMonth[1].trim()));
        setReportMonth(new Date(`${strMonth} 1, ${reportYear}`).getMonth() + 1);
    };

    const checkAllAbsent = async (date) => {
        try {
            const response = await axios.get(`${Config.apiUrl}/absent?date=${date}`);
            return response.data.data;
        } catch (error) {
            console.error('Error checking all absent', error);
            return false;
        }
    };

    const updatedAttendanceLeaveData = (attendanceRecord, leaveRecord) => {
        return attendanceRecord.map((record) => {
            const leaves = leaveRecord.find((leave) => leave.FromDate === record.date);
            if (leaves) {
                return { ...record, time: leaves.Status === 'Approved' ? 'Leave' : leaves.Status };
            }
            return record;
        });
    };

    const handleMonthReport = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/month?username=${user?.username}&month=${reportMonth}&year=${reportYear}`);
            const holiday = await axios.get(`${Config.apiUrl}/holiday`);
            const updatedAttendanceData = await Promise.all(response.data.data.map(async (record) => {
                if (record.time === null) {
                    const holidayDate = holiday.data.data.find((holiday) => holiday.Date === record.date);
                    if (holidayDate) {
                        return { ...record, time: <b>{holidayDate.HolidayName}</b> };
                    } else {
                        const allAbsent = await checkAllAbsent(record.date);
                        return { ...record, time: allAbsent ? 'OFF' : 'Absent' };
                    }
                }
                return record;
            }));

            const attendanceWithLeave = await updatedAttendanceLeaveData(updatedAttendanceData, leaveRecords);
            setAttendanceData(attendanceWithLeave);
        } catch (error) {
            console.error('Error fetching month report', error);
        }
    };

    useEffect(() => {
        const byDefaultReport = async () => {
            const currentMonth = (new Date().getMonth()) + 1;
            const currentYear = new Date().getFullYear();

            try {
                const response = await axios.get(`${Config.apiUrl}/month?username=${user?.username}&month=${currentMonth}&year=${currentYear}`);
                const holiday = await axios.get(`${Config.apiUrl}/holiday`);
                const updatedAttendanceData = await Promise.all(response.data.data.map(async (record) => {
                    if (record.time === null) {
                        const holidayDate = holiday.data.data.find((holiday) => holiday.Date === record.date);
                        if (holidayDate) {
                            return { ...record, time: holidayDate.HolidayName };
                        } else {
                            const allAbsent = await checkAllAbsent(record.date);
                            return { ...record, time: allAbsent ? 'OFF' : 'Absent' };
                        }
                    }
                    return record;
                }));

                const attendanceWithLeave = await updatedAttendanceLeaveData(updatedAttendanceData, leaveRecords);
                setAttendanceData(attendanceWithLeave);
            } catch {
                console.error("error fetching data by default");
            }
        }
        if (isFirstLoad) {
            byDefaultReport();
            setIsFirstLoad(false);
        }
    }, [isFirstLoad, user?.username, leaveRecords]);

    const downloadTableAsXLSX = async () => {
        const table = document.getElementById('monthlyAttendance');
        if (!table) {
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`Attendance-(${user?.name})`);

        const heading = `${user?.empid}-${user?.name} Attendance Report-${selectedMonthYear}`;
        worksheet.addRow([heading]);
        worksheet.mergeCells('A1', `E1`);
        worksheet.getCell('A1').value = heading;
        worksheet.getCell('A1').font = { bold: true };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };
        worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
        worksheet.getCell('A1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        const rows = table.querySelectorAll('tr');
        const columnName = rows[0];
        worksheet.addRow(Array.from(columnName.querySelectorAll('th')).map(cell => cell.innerText));
        worksheet.getRow(2).font = { bold: true };
        worksheet.getRow(2).alignment = { horizontal: 'center' };
        worksheet.getRow(2).eachCell(cell => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const rowData = Array.from(row.querySelectorAll('td')).map(cell => cell.innerText);
            const dataRow = worksheet.addRow(rowData);
            dataRow.alignment = { horizontal: 'center' };
            dataRow.eachCell(cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        }

        worksheet.columns.forEach(column => column.width = 12);

        // Convert the workbook to a Buffer
        const buffer = await workbook.xlsx.writeBuffer();
        // Create a Blob from the Buffer
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Create a download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${user?.empid}-Attendance (${selectedMonthYear}).xlsx`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    return (
        <>
            <CCard className="mb-4">
                <CCardHeader>Monthly Record</CCardHeader>
                <CCardBody style={{ maxHeight: '320px', overflowY: 'auto', textAlign: 'center' }}>
                    <CRow className='mb-4'>
                        <CCol xs={6} sm={6} xl={3} style={{ marginTop: '5px' }}>
                                <CDropdown>
                                    <CDropdownToggle
                                        color="secondary" caret >
                                        {selectedMonthYear}
                                    </CDropdownToggle>
                                    <CDropdownMenu
                                        onClick={handleMonthChange} style={{ cursor: 'pointer', overflowY: 'scroll', maxHeight: '200px' }}>
                                        <CDropdownItem value="">select month</CDropdownItem>
                                        {months}
                                    </CDropdownMenu>
                                </CDropdown>
                        </CCol>
                        <CCol xs={6} sm={6} xl={9} style={{ marginTop: '5px' }}>
                            <CTooltip
                                content="Show report"
                                trigger={['hover']}
                            >
                                <CButton color="success" onClick={handleMonthReport}>Generate</CButton>
                            </CTooltip>
                        </CCol>
                    </CRow>
                    <CTable align="middle" id='monthlyAttendance' className="mb-4 border"
                        hover responsive>
                        <CTableHead className="text-nowrap">
                            <CTableRow>
                                <CTableHeaderCell className="bg-body-tertiary text-center">
                                    SNo
                                </CTableHeaderCell>
                                <CTableHeaderCell className="bg-body-tertiary text-center">
                                    Date
                                </CTableHeaderCell>
                                <CTableHeaderCell className="bg-body-tertiary text-center">
                                    Day
                                </CTableHeaderCell>
                                <CTableHeaderCell className="bg-body-tertiary text-center">
                                    In Time
                                </CTableHeaderCell>
                                <CTableHeaderCell className="bg-body-tertiary text-center">
                                    Out Time
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {attendanceData.map((record, index) => (
                                <CTableRow key={index} v-for="item in tableItems">
                                    <CTableDataCell>{record.sno}</CTableDataCell>
                                    <CTableDataCell>{record.date}</CTableDataCell>
                                    <CTableDataCell>{record.day}</CTableDataCell>
                                    <CTableDataCell>{record.time}</CTableDataCell>
                                    <CTableDataCell>{record.out ? record.out : "N/A"}</CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                    <CRow>
                        <CCol>
                            <CTooltip
                                content="Download table"
                                trigger={['hover']}
                            >
                                <CButton align="middle" color="success" onClick={downloadTableAsXLSX}>Export</CButton>
                            </CTooltip>
                        </CCol>
                    </CRow>
                </CCardBody>
                <CCardFooter />
            </CCard>
        </>

    )
}

export default Monthly
