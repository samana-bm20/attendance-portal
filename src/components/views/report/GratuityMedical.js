import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from "react-redux";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol,
    CButton,
    CButtonGroup,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CForm,
    CFormInput,
    CFormLabel,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CTooltip,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
} from '@coreui/react';
import axios from 'axios';
import Config from "../../../Config";
import CIcon from '@coreui/icons-react';
import { cilUserPlus, cilPencil, cilCheckCircle, cilTrash } from '@coreui/icons';
import { toast } from 'react-toastify';
import * as ExcelJS from 'exceljs';

const GratuityMedical = () => {
    const [employeeData, setEmployeeData] = useState([]);

    useEffect(() => {
        const fetchEmployeeJoining = async () => {
            try {
                const response = await axios.get(`${Config.apiUrl}/getEmployeeDOJ`);
                setEmployeeData(response.data.data);
            } catch (error) {
                console.error(error)
            }
        }
        fetchEmployeeJoining();
    }, []);

    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    //#region Gratuity
    const gratuityReport = async () => {
        const currentDate = new Date();
        const updatedEmployeeData = employeeData.map(employee => {
            const joiningDate = new Date(employee.joiningDate);
            const yearsCompleted = currentDate.getFullYear() - joiningDate.getFullYear();
            const isEligible = yearsCompleted >= 5;
            return { ...employee, gratuityEligible: isEligible ? 'Yes' : 'No' };
        });
        setEmployeeData(updatedEmployeeData);

        // Initialize a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`Gratuity Report`);

        // Set up the heading
        const heading = `Gratuity Eligibility of Employees`;
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
        worksheet.addRow(['Emp ID', 'Employee Name', 'DOJ', 'Applicable']);
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
        for (let i = 0; i < updatedEmployeeData.length; i++) {
            const row = worksheet.addRow([updatedEmployeeData[i].empid, updatedEmployeeData[i].name,
            formatDate(updatedEmployeeData[i].joiningDate), updatedEmployeeData[i].gratuityEligible]
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
        a.download = `Gratuity Eligible Report.xlsx`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    //#region Medical
    const MedicalInsuranceReport = async () => {
        const currentDate = new Date();
        const updatedEmployeeData = employeeData.map(employee => {
            const joiningDate = new Date(employee.joiningDate);
            const yearsCompleted = currentDate.getFullYear() - joiningDate.getFullYear();
            const isEligible = yearsCompleted >= 2;
            return { ...employee, medicalEligible: isEligible ? 'Yes' : 'No' };
        });
        setEmployeeData(updatedEmployeeData);

        // Initialize a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`Medical Insurance Report`);

        // Set up the heading
        const heading = `Medical Insurance Eligibility of Employees`;
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
        worksheet.addRow(['Emp ID', 'Employee Name', 'DOJ', 'Applicable']);
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
        for (let i = 0; i < updatedEmployeeData.length; i++) {
            const row = worksheet.addRow([updatedEmployeeData[i].empid, updatedEmployeeData[i].name,
            formatDate(updatedEmployeeData[i].joiningDate), updatedEmployeeData[i].medicalEligible]
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
        a.download = `Medical Insurance Eligible Report.xlsx`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    return (
        <>
            <CCard className='mb-4'>
                <CCardHeader>Employee Benefits</CCardHeader>
                <CCardBody>
                    <CRow>
                        <CCol>
                            <CButton
                                color='success'
                                className='mb-2'
                                onClick={gratuityReport}
                            >Show Gratuity Report</CButton>
                        </CCol>
                        <CCol>
                            {/* <CButtonGroup className='mb-2'> */}
                                <CButton color='warning' onClick={MedicalInsuranceReport}>
                                    Show Medical Report</CButton>
                                {/* <CButton color='primary'>Check Renewal</CButton>
                            </CButtonGroup> */}
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
        </>
    )
}

export default GratuityMedical
