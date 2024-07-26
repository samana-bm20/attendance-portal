import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CIcon from '@coreui/icons-react';
import { cilFolderOpen, cilFolder, cilCloudUpload, cilTrash } from '@coreui/icons';
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
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTooltip,
} from '@coreui/react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Config from '../../../Config';

const DocumentUpload = ({ employeeDetails }) => {
  const user = useSelector((state) => state.user);
  const employeeId = user?.empid;
  const fileInputRef = useRef(null);
  const [userId, setUserId] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [documents, setDocuments] = useState([]);
  let toastId = null;

  useEffect(() => {
    fetchDocuments();
  }, [employeeId, employeeDetails]);

  const fetchDocuments = async () => {
    try {
      if (employeeDetails.length > 0) {
        let empid_;
        if (user?.userType == 1) {
          empid_ = employeeDetails[0].empid
          setUserId(empid_)
        } else {
          empid_ = employeeId
          setUserId(empid_)
        }
        const response = await axios.get(`${Config.apiUrl}/getDocuments`, {
          params: { empid_ },
        });
        setDocuments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching documents.', error);
      if (toastId) toast.dismiss(toastId);
      toast.error('Error fetching documents. Please try again later.');
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    // Handle document upload here, e.g., upload files to server
    console.log(files);
  };

  const handleUploadCancel = () => {
    setShowUploadDialog(false);
  };

  const handleShowDocument = (docPath) => {
    window.open(`${Config.apiUrl}/${docPath}`, '_blank');
  };

  //#region Add Doc
  const handleAdd = async () => {
    if (documentName === '') {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.info('Document name cannot be empty.', { autoClose: 3000 });
      return;
    }

    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);
    formData.append('docName', documentName);
    formData.append('empId', userId);
    formData.append('uploadedBy', user?.name);

    try {
      const response = await axios.post(`${Config.apiUrl}/documentUpload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'OK') {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.success(response.data.message, { autoClose: 3000 });
        setDocumentName('');
        setShowUploadDialog(false);
        // Optionally update your document list here if needed
        fetchDocuments(); // Refresh document list after upload
      } else {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.error(response.data.message, { autoClose: 3000 });
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error('Error uploading document. Please try again later.', { autoClose: 3000 });
    }
  };
  //#end region

  //#region Delete Doc
  const handleDeleteDocument = async (id) => {
    try {
      const response = await axios.get(`${Config.apiUrl}/removeDocument?id=${id}`);

      if (response.data.status === 'OK') {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.success(response.data.message, { autoClose: 3000 });
        fetchDocuments(); // Refresh documents list
      } else {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.error(response.data.message, { autoClose: 3000 });
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error('Error deleting document. Please try again later.', { autoClose: 3000 });
    }
  };
  //#end region


  return (
    <CCard className="mb-4">
      <CCardHeader style={{ fontWeight: 'bold'}}>
        <CRow>
          <CCol>Documents</CCol>
          <CCol style={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <CTooltip content="Add new document" trigger={['hover']}>
              <CButton color="success" onClick={() => setShowUploadDialog(true)}>
                <CIcon icon={cilFolderOpen} style={{ marginRight: '5px' }} />
                Upload
              </CButton>
            </CTooltip>
          </CCol>
        </CRow>
        <CModal visible={showUploadDialog} onClose={handleUploadCancel}>
          <CModalHeader>
            <CModalTitle>Upload Document</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CRow className="g-3">
                <CCol xs style={{ marginBottom: '5px' }}>
                  <CFormLabel id="inputGroupPrepend03">Document Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="doc-name"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="Document Name"
                  />
                </CCol>
                <CCol xs>
                  <CFormLabel id="inputGroupPrepend03">Browse</CFormLabel>
                  <CIcon icon={cilCloudUpload} style={{ marginLeft: '5px' }} />
                  <CFormInput
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg"
                  />
                </CCol>
              </CRow>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={handleUploadCancel}>
              Cancel
            </CButton>
            <CButton color="primary" onClick={handleAdd}>
              Add
            </CButton>
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
                Document Name
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                View
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                Delete
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" className="bg-body-tertiary text-center">
                Uploaded By
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {documents.map((doc, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{doc.SNo}.</CTableDataCell>
                <CTableDataCell>{doc.DocName}</CTableDataCell>
                <CTableDataCell>
                  <CTooltip content="View document" trigger={['hover']}>
                    <CIcon
                      icon={cilFolder}
                      style={{ color: '#5856d6', cursor: 'pointer' }}
                      onClick={() => handleShowDocument(doc.DocPath)}
                    />
                  </CTooltip>
                </CTableDataCell>
                <CTableDataCell>
                  {(user?.userType != 1) ? (
                    <>
                      {(doc.UploadedBy == user?.name) && (
                        <CTooltip content="Delete document" trigger={['hover']}>
                          <CIcon
                            icon={cilTrash}
                            style={{ color: 'red', cursor: 'pointer' }}
                            onClick={() => handleDeleteDocument(doc.id)}
                          />
                        </CTooltip>
                      )}
                    </>
                  ):(
                    <CTooltip content="Delete document" trigger={['hover']}>
                      <CIcon
                        icon={cilTrash}
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={() => handleDeleteDocument(doc.id)}
                      />
                    </CTooltip>
                  )}
                </CTableDataCell>
                <CTableDataCell>{doc.UploadedBy}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default DocumentUpload;
