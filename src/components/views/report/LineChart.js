import React, { useEffect, useState, useContext, useCallback } from 'react';
import Config from "../../../Config";
import { useSelector } from "react-redux";
// import { CChartLine } from '@coreui/react-chartjs';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import * as ExcelJS from 'exceljs';
import UserContext from '../../../context/UserContext'

import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CFormInput,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CTooltip,
    CButton,
} from '@coreui/react';

const LineChart = () => {
    const user = useSelector((state) => state.user);
    const [empIds, setEmpIds] = useState([]);
    const [XAxisData, setXAxisData] = useState([]);
    const [YAxisData, setYAxisData] = useState([]);
    const [empHours, setEmpHours] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedMonthYear, setSelectedMonthYear] = useState('Select Month');
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [empIdName, setEmpIdName] = useState('Select Employee');
    const [employeeID, setEmployeeID] = useState('');
    const [reportMonth, setReportMonth] = useState('');
    const [reportYear, setReportYear] = useState('');
    const [dailyRecord, setDailyRecord] = useState(true);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const { months } = useContext(UserContext);

    //#region Time Calculation
    const convertTimeToHours = (time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours + minutes / 60 + seconds / 3600;
    };

    const numericData = YAxisData.map(convertTimeToHours);

    function parseTime(timeString) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
    }

    function calculateTimeDifference(employeeTime) {
        const start = parseTime(employeeTime);
        const end = parseTime('08:30:00');

        const diffInMilliseconds = end - start;
        const diffInMinutes = diffInMilliseconds / 1000 / 60;

        return diffInMinutes.toFixed(0);
    }

    //#endregion

    //#region Daily Working Hours

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const fetchDailyWorkingHours = useCallback(async () => {
        try {
            if (isFirstLoad) {
                const today = new Date();
                let dayOfWeek = today.getDay();

                // If today is Monday, set the date to last Friday
                if (dayOfWeek === 1) {
                    today.setDate(today.getDate() - 3);
                }
                // If today is Sunday, set the date to last Friday
                else if (dayOfWeek === 0) {
                    today.setDate(today.getDate() - 2);
                }
                // For other days, simply go back one day
                else {
                    today.setDate(today.getDate() - 1);
                }

                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
                const day = String(today.getDate()).padStart(2, '0');
                const previousDate = `${year}-${month}-${day}`;
                setSelectedDate(`${year}-${month}-${day}`);

                const response = await axios.get(`${Config.apiUrl}/workingHours?date=${previousDate}`);
                setEmpHours(response.data.data);
                setIsFirstLoad(false);
            } else {
                const response = await axios.get(`${Config.apiUrl}/workingHours?date=${selectedDate}`);
                setEmpHours(response.data.data);
            }

        } catch (error) {
            console.error(error);
        }

    }, [isFirstLoad, selectedDate]);

    useEffect(() => {
        fetchDailyWorkingHours();
    }, [fetchDailyWorkingHours]);

    useEffect(() => {
        const extractedEmpIds = empHours.map(obj => obj.empid);
        const extractedEmpNames = empHours.map(obj => obj.fullName);
        const extractedWorkingHours = empHours.map(obj => obj.workedFor);

        setEmpIds(extractedEmpIds);
        setXAxisData(extractedEmpNames);
        setYAxisData(extractedWorkingHours);
        setDailyRecord(true);
    }, [empHours]);
    //#endregion

    //#region Monthly Working Hours

    const handleMonthChange = (event) => {
        if (event.target.text == 'Full Report') {
            setSelectedMonthYear(event.target.text);
        } else {
            setSelectedMonthYear(event.target.text);
            const selectedMonth = event.target.text.split(',');

            let strMonth = selectedMonth[0].trim();
            setReportYear(parseInt(selectedMonth[1].trim()));
            setReportMonth(new Date(`${strMonth} 1, ${reportYear}`).getMonth() + 1);
        }
    };

    const handleEmployeeChange = (event) => {
        if (event.target.text == 'All Employees') {
            setEmpIdName(event.target.text);
        } else {
            setEmpIdName(event.target.text);
            const employee = event.target.text.split('-');
            setEmployeeID(employee[0].trim());
        }
    };

    useEffect(() => {
        const setEmpIdName = async () => {
            try {
                const response = await axios.get(`${Config.apiUrl}/empidname`);
                const options = response.data.data.map((employee, index) => (
                    <CDropdownItem key={index} value={`${employee.empid}-${employee.name}`}>{employee.empid}-{employee.name}</CDropdownItem>
                ));
                setEmployeeOptions(options);
            } catch (error) {
                console.error('Error fetching employees name-id', error);
            }
        };
        setEmpIdName();
    }, []);

    const fetchWorkingHours = useCallback(async () => {
        try {
            if (selectedMonthYear === 'Select Month' || empIdName === 'Select Employee') {
                return; // Exit early if the conditions are not met
            } else {
                const response = await axios.get(`${Config.apiUrl}/monthlyWorkingHours?empid=${employeeID}&month=${reportMonth}&year=${reportYear}`);
                const days = response.data.data.map(record => record.WorkingDay);
                const hours = response.data.data.map(record => record.WorkedFor);
                setXAxisData(days);
                setYAxisData(hours);
                setDailyRecord(false);
            }
        } catch (error) {
            console.error('error in fetching working hours data', error);
        }
    }, [selectedMonthYear, empIdName]);

    useEffect(() => {
        fetchWorkingHours();
    }, [fetchWorkingHours]);

    //#endregion

    //#region Data & Export

    const chartData = {
        data: {
            labels: XAxisData,
            datasets: [
                {

                    label: 'Working Hours',
                    backgroundColor: 'rgba(29, 123, 90, 0.3)',
                    borderColor: 'rgba(29, 123, 90, 1)',
                    borderWidth: 3,
                    data: numericData,
                    pointStyle: 'circle',
                    pointRadius: 7,
                    pointHoverRadius: 10
                },
            ],
        },
        labels: "Employee",
        options: {
            indexAxis: 'x',
        }
    }

    const downloadLineChartAsXLSX = async () => {
        if (dailyRecord == true) {
            const employeeIDs = empIds;
            const employeeNames = XAxisData;
            const workingHours = YAxisData;

            // Initialize a new workbook and worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(`Working Hours (${selectedDate})`);

            // Set up the heading
            const heading = `Employee Working Hours on ${selectedDate}`;
            worksheet.addRow([heading]);
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

            worksheet.mergeCells('A1', 'D1');
            // Add column headers
            worksheet.addRow(['Emp ID', 'Employee Name', 'Working Hours', 'Less By (in min)']);
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

            // Add the chart data to the worksheet
            for (let i = 0; i < employeeNames.length; i++) {
                const row = worksheet.addRow([employeeIDs[i], employeeNames[i], workingHours[i], '-']);
                row.alignment = { horizontal: 'center' };
                row.eachCell(cell => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            }

            for (let i = 0; i < employeeNames.length; i++) {
                const [hours, minutes, seconds] = workingHours[i].split(':').map(Number);
                const numeric = hours + minutes / 60 + seconds / 3600;
                if (numeric < 8.5) {
                    worksheet.getCell(`C${i + 3}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffda9694' } };
                    worksheet.getCell(`D${i + 3}`).value = calculateTimeDifference(workingHours[i]);
                }
            }

            // Set column widths
            worksheet.columns.forEach(column => column.width = 20);

            // Convert the workbook to a Buffer
            const buffer = await workbook.xlsx.writeBuffer();
            // Create a Blob from the Buffer
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            // Create a download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `WorkingHours(${selectedDate}).xlsx`;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            const monthDates = XAxisData;
            const workingHours = YAxisData;

            // Initialize a new workbook and worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(`${employeeID} - ${selectedMonthYear}`);

            // Set up the heading
            const heading = `${empIdName} Working Hours in ${selectedMonthYear}`;
            worksheet.addRow([heading]);
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

            worksheet.mergeCells('A1', 'D1');
            // Add column headers
            worksheet.addRow(['S.No.', 'Date', 'Working Hours', 'Less By (in min)']);
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

            // Add the chart data to the worksheet
            for (let i = 0; i < monthDates.length; i++) {
                const row = worksheet.addRow([i + 1, monthDates[i], workingHours[i], '-']);
                row.alignment = { horizontal: 'center' };
                row.eachCell(cell => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            }

            for (let i = 0; i < monthDates.length; i++) {
                const [hours, minutes, seconds] = workingHours[i].split(':').map(Number);
                const numeric = hours + minutes / 60 + seconds / 3600;
                if (numeric < 8.5) {
                    worksheet.getCell(`C${i + 3}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffda9694' } };
                    worksheet.getCell(`D${i + 3}`).value = calculateTimeDifference(workingHours[i]);
                }
            }

            // Set column widths
            worksheet.columns.forEach(column => column.width = 20);

            // Convert the workbook to a Buffer
            const buffer = await workbook.xlsx.writeBuffer();
            // Create a Blob from the Buffer
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            // Create a download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `WH-${empIdName}(${selectedMonthYear}).xlsx`;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }

    };
    //#endregion

    return (
        <div>
            <CRow xs={{ gutter: 3 }}>
                <CCol>
                    <CCard style={{ marginBottom: '50px' }}>
                        <CCardHeader>
                            <CRow>
                                <CCol className='mb-1' xs={12} sm={12} md={12} xl={5}>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <p>Working Hours (Daily)</p>
                                        <CFormInput style={{ marginLeft: '20px', maxWidth: '150px' }}
                                            type="date"
                                            id="date-input"
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                        />
                                    </div>
                                </CCol>
                                <CCol className='mb-1' xs={12} sm={12} md={12} xl={6}>
                                    (Monthly)
                                    <CDropdown style={{ margin: '10px' }}>
                                        <CDropdownToggle
                                            color="secondary" caret >
                                            {selectedMonthYear}
                                        </CDropdownToggle>
                                        <CDropdownMenu
                                            onClick={handleMonthChange} style={{ cursor: 'pointer', overflowY: 'scroll', maxHeight: '200px' }}>
                                            <CDropdownItem value="">Select Month</CDropdownItem>
                                            {months}
                                        </CDropdownMenu>
                                    </CDropdown>
                                    <CDropdown style={{ marginLeft: '10px' }}>
                                        <CDropdownToggle
                                            color="secondary" caret >
                                            {empIdName}
                                        </CDropdownToggle>
                                        <CDropdownMenu
                                            onClick={handleEmployeeChange} style={{ cursor: 'pointer', overflowY: 'scroll', maxHeight: '200px' }}>
                                            <CDropdownItem value="">Select Employee</CDropdownItem>
                                            {employeeOptions}
                                        </CDropdownMenu>
                                    </CDropdown>
                                </CCol>
                                <CCol className='mb-1' xs={12} sm={12} md={12} xl={1}>                                    <CTooltip
                                    content="Download data"
                                    trigger={['hover']}
                                >
                                    <CButton
                                        align="middle"
                                        color="success"
                                        style={{ marginTop: '10px' }}
                                        onClick={downloadLineChartAsXLSX}>Export</CButton>
                                </CTooltip>
                                </CCol>
                            </CRow>
                        </CCardHeader>
                        <CCardBody>
                            <Line
                                style={{ maxHeight: '25rem' }}
                                data={chartData.data}
                                options={chartData.options}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    )
}

export default LineChart;
