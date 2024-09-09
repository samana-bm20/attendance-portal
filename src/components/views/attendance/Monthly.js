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
    const [selectedMonthYear, setSelectedMonthYear] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

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

    const handleMonthChange = (event) => {
        setSelectedMonthYear(event.target.text);
        const selectedMonth = event.target.text.split(',');
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

    // const updatedAttendanceLeaveData = (attendanceRecord, leaveRecord) => {
    //     debugger
    //     return attendanceRecord.map((record) => {
    //         const leaves = leaveRecord.find((leave) => record.date >= leave.FromDate && record.date <= leave.ToDate);
    //         if (leaves) {
    //             return { ...record, time: leaves.Status === 'Approved' ? 'Leave' : leaves.Status };
    //         }
    //         return record;
    //     });
    // };

    const updatedAttendanceLeaveData = (attendanceRecord, leaveRecord) => {
        debugger
        return attendanceRecord.map((record) => {
            const leave = leaveRecord.find((leave) => record.date >= leave.FromDate && record.date <= leave.ToDate);
            
            if (leave && leave.Status == 'Approved') {

                if (leave.SecondHalf === 1 && record.date == leave.FromDate) {
                    return record;
                } else if (leave.FirstHalf === 1 && record.date == leave.ToDate) {
                    return record;
                } else {
                    return { ...record, time: 'Leave' };
                }
            }

            return record;
        });
    };

    useEffect(() => {
        const handleMonthReport = async () => {
            try {
                if (isFirstLoad) {
                    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    const currentMonth = (new Date().getMonth()) + 1;
                    const currentYear = new Date().getFullYear();
                    const wordMonth = months[new Date().getMonth()];
                    setSelectedMonthYear(wordMonth + "," + currentYear);

                    const response = await axios.get(`${Config.apiUrl}/month?username=${user?.username}&month=${currentMonth}&year=${currentYear}`);
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

                    const startDate = new Date(currentYear, currentMonth - 1, 1);
                    const endDate = new Date(currentYear, currentMonth, 0);
                    const record = await axios.get(`${Config.apiUrl}/fetch?empname=${user?.name}&startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`);

                    const attendanceWithLeave = await updatedAttendanceLeaveData(updatedAttendanceData, (record.data.data));
                    setAttendanceData(attendanceWithLeave);

                    setIsFirstLoad(false);
                } else if (selectedMonthYear == 'select month') {
                    return;
                } else {
                    const selectedMonth = selectedMonthYear.split(',');
                    let strMonth = selectedMonth[0].trim();
                    const ReportYear = parseInt(selectedMonth[1].trim());
                    const ReportMonth = new Date(`${strMonth} 1, ${ReportYear}`).getMonth() + 1;

                    const response = await axios.get(`${Config.apiUrl}/month?username=${user?.username}&month=${ReportMonth}&year=${ReportYear}`);
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

                    const startDate = new Date(ReportYear, ReportMonth - 1, 1);
                    const endDate = new Date(ReportYear, ReportMonth, 0);
                    const record = await axios.get(`${Config.apiUrl}/fetch?empid=${user?.empid}&startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`);

                    const attendanceWithLeave = await updatedAttendanceLeaveData(updatedAttendanceData, (record.data.data));
                    setAttendanceData(attendanceWithLeave);
                }
            } catch (error) {
                console.error('Error fetching month report', error);
            }
        };
        handleMonthReport();
    }, [isFirstLoad, selectedMonthYear])

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
                        <CCol style={{ marginTop: '5px' }}>
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
                                    <CTableDataCell> {String(record.time).includes('M') ? (record.out ? record.out : 'N/A') : record.time}
                                        {/* {record.out ? record.out : (record.time == 'OFF' ? 'OFF' : 'N/A')} */}
                                    </CTableDataCell>
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
