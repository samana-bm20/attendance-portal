import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from "react-redux";
import ProfilePictureUpload from './ProfilePictureUpload';
import EmployeeDetailsForm from './EmployeeDetailsForm';
import DetailsForm from './DetailsForm';
import DocumentUpload from './DocumentUpload';
import EmployeeAddress from './EmployeeAddress';
import DependencyForm from './DependencyForm';
import {
  CContainer,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import axios from 'axios';
import Config from "../../../Config";

const PersonalDetails = () => {
  const user = useSelector((state) => state.user);
  const [profilePicture, setProfilePicture] = useState(null);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [empIdName, setEmpIdName] = useState(`${user?.empid}-${user?.name}`)
  const [employeeID, setEmployeeID] = useState('');
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [personalDetails, setPersonalDetails] = useState([]);
  const [trigger, setTrigger] = useState(false);

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
    if (event.target.text == 'Select Employee') {
      setEmpIdName(event.target.text);
    } else {
      setEmpIdName(event.target.text);
      const employee = event.target.text.split('-');
      setEmployeeID(employee[0].trim());
    }
  };

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        let empid;
        if (empIdName == `${user?.empid}-${user?.name}`) {
          empid = user?.empid;
        } else if (empIdName == 'Select Employee') {
          return;
        } else {
          empid = employeeID
        }
        const response = await axios.get(`${Config.apiUrl}/getInformation?empid=${empid}`)
        setEmployeeDetails(response.data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchEmployeeDetails();
  }, [employeeID])

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      try {
        let empid;
        if (empIdName == `${user?.empid}-${user?.name}`) {
          empid = user?.empid;
        } else if (empIdName == 'Select Employee') {
          return;
        } else {
          empid = employeeID
        }
        const response = await axios.get(`${Config.apiUrl}/getPersonalDetails?empid=${empid}`)
        setPersonalDetails(response.data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchPersonalDetails();
  }, [trigger, employeeID])

  const handleTriggerChange = () => {
    setTrigger(prev => !prev);
  };

  return (
    <CContainer>
      <CRow xs={{ gutter: 3 }}>
        <CCol md={12} xl={12}>
          <CCard className="mb-4" >
            <CCardHeader style={{ fontWeight: 'bold', fontSize: 'larger' }}>
              {(user?.userType == 2 || user?.userType == 3) && (
                <>
                  {empIdName}
                </>
              )}
              <div>
                {user?.userType == 1 && (
                  <CDropdown style={{ marginLeft: '10px' }}>
                    <CDropdownToggle
                      color="secondary" caret >
                      {empIdName}
                    </CDropdownToggle>
                    <CDropdownMenu
                      onClick={handleEmployeeChange} style={{ cursor: 'pointer', overflowY: 'scroll', maxHeight: '200px' }}>
                      <CDropdownItem value="">Select Employee</CDropdownItem>
                      {employeeOptions}
                    </CDropdownMenu>
                  </CDropdown>
                )}
              </div>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xl={8}>
                  <EmployeeDetailsForm
                    employeeDetails={employeeDetails}
                    setEmployeeDetails={setEmployeeDetails}
                  />
                </CCol>
                <CCol xl={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ProfilePictureUpload
                    profilePicture={profilePicture}
                    setProfilePicture={setProfilePicture}
                    employeeDetails={employeeDetails}
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol md={12} xl={12}>
          <CCard className="mb-4" >
            <CCardHeader style={{ fontWeight: 'bold'}}>Expertise</CCardHeader>
            <CCardBody>
              <DetailsForm
                employeeDetails={employeeDetails}
                setEmployeeDetails={setEmployeeDetails}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <EmployeeAddress
        personalDetails={personalDetails}
        setPersonalDetails={setPersonalDetails}
      />
      <CRow>
        <CCol>
          <DependencyForm
            personalDetails={personalDetails}
            onTriggerChange={handleTriggerChange}
          />
        </CCol>
      </CRow>
      <CRow xs={{ gutter: 3 }}>
        <CCol>
          <DocumentUpload
            employeeDetails={employeeDetails}
          />
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default PersonalDetails
