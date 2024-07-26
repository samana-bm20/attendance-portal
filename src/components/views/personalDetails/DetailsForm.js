import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from "react-redux";
import {
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CBadge,
  CContainer,
  CRow,
  CCol,
} from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { cilPencil, cilCheckCircle, cilXCircle } from '@coreui/icons'
import { toast } from "react-toastify";
import axios from 'axios';
import Config from "../../../Config";

const DetailsForm = ({ employeeDetails, setEmployeeDetails }) => {
  const user = useSelector((state) => state.user);
  const [isEditMode, setIsEditMode] = useState(false);
  const qualificationRef = useRef(null);
  const skillsRef = useRef(null);
  const [empid, setEmpid] = useState('');
  const [qualification, setQualification] = useState('');
  const [designation, setDesignation] = useState('');
  const [skillSet1, setSkillSet1] = useState([]);
  const [skillSet2, setSkillSet2] = useState([]);
  const [skillSet3, setSkillSet3] = useState([]);
  const [skillSet4, setSkillSet4] = useState([]);
  const [skillInput1, setSkillInput1] = useState('');
  const [skillInput2, setSkillInput2] = useState('');
  const [skillInput3, setSkillInput3] = useState('');
  const [skillInput4, setSkillInput4] = useState('');
  const [isSameUser, setIsSameUser] = useState(true)
  let toastId = null;

  useEffect(() => {
    const fetchEmployeeDetails = () => {
      try {
        if (employeeDetails.length > 0) {
          setEmpid(employeeDetails[0].empid);
          setQualification(employeeDetails[0].qualification);
          setSkillSet1(employeeDetails[0].skillSet1 ? JSON.parse(employeeDetails[0].skillSet1) : []);
          setSkillSet2(employeeDetails[0].skillSet2 ? JSON.parse(employeeDetails[0].skillSet2) : []);
          setSkillSet3(employeeDetails[0].skillSet3 ? JSON.parse(employeeDetails[0].skillSet3) : []);
          setSkillSet4(employeeDetails[0].skillSet4 ? JSON.parse(employeeDetails[0].skillSet4) : []);
          setDesignation(employeeDetails[0].designation);

          if (employeeDetails[0].empid == user?.empid) {
            setIsSameUser(true)
          } else {
            setIsSameUser(false)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchEmployeeDetails();
  }, [employeeDetails])

  //#region Qualification
  const handleQualificationChange = (e) => {
    setQualification(e.target.value);
    qualificationRef.current.focus();
  };

  const turnOnQualEdit = () => {
    setIsEditMode(true);
    qualificationRef.current.focus();
  }

  const turnOffQualEdit = useCallback(async () => {
    try {
      if (qualification == '') {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Qualification cannot be empty.", { autoClose: 3000 });
        setIsEditMode(true);
        return;
      }
      const params = {
        'empid': empid,
        'qualification': qualification,
      }
      const response = await axios.put(`${Config.apiUrl}/updateQualification`, params);
      console.log(response.data.status);
      setIsEditMode(false);
      if (toastId) toast.dismiss(toastId);
      toastId = toast.success("Qualification updated successfully.", { autoClose: 3000 });
    } catch (error) {
      console.error(error)
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in qualification updation." + error, { autoClose: 3000 });
    }
  }, [qualification]);
  //#end region

  //#region skillSet1
  const handleAddSkillSet1 = useCallback(async (skill) => {
    try {
      if (skill && !skillSet1.includes(skill)) {
        setSkillSet1([...skillSet1, skill]);
        setSkillInput1('');
        const params = {
          'empid': empid,
          'skillSet1': [...skillSet1, skill],
        }
        const response = await axios.put(`${Config.apiUrl}/updateSkillSet1`, params);
        console.log(response.data.status);
      }
    } catch (error) {
      console.error(error)
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in skills updation." + error, { autoClose: 3000 });
    }
  }, [skillSet1]);

  const handleDeleteSkillSet1 = useCallback(async (skillToDelete) => {
    try {
      setSkillSet1(skillSet1.filter(skill => skill !== skillToDelete));
      const params = {
        'empid': empid,
        'skillSet1': skillSet1.filter(skill => skill !== skillToDelete),
      }
      const response = await axios.put(`${Config.apiUrl}/updateSkillSet1`, params);
      console.log(response.data.status);
    } catch (error) {
      console.error(error)
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in skills updation." + error, { autoClose: 3000 });
    }
  }, [skillSet1]);

  const handleSkillSet1Change = (event) => {
    setSkillInput1(event.target.value);
  };

  const handleInputKey1Press = (event) => {
    if (event.key === 'Enter') {
      handleAddSkillSet1(skillInput1);
    }
  };
  //#end region

  //#region skillSet2
  const handleAddSkillSet2 = useCallback(async (skill) => {
    try {
      if (skill && !skillSet2.includes(skill)) {
        setSkillSet2([...skillSet2, skill]);
        setSkillInput2('');
        const params = {
          'empid': empid,
          'skillSet2': [...skillSet2, skill],
        }
        const response = await axios.put(`${Config.apiUrl}/updateSkillSet2`, params);
        console.log(response.data.status);
      }
    } catch (error) {
      console.error(error)
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in skills updation." + error, { autoClose: 3000 });
    }
  }, [skillSet2]);

  const handleDeleteSkillSet2 = useCallback(async (skillToDelete) => {
    try {
      setSkillSet2(skillSet2.filter(skill => skill !== skillToDelete));
      const params = {
        'empid': empid,
        'skillSet2': skillSet2.filter(skill => skill !== skillToDelete),
      }
      const response = await axios.put(`${Config.apiUrl}/updateSkillSet2`, params);
      console.log(response.data.status);
    } catch (error) {
      console.error(error)
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in skills updation." + error, { autoClose: 3000 });
    }
  }, [skillSet2]);

  const handleSkillSet2Change = (event) => {
    setSkillInput2(event.target.value);
  };

  const handleInputKey2Press = (event) => {
    if (event.key === 'Enter') {
      handleAddSkillSet2(skillInput2);
    }
  };
  //#end region

  //#region skillSet3
  const handleAddSkillSet3 = useCallback(async (skill) => {
    try {
      if (skill && !skillSet3.includes(skill)) {
        setSkillSet3([...skillSet3, skill]);
        setSkillInput3('');
        const params = {
          'empid': empid,
          'skillSet3': [...skillSet3, skill],
        }
        const response = await axios.put(`${Config.apiUrl}/updateSkillSet3`, params);
        console.log(response.data.status);
      }
    } catch (error) {
      console.error(error)
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in skills updation." + error, { autoClose: 3000 });
    }
  }, [skillSet3]);

  const handleDeleteSkillSet3 = useCallback(async (skillToDelete) => {
    try {
      setSkillSet3(skillSet3.filter(skill => skill !== skillToDelete));
      const params = {
        'empid': empid,
        'skillSet3': skillSet3.filter(skill => skill !== skillToDelete),
      }
      const response = await axios.put(`${Config.apiUrl}/updateSkillSet3`, params);
      console.log(response.data.status);
    } catch (error) {
      console.error(error)
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in skills updation." + error, { autoClose: 3000 });
    }
  }, [skillSet3]);

  const handleSkillSet3Change = (event) => {
    setSkillInput3(event.target.value);
  };

  const handleInputKey3Press = (event) => {
    if (event.key === 'Enter') {
      handleAddSkillSet3(skillInput3);
    }
  };
  //#end region

  //#region skillSet4
  const handleAddSkillSet4 = useCallback(async (skill) => {
    try {
      if (skill && !skillSet4.includes(skill)) {
        setSkillSet4([...skillSet4, skill]);
        setSkillInput4('');
        const params = {
          'empid': empid,
          'skillSet4': [...skillSet4, skill],
        }
        const response = await axios.put(`${Config.apiUrl}/updateSkillSet4`, params);
        console.log(response.data.status);
      }
    } catch (error) {
      console.error(error)
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in skills updation." + error, { autoClose: 3000 });
    }
  }, [skillSet4]);

  const handleDeleteSkillSet4 = useCallback(async (skillToDelete) => {
    try {
      setSkillSet4(skillSet4.filter(skill => skill !== skillToDelete));
      const params = {
        'empid': empid,
        'skillSet4': skillSet4.filter(skill => skill !== skillToDelete),
      }
      const response = await axios.put(`${Config.apiUrl}/updateSkillSet4`, params);
      console.log(response.data.status);
    } catch (error) {
      console.error(error)
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in skills updation." + error, { autoClose: 3000 });
    }
  }, [skillSet4]);

  const handleSkillSet4Change = (event) => {
    setSkillInput4(event.target.value);
  };

  const handleInputKey4Press = (event) => {
    if (event.key === 'Enter') {
      handleAddSkillSet4(skillInput4);
    }
  };
  //#end region


  return (
    <CContainer>
      <CForm>
        <CRow>
          <CCol xl={6}>
            <CFormLabel htmlFor="qualification">Educational Qualification</CFormLabel>
            <div className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
              <CFormInput
                id="qualification"
                name="qualification"
                ref={qualificationRef}
                value={qualification}
                onChange={handleQualificationChange}
                readOnly={!isEditMode}
                required
              />
              {isSameUser && (
                <>
                  {isEditMode ? (
                    <CIcon
                      icon={cilCheckCircle}
                      style={{ color: 'green', marginRight: '5px', marginLeft: '5px', cursor: 'pointer' }}
                      onClick={turnOffQualEdit}
                    />
                  ) : (
                    <CIcon
                      icon={cilPencil}
                      style={{ color: '#5856d6', marginRight: '5px', marginLeft: '5px', cursor: 'pointer' }}
                      onClick={turnOnQualEdit}
                    />
                  )}
                </>
              )}
            </div>
          </CCol>
          <CCol xl={6}>
            <div className="mb-3">
              <CFormLabel htmlFor="designation">Designation</CFormLabel>
              <CFormInput
                type='text'
                id="designation"
                name="designation"
                value={designation}
                readOnly
              />
            </div>
          </CCol>
        </CRow>
        <CRow>
          <CCol xl={6}>
            <CRow className="mt-3 mb-3">
              <CCol>
                <CFormLabel htmlFor="skillSet1">Skill Set 1</CFormLabel>
                {isSameUser && (
                  <CRow>
                    <CCol xs={8} sm={10} xl={10} >
                      <CFormInput
                        type="text"
                        placeholder="Enter Skills"
                        value={skillInput1}
                        onChange={handleSkillSet1Change}
                        onKeyPress={handleInputKey1Press}
                      />
                    </CCol>
                    <CCol xs={2} sm={2} xl={2} >
                      <CButton color="success" className="me-2" onClick={() => handleAddSkillSet1(skillInput1)}>Add</CButton>
                    </CCol>
                  </CRow>
                )}
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                {skillSet1.map((skill, index) => (
                  <CBadge
                    key={index}
                    color="primary"
                    className="me-2"
                    style={{ cursor: 'pointer', marginTop: '5px' }}>
                    {skill}
                    {isSameUser && (
                      <CIcon icon={cilXCircle} className="ms-1" onClick={() => handleDeleteSkillSet1(skill)} />
                    )}
                  </CBadge>
                ))}
              </CCol>
            </CRow>
          </CCol>
          <CCol xl={6}>
            <CRow className="mt-3 mb-3">
              <CCol>
                <CFormLabel htmlFor="skills">Skill Set 2</CFormLabel>
                {isSameUser && (
                  <CRow>
                    <CCol xs={8} sm={10} xl={10} >
                      <CFormInput
                        type="text"
                        placeholder="Enter Skills"
                        value={skillInput2}
                        onChange={handleSkillSet2Change}
                        onKeyPress={handleInputKey2Press}
                      />
                    </CCol>
                    <CCol xs={2} sm={2} xl={2} >
                      <CButton color="success" className="me-2" onClick={() => handleAddSkillSet2(skillInput2)}>Add</CButton>
                    </CCol>
                  </CRow>
                )}
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                {skillSet2.map((skill, index) => (
                  <CBadge
                    key={index}
                    color="primary"
                    className="me-2"
                    style={{ cursor: 'pointer', marginTop: '5px' }}>
                    {skill}
                    {isSameUser && (
                      <CIcon icon={cilXCircle} className="ms-1" onClick={() => handleDeleteSkillSet2(skill)} />
                    )}
                  </CBadge>
                ))}
              </CCol>
            </CRow>
          </CCol>
        </CRow>
        <CRow>
          <CCol xl={6}>
            <CRow className="mt-3 mb-3">
              <CCol>
                <CFormLabel htmlFor="skills">Skill Set 3</CFormLabel>
                {isSameUser && (
                  <CRow>
                    <CCol xs={8} sm={10} xl={10} >
                      <CFormInput
                        type="text"
                        placeholder="Enter Skills"
                        value={skillInput3}
                        onChange={handleSkillSet3Change}
                        onKeyPress={handleInputKey3Press}
                      />
                    </CCol>
                    <CCol xs={2} sm={2} xl={2} >
                      <CButton color="success" className="me-2" onClick={() => handleAddSkillSet3(skillInput3)}>Add</CButton>
                    </CCol>
                  </CRow>
                )}
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                {skillSet3.map((skill, index) => (
                  <CBadge
                    key={index}
                    color="primary"
                    className="me-2"
                    style={{ cursor: 'pointer', marginTop: '5px' }}>
                    {skill}
                    {isSameUser && (
                      <CIcon icon={cilXCircle} className="ms-1" onClick={() => handleDeleteSkillSet3(skill)} />
                    )}
                  </CBadge>
                ))}
              </CCol>
            </CRow>
          </CCol>
          <CCol xl={6}>
            <CRow className="mt-3 mb-3">
              <CCol>
                <CFormLabel htmlFor="skills">Skill Set 4</CFormLabel>
                {isSameUser && (
                  <CRow>
                    <CCol xs={8} sm={10} xl={10} >
                      <CFormInput
                        type="text"
                        placeholder="Enter Skills"
                        value={skillInput4}
                        onChange={handleSkillSet4Change}
                        onKeyPress={handleInputKey4Press}
                      />
                    </CCol>
                    <CCol xs={2} sm={2} xl={2} >
                      <CButton color="success" className="me-2" onClick={() => handleAddSkillSet4(skillInput4)}>Add</CButton>
                    </CCol>
                  </CRow>
                )}
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                {skillSet4.map((skill, index) => (
                  <CBadge
                    key={index}
                    color="primary"
                    className="me-2"
                    style={{ cursor: 'pointer', marginTop: '5px' }}>
                    {skill}
                    {isSameUser && (
                      <CIcon icon={cilXCircle} className="ms-1" onClick={() => handleDeleteSkillSet4(skill)} />
                    )}
                  </CBadge>
                ))}
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CForm>
    </CContainer>
  );
};

export default DetailsForm;
