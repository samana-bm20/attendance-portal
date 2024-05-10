import React, { useState, useEffect, useMemo, useContext } from "react"
import { useSelector } from "react-redux";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CFormCheck,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
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
let PageSize = 10;

const LeavePage = () => {
  const user = useSelector((state) => state.user);
  const { employeeNames } = useContext(UserContext);
  const [checkStatusPending, setCheckStatusPending] = useState('');
  const [showPullback, setShowPullback] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showLateDialog, setShowLateDialog] = useState(false);
  const [empID, setEmpID] = useState('');
  const [empName, setEmpName] = useState('Employee Name');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [firstHalfChecked, setFirstHalfChecked] = useState(false);
  const [secondHalfChecked, setSecondHalfChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [secondHalf, setSecondHalf] = useState(0.5);
  const [firstHalf, setFirstHalf] = useState(0.5);

  const fetchLeaveRequests = async (page) => {
    try {
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
    } catch (error) {
      console.error("error fetching pending requests");
    }
  };


  useEffect(() => {
    fetchLeaveRequests(currentPage); // Pass currentPage to fetch the appropriate page
  }, [currentPage]);

  const handleApprove = async () => {

    try {
      let params = {
        "EmpID": user?.empid,
        "Id": selectedRequest.id
      }
      const response = await axios.put(`${Config.apiUrl}/approve`, params);
      console.log(response.data);
      setShowApproveDialog(false);
      fetchLeaveRequests();
      toast.success("Leave approved successfully.", { autoClose: 3000 });
    } catch {
      toast.error("Error in approving leave.", { autoClose: 3000 });
    }
  }

  const handleReasonChange = ((event) => {
    setReason(event.target.value);
  });

  const handleNameChange = (async (event) => {
    setEmpName(event.target.text);
    if (event.target.text === 'Employee Name') {
      setEmpID('Employee ID')
    } else {
      const response = await axios.get(`${Config.apiUrl}/empid?name=${event.target.text}`);
      setEmpID(response.data.data);
    }
  });

  const handleRejectReasonChange = ((event) => {
    setRejectReason(event.target.value);
  });

  const handleCancelReasonChange = ((event) => {
    setRejectReason(event.target.value);
  });

  const handlStartDateChange = ((event) => {
    setStartDate(event.target.value);
  });
  const handleEndDateChange = ((event) => {
    setEndDate(event.target.value);
  });

  const handleReject = async () => {
    if (!rejectReason) {
      toast.info("Please enter reason for rejection.", { autoClose: 3000 });
      return;
    }
    try {
      let params = {
        "rejectedCancel": 'Rejected',
        "Id": selectedRequest.id,
        "rejectReason": rejectReason
      }
      const response = await axios.put(`${Config.apiUrl}/reject`, params);
      console.log(response.data);
      setShowRejectDialog(false);
      fetchLeaveRequests();
      setRejectReason('');
      toast.success("Leave rejected successfully.", { autoClose: 3000 });
    } catch {
      toast.error("Error in rejecting leave.", { autoClose: 3000 });

    }
  }

  const handleCancel = async () => {
    if (!rejectReason) {
      toast.info("Please enter reason for deleting leave request.", { autoClose: 3000 });
      return;
    }
    try {
      let params = {
        "rejectedCancel": 'Pullback',
        "Id": selectedRequest.id,
        "rejectReason": rejectReason
      }
      const response = await axios.put(`${Config.apiUrl}/reject`, params);
      console.log(response.data);
      handleModelCancel(false);
      fetchLeaveRequests();
      setRejectReason('');
      toast.success("Leave request deleted successfully.", { autoClose: 3000 });
    } catch {
      toast.error("Error in deleting leave request.", { autoClose: 3000 });

    }

  }

  const handleModelCancel = () => {
    setShowPullback(false);
    setRejectReason('');
  }

  const handleRejectCancel = () => {
    setShowRejectDialog(false);
    setRejectReason('');
  }

  const handleFirstHalfChange = (event) => {
    //setFirstHalf(0.5);
    setFirstHalfChecked(event.target.checked);
  };

  const handleSecondHalfChange = (event) => {
    //setSecondHalf(0.5);
    setSecondHalfChecked(event.target.checked);
  };

  const handleAdd = async () => {
    try {
      if (!startDate) {
        toast.info("Please enter start date.", { autoClose: 3000 });
        return;
      }
      if (!endDate) {
        toast.info("Please enter end date.", { autoClose: 3000 });
        return;
      }
      if (!reason) {
        toast.info("Please enter reason.", { autoClose: 3000 });
        return;
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
        "status": 'Pending'
      };


      const response = await axios.post(`${Config.apiUrl}/addleave`, params);
      console.log(response.data);
      setShowAddDialog(false);

      fetchLeaveRequests();
      setReason('');
      setStartDate('');
      setEndDate('');
      toast.success("Leave request submitted successfully.", { autoClose: 3000 });
    } catch (error) {
      toast.error("Error in leave submission." + error, { autoClose: 3000 });
    }
  };

  const handleLateAdd = async () => {
    try {
      if (!empID) {
        toast.info("Please enter employee ID.", { autoClose: 3000 });
        return;
      }
      if (!empName) {
        toast.info("Please enter employee name.", { autoClose: 3000 });
        return;
      }
      if (!startDate) {
        toast.info("Please enter start date.", { autoClose: 3000 });
        return;
      }
      if (!endDate) {
        toast.info("Please enter end date.", { autoClose: 3000 });
        return;
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
      debugger
      const params = {
        "EmpID": empID,
        "empName": empName,
        "fromDate": startDate,
        "toDate": endDate,
        "reason": 'LATE LEAVE',
        "firstHalf": firstHalf,
        "secondHalf": secondHalf,
        "NoOfLeave": NoOfLeave,
        "status": 'Approved'
      };


      const response = await axios.post(`${Config.apiUrl}/addleave`, params);
      console.log(response.data);
      setShowLateDialog(false);

      fetchLeaveRequests();
      setEmpID('');
      setEmpName('');
      setStartDate('');
      setEndDate('');
      toast.success("Late leave added successfully.", { autoClose: 3000 });
    } catch (error) {
      toast.error("Error in late leave submission." + error, { autoClose: 3000 });
    }
  };

  const handleLateCancel = () => {
    setEmpID('');
    setEmpName('Employee Name');
    setStartDate('');
    setEndDate('');
    setShowLateDialog(false);
  };

  const handleAddCancel = () => {
    setShowAddDialog(false);
  };

  const openLateModal = () => {
    setShowLateDialog(true);
  };

  const openModal = () => {
    setShowAddDialog(true);
  };

  const calculateDays = (start, end, count) => {
    if (start && end) {
      const startDt = new Date(start);
      const endDt = new Date(end);
      const diffTime = Math.abs(endDt - startDt);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays + count;
    }
  };

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return leaveRequests.slice(firstPageIndex, lastPageIndex);
  }, [leaveRequests, currentPage]);


  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader style={{ display: 'flex' }}>Leave
              <div className="leave-status" style={{ position: 'absolute', right: '10px', top: '-3px' }}>
                {user?.userType == 1 && (
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
                        {/* <CFormInput
                          type="text"
                          placeholder="Employee Name"
                          id="EmpID"
                          name='EmpID'
                          onChange={handleNameChange}
                        /> */}

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
                        <CFormLabel id="inputGroupPrepend03">Leave Start Date</CFormLabel>
                        <CFormInput
                          type="date"
                          id="StartDate"
                          name='StartDate'
                          onChange={handlStartDateChange}
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
                          onChange={handlStartDateChange}
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
                          No Of Days
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
                        {user?.userType == 2 && (
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
                          <CTableHeaderCell scope="row">{request.id}</CTableHeaderCell>
                          <CTableDataCell className="text-nowrap">
                            <div>{request.EmpName}</div>
                            <div style={{ fontSize: 'small' }}>({request.EmpID})</div>
                          </CTableDataCell>
                          <CTableDataCell className="text-nowrap">{request.fromDate}</CTableDataCell>
                          <CTableDataCell className="text-nowrap">{request.toDate}</CTableDataCell>
                          <CTableDataCell>{request.Reason}</CTableDataCell>
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
                          <CTableDataCell>{request.RejectReason}</CTableDataCell>

                          {user?.userType == 2 && (
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
                                  </CTableDataCell>
                                </>
                              )}
                            </>
                          )}
                          {user?.userType == 2 && (
                            <>
                              {request.Status == 'Approved' && (
                                <CTableDataCell></CTableDataCell>
                              )}
                            </>
                          )}
                          {user?.userType == 2 && (
                            <>
                              {request.Status == 'Rejected' && (
                                <CTableDataCell></CTableDataCell>
                              )}
                            </>
                          )}
                          {user?.userType == 2 && (
                            <>
                              {request.Status == 'Pullback' && (
                                <CTableDataCell></CTableDataCell>
                              )}
                            </>
                          )}

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

                                    <CModal visible={showApproveDialog} onClose={() => setShowApproveDialog(false)}>
                                      <CModalHeader>
                                        <CModalTitle>Approve</CModalTitle>
                                      </CModalHeader>
                                      <CModalBody>
                                        <div className="confirmation-text">
                                          Do you want to approve the leave?
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

                                  </CTableDataCell>
                                </>
                              )}
                            </>
                          )}
                          {request.Status == 'Approved' && (
                            <>
                              {user?.userType == 1 && (
                                <CTableDataCell></CTableDataCell>
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
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default LeavePage
