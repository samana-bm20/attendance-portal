import React, { useState, useEffect, useMemo } from "react"
import { useSelector } from "react-redux";
import CIcon from '@coreui/icons-react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CFormCheck,
  CTooltip,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CTableDataCell,
  CFormSelect,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'

import {
  cilClock,
  cilTrash,
  cilCheckCircle,
  cibRiot,
  cilXCircle,
  cilUser,
  cilExternalLink,
  cilBan,
} from '@coreui/icons'
import Config from "../../../Config";
import './LeaveRequestPage.css'
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "./Pagination";
let PageSize = 10;

const Employee = () => {
  const user = useSelector((state) => state.user);
  const [checkStatusPending, setCheckStatusPending] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState('');
  const [dob, setDOB] = useState('');
  const [editDesignation, setEditDesignation] = useState('');
  const [editEmployeeName, setEditEmployeeName] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editDob, setEditDOB] = useState('');
  const [editEmpUid, setEditEmpUid] = useState('');
  const [editRole, setEditRole] = useState('');
  let toastId = null;

  const handleEditRoleChange = ((event) => {
    setEditRole(event.target.value);
  });

  const handlSEditEmployeeNameChange = ((event) => {
    setEditEmployeeName(event.target.value);
  });

  const handleEditStatusChange = ((event) => {
    setEditStatus(event.target.value);
  });

  const handlEditPasswordChange = ((event) => {
    setEditPassword(event.target.value);
  });

  const handleEditDesignationChange = ((event) => {
    setEditDesignation(event.target.value);
  });

  const handleEditDOBChange = ((event) => {
    setEditDOB(event.target.value);
  });

  const handlSEmployeeNameChange = ((event) => {
    setEmployeeName(event.target.value);
  });

  const handlSEmployeeIdChange = ((event) => {
    setEmployeeId(event.target.value);
  });

  const handlUserNameChange = ((event) => {
    setUserName(event.target.value);
  });

  const handlPasswordChange = ((event) => {
    setPassword(event.target.value);
  });

  const handleDesignationChange = ((event) => {
    setDesignation(event.target.value);
  });

  const handleDOBChange = ((event) => {
    setDOB(event.target.value);
  });

  const editDesignationUser = ((data) => {
    setEditEmpUid(data.uid);
    setEditEmployeeName(data.name);
    setEditStatus(data.isStatus);
    setEditPassword(data.password);
    setEditDesignation(data.designation);
    setEditDOB(data.birthday);
    setShowApproveDialog(!showApproveDialog);
  });




  const fetchLeaveRequests = async (page) => {
    try {
      const response = await axios.get(`${Config.apiUrl}/FetchEmployee`);
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
    fetchLeaveRequests(); // Pass currentPage to fetch the appropriate page
  }, [currentPage]);

  const changeRoleBase = async (data) => {
    setEditEmpUid(data.uid);
    setEditRole(data.userType);
    setShowRejectDialog(!showRejectDialog);
  }

  const handleRoleBase = async () => {

    try {
      let params = {
        "uid": editEmpUid,
        "userType": editRole,
      }
      const response = await axios.post(`${Config.apiUrl}/RoleChange`, params);
      console.log(response.data);
      setShowRejectDialog(false);
      fetchLeaveRequests();
      if (toastId) toast.dismiss(toastId);
      toastId = toast.success("Employee role changed successfully.", { autoClose: 3000 });
    } catch {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in changing employee role.", { autoClose: 3000 });
    }
  }


  const handleEdit = async () => {
    if (!editDesignation) {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.info("Please enter designation.", { autoClose: 3000 });
      return;
    }
    if (!editEmployeeName) {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.info("Please enter employee name.", { autoClose: 3000 });
      return;
    }
    if (!editStatus) {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.info("Please enter status.", { autoClose: 3000 });
      return;
    }
    if (!editPassword) {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.info("Please enter password.", { autoClose: 3000 });
      return;
    }
    if (!editDob) {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.info("Please enter dob.", { autoClose: 3000 });
      return;
    }
    try {
      const params = {
        "uid": editEmpUid,
        "name": editEmployeeName,
        "password": editPassword,
        "designation": editDesignation,
        "statusEmploy": editStatus,
        "birthday": editDob
      };

      const response = await axios.post(`${Config.apiUrl}/UpdateRegister`, params);
      console.log(response.data);

      if (response.data.status === 'NOK') {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.success(response.data.message, { autoClose: 3000 });
      }
      else {
        setShowApproveDialog(false);
        fetchLeaveRequests();
        if (toastId) toast.dismiss(toastId);
        toastId = toast.success(response.data.message, { autoClose: 3000 });
      }
    } catch {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in updating employee details", { autoClose: 3000 });

    }

  }

  const handleRejectCancel = () => {
    setShowRejectDialog(false);
  }


  const handleAdd = async () => {
    try {
      if (!employeeName) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Please enter employee name.", { autoClose: 3000 });
        return;
      }
      if (!employeeId) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Please enter employee id.", { autoClose: 3000 });
        return;
      }
      if (!userName) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Please enter userName.", { autoClose: 3000 });
        return;
      }

      if (!password) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Please enter password.", { autoClose: 3000 });
        return;
      }

      if (!designation) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Please enter designation.", { autoClose: 3000 });
        return;
      }

      if (!dob) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Please enter dob.", { autoClose: 3000 });
        return;
      }

      const params = {
        "name": employeeName,
        "empid": employeeId,
        "username": userName,
        "password": password,
        "designation": designation,
        "birthday": dob
      };
      const response = await axios.post(`${Config.apiUrl}/addRegister`, params);
      console.log(response.data);
      if (response.data.status === 'NOK') {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.success(response.data.message, { autoClose: 3000 });
      }
      else {
        setShowAddDialog(false);
        fetchLeaveRequests();
        setEmployeeName('');
        setEmployeeId('');
        setUserName('');
        setPassword('');
        setDesignation('');
        setDOB('');
        if (toastId) toast.dismiss(toastId);
        toastId = toast.success(response.data.message, { autoClose: 3000 });
      }

    } catch (error) {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in leave submission." + error, { autoClose: 3000 });
    }
  };

  const handleAddCancel = () => {
    setShowAddDialog(false);
  };

  const openModal = () => {
    setShowAddDialog(true);
  };

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return leaveRequests.slice(firstPageIndex, lastPageIndex);
  }, [leaveRequests, currentPage]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // January is 0!
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const customTooltipStyle = {
    '--cui-tooltip-bg': 'var(--cui-primary)',
  }


  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader style={{ display: 'flex' }}>Employee
              {user?.userType == 1 && (
                <>
                  <div className="leave-status" style={{ position: 'absolute', right: '10px', top: '-3px' }}>
                    <CTooltip
                      content="Add new employee"
                      trigger={['hover']}
                    >
                      <CButton
                        color="primary"
                        type="button"
                        className="reject-btn"
                        onClick={openModal}>
                        Add Employee
                      </CButton>
                    </CTooltip>
                  </div>
                  <CModal visible={showAddDialog} onClose={handleAddCancel}>
                    <CModalHeader>
                      <CModalTitle>Employee</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                      <CForm>
                        <CRow className="g-3">
                          <CCol xs>
                            <CFormLabel id="inputGroupPrepend03">Employee Name</CFormLabel>
                            <CFormInput
                              type="text"
                              placeholder="Employee Name"
                              id="EmpID"
                              name='EmpID'
                              onChange={handlSEmployeeNameChange}
                            />
                          </CCol>
                          <CCol xs style={{ marginBottom: '5px' }}>
                            <CFormLabel id="inputGroupPrepend03">Employee Id</CFormLabel>
                            <CFormInput
                              type="text"
                              id="EmpID"
                              name='EmpID'
                              placeholder="Employee Id"
                              onChange={handlSEmployeeIdChange}

                            />
                          </CCol>

                        </CRow>
                        <CRow className="g-3">
                          <CCol xs>
                            <CFormLabel id="inputGroupPrepend03">User Name</CFormLabel>
                            <CFormInput
                              type="text"
                              placeholder="User Name"
                              id="username"
                              name='username'
                              onChange={handlUserNameChange}
                            />
                          </CCol>
                          <CCol xs style={{ marginBottom: '5px' }}>
                            <CFormLabel id="inputGroupPrepend03">Password</CFormLabel>
                            <CFormInput
                              type="password"
                              id="password"
                              name='password'
                              placeholder="Password"
                              onChange={handlPasswordChange}
                            />
                          </CCol>

                        </CRow>
                        <CRow className="g-3">
                          <CCol xs style={{ marginBottom: '5px' }}>
                            <CFormLabel id="inputGroupPrepend03">Designation</CFormLabel>
                            <CFormSelect aria-label="Select Role" name="reason" onChange={handleDesignationChange}>
                              <option>Select Role</option>
                              <option value="Manager">Manager</option>
                              <option value="Programmer">Programmer</option>
                              <option value="Database Developer">Database Developer</option>
                              <option value="Business Development">Business Development</option>
                            </CFormSelect>
                          </CCol>
                          <CCol xs>
                            <CFormLabel id="inputGroupPrepend03">DOB</CFormLabel>
                            <CFormInput
                              type="date"
                              placeholder="DOB"
                              onChange={handleDOBChange}
                              min={startDate}
                              id="EndDate"
                              name='EndDate'
                            />
                          </CCol>
                        </CRow>
                      </CForm>
                    </CModalBody>
                    <CModalFooter>
                      <CButton color="secondary" onClick={handleAddCancel}>
                        No
                      </CButton>
                      <CButton color="primary" onClick={handleAdd}>Yes</CButton>
                    </CModalFooter>
                  </CModal>
                </>
              )}

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
                          Emp Id
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          Name
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          Designation
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          Username
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          DOB
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          User Type
                        </CTableHeaderCell>

                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          Status
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                          Action
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {currentTableData.map(request => (
                        <CTableRow key={request.SNo}>
                          <CTableDataCell className="text-nowrap">
                            <div>{request.SNo}</div>
                          </CTableDataCell>
                          <CTableDataCell className="text-nowrap">
                            <div>{request.empid}</div>
                          </CTableDataCell>
                          <CTableDataCell className="text-nowrap">
                            <div>{request.name}</div>
                          </CTableDataCell>
                          <CTableDataCell className="text-nowrap">
                            <div>{request.designation}</div>
                          </CTableDataCell>
                          <CTableDataCell className="text-nowrap">{request.username}</CTableDataCell>
                          <CTableDataCell className="text-nowrap">{request.birthday}</CTableDataCell>
                          {request.userType == 2 && (
                            <>
                              <CTableDataCell>
                                <div style={{
                                  backgroundColor: '#f7c63e',
                                  padding: '4px', textAlign: 'center'
                                }}>
                                  Employee
                                </div></CTableDataCell>
                            </>
                          )}
                          {request.userType == 1 && (
                            <>
                              <CTableDataCell>
                                <div style={{
                                  backgroundColor: '#39d465',
                                  padding: '4px', textAlign: 'center'
                                }}>
                                  Admin
                                </div></CTableDataCell>
                            </>
                          )}
                          {request.isStatus == 1 && (
                            <>
                              <CTableDataCell>
                                <div style={{
                                  backgroundColor: '#f7c63e',
                                  padding: '4px', textAlign: 'center'
                                }}>
                                  Active
                                </div></CTableDataCell>
                            </>
                          )}
                          {request.isStatus == 0 && (
                            <>
                              <CTableDataCell>
                                <div style={{
                                  backgroundColor: '#39d465',
                                  padding: '4px', textAlign: 'center'
                                }}>
                                  Inactive
                                </div></CTableDataCell>
                            </>
                          )}
                          <CTableDataCell >
                            <CRow style={{ position: 'relative', display: 'flex' }}>
                              <CCol>
                                <div className="leave-status">
                                  <CTooltip
                                    content="Edit employee"
                                    trigger={['hover']}
                                  >
                                    <CButton
                                      color="primary"
                                      className="approve-btn"
                                      onClick={() => {
                                        editDesignationUser(request);
                                      }}>
                                      <CIcon icon={cilExternalLink} />
                                    </CButton>
                                  </CTooltip>
                                </div>
                              </CCol>
                              <CCol>
                                <div className="leave-status">
                                  <CTooltip
                                    content="Change employee role"
                                    trigger={['hover']}
                                  >
                                    <CButton
                                      color="primary"
                                      type="button"
                                      className="reject-btn"
                                      onClick={() => {
                                        changeRoleBase(request);
                                      }}>
                                      <CIcon icon={cibRiot} />
                                    </CButton>
                                  </CTooltip>
                                </div>
                              </CCol>
                            </CRow>
                          </CTableDataCell>
                        </CTableRow>

                      ))}
                      <CModal visible={showApproveDialog} onClose={() => setShowApproveDialog(false)}>
                        <CModalHeader>
                          <CModalTitle>Employee</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                          <CForm>
                            <CRow className="g-3">
                              <CCol xs>
                                <CFormLabel id="inputGroupPrepend01">Employee Name</CFormLabel>
                                <CFormInput
                                  type="text"
                                  placeholder="Employee Name"
                                  id="inputGroupPrepend01"
                                  name='EmpID'
                                  defaultValue={editEmployeeName}
                                  onChange={handlSEditEmployeeNameChange}
                                />
                              </CCol>

                              <CCol xs style={{ marginBottom: '5px' }}>
                                <CFormLabel for="inputGroupPrepend02">Password</CFormLabel>
                                <CFormInput
                                  type="password"
                                  id="inputGroupPrepend02"
                                  name='password'
                                  placeholder="Password"
                                  onChange={handlEditPasswordChange}
                                  defaultValue={editPassword}

                                />
                              </CCol>
                            </CRow>
                            <CRow className="g-3">

                              <CCol xs style={{ marginBottom: '5px' }}>
                                <CFormLabel for="inputGroupPrepend03">Designation</CFormLabel>
                                <CFormSelect aria-label="Select Designation" id="inputGroupPrepend03" name="reason" onChange={handleEditDesignationChange} value={editDesignation}>
                                  <option>Select Designation</option>
                                  <option value="Manager">Manager</option>
                                  <option value="Programmer">Programmer</option>
                                  <option value="Database Developer">Database Developer</option>
                                  <option value="Business Development">Business Development</option>
                                  </CFormSelect>
                              </CCol>

                              <CCol xs>
                                <CFormLabel for="inputGroupPrepend04">DOB</CFormLabel>
                                <CFormInput
                                  type="date"
                                  placeholder="DOB"
                                  onChange={handleEditDOBChange}
                                  id="inputGroupPrepend04"
                                  name='EndDate'
                                  value={formatDate(editDob)}

                                />
                              </CCol>
                            </CRow>
                            <CRow className="g-3">
                              <CCol xs style={{ marginBottom: '5px' }}>
                                <CFormLabel id="inputGroupPrepend05">Status</CFormLabel>
                                <CFormSelect aria-label="Select Status" name="reason" onChange={handleEditStatusChange} value={editStatus}>
                                  <option>Select Status</option>
                                  <option value="1">Active</option>
                                  <option value="0">Inactive</option>
                                </CFormSelect>
                              </CCol>
                            </CRow>
                          </CForm>
                        </CModalBody>
                        <CModalFooter>
                          <CButton color="secondary" onClick={() => setShowApproveDialog(false)}>
                            No
                          </CButton>
                          <CButton color="primary" onClick={handleEdit}>Yes</CButton>
                        </CModalFooter>
                      </CModal>
                      <CModal visible={showRejectDialog} onClose={() => handleRejectCancel}>
                        <CModalHeader>
                          <CModalTitle>Role</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                          <CForm>
                            <div className="mb-3">
                              <CFormLabel htmlFor="exampleFormControlTextarea1">Role Change</CFormLabel>
                              <CFormSelect aria-label="Select Role" name="reason" onChange={handleEditRoleChange} value={editRole}>
                                <option>Select Role</option>
                                <option value="1">Admin</option>
                                <option value="2">Employee</option>
                              </CFormSelect>
                            </div>
                          </CForm>
                        </CModalBody>
                        <CModalFooter>
                          <CButton color="secondary" onClick={() => setShowRejectDialog(false)}>
                            No
                          </CButton>
                          <CButton color="primary" onClick={handleRoleBase}>Yes</CButton>
                        </CModalFooter>
                      </CModal>
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

export default Employee
