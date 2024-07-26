import React, { useEffect, useState, useContext } from 'react'
import Config from "../../../Config";
import { useSelector } from "react-redux";
import { Bar } from 'react-chartjs-2';
import * as ExcelJS from 'exceljs';
import axios from 'axios'
import UserContext from '../../../context/UserContext'
import { Chart as ChartJS, registerables } from 'chart.js';
import 'chart.js/auto';
ChartJS.register(...registerables);

import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CTooltip,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
} from '@coreui/react'

const GroupBarChart = () => {
    const user = useSelector((state) => state.user);
    const [empIds, setEmpIds] = useState([]);
    const [empNames, setEmpNames] = useState([]);
    const [lateUnder5Mins, setLateUnder5Mins] = useState([]);
    const [lateAbove5Mins, setLateAbove5Mins] = useState([]);
    const [ODCount, setODCount] = useState([]);
    const [WFHCount, setWFHCount] = useState([]);
    const [monthlyLeaves, setMonthlyLeaves] = useState([]);
    const [totalLeaves, setTotalLeaves] = useState([]);
    const [salaryMonthlyData, setSalaryMonthlyData] = useState([]);
    const [selectedMonthYear, setSelectedMonthYear] = useState('');
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const { months } = useContext(UserContext);

    const handleMonthChange = (event) => {
        setSelectedMonthYear(event.target.text);
    };

    //#region Fetch
    useEffect(() => {
        const fetchSalaryMonthlyReport = async () => {
            try {
                if (isFirstLoad) {
                    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    const currentMonth = new Date().getMonth();
                    const selectedMonth = months[currentMonth];
                    const currentYear = new Date().getFullYear();
                    const monthYear = (selectedMonth + "," + currentYear);
                    setSelectedMonthYear(selectedMonth + "," + currentYear);
                    const response = await axios.get(`${Config.apiUrl}/salaryReportMonthWise?MonthYear=${monthYear}`);
                    setSalaryMonthlyData(response.data.data)
                    setIsFirstLoad(false);
                } else {
                    const response = await axios.get(`${Config.apiUrl}/salaryReportMonthWise?MonthYear=${selectedMonthYear}`);
                    setSalaryMonthlyData(response.data.data)
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchSalaryMonthlyReport();
    }, [isFirstLoad, selectedMonthYear]);

    //#region Extract
    useEffect(() => {
        const extractedEmpIds = salaryMonthlyData.map(obj => obj.empid);
        const extractedEmpNames = salaryMonthlyData.map(obj => obj.name);
        const extractedLateUnder5Mins = salaryMonthlyData.map(obj => obj.LateUnder5Mins);
        const extractedLateAbove5Mins = salaryMonthlyData.map(obj => obj.LateAbove5Mins);
        const extractedODCount = salaryMonthlyData.map(obj => obj.OD_COUNT);
        const extractedWFHCount = salaryMonthlyData.map(obj => obj.WFH_COUNT);
        const extractedMonthlyLeaves = salaryMonthlyData.map(obj => obj.MonthlyLeaves);
        const extractedTotalLeaves = salaryMonthlyData.map(obj => obj.TotalLeaves);

        setEmpIds(extractedEmpIds);
        setEmpNames(extractedEmpNames);
        setLateUnder5Mins(extractedLateUnder5Mins);
        setLateAbove5Mins(extractedLateAbove5Mins);
        setODCount(extractedODCount);
        setWFHCount(extractedWFHCount);
        setMonthlyLeaves(extractedMonthlyLeaves);
        setTotalLeaves(extractedTotalLeaves);
    }, [salaryMonthlyData]);

    //#region Chart Data
    const chartData = {
        data: {
            labels: empNames,
            datasets: [
                {
                    label: "Late Under 5 Mins",
                    backgroundColor: ['#F89717'],
                    data: lateUnder5Mins
                },
                {
                    label: "Late Above 5 Mins",
                    backgroundColor: ['#FF3131'],
                    data: lateAbove5Mins
                },
                {
                    label: "Month Leaves",
                    backgroundColor: ['#004AAD'],
                    data: monthlyLeaves
                },
                {
                    label: "OD",
                    backgroundColor: ['#095D40'],
                    data: ODCount
                },
            ],
        },
        labels: "Employee",
        options: {
            indexAxis: 'x',
            barPercentage: 1,
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true
            },
        }

    }

    //#region Download
    const downloadBarChartAsXLSX = async () => {
        const employeeID = empIds;
        const employeeName = empNames;
        const lessThanFive = lateUnder5Mins;
        const moreThanFive = lateAbove5Mins;
        const noOfOD = ODCount;
        const noOfWFH = WFHCount;
        const MonthlyLeaves = monthlyLeaves;
        const TotalLeaves = totalLeaves;

        // Initialize a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`Salary Report - ${selectedMonthYear}`);

        // Set up the heading
        const heading = `Monthly Salary Report for ${selectedMonthYear}`;
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

            worksheet.mergeCells('A1', 'H1');
            // Add column headers
            worksheet.addRow(
                ['Emp ID', 'Employee Name', 
                 'Late Under 5 Mins', 'Late Above 5 Mins', 
                'OD Count', 'WFH Count', 'Monthly Leaves', 'Total Leaves']);
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
            for (let i = 0; i < employeeName.length; i++) {
                const row = worksheet.addRow(
                    [employeeID[i], employeeName[i], 
                    lessThanFive[i], moreThanFive[i], 
                    noOfOD[i], noOfWFH[i], MonthlyLeaves[i], TotalLeaves[i]]
                );
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
        a.download = `Salary Report-${selectedMonthYear}.xlsx`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    return (
        <div>
            <CRow xs={{ gutter: 3 }}>
                <CCol>
                    <CCard style={{ marginBottom: '40px' }}>
                        <CCardHeader>
                            <CRow>
                                <CCol className='mb-1' xs={12} sm={6} md={6} xl={6}>
                                    Monthly Salary Report
                                    <CDropdown style={{ marginLeft: '10px' }}>
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
                                </CCol>
                                <CCol className='mb-1' xs={12} sm={6} md={6} xl={6}
                                    style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                    <CTooltip
                                        content="Download report"
                                        trigger={['hover']}
                                    >
                                        <CButton
                                            align="middle"
                                            color="success"
                                            onClick={downloadBarChartAsXLSX}>Export</CButton>
                                    </CTooltip>
                                </CCol>
                            </CRow>
                        </CCardHeader>
                        <CCardBody>
                            <Bar
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

export default GroupBarChart;