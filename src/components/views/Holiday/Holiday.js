import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';
import Config from '../../../Config';

const Holiday = () => {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}/getHolidayList`);
        setHolidays(response.data.data);
      } catch (error) {
        console.error('Error fetching holidays:', error);
      }
    };
    fetchHolidays();
  }, []);

  return (
    <CTable style={{ overflowX: 'auto', textAlign: 'center' }} align="middle" className="mb-4"
    hover responsive bordered>
      <CTableHead className="text-nowrap">
        <CTableRow>
        <CTableHeaderCell className="bg-body-tertiary text-center">S.No.</CTableHeaderCell>
          <CTableHeaderCell className="bg-body-tertiary text-center">Date</CTableHeaderCell>
          <CTableHeaderCell className="bg-body-tertiary text-center">Day</CTableHeaderCell>
          <CTableHeaderCell className="bg-body-tertiary text-center">Holiday Name</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {holidays.map((holiday, index) => (
          <CTableRow key={index}>
          <CTableDataCell>{holiday.SNo}.</CTableDataCell>
            <CTableDataCell>{holiday.Date}</CTableDataCell>
            <CTableDataCell>{holiday.Day}</CTableDataCell>
            <CTableDataCell>{holiday.HolidayName}</CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

export default Holiday;
