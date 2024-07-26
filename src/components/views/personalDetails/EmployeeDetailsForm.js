
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux'
import {
  CForm,
  CFormLabel,
  CFormInput,
  CFormCheck,
  CRow,
  CCol
} from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { cilPencil, cilCheckCircle } from '@coreui/icons'
import { toast } from "react-toastify";
import axios from 'axios';
import Config from "../../../Config";

const EmployeeDetailsForm = ({ employeeDetails, setEmployeeDetails }) => {
  const user = useSelector((state) => state.user)
  const [isEmailEdit, setIsEmailEdit] = useState(false);
  const [isContactEdit, setIsContactEdit] = useState(false);
  const [isSecondaryContactEdit, setIsSecondaryContactEdit] = useState(false);
  const [isSameUser, setIsSameUser] = useState(true)
  const [empid, setEmpid] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [secondaryContact, setSecondaryContact] = useState('');
  const [dob, setDOB] = useState('');
  const [doj, setDOJ] = useState('');
  const [isGratuityApplicable, setIsGratuityApplicable] = useState(false);
  const [isMedicalApplicable, setIsMedicalApplicable] = useState(false);
  const emailRef = useRef(null);
  const contactRef = useRef(null);
  const secondaryContactRef = useRef(null);
  const phoneRegex = /^[0-9]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let toastId = null;

  useEffect(() => {
    const fetchEmployeeDetails = () => {
      try {
        if (employeeDetails.length > 0) {
          setEmpid(employeeDetails[0].empid);
          setEmail(employeeDetails[0].emailID);
          setContact(employeeDetails[0].contactNo);
          setSecondaryContact(employeeDetails[0].secondaryContact);
          setDOB(employeeDetails[0].Birthday);
          setDOJ(employeeDetails[0].joiningDate);

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

  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [day, month, year].join('-');
  }

  //#region Email
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    emailRef.current.focus();
  };

  const turnOnEmailEdit = () => {
    setIsEmailEdit(true);
    emailRef.current.focus();
  }

  const turnOffEmailEdit = useCallback(async () => {
    try {
      if (email == '') {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Email cannot be empty.", { autoClose: 3000 });
        setIsEmailEdit(true);
        return;
      }
      if (!emailRegex.test(email)) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Invalid email.", { autoClose: 3000 });
        setIsEmailEdit(true);
        return;
      }
      const params = {
        'empid': empid,
        'email': email,
      }
      const response = await axios.put(`${Config.apiUrl}/updateEmail`, params);
      console.log(response.data.message);
      setIsEmailEdit(false);
      if (toastId) toast.dismiss(toastId);
      toastId = toast.success("Email updated successfully.", { autoClose: 3000 });
    } catch (error) {
      console.error(error)
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in email updation." + error, { autoClose: 3000 });
    }
  }, [email]);
  //#end region

  //#region Contact
  const handleContactChange = (e) => {
    setContact(e.target.value)
    contactRef.current.focus();
  };

  const turnOnContactEdit = () => {
    setIsContactEdit(true);
    contactRef.current.focus();
  }

  const turnOffContactEdit = useCallback(async () => {
    try {
      if (contact == '') {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Contact cannot be empty.", { autoClose: 3000 });
        setIsContactEdit(true);
        return;
      }
      if (!phoneRegex.test(contact)) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Invalid contact.", { autoClose: 3000 });
        setIsContactEdit(true);
        return;
      }
      const params = {
        'empid': empid,
        'contact': contact,
      }
      const response = await axios.put(`${Config.apiUrl}/updateContact`, params);
      console.log(response.data.message);
      setIsContactEdit(false);
      if (toastId) toast.dismiss(toastId);
      toastId = toast.success("Contact updated successfully.", { autoClose: 3000 });
    } catch (error) {
      console.error(error)
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in contact updation." + error, { autoClose: 3000 });
    }
  }, [contact]);
  //#end region

  //#region Secondary Contact
  const handleSecondaryContactChange = (e) => {
    setSecondaryContact(e.target.value)
    secondaryContactRef.current.focus();
  };

  const turnOnSecondaryContactEdit = () => {
    setIsSecondaryContactEdit(true);
    secondaryContactRef.current.focus();
  }

  const turnOffSecondaryContactEdit = useCallback(async () => {
    try {
      if (secondaryContact == '') {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Secondary contact cannot be empty.", { autoClose: 3000 });
        setIsSecondaryContactEdit(true);
        return;
      }
      if (!phoneRegex.test(secondaryContact)) {
        if (toastId) toast.dismiss(toastId);
        toastId = toast.info("Invalid contact.", { autoClose: 3000 });
        setIsSecondaryContactEdit(true);
        return;
      }
      const params = {
        'empid': empid,
        'secondaryContact': secondaryContact,
      }
      const response = await axios.put(`${Config.apiUrl}/updateSecondaryContact`, params);
      console.log(response.data.message);
      setIsSecondaryContactEdit(false);
      if (toastId) toast.dismiss(toastId);
      toastId = toast.success("Secondary contact updated successfully.", { autoClose: 3000 });
    } catch (error) {
      console.error(error)
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Error in secondary contact updation." + error, { autoClose: 3000 });
    }
  }, [secondaryContact]);
  //#end region

  //#region Gratuity/Medical

  const checkMedical = (dateOfJoining) => {
      const joiningDate = new Date(dateOfJoining);
      const currentDate = new Date();
      
      // Calculate the difference in milliseconds
      const differenceInMillis = currentDate - joiningDate;
  
      // Convert milliseconds to years
      const differenceInYears = differenceInMillis / (1000 * 60 * 60 * 24 * 365.25);
  
      // Check if 5 years have passed
      return differenceInYears >= 2;
  }

    const checkGratuity = (dateOfJoining) => {
      const joiningDate = new Date(dateOfJoining);
      const currentDate = new Date();
      
      // Calculate the difference in milliseconds
      const differenceInMillis = currentDate - joiningDate;
  
      // Convert milliseconds to years
      const differenceInYears = differenceInMillis / (1000 * 60 * 60 * 24 * 365.25);
  
      // Check if 5 years have passed
      return differenceInYears >= 5;
  }

  return (
    <CForm>
      <CFormLabel htmlFor="email">Email</CFormLabel>
      <div className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
        <CFormInput
          type='email'
          id="email"
          name="email"
          ref={emailRef}
          value={email}
          onChange={handleEmailChange}
          readOnly={!isEmailEdit}
          required
        />
        {isSameUser && (
          <>
            {isEmailEdit ? (
              <CIcon
                icon={cilCheckCircle}
                style={{ color: 'green', marginRight: '5px', marginLeft: '5px', cursor: 'pointer' }}
                onClick={turnOffEmailEdit}
              />
            ) : (
              <CIcon
                icon={cilPencil}
                style={{ color: '#5856d6', marginRight: '5px', marginLeft: '5px', cursor: 'pointer' }}
                onClick={turnOnEmailEdit}
              />
            )}
          </>
        )}
      </div>
      <CRow>
        <CCol>
          <CFormLabel htmlFor="contact">Primary Contact</CFormLabel>
          <div className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
            <CFormInput
              type='tel'
              id="contact"
              name="contact"
              ref={contactRef}
              value={contact}
              onChange={handleContactChange}
              readOnly={!isContactEdit}
              required
            />
            {isSameUser && (
              <>
                {isContactEdit ? (
                  <CIcon
                    icon={cilCheckCircle}
                    style={{ color: 'green', marginRight: '5px', marginLeft: '5px', cursor: 'pointer' }}
                    onClick={turnOffContactEdit}
                  />
                ) : (
                  <CIcon
                    icon={cilPencil}
                    style={{ color: '#5856d6', marginRight: '5px', marginLeft: '5px', cursor: 'pointer' }}
                    onClick={turnOnContactEdit}
                  />
                )}
              </>
            )}
          </div>
        </CCol>
        <CCol>
          <CFormLabel htmlFor="contact">Secondary Contact</CFormLabel>
          <div className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
            <CFormInput
              type='tel'
              id="contact"
              name="contact"
              ref={secondaryContactRef}
              value={secondaryContact}
              onChange={handleSecondaryContactChange}
              readOnly={!isSecondaryContactEdit}
              required
            />
            {isSameUser && (
              <>
                {isSecondaryContactEdit ? (
                  <CIcon
                    icon={cilCheckCircle}
                    style={{ color: 'green', marginRight: '5px', marginLeft: '5px', cursor: 'pointer' }}
                    onClick={turnOffSecondaryContactEdit}
                  />
                ) : (
                  <CIcon
                    icon={cilPencil}
                    style={{ color: '#5856d6', marginRight: '5px', marginLeft: '5px', cursor: 'pointer' }}
                    onClick={turnOnSecondaryContactEdit}
                  />
                )}
              </>
            )}
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <div className="mb-3">
            <CFormLabel htmlFor="joining-date">Date of Birth</CFormLabel>
            <CFormInput
              type='text'
              id="birth-date"
              name="birth-date"
              value={formatDate(dob)}
              readOnly
            />
          </div>
        </CCol>
        <CCol>
          <div className="mb-3">
            <CFormLabel htmlFor="joining-date">Date of Joining</CFormLabel>
            <CFormInput
              type='text'
              id="joining-date"
              name="joining-date"
              value={formatDate(doj)}
              readOnly
            />
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
            <CFormLabel htmlFor="medical">Medical Insurance</CFormLabel>
            <div className="mb-3" style={{display: 'flex'}}>
            <CFormCheck
              type="radio"
              name="medical-options"
              id="medical"
              label="Yes"
              checked={checkMedical(doj) == true}
              readOnly
            />
            <CFormCheck
              type="radio"
              name="medical-options"
              id="medical"
              label="No"
              style={{marginLeft: '5px', marginRight: '10px'}}
              checked={checkMedical(doj) == false}
              readOnly
            />
          </div>
        </CCol>
        <CCol>
            <CFormLabel htmlFor="gratuity">Gratuity</CFormLabel>
            <div className="mb-3" style={{display: 'flex'}}>
            <CFormCheck
              type="radio"
              name="gratuity-options"
              id="gratuity"
              label="Yes"
              checked={checkGratuity(doj) == true}
              readOnly
            />
            <CFormCheck
              type="radio"
              name="gratuity-options"
              id="gratuity"
              label="No"
              style={{marginLeft: '5px', marginRight: '10px'}}
              checked={checkGratuity(doj) == false}
              readOnly
            />
          </div>
        </CCol>
      </CRow>
    </CForm>
  );
};

export default EmployeeDetailsForm;
