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

import { cibRiot, cilExternalLink } from '@coreui/icons'
import Config from "../../../Config";
import './Employee.css'
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "./Pagination";
let PageSize = 10;

const Employee = () => {
  const user = useSelector((state) => state.user);
  const [employeeData, setEmployeeData] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showRoleChangeDialog, setShowRoleChangeDialog] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState('');
  const [dob, setDOB] = useState('');
  const [doj, setDOJ] = useState('');
  const [paidLeave, setPaidLeave] = useState(0);

  const [editDesignation, setEditDesignation] = useState('');
  const [editUserName, setEditUserName] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editDob, setEditDOB] = useState('');
  const [editEmpUid, setEditEmpUid] = useState('');
  const [editPaidLeave, setEditPaidLeave] = useState(0);
  const [editRole, setEditRole] = useState('');
  let toastId = null;

  //#region Fetch Emp Data
  const fetchEmployeeData = async (page) => {
    try {
      const response = await axios.get(`${Config.apiUrl}/FetchEmployee`);
      setEmployeeData(response.data.data);
    } catch (error) {
      console.error("error fetching pending requests");
    }
  };

  useEffect(() => {
    fetchEmployeeData(); 
  }, [currentPage]);
  
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    const filteredData = employeeData.filter(record => record.empid != 'ML35')
    return filteredData.slice(firstPageIndex, lastPageIndex);
  }, [employeeData, currentPage]);
//#endregion

//#region Add New Emp
  const handleEmployeeNameChange = ((event) => {
    setEmployeeName(event.target.value);
  });

  const handleEmployeeIdChange = ((event) => {
    setEmployeeId(event.target.value);
  });

  const handleUserNameChange = ((event) => {
    setUserName(event.target.value);
  });

  const handlePasswordChange = ((event) => {
    setPassword(event.target.value);
  });

  const handleDesignationChange = ((event) => {
    setDesignation(event.target.value);
  });

  const handleDOBChange = ((event) => {
    setDOB(event.target.value);
  });

  const handleDOJChange = ((event) => {
    setDOJ(event.target.value);
  });
  
  const handlePaidLeaveChange = ((event) => {
    setPaidLeave(event.target.value);
  });

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
      
      if (!doj) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Please enter doj.", { autoClose: 3000 });
        return;
      }
      
      if (!paidLeave) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Please enter paid leaves.", { autoClose: 3000 });
        return;
      }
debugger
      const params = {
        "name": employeeName,
        "empid": employeeId,
        "username": userName,
        "password": password,
        "designation": designation,
        "birthday": dob,
        "paidLeave": paidLeave,
        "joiningDate": doj
      };
      const response = await axios.post(`${Config.apiUrl}/addRegister`, params);
      console.log(response.data);
      if (response.data.status === 'NOK') {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.success(response.data.message, { autoClose: 3000 });
      }
      else {
        setShowAddDialog(false);
        fetchEmployeeData();
        setEmployeeName('');
        setEmployeeId('');
        setUserName('');
        setPassword('');
        setDesignation('');
        setDOB('');
        setPaidLeave('');
        if (toastId) toast.dismiss(toastId);
        toastId = toast.success(response.data.message, { autoClose: 3000 });
      }

    } catch (error) {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in adding new employee." + error, { autoClose: 3000 });
    }
  };

  const handleAddCancel = () => {
    setShowAddDialog(false);
  };

  const openModal = () => {
    setShowAddDialog(true);
  };
//#endregion

//#region Edit Emp
  const handleEditUserNameChange = ((event) => {
    setEditUserName(event.target.value);
  });

  const handleEditStatusChange = ((event) => {
    setEditStatus(event.target.value);
  });

  const handleEditPasswordChange = ((event) => {
    setEditPassword(event.target.value);
  });

  const handleEditDesignationChange = ((event) => {
    setEditDesignation(event.target.value);
  });

  const handleEditDOBChange = ((event) => {
    setEditDOB(event.target.value);
  });
  
  const handleEditPaidLeaveChange = ((event) => {
    setEditPaidLeave(event.target.value);
  });

  const editUserDetails = ((data) => {
    setEditEmpUid(data.uid);
    setEditUserName(data.username);
    setEditStatus(data.isStatus);
    setEditPassword(data.password);
    setEditDesignation(data.designation);
    setEditDOB(data.birthday);
    setEditPaidLeave(data.PaidLeave);
    setShowEditDialog(!showEditDialog);
  });

  const handleEdit = async () => {
    if (!editDesignation) {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.info("Please enter designation.", { autoClose: 3000 });
      return;
    }
    if (!editUserName) {
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
    if (!editPaidLeave) {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.info("Please enter paid leave.", { autoClose: 3000 });
      return;
    }
    try {
      const params = {
        "uid": editEmpUid,
        "username": editUserName,
        "password": editPassword,
        "designation": editDesignation,
        "statusEmploy": editStatus,
        "birthday": editDob,
        "paidLeave": editPaidLeave
      };

      const response = await axios.post(`${Config.apiUrl}/UpdateRegister`, params);
      console.log(response.data);

      if (response.data.status === 'NOK') {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.success(response.data.message, { autoClose: 3000 });
      }
      else {
        setShowEditDialog(false);
        fetchEmployeeData();
        if (toastId) toast.dismiss(toastId);
        toastId = toast.success(response.data.message, { autoClose: 3000 });
      }
    } catch {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in updating employee details", { autoClose: 3000 });

    }

  }

//#endregion

//#region Edit Role
const handleEditRoleChange = ((event) => {
  setEditRole(event.target.value);
});

const changeRoleBase = async (data) => {
    setEditEmpUid(data.uid);
    setEditRole(data.userType);
    setShowRoleChangeDialog(!showRoleChangeDialog);
  }

  const handleRoleBase = async () => {

    try {
      let params = {
        "uid": editEmpUid,
        "userType": editRole,
      }
      const response = await axios.post(`${Config.apiUrl}/RoleChange`, params);
      console.log(response.data);
      setShowRoleChangeDialog(false);
      fetchEmployeeData();
      if (toastId) toast.dismiss(toastId);
      toastId = toast.success("Employee role changed successfully.", { autoClose: 3000 });
    } catch {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in changing employee role.", { autoClose: 3000 });
    }
  }

  const handleRoleChangeCancel = () => {
    setShowRoleChangeDialog(false);
  }
//#endregion

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
                              onChange={handleEmployeeNameChange}
                            />
                          </CCol>
                          <CCol xs style={{ marginBottom: '5px' }}>
                            <CFormLabel id="inputGroupPrepend03">Employee Id</CFormLabel>
                            <CFormInput
                              type="text"
                              id="EmpID"
                              name='EmpID'
                              placeholder="Employee Id"
                              onChange={handleEmployeeIdChange}

                            />
                          </CCol>

                        </CRow>
                        <CRow className="g-3">
                          <CCol xs>
                            <CFormLabel id="inputGroupPrepend03">Username</CFormLabel>
                            <CFormInput
                              type="text"
                              placeholder="Username"
                              value={userName}
                              id="username"
                              name='username'
                              onChange={handleUserNameChange}
                            />
                          </CCol>
                          <CCol xs style={{ marginBottom: '5px' }}>
                            <CFormLabel id="inputGroupPrepend03">Password</CFormLabel>
                            <CFormInput
                              type="password"
                              id="password"
                              name='password'
                              placeholder="Password"
                              value={password}
                              onChange={handlePasswordChange}
                            />
                          </CCol>

                        </CRow>
                        <CRow className="g-3">
                          <CCol xs style={{ marginBottom: '5px' }}>
                            <CFormLabel id="inputGroupPrepend03">Designation</CFormLabel>
                            <CFormSelect aria-label="Select Role" name="reason" onChange={handleDesignationChange}>
                              <option>Select Designation</option>
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
                              value={dob}
                              id="dob"
                              name='dob'
                            />
                          </CCol>
                        </CRow>
                        <CRow className="g-3">
                          <CCol xs>
                            <CFormLabel id="inputGroupPrepend03">Paid Leave</CFormLabel>
                            <CFormInput
                              type="text"
                              placeholder="Paid Leave"
                              id="paid-leave"
                              name='paid-leave'
                              onChange={handlePaidLeaveChange}
                            />
                          </CCol>
                          <CCol xs>
                            <CFormLabel id="inputGroupPrepend03">DOJ</CFormLabel>
                            <CFormInput
                              type="date"
                              placeholder="DOJ"
                              onChange={handleDOJChange}
                              value={doj}
                              id="doj"
                              name='doj'
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
                          Paid Leaves
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
                          <CTableDataCell className="text-nowrap">{request.SNo}</CTableDataCell>
                          <CTableDataCell className="text-nowrap">{request.empid}</CTableDataCell>
                          <CTableDataCell className="text-nowrap">{request.name}</CTableDataCell>
                          <CTableDataCell className="text-nowrap">{request.designation}</CTableDataCell>
                          <CTableDataCell className="text-nowrap">{request.username}</CTableDataCell>
                          <CTableDataCell className="text-nowrap">{request.PaidLeave}</CTableDataCell>
                          <CTableDataCell className="text-nowrap">{request.birthday}</CTableDataCell>
                          {request.userType == 3 && (
                            <>
                              <CTableDataCell>
                                <div style={{
                                  backgroundColor: '#008CFF',
                                  padding: '4px', textAlign: 'center'
                                }}>
                                  SubAdmin
                                </div></CTableDataCell>
                            </>
                          )}
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
                                        editUserDetails(request);
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
                      <CModal visible={showEditDialog} onClose={() => setShowEditDialog(false)}>
                        <CModalHeader>
                          <CModalTitle>Employee</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                          <CForm>
                            <CRow className="g-3">
                              <CCol xs>
                                <CFormLabel id="inputGroupPrepend01">Username</CFormLabel>
                                <CFormInput
                                  type="text"
                                  placeholder="Username"
                                  id="inputGroupPrepend01"
                                  name='username'
                                  defaultValue={editUserName}
                                  onChange={handleEditUserNameChange}
                                />
                              </CCol>

                              <CCol xs style={{ marginBottom: '5px' }}>
                                <CFormLabel htmlFor="inputGroupPrepend02">Password</CFormLabel>
                                <CFormInput
                                  type="password"
                                  id="inputGroupPrepend02"
                                  name='password'
                                  placeholder="Password"
                                  onChange={handleEditPasswordChange}
                                  defaultValue={editPassword}

                                />
                              </CCol>
                            </CRow>
                            <CRow className="g-3">

                              <CCol xs style={{ marginBottom: '5px' }}>
                                <CFormLabel htmlFor="inputGroupPrepend03">Designation</CFormLabel>
                                <CFormSelect aria-label="Select Designation" id="inputGroupPrepend03" name="reason" onChange={handleEditDesignationChange} value={editDesignation}>
                                  <option>Select Designation</option>
                                  <option value="Manager">Manager</option>
                                  <option value="Programmer">Programmer</option>
                                  <option value="Database Developer">Database Developer</option>
                                  <option value="Business Development">Business Development</option>
                                </CFormSelect>
                              </CCol>

                              <CCol xs>
                                <CFormLabel htmlFor="inputGroupPrepend04">DOB</CFormLabel>
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

                              <CCol xs>
                                <CFormLabel id="inputGroupPrepend01">Paid Leave</CFormLabel>
                                <CFormInput
                                  type="text"
                                  placeholder="Paid Leave"
                                  id="paid-leave"
                                  name='paid-leave'
                                  defaultValue={editPaidLeave}
                                  onChange={handleEditPaidLeaveChange}
                                />
                              </CCol>
                            </CRow>
                          </CForm>
                        </CModalBody>
                        <CModalFooter>
                          <CButton color="secondary" onClick={() => setShowEditDialog(false)}>
                            No
                          </CButton>
                          <CButton color="primary" onClick={handleEdit}>Yes</CButton>
                        </CModalFooter>
                      </CModal>
                      <CModal visible={showRoleChangeDialog} onClose={() => handleRoleChangeCancel}>
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
                                <option value="3">Sub-Admin</option>
                                <option value="2">Employee</option>
                              </CFormSelect>
                            </div>
                          </CForm>
                        </CModalBody>
                        <CModalFooter>
                          <CButton color="secondary" onClick={() => setShowRoleChangeDialog(false)}>
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
                    totalCount={employeeData.length}
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
