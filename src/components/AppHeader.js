import React, { useEffect, useRef } from 'react';
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilContrast,
  cilAccountLogout,
  cilPowerStandby,
  cilUser,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons';

import { Remove_User } from "./actions";

const AppHeader = () => {
  const user = useSelector((state) => state.user);
  const headerRef = useRef();
  const dispatch = useDispatch();
  const logout = () => dispatch(Remove_User());
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');

  const sidebarShow = useSelector((state) => state.sidebarShow);

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0);
    });
  }, []);

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
              ML INFOMAP : Human Resource Management System
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
        <CTooltip
            content="Mode"
            trigger={['hover']}
          >
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
          </CTooltip>
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
        <CHeaderNav className="d-md-down-none" style={{ fontWeight: 'bold' }}>Hello, {user?.name}</CHeaderNav>
      </CContainer>
    </CHeader>
  );
}

export default AppHeader;
