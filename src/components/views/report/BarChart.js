import React, { useEffect, useState, useContext } from 'react'
import Config from "../../../Config";
import { useSelector } from "react-redux";
// import { CChartBar } from '@coreui/react-chartjs'
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

const BarChart = () => {
    const user = useSelector((state) => state.user);
    const [empIds, setEmpIds] = useState([]);
    const [empNames, setEmpNames] = useState([]);
    const [paidLeaves, setPaidLeaves] = useState([]);
    const [leavesUsed, setLeavesUsed] = useState([]);
    const [balance, setBalance] = useState([]);
    const [empLeaves, setEmpLeaves] = useState([]);
    const [selectedMonthYear, setSelectedMonthYear] = useState('Full Report');
    const [reportMonth, setReportMonth] = useState('');
    const [reportYear, setReportYear] = useState('');
    const { months } = useContext(UserContext);

    useEffect(() => {

        const fetchEmployeeLeaves = async () => {
            if (selectedMonthYear == 'Full Report') {
                const response = await axios.get(`${Config.apiUrl}/empleaves`);
                setEmpLeaves(response.data.data);
            } else {
                const response = await axios.get(`${Config.apiUrl}/monthLeaves?month=${reportMonth}&year=${reportYear}`);
                setEmpLeaves(response.data.data);
            }
        };

        fetchEmployeeLeaves();
    }, [selectedMonthYear]);

    useEffect(() => {
        const extractedEmpIds = empLeaves.map(obj => obj.EmpID);
        const extractedEmpNames = empLeaves.map(obj => obj.EmpName);
        const extractedPaidLeaves = empLeaves.map(obj => obj.PaidLeave);
        const extractedLeavesUsed = empLeaves.map(obj => obj.LeavesUsed);
        const extractedBalance = empLeaves.map(obj => obj.Balance);

        setEmpIds(extractedEmpIds);
        setEmpNames(extractedEmpNames);
        setPaidLeaves(extractedPaidLeaves);
        setLeavesUsed(extractedLeavesUsed);
        setBalance(extractedBalance);
    }, [empLeaves]);

    const chartData = {
        data: {
            labels: empNames,
            datasets: [
                {
                    barPercentage: 0.8,
                    label: 'Leaves Used',
                    backgroundColor: ['rgba(255, 99, 132, 1)'],
                    borderWidth: 0,
                    data: leavesUsed,
                },
            ],
        },
        labels: "Employee",
        options: {
            indexAxis: 'x',
        }
    }

    const downloadBarChartAsXLSX = async () => {
        const employeeIDs = empIds;
        const employeeNames = empNames;
        const paidLeave = paidLeaves;
        const leaveCounts = leavesUsed;
        const leaveBalance = balance;

        // Initialize a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`Employee Leave - ${selectedMonthYear}`);

        // Set up the heading
        const heading = `Employee Leave Report - ${selectedMonthYear}`;
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

        if (selectedMonthYear == 'Full Report') {
            worksheet.mergeCells('A1', 'E1');
            // Add column headers
            worksheet.addRow(['Emp ID', 'Employee Name', 'Paid Leave', 'Leaves Taken', 'Balance']);
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
                const row = worksheet.addRow(
                    [employeeIDs[i], employeeNames[i], paidLeave[i], 
                    leaveCounts[i], leaveBalance[i]]
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

            for (let i = 0; i < employeeNames.length; i++) {
                if (leaveCounts[i] > paidLeave[i]) {
                    worksheet.getCell(`E${i+3}`).fill = { 
                        type: 'pattern', 
                        pattern: 'solid', 
                        fgColor: { argb: 'ffda9694' } 
                    };   

                }
            }

        } else {
            worksheet.mergeCells('A1', 'C1');
            // Add column headers
            worksheet.addRow(['Emp ID', 'Employee Name', 'Leaves Taken']);
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
                const row = worksheet.addRow([employeeIDs[i], employeeNames[i], leaveCounts[i]]);
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
                if (leaveCounts[i] > 0) {
                    worksheet.getCell(`C${i+3}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffb7dee8' } };   

                }
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
        a.download = `Leave-${selectedMonthYear}.xlsx`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

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


    return (
        <div>
            <CRow xs={{ gutter: 3 }}>
                <CCol>
                    <CCard style={{ marginBottom: '50px' }}>
                        <CCardHeader>
                            <CRow>
                                <CCol className='mb-1' xs={12} sm={6} md={6} xl={6}>
                                    Leave Summary
                                        <CDropdown style={{ marginLeft: '10px' }}>
                                            <CDropdownToggle
                                                color="secondary" caret >
                                                {selectedMonthYear}
                                            </CDropdownToggle>
                                            <CDropdownMenu
                                                onClick={handleMonthChange} style={{ cursor: 'pointer', overflowY: 'scroll', maxHeight: '200px' }}>
                                                <CDropdownItem value="">Full Report</CDropdownItem>
                                                {months}
                                            </CDropdownMenu>
                                        </CDropdown>
                                </CCol>
                                <CCol className='mb-1' xs={12} sm={6} md={6} xl={6}
                                    style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                    <CTooltip
                                        content="Download data"
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

export default BarChart;
