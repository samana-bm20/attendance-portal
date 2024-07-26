import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from "react-redux";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol,
    CButton,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CForm,
    CFormInput,
    CFormLabel,
    CFormSelect,
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

const DependencyForm = ({ personalDetails, onTriggerChange }) => {
    const user = useSelector((state) => state.user);
    const [empid, setEmpid] = useState('');
    const [dependencyData, setDependencyData] = useState([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [dependencyRelation, setDependencyRelation] = useState('Select Relation');
    const [dependencyName, setDependencyName] = useState('');
    const [dependencyContact, setDependencyContact] = useState('');
    const [dependencyDOB, setDependencyDOB] = useState('');
    const [isSameUser, setIsSameUser] = useState(true);
    let toastId = null;

    //#region Fetch
    const fetchPersonalDetails = () => {
        try {
            if (personalDetails.length > 0) {
                setEmpid(personalDetails[0].empid);
                setDependencyData(personalDetails[0].Dependency ? JSON.parse(personalDetails[0].Dependency) : []);
                if (personalDetails[0].empid == user?.empid) {
                    setIsSameUser(true)
                } else {
                    setIsSameUser(false)
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchPersonalDetails();
    }, [personalDetails])
    //#end region 

    //#region Add
    const handleAddCancel = () => {
        setShowAddDialog(false);
        setDependencyRelation('Select Relation');
        setDependencyName('');
        setDependencyContact('');
        setDependencyDOB('');
    }

    const handleDependencyRelationChange = (event) => {
        setDependencyRelation(event.target.value);
    }

    const handleDependencyNameChange = (event) => {
        setDependencyName(event.target.value);
    }

    const handleDependencyContactChange = (event) => {
        setDependencyContact(event.target.value);
    }

    const handleDependencyDOBChange = (event) => {
        setDependencyDOB(event.target.value);
    }

    const handleAddDependency = async () => {
        if (dependencyRelation == 'Select Relation') {
            if (toastId) toast.dismiss(toastId);
            Id = toastId = toast.info("Invalid relation.", { autoClose: 3000 });
            return;
        }
        if (!dependencyName || !dependencyContact || !dependencyDOB) {
            if (toastId) toast.dismiss(toastId);
            Id = toastId = toast.info("Please enter complete details.", { autoClose: 3000 });
            return;
        }
        try {
            let newDependency;
            if (dependencyData == '') {
                newDependency = [
                    [{
                        relation: dependencyRelation,
                        name: dependencyName,
                        contact: dependencyContact,
                        dob: dependencyDOB
                    }]
                ]
            } else {
                newDependency = [...dependencyData,
                [{
                    relation: dependencyRelation,
                    name: dependencyName,
                    contact: dependencyContact,
                    dob: dependencyDOB
                }]
                ]
            }
            const params = {
                'empid': empid,
                'Dependency': newDependency
            }
            debugger
            // setDependencyData(newDependency)
            const _ = await axios.put(`${Config.apiUrl}/updateDependency`, params);
            if (toastId) toast.dismiss(toastId);
            toastId = toast.success("Dependency added successfully.", { autoClose: 3000 });
            setShowAddDialog(false);
            setDependencyRelation('Select Relation');
            setDependencyName('');
            setDependencyContact('');
            setDependencyDOB('');
            onTriggerChange();
        } catch (error) {
            console.error(error);
            if (toastId) toast.dismiss(toastId);
            toastId = toast.error("Error in adding dependency." + error, { autoClose: 3000 });
        }

    }
    //#end region

    //#region Remove
    const handleRemoveDependency = async (index) => {
        try {
            const newDependency = dependencyData.filter((_, key) => key !== index)
            const params = {
                'empid': empid,
                'Dependency': newDependency
            }
            const _ = await axios.put(`${Config.apiUrl}/updateDependency`, params);
            if (toastId) toast.dismiss(toastId);
            toastId = toast.success("Dependency removed successfully.", { autoClose: 3000 });
            onTriggerChange();
        } catch (error) {
            console.error(error)
        }
    }
    //#end region

    return (
        <CCard className="mb-4">
            <CCardHeader style={{ fontWeight: 'bold' }}>
                <CRow>
                    <CCol>Dependency</CCol>
                    {isSameUser && (
                        <CCol style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                            <CTooltip content="Add dependency" trigger={['hover']}>
                                <CButton color="success" onClick={() => setShowAddDialog(true)}>
                                    <CIcon icon={cilUserPlus} style={{ marginRight: '5px' }} />
                                    Add
                                </CButton>
                            </CTooltip>
                        </CCol>
                    )}
                </CRow>
                <CModal visible={showAddDialog} onClose={handleAddCancel}>
                    <CModalHeader>
                        <CModalTitle>Add Dependency</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CForm>
                            <CRow className="g-3 mb-2">
                                <CCol xs style={{ marginBottom: '5px' }}>
                                    <CFormLabel>Employee ID</CFormLabel>
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
                                    <CFormLabel>Employee Name</CFormLabel>
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
                            <CRow className="g-3 mb-2">
                                <CCol xs style={{ marginBottom: '5px' }}>
                                    <CFormLabel>Relation</CFormLabel>
                                    <CFormSelect
                                        aria-label="Select Relation"
                                        name="relation"
                                        value={dependencyRelation}
                                        style={{
                                            cursor: 'pointer', overflowY: 'scroll',
                                            maxHeight: '100px'
                                        }}
                                        onChange={handleDependencyRelationChange}
                                    >
                                        <option>Select Relation</option>
                                        <option value="Father">Father</option>
                                        <option value="Mother">Mother</option>
                                        <option value="Husband">Husband</option>
                                        <option value="Wife">Wife</option>
                                        <option value="Son">Son</option>
                                        <option value="Daughter">Daughter</option>
                                        <option value="Gaurdian">Gaurdian</option>
                                    </CFormSelect>
                                </CCol>
                                <CCol xs>
                                    <CFormLabel>Name</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        placeholder="Dependency Name"
                                        onChange={handleDependencyNameChange}
                                        value={dependencyName}
                                        id="name"
                                        name='name'
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="g-3 mb-2">
                                <CCol xs style={{ marginBottom: '5px' }}>
                                    <CFormLabel>Contact</CFormLabel>
                                    <CFormInput
                                        type="tel"
                                        placeholder="Dependency Contact"
                                        onChange={handleDependencyContactChange}
                                        value={dependencyContact}
                                        id="contact"
                                        name='contact'
                                    />
                                </CCol>
                                <CCol xs>
                                    <CFormLabel>Date Of Birth</CFormLabel>
                                    <CFormInput
                                        type="date"
                                        placeholder="Dependency BirthDate"
                                        onChange={handleDependencyDOBChange}
                                        value={dependencyDOB}
                                        id="birthdate"
                                        name='birthdate'
                                    />
                                </CCol>
                            </CRow>
                        </CForm>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={handleAddCancel}>
                            Cancel
                        </CButton>
                        <CButton color="primary" onClick={handleAddDependency}>Submit</CButton>
                    </CModalFooter>
                </CModal>
            </CCardHeader>
            <CCardBody style={{ textAlign: 'center' }}>
                <CTable style={{ overflowX: 'auto', textAlign: 'center' }} align="middle" className="mb-2" hover responsive bordered>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                                S.No.
                            </CTableHeaderCell>
                            <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                                Name
                            </CTableHeaderCell>
                            <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                                Relation
                            </CTableHeaderCell>
                            <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                                Contact
                            </CTableHeaderCell>
                            <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                                DOB
                            </CTableHeaderCell>
                            {isSameUser && (
                                <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                                    Delete
                                </CTableHeaderCell>
                            )}
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {dependencyData.map((record, index) => (
                            <CTableRow key={index}>
                                <CTableDataCell>{index + 1}.</CTableDataCell>
                                <CTableDataCell>{record[0].name}</CTableDataCell>
                                <CTableDataCell>{record[0].relation}</CTableDataCell>
                                <CTableDataCell>{record[0].contact}</CTableDataCell>
                                <CTableDataCell>{record[0].dob}</CTableDataCell>
                                {/* <CTableDataCell>
                                    {isSameUser && (
                                        <>
                                            {isDependencyEdit ? (
                                                <CTooltip content="Save Dependency" trigger={['hover']}>
                                                    <CIcon
                                                        icon={cilCheckCircle}
                                                        style={{ color: 'green', marginRight: '5px', marginLeft: '5px', cursor: 'pointer' }}
                                                        onClick={() => turnOffDependencyEdit(index)}
                                                    />
                                                </CTooltip>
                                            ) : (
                                                <CTooltip content="Edit Dependency" trigger={['hover']}>
                                                    <CIcon
                                                        icon={cilPencil}
                                                        style={{ color: 'blue', marginRight: '5px', marginLeft: '5px', cursor: 'pointer' }}
                                                        onClick={() => turnOnDependencyEdit(index)}
                                                    />
                                                </CTooltip>
                                            )}
                                        </>
                                    )}
                                </CTableDataCell> */}
                                {isSameUser && (
                                    <CTableDataCell>
                                        <CTooltip content="Remove Dependency" trigger={['hover']}>
                                            <CIcon
                                                icon={cilTrash}
                                                style={{ color: 'red', cursor: 'pointer' }}
                                                onClick={() => handleRemoveDependency(index)}
                                            />
                                        </CTooltip>
                                    </CTableDataCell>
                                )}
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </CCardBody>
        </CCard>
    )
}

export default DependencyForm