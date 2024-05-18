import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Config from "../../../../Config";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  Save_User,
} from "../../../actions";

import moment from "moment";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { toast } from "react-toastify";

import logo from 'src/assets/MLInfomap.png'
import logoname from 'src/assets/logoname.png'

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Please enter both username and password.");
      return;
    }

    try {
      const response = await axios.get(
        `${Config.apiUrl}/login`,
        {
          params: { username, password }, // Send username and password as query parameters
          headers: {
            authorization: Config.AxiosConfig.headers.authorization,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
        }
      );
      
      if (response.data.status === "OK") {
        const expireAt = moment()
          .add(Config.sessionExpiredTime, "minutes")
          .valueOf();
        const realData = { ...response.data.data, expireAt };
        dispatch(Save_User(realData));
        navigate("/dashboard");
      } else {
        // Handle invalid credentials
        toast.error('Invalid user credentials');
      }
    } catch (error) {
      // Handle errors
      toast.error(error.response?.data?.message || "An error occurred while logging in.");
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <CRow style={{ display: 'flex', justifyContent: 'center' }}>
                      <CCol>
                        <img src={logo} alt='Logo'
                          style={{
                            padding: '5px',
                            width: '50px', height: '50px'
                          }} />
                        <img src={logoname} alt='Company'
                          style={{
                            backgroundColor: 'white',
                            padding: '5px', borderRadius: '5px',
                            width: '180px', height: '50px'
                          }} />
                      </CCol>
                    </CRow>
                    <p className="text-body-secondary">Sign In to HRMS Portal</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CTooltip
                        content="username"
                        trigger={['hover']}
                      >
                        <CFormInput
                          placeholder="Username"
                          autoComplete="username"
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value);
                          }} />
                      </CTooltip>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CTooltip
                        content="password"
                        trigger={['hover']}
                      >
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                      </CTooltip>
                    </CInputGroup>
                    <CRow>
                      <CCol xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <CTooltip
                          content="login"
                          trigger={['hover']}
                        >
                          <CButton color="primary" className="px-4" onClick={handleLogin}>
                            Login
                          </CButton>
                        </CTooltip>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
