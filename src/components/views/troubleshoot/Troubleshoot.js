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
import Config from "../../../Config";
import './Troubleshoot.css'
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "./Pagination";
let PageSize = 10;

const Troubleshoot = () => {
    const user = useSelector((state) => state.user);
    const [troubleshoot, setTroubleshoot] = useState([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [issueDate, setIssueDate] = useState('');
    const [issueDescription, setIssueDescription] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    let toastId = null;

    const fetchIssueRecords = async (page) => {
        try {
            const response = await axios.get(`${Config.apiUrl}/fetchIssue`);
            setTroubleshoot(response.data.data);
        } catch (error) {
            console.error("error fetching issue records");
        }
    };

    useEffect(() => {
        fetchIssueRecords(currentPage);
    }, [currentPage]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return troubleshoot.slice(firstPageIndex, lastPageIndex);
    }, [troubleshoot, currentPage]);


    //#region Add Issue

    const openModal = () => {
        setShowAddDialog(true);
    };

    const handleIssueDateChange = ((event) => {
        setIssueDate(event.target.value);
    });

    const handleIssueChange = ((event) => {
        setIssueDescription(event.target.value);
    });

    const handleAdd = async () => {
        try {
            if (!issueDate) {
                if (toastId) toast.dismiss(toastId);
                toastId = toast.info("Please enter issue date.", { autoClose: 3000 });
                return;
            }
            if (!issueDescription) {
                if (toastId) toast.dismiss(toastId);
                toastId = toast.info("Please enter issue description.", { autoClose: 3000 });
                return;
            }

            const params = {
                "issueDate": issueDate,
                "Issue": issueDescription,
                "recordedBy": user?.name,
            };

            const response = await axios.post(`${Config.apiUrl}/addTroubleshoot`, params);
            console.log(response.data);
            setShowAddDialog(false);

            fetchIssueRecords();
            setIssueDescription('');
            setIssueDate('');
            if (toastId) toast.dismiss(toastId);
            toastId = toast.success("Issue added successfully.", { autoClose: 3000 });
        } catch (error) {
            if (toastId) toast.dismiss(toastId);
            toastId = toast.error("Error in adding issue." + error, { autoClose: 3000 });
        }
    };

    const handleAddCancel = () => {
        setShowAddDialog(false);
    };

    //#endregion

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader style={{ display: 'flex' }}>
                            Troubleshoot Log
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
                                        Add Issue
                                    </CButton>
                                </CTooltip>
                            </div>
                            <CModal visible={showAddDialog} onClose={handleAddCancel}>
                                <CModalHeader>
                                    <CModalTitle>Add Issue Details</CModalTitle>
                                </CModalHeader>
                                <CModalBody>
                                    <CForm>
                                        <CRow className="g-3">
                                            <CCol xs style={{ marginBottom: '5px' }}>
                                                <CFormLabel id="inputGroupPrepend03">Date of Issue</CFormLabel>
                                                <CFormInput
                                                    type="date"
                                                    id="IssueDate"
                                                    name='IssueDate'
                                                    onChange={handleIssueDateChange}
                                                    placeholder="Issue Date"

                                                />
                                            </CCol>
                                        </CRow>

                                        <div className="mb-3">
                                            <CFormLabel htmlFor="exampleFormControlTextarea1">Issue Description</CFormLabel>
                                            <CFormTextarea
                                                id="exampleFormControlTextarea1"
                                                rows={3}
                                                placeholder="Issue"
                                                name="issue"
                                                onChange={handleIssueChange}

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
                                                    Issue Date
                                                </CTableHeaderCell>
                                                <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                                                    Issue Description
                                                </CTableHeaderCell>
                                                <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                                                    Recorded By
                                                </CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {currentTableData.map(request => (
                                                <CTableRow key={request.SNo}>
                                                    <CTableHeaderCell scope="row">{request.SNo}.</CTableHeaderCell>
                                                    <CTableDataCell>{request.issueDate}</CTableDataCell>
                                                    <CTableDataCell className="text-nowrap">
                                                        <div>{request.Issue}</div>
                                                    </CTableDataCell>
                                                    <CTableDataCell className="text-nowrap">
                                                        <div>{request.RecordedBy}</div>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            ))}
                                        </CTableBody>
                                    </CTable>
                                    <Pagination
                                        className="pagination-bar"
                                        currentPage={currentPage}
                                        totalCount={troubleshoot.length}
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

export default Troubleshoot
