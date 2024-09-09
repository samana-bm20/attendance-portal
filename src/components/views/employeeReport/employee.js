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
  const [processedEmployeeData, setProcessedEmployeeData] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [valueFirstLoad, setValueFirstLoad] = useState(true);
  let keys;

  const { months } = useContext(UserContext);

  //#region Fetch Attributes
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

  //#region Full
  const handleFullReport = async () => {
    try {
      if (empIdName == 'All Employees') {
        setDateHeaders([]);
        setEmployeeData([]);
        const response = await axios.get(`${Config.apiUrl}/allEmp?month=${reportMonth}&year=${reportYear}`);
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

  //#region Default
  useEffect(() => {
    const fetchDefaultReport = async () => {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      try {
        const response = await axios.get(`${Config.apiUrl}/allEmp?month=${currentMonth}&year=${currentYear}`);
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

  //#region Single Emp
  const preprocessData = async (employeeData) => {
    const processedData = await Promise.all(employeeData.map(async (employee) => {
      const processedRow = await Promise.all(Object.values(employee).map(async (value, columnIndex) => {
        const text = await formatCellText(value, columnIndex, employeeData, dateHeaders[columnIndex]);
        const style = await getStyle(value, columnIndex, employeeData, dateHeaders[columnIndex]);
        return { text, style };
      }));
      return processedRow;
    }));
    return processedData;
  };

  useEffect(() => {
    const processData = async () => {
      const data = await preprocessData(employeeData);
      setProcessedEmployeeData(data);
    };
    processData();
  }, [employeeData]);

  //#region Absent-Off
  const formatCellText = async (cell, columnIndex, employeeData, header) => {
    if (employeeData.length == 1) {
      if (!cell || cell == null) {
        const datePart = header.split(' ')[0];
        try {
          const response = await axios.get(`${Config.apiUrl}/absent?date=${datePart}`);
          const result = response.data.data; // Assuming the API response is a single integer

          if (result == 1) {
            return 'Off';
          } else if (result == 0) {
            return 'Absent';
          }
        } catch (error) {
          console.error('API call failed:', error);
          return 'Error';
        }
      } else {
        return cell;
      }
    } else {
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
  };
  //#end region

  //#region Color
  const getStyle = async (cell, columnIndex, employeeData, header) => {
    const defaultStyles = { backgroundColor: '', color: '', minWidth: '105px' };

    if (cell == 'Leave' || cell == 'Absent - FHL' || cell == 'SHL - Absent') {
      return { ...defaultStyles, backgroundColor: '#25bdf5', color: 'black' };
    } else if (cell == 'OD' || cell == 'First-Half OD' || cell == 'Second-Half OD') {
      return { ...defaultStyles, backgroundColor: '#34a84d', color: 'black' };
    } else if (cell == 'WFH') {
      return { ...defaultStyles, backgroundColor: '#C08B5C', color: 'black' };
    }


    if (employeeData.length == 1) {
      if (!cell || cell == null) {
        const datePart = header.split(' ')[0];
        try {
          const response = await axios.get(`${Config.apiUrl}/absent?date=${datePart}`);
          const result = response.data.data;

          if (result == 1) {
            return { ...defaultStyles, backgroundColor: 'grey', color: 'black' };
          } else if (result == 0) {
            return { ...defaultStyles, backgroundColor: 'gold', color: 'black' };
          }
        } catch (error) {
          console.error('API call failed:', error);
          return defaultStyles;
        }
      } else {
        if (!cell.includes('SHL') && !cell.includes('FHL') && !cell.includes('SH(OD)') && !cell.includes('FH(OD)')) {
          if ((parseInt(cell.split(':')[0]) === 9 && parseInt(cell.split(':')[1]) > 0) ||
            parseInt(cell.split(':')[0]) > 9 || cell.includes('PM')) {
            return { ...defaultStyles, backgroundColor: 'red', color: 'white' };
          }
        } else if (cell.includes('FHL') || cell.includes('SHL')) {
          return { ...defaultStyles, backgroundColor: '#25bdf5', color: 'black' };
        } else if (cell.includes('FH(OD)') || cell.includes('SH(OD)')) {
          return { ...defaultStyles, backgroundColor: '#34a84d', color: 'black' };
        }
      }
    } else {
      const allAbsent = employeeData.every((employee) => {
        const value = Object.values(employee)[columnIndex];
        return !value || value === 'Absent';
      });


      if (allAbsent) {
        return { ...defaultStyles, backgroundColor: 'grey', color: 'black' };
      } else if (!cell || cell === null) {
        return { ...defaultStyles, backgroundColor: 'gold', color: 'black' };
      } else {
        if (!cell.includes('SHL') && !cell.includes('FHL') && !cell.includes('SH(OD)') && !cell.includes('FH(OD)')) {
          if ((parseInt(cell.split(':')[0]) === 9 && parseInt(cell.split(':')[1]) > 0) ||
            parseInt(cell.split(':')[0]) > 9 || cell.includes('PM')) {
            return { ...defaultStyles, backgroundColor: 'red', color: 'white' };
          }
        } else if (cell.includes('FHL') || cell.includes('SHL')) {
          return { ...defaultStyles, backgroundColor: '#25bdf5', color: 'black' };
        } else if (cell.includes('FH(OD)') || cell.includes('SH(OD)')) {
          return { ...defaultStyles, backgroundColor: '#34a84d', color: 'black' };
        }
      }
    }

    return defaultStyles;
  };
  //#end region

  //#region Download
  const downloadTableAsXLSX = async () => {
    const table = document.getElementById('employeeAttendance');
    if (!table) {
      return;
    }

    if (employeeData.length == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(`${employeeID} Report (${selectedMonthYear})`);
      const rows = table.querySelectorAll('tr');
      const columnName = rows[0];
      const numHeaderCells = columnName.querySelectorAll('th').length;
      let rowCount = 0;

      const heading = `${empIdName} Attendance Report for ${selectedMonthYear}`;
      worksheet.addRow([heading]);
      rowCount += 1;
      worksheet.mergeCells(1, 1, 1, numHeaderCells);
      const headingCell = worksheet.getCell(1, 1);
      headingCell.value = heading;
      headingCell.font = { bold: true };
      headingCell.alignment = { horizontal: 'center' };
      headingCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ff91d2ff' } };
      headingCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };

      const columnHeaders = Array.from(columnName.querySelectorAll('th')).map(cell => cell.innerText);
      rowCount += 1;
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

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        rowCount += 1;
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

      for (let i = 3; i <= rowCount; i++) {
        for (let j = 1; j <= numHeaderCells; j++) {
          const cellValue = worksheet.getCell(i, j).value;
          if (cellValue == 'Leave' || cellValue == 'Absent - FHL' || cellValue == 'SHL - Absent') {
            worksheet.getCell(i, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ff87cefa' } };
          } else if (cellValue === 'OD' || cellValue == 'First-Half OD' || cellValue == 'Second-Half OD') {
            worksheet.getCell(i, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ff90ee90' } };
          } else if (cellValue === 'WFH') {
            worksheet.getCell(i, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffc08b5c' } };
          } else if (cellValue === 'Off') {
            worksheet.getCell(i, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffd9d9d9' } };
          } else if (cellValue === 'Absent') {
            worksheet.getCell(i, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffffff66' } };
          } else {
            if (!cellValue.includes('SHL') && !cellValue.includes('FHL') && !cellValue.includes('SH(OD)') && !cellValue.includes('FH(OD)')) {
              if (cellValue && ((parseInt(cellValue.split(':')[0]) === 9 && parseInt(cellValue.split(':')[1]) > 0) ||
                parseInt(cellValue.split(':')[0]) > 9 || cellValue.includes('PM'))) {
                worksheet.getCell(i, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffda9694' } };
              }
            } else if (cellValue.includes('SHL') || cellValue.includes('FHL')) {
              worksheet.getCell(i, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ff87cefa' } };
            } else if (cellValue.includes('SH(OD)') || cellValue.includes('FH(OD)')) {
              worksheet.getCell(i, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ff90ee90' } };
            }
          }
        }
      }

      worksheet.columns.forEach(column => column.width = 22);
      worksheet.getColumn(1).font = { bold: true };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${empIdName} Report(${selectedMonthYear}).xlsx`;
      document.body.appendChild(a);
      a.click();

      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(`Full Report (${selectedMonthYear})`);
      const rows = table.querySelectorAll('tr');
      const columnName = rows[0];
      const numHeaderCells = columnName.querySelectorAll('th').length;
      let rowCount = 0;

      const heading = `Employee Attendance Report for ${selectedMonthYear}`;
      worksheet.addRow([heading]);
      rowCount += 1;
      worksheet.mergeCells(1, 1, 1, numHeaderCells);
      const headingCell = worksheet.getCell(1, 1);
      headingCell.value = heading;
      headingCell.font = { bold: true };
      headingCell.alignment = { horizontal: 'center' };
      headingCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ff91d2ff' } };
      headingCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };

      const columnHeaders = Array.from(columnName.querySelectorAll('th')).map(cell => cell.innerText);
      rowCount += 1;
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

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        rowCount += 1;
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

      for (let i = 3; i <= rowCount; i++) {
        for (let j = 1; j <= numHeaderCells; j++) {
          const cellValue = worksheet.getCell(i, j).value;
          if (cellValue == 'Leave' || cellValue == 'Absent - FHL' || cellValue == 'SHL - Absent') {
            worksheet.getCell(i, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ff87cefa' } };
          } else if (cellValue === 'OD' || cellValue == 'First-Half OD' || cellValue == 'Second-Half OD') {
            worksheet.getCell(i, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ff90ee90' } };
          } else if (cellValue === 'WFH') {
            worksheet.getCell(i, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffc08b5c' } };
          } else if (cellValue === 'Off') {
            worksheet.getCell(i, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffd9d9d9' } };
          } else if (cellValue === 'Absent') {
            worksheet.getCell(i, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffffff66' } };
          } else {
            if (!cellValue.includes('SHL') && !cellValue.includes('FHL') && !cellValue.includes('SH(OD)') && !cellValue.includes('FH(OD)')) {
              if (cellValue && ((parseInt(cellValue.split(':')[0]) === 9 && parseInt(cellValue.split(':')[1]) > 0) ||
                parseInt(cellValue.split(':')[0]) > 9 || cellValue.includes('PM'))) {
                worksheet.getCell(i, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffda9694' } };
              }
            } else if (cellValue.includes('SHL') || cellValue.includes('FHL')) {
              worksheet.getCell(i, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ff87cefa' } };
            } else if (cellValue.includes('SH(OD)') || cellValue.includes('FH(OD)')) {
              worksheet.getCell(i, j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ff90ee90' } };
            }
          }
        }
      }

      worksheet.columns.forEach(column => column.width = 22);
      worksheet.getColumn(1).font = { bold: true };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Attendance Report(${selectedMonthYear}).xlsx`;
      document.body.appendChild(a);
      a.click();

      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };
  //#end region



  return (
    <>
      <CRow>
        <CCard>
          <CCardHeader>
            Employee Report
          </CCardHeader>
          <CCardBody style={{ overflowY: 'scroll', maxHeight: '500px' }}>
            <CRow className='mb-4'>
              <CCol xs={12} sm={12} md={3} xl={3} style={{ marginTop: '5px' }}>
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
              <CCol xs={12} sm={12} md={3} xl={3} style={{ marginTop: '5px' }}>
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
                style={{ minWidth: 'max-content', border: '1px solid #000' }}
                id='employeeAttendance'
                className="mb-4 border"
                hover bordered responsive>
                <CTableHead style={{ overflowX: 'auto', textAlign: 'center' }}>
                  <CTableRow className="bg-body-tertiary text-center">
                    {
                      dateHeaders && dateHeaders.map((headers, index) => (
                        <CTableHeaderCell key={index}
                          style={{ minWidth: '105px' }}>{headers}</CTableHeaderCell>
                      ))
                    }
                  </CTableRow>
                </CTableHead>
                <CTableBody style={{ textAlign: 'center' }}>
                  {
                    processedEmployeeData && processedEmployeeData.map((employee, rowIndex) => {
                      return (
                        <CTableRow key={rowIndex}>
                          {employee.map((cell, columnIndex) => (
                            <CTableDataCell key={columnIndex} style={cell.style}>
                              {cell.text}
                            </CTableDataCell>
                          ))}
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
