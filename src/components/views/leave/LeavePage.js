//copy paste entire view folder
import React, { useState, useEffect, useMemo, useContext } from "react"
import { useSelector } from "react-redux";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormCheck,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
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
  CFormSwitch,
} from '@coreui/react'
import {
  cilTrash,
} from '@coreui/icons'
import Config from "../../../Config";
import './LeaveRequestPage.css'
import axios from "axios";
import { toast } from "react-toastify";
import CIcon from "@coreui/icons-react";
import Pagination from "./Pagination";
import UserContext from '../../../context/UserContext';
import UserContextProvider from "../../../context/UserContextProvider";
let PageSize = 10;

const LeavePage = () => {
  const user = useSelector((state) => state.user);
  const { employeeNames } = useContext(UserContext);
  const { setPendingLeave } = useContext(UserContext);
  const [checkStatusPending, setCheckStatusPending] = useState('');
  const [showPullback, setShowPullback] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showLateDialog, setShowLateDialog] = useState(false);
  const [empID, setEmpID] = useState('');
  const [empName, setEmpName] = useState('Employee Name');
  const [rangeStartDate, setRangeStartDate] = useState('');
  const [rangeEndDate, setRangeEndDate] = useState('');
  const [relaxationTime, setRelaxationTime] = useState('');
  const [lateRecord, setLateRecord] = useState('');
  const [lateEnd, setLateEnd] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [approveReason, setApproveReason] = useState('Approved');
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [halfDayChecked, setHalfDayChecked] = useState(false);
  const [firstHalfChecked, setFirstHalfChecked] = useState(false);
  const [secondHalfChecked, setSecondHalfChecked] = useState(false);
  const [empIdName, setEmpIdName] = useState('All Employees');
  const [employeeID, setEmployeeID] = useState('');
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [switchEnabled, setSwitchEnabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  let toastId = null;

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return leaveRequests.slice(firstPageIndex, lastPageIndex);
  }, [leaveRequests, currentPage]);

  //#region Fetch Leave Req
  const fetchLeaveRequests = async (page) => {
    try {
      if ((user?.userType == 1 && empIdName == 'All Employees') ||
        user?.userType == 2 || user?.userType == 3) {
        const response = await axios.get(`${Config.apiUrl}/pending`, {
          params: {
            userType: user?.userType,
            empid: user?.empid
          }
        });
        setLeaveRequests(response.data.data);
        const hasPendingRequest = response.data.data.some(request => request.Status === 'Pending');
        if (hasPendingRequest) {
          setCheckStatusPending('Pending');
        } else {
          setCheckStatusPending('');
        }
        const countPending = response.data.data.filter(request => request.Status === 'Pending');
        setPendingLeave(countPending.length)
      } else {
        const response = await axios.get(`${Config.apiUrl}/eachEmpLeaves?empid=${employeeID}`);
        setLeaveRequests(response.data.data);
      }
    } catch (error) {
      console.error("error fetching pending requests");
    }
  };

  useEffect(() => {
    fetchLeaveRequests(currentPage);
  }, [currentPage, empIdName, employeeID, setPendingLeave]);

  //#region Set EmpIDName
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

  const handleEmployeeChange = (event) => {
    if (event.target.text == 'All Employees') {
      setEmpIdName(event.target.text);
    } else {
      setEmpIdName(event.target.text);
      const employee = event.target.text.split('-');
      setEmployeeID(employee[0].trim());
    }
  };

  //#region Add Leave
  const calculateDays = (start, end, count) => {
    if (start && end) {
      const startDt = new Date(start);
      const endDt = new Date(end);
      const diffTime = Math.abs(endDt - startDt);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays + count;
    }
  };

  const openModal = () => {
    setShowAddDialog(true);
  };

  const handleStartDateChange = ((event) => {
    setStartDate(event.target.value);
  });

  const handleEndDateChange = ((event) => {
    setEndDate(event.target.value);
  });

  const handleFirstHalfChange = (event) => {
    setFirstHalfChecked(event.target.checked);
  };

  const handleSecondHalfChange = (event) => {
    setSecondHalfChecked(event.target.checked);
  };

  const handleReasonChange = ((event) => {
    setReason(event.target.value);
  });

  const checkSaturday = (startDate, endDate) => {
    let start = new Date(startDate);
    let end = new Date(endDate);

    while (start <= end) {
      let day = start.getDay();
      let date = start.getDate();

      if (day === 6 && Math.ceil(date / 7) % 2 === 0) {
        return 1;
      }

      start.setDate(start.getDate() + 1);
    }

    return 0;
  }

  const checkFifthSaturday = (startDate, endDate) => {
    let start = new Date(startDate);
    let end = new Date(endDate);
    const currentYear = start.getFullYear();
    const currentMonth = start.getMonth() + 1;

    const storageKey = `fifthSaturday_${currentYear}_${currentMonth}`;

    if(localStorage.getItem(storageKey) == 'true') {
      let saturdayCount = 0;
      while (start <= end) {
        if (start.getDay() === 6) { 
          saturdayCount++;
        }
    
        if (saturdayCount === 5) {
          return 0; 
        }
        start.setDate(start.getDate() + 1);
      }
    } else {
      return 1;
    }
  }

  const checkSunday = (fromDate, toDate) => {
    let startDate = new Date(fromDate);
    let endDate = new Date(toDate);

    while (startDate <= endDate) {
      if (startDate.getDay() === 0) {  
        return 1;
      }
      startDate.setDate(startDate.getDate() + 1);
    }
    return 0;
  }

  const handleAdd = async () => {
    try {
      if (!startDate) {
        if (toastId) toast.dismiss(toastId);
        Id = toastId = toast.info("Please enter start date.", { autoClose: 3000 });
        return;
      }
      if (!endDate) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Please enter end date.", { autoClose: 3000 });
        return;
      }
      if (!reason) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Please enter reason.", { autoClose: 3000 });
        return;
      }
      if (checkSaturday(startDate, endDate) == 1) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Cannot include even Saturdays.", { autoClose: 3000 });
        return;
      }
      if (checkSunday(startDate, endDate) == 1) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Cannot include Sunday.", { autoClose: 3000 });
        return;
      }
      if(hasFifthSaturday(new Date(startDate).getFullYear(), new Date(startDate).getMonth() + 1)){
        if (checkFifthSaturday(startDate, endDate) == 1) {
          if (toastId) toast.dismiss(toastId);
          toastId = toast.info("Cannot include Off 5th Saturday.", { autoClose: 3000 });
          return;
        }
      }

      let firstHalf = 'No';
      let secondHalf = 'No';
      let NoOfLeave = 0;
      if (firstHalfChecked == true) {
        firstHalf = 'Yes';
        secondHalf = 'No';
        NoOfLeave = calculateDays(startDate, endDate, .5);
      }
      else if (secondHalfChecked == true) {
        secondHalf = 'Yes';
        firstHalf = 'No';
        NoOfLeave = calculateDays(startDate, endDate, .5);
      }
      else if (secondHalfChecked == true && firstHalfChecked == true) {
        firstHalf = 'Yes';
        secondHalf = 'Yes';
        NoOfLeave = calculateDays(startDate, endDate, 0);
      }
      else {
        firstHalf = 'No';
        secondHalf = 'No';
        NoOfLeave = calculateDays(startDate, endDate, 1);
      }

      const params = {
        "EmpID": user?.empid,
        "empName": user?.name,
        "fromDate": startDate,
        "toDate": endDate,
        "reason": reason,
        "firstHalf": firstHalf,
        "secondHalf": secondHalf,
        "NoOfLeave": NoOfLeave,
        "status": 'Pending',
        "remark": 'N/A',
      };

      const response = await axios.post(`${Config.apiUrl}/addleave`, params);
      console.log(response.data);
      setShowAddDialog(false);

      fetchLeaveRequests();
      setReason('');
      setStartDate('');
      setEndDate('');
      setFirstHalfChecked(false);
      setSecondHalfChecked(false);
      if (toastId) toast.dismiss(toastId);
      toastId = toast.success("Leave request submitted successfully.", { autoClose: 3000 });
    } catch (error) {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in leave submission." + error, { autoClose: 3000 });
    }
  };

  const handleAddCancel = () => {
    setShowAddDialog(false);
    setFirstHalfChecked(false);
    setSecondHalfChecked(false);
  };

  //#endregion

  //#region Late Leave

  const openLateModal = () => {
    setShowLateDialog(true);
  };

  const handleNameChange = (async (event) => {
    setEmpName(event.target.text);
    if (event.target.text === 'Employee Name') {
      setEmpID('Employee ID')
      setRangeStartDate('')
      setRangeEndDate('')
      setRelaxationTime('')
      setLateRecord('')
    } else {
      const response = await axios.get(`${Config.apiUrl}/empid?name=${event.target.text}`);
      setEmpID(response.data.data);
      const res = await axios.get(`${Config.apiUrl}/latecount`, {
        params: {
          empID: response.data.data,
          fromDate: rangeStartDate,
          toDate: rangeEndDate,
          relaxationTime: relaxationTime,
        }
      });
      setLateRecord(res.data.data[0].DaysWithLateLogin);
    }
  });

  const handleRangeStartDate = (async (event) => {
    setRangeStartDate(event.target.value);
    const response = await axios.get(`${Config.apiUrl}/latecount`, {
      params: {
        empID: empID,
        fromDate: event.target.value,
        toDate: rangeEndDate,
        relaxationTime: relaxationTime,
      }
    });
    setLateRecord(response.data.data[0].DaysWithLateLogin);
  });

  const handleRangeEndDate = (async (event) => {
    setRangeEndDate(event.target.value);
    const response = await axios.get(`${Config.apiUrl}/latecount`, {
      params: {
        empID: empID,
        fromDate: rangeStartDate,
        toDate: event.target.value,
        relaxationTime: relaxationTime,
      }
    });
    setLateRecord(response.data.data[0].DaysWithLateLogin);
  });

  const handleRelaxationTimeChange = (async (event) => {
    setRelaxationTime(event.target.value);
    const response = await axios.get(`${Config.apiUrl}/latecount`, {
      params: {
        empID: empID,
        fromDate: rangeStartDate,
        toDate: rangeEndDate,
        relaxationTime: event.target.value,
      }
    });
    setLateRecord(response.data.data[0].DaysWithLateLogin);
  });

  const handleLateEndDate = ((event) => {
    setLateEnd(event.target.value);
  });

  const handleHalfDayChange = (event) => {
    setHalfDayChecked(event.target.checked);
  };
  const handleLateAdd = async () => {
    try {
      if (!empName) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Please enter employee name.", { autoClose: 3000 });
        return;
      }
      if (!rangeStartDate) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Please enter range start date.", { autoClose: 3000 });
        return;
      }
      if (!rangeEndDate) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Please enter range end date.", { autoClose: 3000 });
        return;
      }
      if (!relaxationTime) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Please enter relaxation time.", { autoClose: 3000 });
        return;
      }
      if (!lateEnd) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Please enter late leave end date.", { autoClose: 3000 });
        return;
      }
      let halfDay = 'No';
      let NoOfLeave = 0;
      if (halfDayChecked == true) {
        halfDay = 'Yes';
        NoOfLeave = calculateDays(rangeStartDate, lateEnd, .5);
      }
      else {
        halfDay = 'No';
        NoOfLeave = calculateDays(rangeStartDate, lateEnd, 1);
      }
      const params = {
        "EmpID": empID,
        "empName": empName,
        "fromDate": rangeStartDate,
        "toDate": lateEnd,
        "reason": 'LATE LEAVE',
        "firstHalf": halfDay,
        "secondHalf": 'No',
        "NoOfLeave": NoOfLeave,
        "status": 'Approved',
        "remark": 'From Admin',
      };

      const response = await axios.post(`${Config.apiUrl}/addleave`, params);
      console.log(response.data);
      setShowLateDialog(false);

      fetchLeaveRequests();
      setEmpID('');
      setEmpName('');
      setRangeStartDate('');
      setRangeEndDate('');
      setRelaxationTime('');
      setLateRecord('');
      setLateEnd('');
      setHalfDayChecked(false);
      if (toastId) toast.dismiss(toastId);
      toastId = toast.success("Late leave added successfully.", { autoClose: 3000 });
    } catch (error) {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in late leave submission." + error, { autoClose: 3000 });
    }
  };

  const handleLateCancel = () => {
    setEmpID('');
    setEmpName('Employee Name');
    setRangeStartDate('');
    setRangeEndDate('');
    setLateEnd('');
    setRelaxationTime('');
    setLateRecord('');
    setShowLateDialog(false);
    setHalfDayChecked(false);
  };

  //#endregion

  //#region Approve Leave

  const handleApproveReasonChange = ((event) => {
    setApproveReason(event.target.value);
  });

  const handleApprove = async () => {

    try {
      let params = {
        "Id": selectedRequest.id,
        "Reason": approveReason + ` (By- ${user?.name})`
      }
      const response = await axios.put(`${Config.apiUrl}/approve`, params);
      console.log(response.data);
      setShowApproveDialog(false);
      fetchLeaveRequests();
      if (toastId) toast.dismiss(toastId);
      toastId = toast.success("Leave approved successfully.", { autoClose: 3000 });
    } catch {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in approving leave.", { autoClose: 3000 });
    }
  }

  const handleApproveCancel = (() => {
    setShowApproveDialog(false);
    setApproveReason('Approved');
  });

  //#endregion

  //#region Reject Leave
  const handleRejectReasonChange = ((event) => {
    setRejectReason(event.target.value);
  });

  const handleReject = async () => {
    if (!rejectReason) {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.info("Please enter reason for rejection.", { autoClose: 3000 });
      return;
    }
    try {
      let params = {
        "rejectedCancel": 'Rejected',
        "Id": selectedRequest.id,
        "rejectReason": rejectReason + ` (By- ${user?.name})`
      }
      const response = await axios.put(`${Config.apiUrl}/rejectPullback`, params);
      console.log(response.data);
      setShowRejectDialog(false);
      fetchLeaveRequests();
      setRejectReason('');
      if (toastId) toast.dismiss(toastId);
      toastId = toast.success("Leave rejected successfully.", { autoClose: 3000 });
    } catch {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in rejecting leave.", { autoClose: 3000 });

    }
  }

  const handleRejectCancel = () => {
    setShowRejectDialog(false);
    setRejectReason('');
  }

  //#endregion

  //#region Pullback Leave
  const handleCancelReasonChange = ((event) => {
    setRejectReason(event.target.value);
  });

  const handleCancel = async () => {
    if (!rejectReason) {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.info("Please enter reason for deleting leave request.", { autoClose: 3000 });
      return;
    }
    try {
      let params = {
        "rejectedCancel": 'Pullback',
        "Id": selectedRequest.id,
        "rejectReason": rejectReason
      }
      const response = await axios.put(`${Config.apiUrl}/rejectPullback`, params);
      console.log(response.data);
      setShowPullback(false);
      fetchLeaveRequests();
      setRejectReason('');
      if (toastId) toast.dismiss(toastId);
      toastId = toast.success("Leave request deleted successfully.", { autoClose: 3000 });
    } catch {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in deleting leave request.", { autoClose: 3000 });

    }

  }
  //#endregion

  //#region Delete Approved

  const handleDeleteApproved = async () => {
    try {
      const response = await axios.post(`${Config.apiUrl}/deleteApproved`, { Id: selectedRequest.id });
      console.log(response.data);
      setShowDelete(false);
      fetchLeaveRequests();
      if (toastId) toast.dismiss(toastId);
      toastId = toast.success("Leave request deleted successfully.", { autoClose: 3000 });
    } catch {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in deleting leave request.", { autoClose: 3000 });
    }
  }

  const handleDeleteCancel = () => {
    setShowDelete(false)
    setSelectedRequest(null)
  }
  //#end region

  
  //#region 5th Saturday
  const hasFifthSaturday = (year, month) => {
    let saturdayCount = 0;

    for (let day = 1; day <= 31; day++) {
      const date = new Date(year, month - 1, day);
      if (date.getMonth() + 1 !== month) break;
      if (date.getDay() === 6) saturdayCount++;

      if (saturdayCount === 5) return true;
    }
    return false;
  };

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const storageKey = `fifthSaturday_${currentYear}_${currentMonth}`;

    if (hasFifthSaturday(currentYear, currentMonth)) {
      const savedState = localStorage.getItem(storageKey);
      if (savedState !== null) {
        setSwitchEnabled(JSON.parse(savedState));
      } else {
        setSwitchEnabled(false);
      }
    }
  }, []);

  const handleSwitchChange = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const storageKey = `fifthSaturday_${currentYear}_${currentMonth}`;
    
    setSwitchEnabled(!switchEnabled);
    localStorage.setItem(storageKey, JSON.stringify(!switchEnabled));
  };

  return (
    <UserContextProvider>
      <CRow xs={{ gutter: 3 }}>
        <CCol>
          <CCard style={{ marginBottom: '10px' }}>
            <CCardHeader>
              <CRow>
                <CCol xs={12} sm={6} md={6} xl={6}>
                  Leave
                  {user?.userType == 1 && (
                    <>
                      <CDropdown style={{ marginLeft: '10px' }}>
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
                    </>
                  )}
                </CCol>
                <CCol xs={12} sm={6} md={6} xl={6}
                  style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                  <div className="leave-status"
                    style={{ display: 'flex', alignItems: 'center' }}>

                    {user?.userType == 1 && (
                      <>
                      {hasFifthSaturday(new Date().getFullYear(), new Date().getMonth() + 1) && (
                        <CFormSwitch 
                        style={{ marginLeft: '5px' }} 
                        reverse id="fifthSaturday" 
                        label="5th Saturday" 
                        checked={switchEnabled}
                        onChange={handleSwitchChange}
                        />
                      )}
                        <CTooltip
                          content="Add late leave"
                          trigger={['hover']}
                        >
                          <CButton
                            color="primary"
                            type="button"
                            className="reject-btn mb-2 mx-2"
                            onClick={openLateModal}>
                            Late Leave
                          </CButton>
                        </CTooltip>
                      </>
                    )}
                    <CTooltip
                      content="Apply leave"
                      trigger={['hover']}
                    >
                      <CButton
                        color="primary"
                        type="button"
                        className="reject-btn mb-2 mx-2"
                        onClick={openModal}>
                        Leave Request
                      </CButton>
                    </CTooltip>
                  </div>
                </CCol>
              </CRow>
              <CModal visible={showLateDialog} onClose={handleLateCancel}>
                <CModalHeader>
                  <CModalTitle>Late Leave</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CForm>
                    <CRow className="g-3">
                      <CCol xs style={{ marginBottom: '5px' }}>
                        <CFormLabel id="inputGroupPrepend03">Employee ID</CFormLabel>
                        <CFormInput
                          type="text"
                          id="EmpID"
                          name='EmpID'
                          placeholder="Employee ID"
                          value={empID}
                          disabled
                        />
                      </CCol>
                      <CCol xs>
                        <CFormLabel id="inputGroupPrepend03">Employee Name</CFormLabel>
                        <div>
                          <CDropdown>
                            <CDropdownToggle
                              color="secondary" caret >
                              {empName}
                            </CDropdownToggle>
                            <CDropdownMenu
                              placeholder="Employee Name"
                              id="EmpID"
                              name='EmpID'
                              onClick={handleNameChange} style={{ cursor: 'pointer', overflowY: 'scroll', maxHeight: '200px' }}>
                              <CDropdownItem value="">Employee Name</CDropdownItem>
                              {employeeNames}
                            </CDropdownMenu>
                          </CDropdown>
                        </div>
                      </CCol>
                    </CRow>
                    <CRow className="g-3">
                      <CCol xs style={{ marginBottom: '5px' }}>
                        <CFormLabel id="inputGroupPrepend03">Range Start Date</CFormLabel>
                        <CFormInput
                          type="date"
                          id="StartDate"
                          name='StartDate'
                          onChange={handleRangeStartDate}
                          placeholder="Range Start Date"

                        />
                      </CCol>
                      <CCol xs>
                        <CFormLabel id="inputGroupPrepend03">Range End Date</CFormLabel>
                        <CFormInput
                          type="date"
                          placeholder="Range End Date"
                          onChange={handleRangeEndDate}
                          min={rangeStartDate}
                          id="EndDate"
                          name='EndDate'

                        />
                      </CCol>
                    </CRow>
                    <CRow className="g-3">
                      <CCol xs style={{ marginBottom: '5px' }}>
                        <CFormLabel id="inputGroupPrepend03">Relaxation Time (in min)</CFormLabel>
                        <CFormInput
                          type="input"
                          id="RelaxationTime"
                          name='RelaxationTime'
                          onChange={handleRelaxationTimeChange}
                          placeholder="Relaxation Time"

                        />
                      </CCol>
                      <CCol xs>
                        <CFormLabel id="inputGroupPrepend03">Late Record Count</CFormLabel>
                        <CFormInput
                          type="input"
                          id="LateRecordCount"
                          name='LateRecordCount'
                          placeholder="Late Record Count"
                          value={lateRecord}
                          disabled
                        />
                      </CCol>
                    </CRow>
                    <CRow className="g-3">
                      <CCol xs style={{ marginBottom: '5px' }}>
                        <CFormLabel id="inputGroupPrepend03">Late Leave Start Date</CFormLabel>
                        <CFormInput
                          type="date"
                          id="StartDate"
                          name='StartDate'
                          // onChange={handleLateStartDate}
                          value={rangeStartDate}
                          disabled
                          placeholder="Late Leave Start Date"

                        />
                      </CCol>
                      <CCol xs>
                        <CFormLabel id="inputGroupPrepend03">Late Leave End Date</CFormLabel>
                        <CFormInput
                          type="date"
                          placeholder="Late Leave End Date"
                          onChange={handleLateEndDate}
                          min={rangeStartDate}
                          id="EndDate"
                          name='EndDate'

                        />
                      </CCol>
                    </CRow>
                    <CRow className="g-3">
                      <CCol xs>
                        <CFormCheck
                          inline
                          id="inlineCheckbox3"
                          value="Yes"
                          label="Half Day"
                          checked={halfDayChecked}
                          onChange={handleHalfDayChange}
                        />
                      </CCol>
                      <CCol xs style={{ marginBottom: '5px' }}>
                      </CCol>
                    </CRow>
                    <div className="mb-3">
                      <CFormLabel htmlFor="exampleFormControlTextarea1">Reason</CFormLabel>
                      <CFormTextarea
                        id="exampleFormControlTextarea1"
                        rows={3}
                        placeholder="Reason"
                        name="reason"
                        defaultValue="LATE LEAVE"
                        disabled

                      ></CFormTextarea>
                    </div>
                  </CForm>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={handleLateCancel}>
                    Cancel
                  </CButton>
                  <CButton color="primary" onClick={handleLateAdd}>Submit</CButton>
                </CModalFooter>
              </CModal>
              <CModal visible={showAddDialog} onClose={handleAddCancel}>
                <CModalHeader>
                  <CModalTitle>Mark Leave</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CForm>
                    <CRow className="g-3">
                      <CCol xs style={{ marginBottom: '5px' }}>
                        <CFormLabel id="inputGroupPrepend03">Employee ID</CFormLabel>
                        <CFormInput
                          type="text"
                          id="EmpID"
                          name='EmpID'
                          placeholder="Employee ID"
                          defaultValue={user?.empid}
                          disabled
                        />
                      </CCol>
                      <CCol xs>
                        <CFormLabel id="inputGroupPrepend03">Employee Name</CFormLabel>
                        <CFormInput
                          type="text"
                          placeholder="Employee Name"
                          id="EmpID"
                          name='EmpID'
                          defaultValue={user?.name}
                          disabled
                        />
                      </CCol>
                    </CRow>
                    <CRow className="g-3">
                      <CCol xs style={{ marginBottom: '5px' }}>
                        <CFormLabel id="inputGroupPrepend03">Leave Start Date</CFormLabel>
                        <CFormInput
                          type="date"
                          id="StartDate"
                          name='StartDate'
                          onChange={handleStartDateChange}
                          placeholder="Leave Start Date"

                        />
                      </CCol>
                      <CCol xs>
                        <CFormLabel id="inputGroupPrepend03">Leave End Date</CFormLabel>
                        <CFormInput
                          type="date"
                          placeholder="Leave End Date"
                          onChange={handleEndDateChange}
                          min={startDate}
                          id="EndDate"
                          name='EndDate'

                        />
                      </CCol>
                    </CRow>
                    <CRow className="g-3">
                      <CCol xs>
                        <CFormCheck
                          inline
                          id="inlineCheckbox2"
                          value="Yes"
                          label="Second Half"
                          checked={secondHalfChecked}
                          onChange={handleSecondHalfChange}
                        />
                      </CCol>
                      <CCol xs style={{ marginBottom: '5px' }}>
                        <CFormCheck
                          inline
                          id="inlineCheckbox1"
                          value="Yes"
                          label="First Half"
                          checked={firstHalfChecked}
                          onChange={handleFirstHalfChange}
                        />
                      </CCol>
                    </CRow>
                    <div className="mb-3">
                      <CFormLabel htmlFor="exampleFormControlTextarea1">Reason</CFormLabel>
                      <CFormTextarea
                        id="exampleFormControlTextarea1"
                        rows={3}
                        placeholder="Reason"
                        name="reason"
                        onChange={handleReasonChange}

                      ></CFormTextarea>
                    </div>
                  </CForm>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={handleAddCancel}>
                    Cancel
                  </CButton>
                  <CButton color="primary" onClick={handleAdd}>Submit</CButton>
                </CModalFooter>
              </CModal>
            </CCardHeader>
            <CCardBody>
              <CRow xs={{ gutter: 12 }}>
                <CCol xs={12} sm={12} xl={12} xxl={12}>
                  <CTable style={{ overflowX: 'auto', textAlign: 'center' }} align="middle" className="mb-4"
                    hover responsive bordered>
                    <CTableHead className="text-nowrap">
                      <CTableRow>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          SNo
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          Name
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          FromDate
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          ToDate
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          Reason
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          Day(s)
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          First Half
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          Second Half
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          Status
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          Remarks
                        </CTableHeaderCell>
                        {user?.userType == 1 && (
                          <>
                            <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                              Action
                            </CTableHeaderCell>
                          </>
                        )}
                        {(user?.userType == 2 || user?.userType == 3) && (
                          <>
                            {checkStatusPending == 'Pending' && (
                              <>
                                <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">Pullback</CTableHeaderCell>
                              </>
                            )}
                          </>
                        )}
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {currentTableData.map(request => (
                        <CTableRow key={request.SNo}>
                          <CTableHeaderCell scope="row">{request.SNo}</CTableHeaderCell>
                          <CTableDataCell className="text-nowrap">
                            <div>{request.EmpName}</div>
                            <div style={{ fontSize: 'small' }}>({request.EmpID})</div>
                          </CTableDataCell>
                          <CTableDataCell className="text-nowrap">{request.fromDate}</CTableDataCell>
                          <CTableDataCell className="text-nowrap">{request.toDate}</CTableDataCell>
                          <CTableDataCell row="scope">{request.Reason}</CTableDataCell>
                          <CTableDataCell>{request.NoOfLeave}</CTableDataCell>
                          {request.FirstHalf == 0 && (
                            <>
                              <CTableDataCell>No</CTableDataCell>
                            </>
                          )}
                          {request.FirstHalf == 1 && (
                            <>
                              <CTableDataCell >Yes</CTableDataCell>
                            </>
                          )}

                          {request.SecondHalf == 0 && (
                            <>
                              <CTableDataCell>No</CTableDataCell>
                            </>
                          )}
                          {request.SecondHalf == 1 && (
                            <>
                              <CTableDataCell>Yes</CTableDataCell>
                            </>
                          )}

                          {request.Status == 'Pending' && (
                            <>
                              <CTableDataCell>
                                <div style={{
                                  backgroundColor: '#f7c63e',
                                  padding: '4px', textAlign: 'center'
                                }}>
                                  {request.Status}
                                </div></CTableDataCell>
                            </>
                          )}
                          {request.Status == 'Approved' && (
                            <>
                              <CTableDataCell>
                                <div style={{
                                  backgroundColor: '#39d465',
                                  padding: '4px', textAlign: 'center'
                                }}>
                                  {request.Status}
                                </div></CTableDataCell>
                            </>
                          )}
                          {request.Status == 'Rejected' && (
                            <>
                              <CTableDataCell>
                                <div style={{
                                  backgroundColor: '#f55142',
                                  padding: '4px', textAlign: 'center'
                                }}>
                                  {request.Status}
                                </div></CTableDataCell>
                            </>
                          )}
                          {request.Status == 'Pullback' && (
                            <>
                              <CTableDataCell>
                                <div style={{
                                  backgroundColor: '#a3a3a3',
                                  padding: '4px', textAlign: 'center'
                                }}>
                                  {request.Status}
                                </div></CTableDataCell>
                            </>
                          )}

                          <CTableDataCell>{request.Remarks}</CTableDataCell>

                          {request.Status == 'Pending' && (
                            <>
                              {user?.userType == 1 && (
                                <>
                                  <CTableDataCell >

                                    <CRow style={{ position: 'relative', display: 'flex' }}>
                                      <CCol>
                                        <div className="leave-status">
                                          <CTooltip
                                            content="Approve leave"
                                            trigger={['hover']}
                                          >
                                            <CButton
                                              color="primary"
                                              className="approve-btn"
                                              onClick={() => {
                                                setSelectedRequest(request);
                                                setShowApproveDialog(!showApproveDialog);
                                              }}>
                                              APPROVE
                                            </CButton>
                                          </CTooltip>
                                        </div>
                                      </CCol>
                                      <CCol>
                                        <div className="leave-status">
                                          <CTooltip
                                            content="Reject leave"
                                            trigger={['hover']}
                                          >
                                            <CButton
                                              color="primary"
                                              type="button"
                                              className="reject-btn"
                                              onClick={() => {
                                                setSelectedRequest(request);
                                                setShowRejectDialog(!showRejectDialog);
                                              }}>
                                              REJECT
                                            </CButton>
                                          </CTooltip>
                                        </div>
                                      </CCol>
                                    </CRow>
                                  </CTableDataCell>
                                </>
                              )}
                            </>
                          )}
                          {request.Status == 'Approved' && (
                            <>
                              {user?.userType == 1 && (
                                <>
                                  <CTableDataCell>
                                    <CRow style={{ position: 'relative', display: 'flex' }}>
                                      <CCol>
                                        <div className="leave-status">
                                          <CTooltip
                                            content="Delete approved request"
                                            trigger={['hover']}
                                          >
                                            <CIcon icon={cilTrash} style={{ color: 'red', cursor: 'pointer' }}
                                              onClick={() => {
                                                setSelectedRequest(request);
                                                setShowDelete(!showDelete);
                                              }}
                                            ></CIcon>
                                          </CTooltip>
                                        </div>
                                      </CCol>
                                    </CRow>
                                  </CTableDataCell>

                                </>
                              )}
                            </>
                          )}
                          {request.Status == 'Rejected' && (
                            <>
                              {user?.userType == 1 && (
                                <CTableDataCell></CTableDataCell>
                              )}
                            </>
                          )}
                          {request.Status == 'Pullback' && (
                            <>
                              {user?.userType == 1 && (
                                <CTableDataCell></CTableDataCell>
                              )}
                            </>
                          )}

                          {(user?.userType == 2 || user?.userType == 3) && (
                            <>
                              {request.Status == 'Pending' && (
                                <>
                                  <CTableDataCell>
                                    <CRow style={{ position: 'relative', display: 'flex' }}>
                                      <CCol>
                                        <div className="leave-status">
                                          <CTooltip
                                            content="Delete request"
                                            trigger={['hover']}
                                          >
                                            <CIcon icon={cilTrash} style={{ color: 'red', cursor: 'pointer' }}
                                              onClick={() => {
                                                setSelectedRequest(request);
                                                setShowPullback(true);
                                              }}
                                            ></CIcon>
                                          </CTooltip>
                                        </div>
                                      </CCol>
                                    </CRow>

                                  </CTableDataCell>
                                </>
                              )}
                            </>
                          )}
                          {(user?.userType == 2 || user?.userType == 3) && (
                            <>
                              {request.Status == 'Approved' && (
                                <CTableDataCell></CTableDataCell>
                              )}
                            </>
                          )}
                          {(user?.userType == 2 || user?.userType == 3) && (
                            <>
                              {request.Status == 'Rejected' && (
                                <CTableDataCell></CTableDataCell>
                              )}
                            </>
                          )}
                          {(user?.userType == 2 || user?.userType == 3) && (
                            <>
                              {request.Status == 'Pullback' && (
                                <CTableDataCell></CTableDataCell>
                              )}
                            </>
                          )}
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                  <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={leaveRequests.length}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                  />
                </CCol>
              </CRow>

              <CModal visible={showApproveDialog} onClose={() => handleApproveCancel}>
                <CModalHeader>
                  <CModalTitle>Approve</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <div className="mb-3">
                    <CFormLabel htmlFor="exampleFormControlTextarea1">
                      Do you want to approve the leave?                                              </CFormLabel>
                    <CFormTextarea
                      id="exampleFormControlTextarea1"
                      rows={3}
                      placeholder="Reason for Approval"
                      name="reason"
                      defaultValue="Approved"
                      onChange={handleApproveReasonChange}

                    ></CFormTextarea>
                  </div>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setShowApproveDialog(false)}>
                    No
                  </CButton>
                  <CButton color="primary" onClick={handleApprove}>Yes</CButton>
                </CModalFooter>
              </CModal>

              <CModal visible={showRejectDialog} onClose={() => handleRejectCancel}>
                <CModalHeader>
                  <CModalTitle>Reject</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CForm>
                    <div className="mb-3">
                      <CFormLabel htmlFor="exampleFormControlTextarea1">
                        Do you want to reject the leave?                                              </CFormLabel>
                      <CFormTextarea
                        id="exampleFormControlTextarea1"
                        rows={3}
                        placeholder="Reason for Rejection"
                        name="reason"
                        onChange={handleRejectReasonChange}

                      ></CFormTextarea>
                    </div>
                  </CForm>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setShowRejectDialog(false)}>
                    No
                  </CButton>
                  <CButton color="primary" onClick={handleReject}>Yes</CButton>
                </CModalFooter>
              </CModal>

              <CModal visible={showPullback} onClose={() => setShowPullback(false)}>
                <CModalHeader>
                  <CModalTitle> Pullback </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CForm>
                    <div className="mb-3">
                      <CFormLabel htmlFor="exampleFormControlTextarea1">
                        Do you want to delete the leave request?                                              </CFormLabel>
                      <CFormTextarea
                        id="exampleFormControlTextarea1"
                        rows={3}
                        placeholder="Reason for Cancel"
                        name="cancel"
                        onChange={handleCancelReasonChange}
                      ></CFormTextarea>
                    </div>
                  </CForm>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setShowPullback(false)}>
                    No
                  </CButton>
                  <CButton color="primary" onClick={handleCancel}>Yes</CButton>
                </CModalFooter>
              </CModal>

              <CModal visible={showDelete} onClose={handleDeleteCancel}>
                <CModalHeader>
                  <CModalTitle> Delete Approved Request </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CForm>
                    <CFormLabel htmlFor="deleteApproved">
                      Do you want to delete the approved leave request?
                    </CFormLabel>
                  </CForm>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setShowDelete(false)}>
                    No
                  </CButton>
                  <CButton color="primary"
                    onClick={handleDeleteApproved}>
                    Yes
                  </CButton>
                </CModalFooter>
              </CModal>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </UserContextProvider>
  )
}

export default LeavePage
