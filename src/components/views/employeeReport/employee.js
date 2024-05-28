import React, { useState, useEffect, useContext } from 'react'
import * as ExcelJS from 'exceljs';
import Config from "../../../Config";
import { useSelector } from "react-redux";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
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
import axios from 'axios'
import UserContext from '../../../context/UserContext'

const EmployeeAttendance = () => {
  const user = useSelector((state) => state.user);
  const [selectedMonthYear, setSelectedMonthYear] = useState('');
  const [empIdName, setEmpIdName] = useState('All Employees');
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [employeeID, setEmployeeID] = useState('');
  const [reportMonth, setReportMonth] = useState('');
  const [reportYear, setReportYear] = useState('');
  const [dateHeaders, setDateHeaders] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [valueFirstLoad, setValueFirstLoad] = useState(true);
  let keys;

  const { months } = useContext(UserContext);

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

  useEffect(() => {
    const setEmpIdName = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}/empidname`);
        const options = response.data.data.map((employee, index) => (
          <CDropdownItem key={index} value={`${employee.empid}-${employee.name}`}>{employee.empid}-{employee.name}</CDropdownItem>
        ));
        setEmployeeOptions(options);
        (response.data.data).forEach(record => {
          if (record.name === name) {
            setEmpIdName(`${record.empid}-${record.name}`);
          }
        });
      } catch (error) {
        console.error('Error fetching employees name-id', error);
      }
    };
    setEmpIdName();
  }, [name]);

  const handleMonthChange = (event) => {
    setSelectedMonthYear(event.target.text);
    const selectedMonth = event.target.text.split(',');

    let strMonth = selectedMonth[0].trim();
    setReportYear(parseInt(selectedMonth[1].trim()));
    setReportMonth(new Date(`${strMonth} 1, ${reportYear}`).getMonth() + 1);
  };

  const handleEmployeeChange = (event) => {
    setEmpIdName(event.target.text);
    const employee = event.target.text.split('-');
    setEmployeeID(employee[0].trim());
  };

  const handleFullReport = async () => {
    try {
      if (empIdName == 'All Employees') {
        setDateHeaders([]);
        setEmployeeData([]);
        const response = await axios.get(`${Config.apiUrl}/admin?month=${reportMonth}&year=${reportYear}`);
        keys = Object.keys(response.data.data[0]);
        keys.forEach((item, index) => {
          setDateHeaders(prevDateHeaders => [...prevDateHeaders, item]);
        });

        for (const key in (response.data.data)) {
          const eachEmployee = response.data.data[key];
          const employeeObject = {};
          for (const valueKey in eachEmployee) {
            employeeObject[valueKey] = eachEmployee[valueKey];
          }
          setEmployeeData(prevEmployeeData => [...prevEmployeeData, employeeObject]);
        }
      } else {
        setDateHeaders([]);
        setEmployeeData([]);
        const response = await axios.get(`${Config.apiUrl}/singleEmp?month=${reportMonth}&year=${reportYear}&empid=${employeeID}`);
        keys = Object.keys(response.data.data[0]);
        keys.forEach((item, index) => {
          setDateHeaders(prevDateHeaders => [...prevDateHeaders, item]);
        });

        for (const key in (response.data.data)) {
          const eachEmployee = response.data.data[key];
          const employeeObject = {};
          for (const valueKey in eachEmployee) {
            employeeObject[valueKey] = eachEmployee[valueKey];
          }
          setEmployeeData(prevEmployeeData => [...prevEmployeeData, employeeObject]);
        }
      }
    }
    catch (error) {
      console.error('Error fetching employee report', error);
    }

  };

  useEffect(() => {
    const fetchDefaultReport = async () => {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      try {
        const response = await axios.get(`${Config.apiUrl}/admin?month=${currentMonth}&year=${currentYear}`);
        const responseData = response.data.data;

        // Extract date headers from the first object
        const dateHeaders = Object.keys(responseData[0] || {});

        // Map through the data to create employee objects
        const employeeData = responseData.map(employee => {
          // Filter out non-header keys
          const filteredEmployee = {};
          dateHeaders.forEach(header => {
            if (employee.hasOwnProperty(header)) {
              filteredEmployee[header] = employee[header];
            }
          });
          return filteredEmployee;
        });

        // Update state with the fetched data
        setDateHeaders(dateHeaders);
        setEmployeeData(employeeData);
      } catch (error) {
        console.error('Error fetching employee report', error);
      }
    };

    if (isFirstLoad) {
      fetchDefaultReport();
      setIsFirstLoad(false);
    }
  }, [isFirstLoad]);


  const formatCellText = (cell, columnIndex, employeeData) => {
    const allAbsent = employeeData.every((employee) => {
      const value = Object.values(employee)[columnIndex];
      return !value || value === 'Absent';
    });

    if (allAbsent) {
      return 'Off';
    } else if (!cell || cell === null) {
      return 'Absent';
    } else {
      return cell;
    }
  }

  const getStyle = (cell, columnIndex, employeeData) => {
    try {
      const defaultStyles = { backgroundColor: '', color: '' };
      const allAbsent = employeeData.every((employee) => {
        const value = Object.values(employee)[columnIndex];
        return !value || value === 'Absent';
      });

      if (allAbsent) {
        return { ...defaultStyles, backgroundColor: 'grey', color: 'black' };
      } else if (!cell || cell === null) {
        return { ...defaultStyles, backgroundColor: 'gold', color: 'black' };
      } else {
        if ((parseInt(cell.split(':')[0]) === 9 && parseInt(cell.split(':')[1]) > 0) ||
          parseInt(cell.split(':')[0]) > 9 || cell.includes('PM')) {
          return { ...defaultStyles, backgroundColor: 'red', color: 'white' };
        }
      }
      return defaultStyles;
    } catch (error) {
      //console.error(error);
    }
  }

  const downloadTableAsXLSX = async () => {
    const table = document.getElementById('employeeAttendance');
    if (!table) {
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${selectedMonthYear}`);
    const rows = table.querySelectorAll('tr');
    const columnName = rows[0];
    const numHeaderCells = columnName.querySelectorAll('th').length;

    const heading = `Attendance Report - ${selectedMonthYear}`;
    worksheet.addRow([heading]);
    worksheet.mergeCells(1, 1, 1, numHeaderCells); // Merge cells for the heading
    const headingCell = worksheet.getCell(1, 1);
    headingCell.value = heading;
    headingCell.font = { bold: true };
    headingCell.alignment = { horizontal: 'center' };
    headingCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
    headingCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // Transpose column headers
    const columnHeaders = Array.from(columnName.querySelectorAll('th')).map(cell => cell.innerText);
    for (let i = 0; i < numHeaderCells; i++) {
      worksheet.getCell(2, i + 1).value = columnHeaders[i];
      worksheet.getCell(2, i + 1).font = { bold: true };
      worksheet.getCell(2, i + 1).alignment = { horizontal: 'center' };
      worksheet.getCell(2, i + 1).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }

    // Add data rows
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

    worksheet.columns.forEach(column => column.width = 22);
    worksheet.getColumn(1).font = { bold: true };

    // Convert the workbook to a Buffer
    const buffer = await workbook.xlsx.writeBuffer();
    // Create a Blob from the Buffer
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Attendance.xlsx';
    document.body.appendChild(a);
    a.click();

    // Cleanup
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };



  return (
    <>
      <CRow>
        <CCard>
          <CCardHeader>
            Employee Report
          </CCardHeader>
          <CCardBody  style={{ overflowY: 'scroll', maxHeight: '500px' }}>
            <CRow className='mb-4'>
              <CCol xs={12} sm={12} md={3} xl={3} style={{ marginTop: '5px' }}>
                <CTooltip
                  content="Select month"
                  trigger={['hover']}
                >
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
                </CTooltip>
              </CCol>
              <CCol xs={12} sm={12} md={3} xl={3} style={{ marginTop: '5px' }}>
                <CTooltip
                  content="Select employee"
                  trigger={['hover']}
                >
                  <CDropdown>
                    <CDropdownToggle
                      color="secondary" caret >
                      {empIdName}
                    </CDropdownToggle>
                    <CDropdownMenu
                      onClick={handleEmployeeChange} style={{ cursor: 'pointer', overflowY: 'scroll', maxHeight: '200px' }}>
                      <CDropdownItem value="">All Employees</CDropdownItem>
                      {employeeOptions}
                    </CDropdownMenu>
                  </CDropdown>
                </CTooltip>
              </CCol>
              <CCol xs={12} sm={12} md={6} xl={6} style={{ marginTop: '5px' }}>
                <CTooltip
                  content="Show report"
                  trigger={['hover']}
                >
                  <CButton color="success" onClick={handleFullReport}>Generate</CButton>
                </CTooltip>
              </CCol>
            </CRow>
            <CRow
              className='mb-4'
              style={{
                overflowX: 'auto',
                textAlign: 'center'
              }}>
              <CTable
                align="middle"
                id='employeeAttendance'
                className="mb-4 border"
                hover responsive>
                <CTableHead style={{ overflowX: 'auto', textAlign: 'center' }}>
                  <CTableRow className="bg-body-tertiary text-center">
                    {
                      dateHeaders && dateHeaders.map((headers, index) => (
                        <CTableHeaderCell key={index}>{headers}</CTableHeaderCell>
                      ))
                    }
                  </CTableRow>
                </CTableHead>
                  <CTableBody>
                  {
                    employeeData && employeeData.map((employee, rowIndex) => {
                      return (
                        <CTableRow key={rowIndex}>
                          {Object.values(employee).map((value, columnIndex) => {
                            return <CTableDataCell key={columnIndex} style={getStyle(value, columnIndex, employeeData)}>
                              {formatCellText(value, columnIndex, employeeData)}
                            </CTableDataCell>
                          })}
                        </CTableRow>
                      );
                    })
                  }
                </CTableBody>
              </CTable>
            </CRow>
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
        </CCard>
      </CRow>
    </>

  )
}

export default EmployeeAttendance
