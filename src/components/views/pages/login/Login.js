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
import { cilLockLocked, cilUser, cilLockUnlocked } from '@coreui/icons';
import { toast } from "react-toastify";

import logo from 'src/assets/MLInfomap.png'
import logoname from 'src/assets/logoname.png'

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [Password, setPassword_] = useState('password');
  const [iconType, setIconType] = useState(cilLockLocked);
  const [passwordTooltip, setPasswordTooltip] = useState('Show Password');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let toastId = null;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  const showPassword = () => {
    setPasswordTooltip(Password == 'password'? 'Hide Password' : 'Show Password');
    setPassword_(Password == 'password' ? 'text' : 'password');
    setIconType(iconType == cilLockLocked ? cilLockUnlocked : cilLockLocked);
  }

  const handleLogin = async () => {
    if (!username || !password) {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("Please enter both username and password.", { autoClose: 3000 });
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
        if (toastId) toast.dismiss(toastId);
        toastId = toast.error('Invalid user credentials', { autoClose: 3000 });
      }
    } catch (error) {
      // Handle errors
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error("An error occurred while logging in.", { autoClose: 3000 });
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
                          onChange={(e) => setUsername(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                      </CTooltip>
                    </CInputGroup>
                    <CInputGroup className="mb-4" style={{ cursor: 'pointer' }}>
                      <CInputGroupText>
                        <CTooltip content={passwordTooltip} trigger={['hover']}>
                          <CIcon icon={iconType} onClick={showPassword} />
                        </CTooltip>
                      </CInputGroupText>
                      <CTooltip
                        content="password"
                        trigger={['hover']}
                      >
                        <CFormInput
                          type={Password}
                          placeholder="Password"
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyPress={handleKeyPress}
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

export default Login;
