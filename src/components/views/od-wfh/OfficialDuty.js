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
import './OfficialDuty.css'
import axios from "axios";
import { toast } from "react-toastify";
import CIcon from "@coreui/icons-react";
import Pagination from "./Pagination";
import UserContext from '../../../context/UserContext';
let PageSize = 10;

const OfficialDuty = () => {
  const user = useSelector((state) => state.user);
  const { employeeNames } = useContext(UserContext);
  const [checkStatusPending, setCheckStatusPending] = useState('');
  const [officialDuty, setOfficialDuty] = useState([]);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [approveReason, setApproveReason] = useState('Approved');
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [radioChecked, setRadioChecked] = useState(false);
  const [firstHalfChecked, setFirstHalfChecked] = useState(false);
  const [secondHalfChecked, setSecondHalfChecked] = useState(false);
  const [empIdName, setEmpIdName] = useState('All Employees');
  const [employeeID, setEmployeeID] = useState('');
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPullback, setShowPullback] = useState(false);
  let toastId = null;

  const fetchOfficialDutyRequests = async (page) => {
    try {
      if ((user?.userType == 1 && empIdName == 'All Employees') || user?.userType == 2) {
        const response = await axios.get(`${Config.apiUrl}/pendingOfficialDuty`, {
          params: {
            userType: user?.userType,
            empid: user?.empid
          }
        });
        setOfficialDuty(response.data.data);
        const hasPendingRequest = response.data.data.some(request => request.Status === 'Pending');
        if (hasPendingRequest) {
          setCheckStatusPending('Pending');
        } else {
          setCheckStatusPending('');
        }
      } else {
        const response = await axios.get(`${Config.apiUrl}/eachEmpOfficialDuty?empid=${employeeID}`);
        setOfficialDuty(response.data.data);
      }
    } catch (error) {
      console.error("error fetching pending requests");
    }
  };

  useEffect(() => {
    fetchOfficialDutyRequests(currentPage);
  }, [currentPage, empIdName, employeeID]);

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

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return officialDuty.slice(firstPageIndex, lastPageIndex);
  }, [officialDuty, currentPage]);


  //#region Add WFH OR OD 

  const openModal = () => {
    setShowAddDialog(true);
  };

  const handleStartDateChange = ((event) => {
    setStartDate(event.target.value);
  });

  const handleEndDateChange = ((event) => {
    setEndDate(event.target.value);
  });

  const handleModeChange = (event) => {
    setRadioChecked(event.target.id);
  };

  const handleFirstHalfChange = (event) => {
    setFirstHalfChecked(event.target.checked);
  };

  const handleSecondHalfChange = (event) => {
    setSecondHalfChecked(event.target.checked);
  };

  const handleReasonChange = ((event) => {
    setReason(event.target.value);
  });

  const handleAdd = async () => {
    try {
      if (!startDate) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Please enter start date.", { autoClose: 3000 });
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
      if (!radioChecked) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Please select mode.", { autoClose: 3000 });
        return;
      }

      const params = {
        "EmpID": user?.empid,
        "empName": user?.name,
        "fromDate": startDate,
        "toDate": endDate,
        "reason": reason,
        "firstHalf": firstHalfChecked,
        "secondHalf": secondHalfChecked,
        "Mode": radioChecked,
        "status": 'Pending',
        "remark": 'N/A',
      };

      const response = await axios.post(`${Config.apiUrl}/addOfficialDuty`, params);
      console.log(response.data);
      setShowAddDialog(false);

      fetchOfficialDutyRequests();
      setReason('');
      setStartDate('');
      setEndDate('');
      setFirstHalfChecked(false);
      setSecondHalfChecked(false);
      setRadioChecked(false);
      if (toastId) toast.dismiss(toastId);
      toastId = toast.success("Official Duty request submitted successfully.", { autoClose: 3000 });
    } catch (error) {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in Official Duty submission." + error, { autoClose: 3000 });
    }
  };

  const handleAddCancel = () => {
    setShowAddDialog(false);
    setFirstHalfChecked(false);
    setRadioChecked(false);
    setSecondHalfChecked(false);
  };

  //#endregion

  //#region Approve OD/WFH

  const handleApproveReasonChange = ((event) => {
    setApproveReason(event.target.value);
  });

  const handleApprove = async () => {
    try {
      let params = {
        "EmpID": user?.empid,
        "Id": selectedRequest.id,
        "Reason": approveReason,
      }
      const response = await axios.put(`${Config.apiUrl}/updateApproveForOD`, params);
      console.log(response.data);
      if (selectedRequest.Mode == 'work-from-home') {
        let params = {
          "Id": selectedRequest.id,
        }
        const record = await axios.post(`${Config.apiUrl}/insertWFHLogin`, params)
        console.log(record.data);
      } else if (selectedRequest.Mode == 'official-duty') {
        let params = {
          "Id": selectedRequest.id,
        }
        const record = await axios.post(`${Config.apiUrl}/insertODLogin`, params)
        console.log(record.data);
      }
      setShowApproveDialog(false);
      fetchOfficialDutyRequests();
      if (toastId) toast.dismiss(toastId);
      toastId = toast.success("Request approved successfully.", { autoClose: 3000 });
    } catch {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in approving request.", { autoClose: 3000 });
    }
  }

  const handleApproveCancel = (() => {
    setShowApproveDialog(false);
    setApproveReason('Approved');
  });

  //#endregion

  //#region Reject OD/WFH

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
        "rejectReason": rejectReason
      }
      const response = await axios.put(`${Config.apiUrl}/reject`, params);
      console.log(response.data);
      setShowRejectDialog(false);
      fetchOfficialDutyRequests();
      setRejectReason('');
      if (toastId) toast.dismiss(toastId);
      toastId = toast.success("Request rejected successfully.", { autoClose: 3000 });
    } catch {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in rejecting request.", { autoClose: 3000 });

    }
  }

  const handleRejectCancel = () => {
    setShowRejectDialog(false);
    setRejectReason('');
  }
  //#endregion

  //#region Delete OD/WFH

  const handleCancelReasonChange = ((event) => {
    setRejectReason(event.target.value);
  });

  const handleCancel = async () => {
    if (!rejectReason) {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.info("Please enter reason for deleting the request.", { autoClose: 3000 });
      return;
    }
    try {
      let params = {
        "rejectedCancel": 'Pullback',
        "Id": selectedRequest.id,
        "rejectReason": rejectReason
      }
      const response = await axios.put(`${Config.apiUrl}/updatePullbackForOD`, params);
      console.log(response.data);
      handleModalCancel(false);
      fetchOfficialDutyRequests();
      setRejectReason('');
      if (toastId) toast.dismiss(toastId);
      toastId = toast.success("OD/WFH request deleted successfully.", { autoClose: 3000 });
    } catch {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in deleting the request.", { autoClose: 3000 });

    }
  }

  const handleModalCancel = () => {
    setShowPullback(false);
    setRejectReason('');
  }
  //#endregion
  return (
    <>
      <CRow  xs={{ gutter: 3 }}>
        <CCol>
          <CCard style={{ marginBottom: '10px' }}>
            <CCardHeader>
              <CRow>
                <CCol xs={12} sm={6} md={6} xl={6}>
                  Official Duty
                  {user?.userType == 1 && (
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
                  )}
                </CCol>
                <CCol xs={12} sm={6} md={6} xl={6}
                style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                  <div className="leave-status">
                    <CTooltip
                      content="Apply for OD/WFH"
                      trigger={['hover']}
                    >
                      <CButton
                        color="primary"
                        type="button"
                        className="reject-btn mb-2 mx-2"
                        onClick={openModal}>
                        OD / WFH
                      </CButton>
                    </CTooltip>
                  </div>
                </CCol>
              </CRow>
              <CModal visible={showAddDialog} onClose={handleAddCancel}>
                <CModalHeader>
                  <CModalTitle>Mark Official Duty / Work From Home</CModalTitle>
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
                      <CCol xs>
                        <CFormCheck
                          type="radio"
                          name="options"
                          id="official-duty"
                          label="Official Duty"
                          checked={radioChecked === 'official-duty'}
                          onChange={handleModeChange}
                        />
                      </CCol>
                      <CCol xs style={{ marginBottom: '5px' }}>
                        <CFormCheck
                          type="radio"
                          name="options"
                          id="work-from-home"
                          label="Work From Home"
                          checked={radioChecked === 'work-from-home'}
                          onChange={handleModeChange}
                        />
                      </CCol>
                    </CRow>
                    <CRow className="g-3">
                      <CCol xs style={{ marginBottom: '5px' }}>
                        <CFormLabel id="inputGroupPrepend03">Start Date</CFormLabel>
                        <CFormInput
                          type="date"
                          id="StartDate"
                          name='StartDate'
                          onChange={handleStartDateChange}
                          placeholder="Start Date"

                        />
                      </CCol>
                      <CCol xs>
                        <CFormLabel id="inputGroupPrepend03">End Date</CFormLabel>
                        <CFormInput
                          type="date"
                          placeholder="End Date"
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
                          label="Evening"
                          checked={secondHalfChecked}
                          onChange={handleSecondHalfChange}
                        />
                      </CCol>
                      <CCol xs style={{ marginBottom: '5px' }}>
                        <CFormCheck
                          inline
                          id="inlineCheckbox1"
                          value="Yes"
                          label="Morning"
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
                          Mode
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          Morning
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          Evening
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          Reason
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          Status
                        </CTableHeaderCell>
                        {user?.userType == 1 && (
                          <>
                            <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                              Action
                            </CTableHeaderCell>
                          </>
                        )}
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          Remarks
                        </CTableHeaderCell>
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
                          <CTableHeaderCell scope="row">{request.SNo}</CTableHeaderCell>
                          <CTableDataCell className="text-nowrap">
                            <div>{request.EmpName}</div>
                            <div style={{ fontSize: 'small' }}>({request.EmpID})</div>
                          </CTableDataCell>
                          <CTableDataCell className="text-nowrap">{request.fromDate}</CTableDataCell>
                          <CTableDataCell className="text-nowrap">{request.toDate}</CTableDataCell>
                          <CTableDataCell>{request.Mode}</CTableDataCell>

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
                          <CTableDataCell>{request.Reason}</CTableDataCell>
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

                                    <CModal visible={showApproveDialog} onClose={() => handleApproveCancel}>
                                      <CModalHeader>
                                        <CModalTitle>Approve</CModalTitle>
                                      </CModalHeader>
                                      <CModalBody>
                                        <div className="mb-3">
                                          <CFormLabel htmlFor="exampleFormControlTextarea1">
                                            Do you want to approve the OD/WFH?                                              </CFormLabel>
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
                                              Do you want to delete the request?                                              </CFormLabel>
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
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                  <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={officialDuty.length}
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

export default OfficialDuty
