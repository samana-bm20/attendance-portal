import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CDropdownDivider,
  CDropdownHeader,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
  CButton,
  CTooltip,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormLabel,
  CFormInput,
  CRow,
  CCol,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilContrast,
  cilAccountLogout,
  cilPowerStandby,
  cilUser,
  cilLockLocked,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons';
import axios from 'axios'
import { Remove_User } from "./actions";
import { toast } from "react-toastify";
import Config from "../Config";

const AppHeader = () => {
  const user = useSelector((state) => state.user);
  const headerRef = useRef();
  const dispatch = useDispatch();
  const logout = () => dispatch(Remove_User());
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const [fullname, setFullname] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const sidebarShow = useSelector((state) => state.sidebarShow);

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0);
    });
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}/name?empid=${user?.empid}`);
        setFullname(response.data.data);
      } catch (error) {
        console.error('Error checking all absent', error);
        return false;
      }
    };
    fetchUser();
  }, [user?.empid]);

  const openModal = () => {
    setShowPasswordDialog(true);
  };

  const handlePasswordCancel = () => {
    setShowPasswordDialog(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleNewPassword = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handlePasswordChange = async () => {
    try {
      if (!newPassword || !confirmPassword) {
        toast.error("Password fields cannot be empty.", { autoClose: 3000 });
        return;
      }
      if (newPassword === confirmPassword) {
        let params = {
          "EmpID": user?.empid,
          "Password": newPassword,
        }
        const response = await axios.put(`${Config.apiUrl}/password`, params);
        console.log(response.data);
        setShowPasswordDialog(false);
        setNewPassword('');
        setConfirmPassword('');
        toast.success("Password changed successfully.", { autoClose: 3000 });
      } else {
        toast.error("New password and confirm password do not match.", { autoClose: 3000 });
      }
    } catch {
      toast.error("Error in changing password.", { autoClose: 3000 });
    }
  };



  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CTooltip
          content="Menu"
          trigger={['hover']}
        >
          <CHeaderToggler
            onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
            style={{ marginInlineStart: '-14px' }}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
        </CTooltip>
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink to="/dashboard" as={NavLink} style={{ fontWeight: 'bold' }}>
              <h4>Human Resource Management System</h4>
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
            <CDropdown variant="nav-item" placement="bottom-end">
              <CDropdownToggle caret={false}>
                {colorMode === 'dark' ? (
                  <CIcon icon={cilMoon} size="lg" />
                ) : colorMode === 'auto' ? (
                  <CIcon icon={cilContrast} size="lg" />
                ) : (
                  <CIcon icon={cilSun} size="lg" />
                )}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem
                  active={colorMode === 'light'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('light')}
                >
                  <CIcon className="me-2" icon={cilSun} size="lg" /> Light
                </CDropdownItem>
                <CDropdownItem
                  active={colorMode === 'dark'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('dark')}
                >
                  <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
                </CDropdownItem>
                <CDropdownItem
                  active={colorMode === 'auto'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('auto')}
                >
                  <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          <CTooltip
            content="Logout"
            trigger={['hover']}
          >
            <CDropdown variant="nav-item">
              <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
                <CButton
                  color='danger'>
                  <CIcon icon={cilPowerStandby} />
                </CButton>
              </CDropdownToggle>
              <CDropdownMenu className="pt-0" placement="bottom-end">
                <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Account</CDropdownHeader>
                <CDropdownItem>
                  <CIcon icon={cilUser} className="me-2" />
                  {user?.name}
                </CDropdownItem>
                <CDropdownItem style={{cursor: 'pointer'}} onClick={openModal} >
                  <CIcon icon={cilLockLocked} className="me-2" />
                  Change Password
                </CDropdownItem>
                <CModal visible={showPasswordDialog} onClose={handlePasswordCancel}>
                  <CModalHeader>
                    <CModalTitle>Change Password</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CForm>
                      <CRow className="g-3">
                        <CCol xs style={{ marginBottom: '5px' }}>
                          <CFormLabel id="inputGroupPrepend03">New Password</CFormLabel>
                          <CFormInput
                            type="password"
                            id="password"
                            name='password'
                            placeholder="New password"
                            onChange={handleNewPassword}
                          />
                        </CCol>
                      </CRow>
                      <CRow className="g-3">
                        <CCol xs style={{ marginBottom: '5px' }}>
                          <CFormLabel id="inputGroupPrepend03">Confirm New Password</CFormLabel>
                          <CFormInput
                            type="password"
                            id="confirmpassword"
                            name='confirmpassword'
                            placeholder="Confirm new password"
                            onChange={handleConfirmPassword}
                          />
                        </CCol>
                      </CRow>
                    </CForm>
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={handlePasswordCancel}>
                      Cancel
                    </CButton>
                    <CButton color="primary" onClick={handlePasswordChange}>Submit</CButton>
                  </CModalFooter>
                </CModal>
                <CDropdownDivider />
                <CDropdownItem href="#" onClick={() => logout()}>
                  <CIcon icon={cilAccountLogout} className="me-2" />
                  Logout
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CTooltip>
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <CHeaderNav className="d-md-down-none" style={{ fontWeight: 'bold' }}>Hello, {fullname}</CHeaderNav>
      </CContainer>
    </CHeader>
  );
}

export default AppHeader;
