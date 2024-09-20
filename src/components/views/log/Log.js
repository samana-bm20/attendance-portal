import React, { useState, useEffect, useMemo } from "react"
import { useSelector } from "react-redux";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
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
} from '@coreui/react'
import CIcon from "@coreui/icons-react";
import {
    cilPencil,
} from '@coreui/icons'
import Config from "../../../Config";
import './Log.css'
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "./Pagination";
let PageSize = 10;

const Log = () => {
    const user = useSelector((state) => state.user);
    const [log, setLog] = useState([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [logDate, setLogDate] = useState('');
    const [description, setDescription] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLog, setSelectedLog] = useState(null);
    const [editDate, setEditDate] = useState(null);
    const [editDescription, setEditDescription] = useState(null);
    const [showEditLog, setShowEditLog] = useState(false);
    let toastId = null;

    const fetchIssueRecords = async (page) => {
        try {
            const response = await axios.get(`${Config.apiUrl}/fetchLog`);
            setLog(response.data.data);
        } catch (error) {
            console.error("error fetching log records");
        }
    };

    useEffect(() => {
        fetchIssueRecords(currentPage);
    }, [currentPage]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return log.slice(firstPageIndex, lastPageIndex);
    }, [log, currentPage]);


    //#region Add Log

    const openModal = () => {
        setShowAddDialog(true);
    };

    const handleLogDateChange = ((event) => {
        setLogDate(event.target.value);
    });

    const handleDescriptionChange = ((event) => {
        setDescription(event.target.value);
    });

    const handleAdd = async () => {
        try {
            if (!logDate) {
                if (toastId) toast.dismiss(toastId);
                toastId = toast.info("Please enter log date.", { autoClose: 3000 });
                return;
            }
            if (!description) {
                if (toastId) toast.dismiss(toastId);
                toastId = toast.info("Please enter log description.", { autoClose: 3000 });
                return;
            }

            const params = {
                "logDate": logDate,
                "description": description,
                "recordedBy": user?.name,
            };

            const response = await axios.post(`${Config.apiUrl}/addLog`, params);
            console.log(response.data);
            setShowAddDialog(false);

            fetchIssueRecords();
            setDescription('');
            setLogDate('');
            if (toastId) toast.dismiss(toastId);
            toastId = toast.success("Log added successfully.", { autoClose: 3000 });
        } catch (error) {
            if (toastId) toast.dismiss(toastId);
            toastId = toast.error("Error in adding log." + error, { autoClose: 3000 });
        }
    };

    const handleAddCancel = () => {
        setShowAddDialog(false);
    };

    //#endregion

    //#region Edit Log
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    };

    const handleEditDateChange = ((event) => {
        setEditDate(event.target.value);
    });

    const handleEditDescriptionChange = ((event) => {
        setEditDescription(event.target.value);
    });

    const handleEdit = async () => {
        try {
            if (!editDate) {
                if (toastId) toast.dismiss(toastId);
                toastId = toast.info("Log Date cannot be null.", { autoClose: 3000 });
                return;
            }
            if (!editDescription) {
                if (toastId) toast.dismiss(toastId);
                toastId = toast.info("Description cannot be empty.", { autoClose: 3000 });
                return;
            }

            const params = {
                "id": selectedLog.id,
                "logDate": editDate,
                "description": editDescription,
            };

            const response = await axios.put(`${Config.apiUrl}/editLog`, params);
            console.log(response.data);
            setShowEditLog(false);

            fetchIssueRecords();
            setEditDescription('');
            setEditDate('');
            if (toastId) toast.dismiss(toastId);
            toastId = toast.success("Log edited successfully.", { autoClose: 3000 });
        } catch (error) {
            if (toastId) toast.dismiss(toastId);
            toastId = toast.error("Error in editing log." + error, { autoClose: 3000 });
        }
    };

    const handleEditCancel = () => {
        setShowEditLog(false);
    };

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader style={{ display: 'flex' }}>
                            Log
                            <div className="leave-status" style={{ position: 'absolute', right: '10px', top: '-3px' }}>
                                <CTooltip
                                    content="Add log"
                                    trigger={['hover']}
                                >
                                    <CButton
                                        color="primary"
                                        type="button"
                                        className="reject-btn mb-2 mx-2"
                                        onClick={openModal}>
                                        Add Log
                                    </CButton>
                                </CTooltip>
                            </div>
                            <CModal visible={showAddDialog} onClose={handleAddCancel}>
                                <CModalHeader>
                                    <CModalTitle>Add Log Details</CModalTitle>
                                </CModalHeader>
                                <CModalBody>
                                    <CForm>
                                        <CRow className="g-3">
                                            <CCol xs style={{ marginBottom: '5px' }}>
                                                <CFormLabel id="inputGroupPrepend03">Log Date</CFormLabel>
                                                <CFormInput
                                                    type="date"
                                                    id="LogDate"
                                                    name='LogDate'
                                                    onChange={handleLogDateChange}
                                                    placeholder="Log Date"

                                                />
                                            </CCol>
                                        </CRow>

                                        <div className="mb-3">
                                            <CFormLabel htmlFor="exampleFormControlTextarea1">Description</CFormLabel>
                                            <CFormTextarea
                                                id="exampleFormControlTextarea1"
                                                rows={3}
                                                placeholder="Description"
                                                name="description"
                                                onChange={handleDescriptionChange}

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
                                                    Log Date
                                                </CTableHeaderCell>
                                                <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                                                    Description
                                                </CTableHeaderCell>
                                                <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                                                    Recorded By
                                                </CTableHeaderCell>
                                                <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                                                    Edit
                                                </CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {currentTableData.map(request => (
                                                <CTableRow key={request.SNo}>
                                                    <CTableHeaderCell scope="row">{request.SNo}.</CTableHeaderCell>
                                                    <CTableDataCell className="text-nowrap">{request.logDate}</CTableDataCell>
                                                    <CTableDataCell className="text-wrap text-start">
                                                        <div>{request.description}</div>
                                                    </CTableDataCell>
                                                    <CTableDataCell className="text-nowrap">
                                                        <div>{request.RecordedBy}</div>
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        <CRow style={{ position: 'relative', display: 'flex' }}>
                                                            <CCol>
                                                                <div className="leave-status">
                                                                    <CTooltip
                                                                        content="Edit log"
                                                                        trigger={['hover']}
                                                                    >
                                                                        <CIcon icon={cilPencil} style={{ color: 'blue', cursor: 'pointer' }}
                                                                            onClick={() => {
                                                                                setSelectedLog(request)
                                                                                setEditDate(formatDate(request.logDate));
                                                                                setEditDescription(request.description);
                                                                                setShowEditLog(!showEditLog);
                                                                            }}
                                                                        ></CIcon>
                                                                    </CTooltip>
                                                                </div>
                                                            </CCol>
                                                        </CRow>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            ))}
                                        </CTableBody>
                                    </CTable>
                                    <Pagination
                                        className="pagination-bar"
                                        currentPage={currentPage}
                                        totalCount={log.length}
                                        pageSize={PageSize}
                                        onPageChange={page => setCurrentPage(page)}
                                    />
                                </CCol>

                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CModal visible={showEditLog} onClose={handleEditCancel}>
                <CModalHeader>
                    <CModalTitle>Edit Log Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow className="g-3">
                            <CCol xs style={{ marginBottom: '5px' }}>
                                <CFormLabel id="inputGroupPrepend03">Log Date</CFormLabel>
                                <CFormInput
                                    type="date"
                                    id="LogDate"
                                    name='LogDate'
                                    value={editDate}
                                    onChange={handleEditDateChange}
                                    placeholder="Log Date"

                                />
                            </CCol>
                        </CRow>

                        <div className="mb-3">
                            <CFormLabel htmlFor="exampleFormControlTextarea1">Description</CFormLabel>
                            <CFormTextarea
                                id="exampleFormControlTextarea1"
                                rows={3}
                                placeholder="Description"
                                name="description"
                                value={editDescription}
                                onChange={handleEditDescriptionChange}
                            ></CFormTextarea>
                        </div>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleEditCancel}>
                        Cancel
                    </CButton>
                    <CButton color="primary" onClick={handleEdit}>Edit</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default Log
