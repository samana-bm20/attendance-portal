import React, { useEffect, useContext, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  CDropdownItem,
  CRow,
  CCol,
  CTooltip,
} from '@coreui/react'
import UserContext from '../context/UserContext'
import UserContextProvider from '../context/UserContextProvider'
import { AppSidebarNav } from './AppSidebarNav'
import axios from 'axios';
import logo from 'src/assets/MLInfomap.png'
import logoname from 'src/assets/logoname.png'
import Config from "../Config";

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { setMonths } = useContext(UserContext);
  const { employeeNames, setEmployeeNames } = useContext(UserContext);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const [sidebarTooltip, setSidebarTooltip] = useState('Collapse Sidebar');

  const sidebarToggle = () => {
    dispatch({ type: 'set', sidebarUnfoldable: !unfoldable });
    setSidebarTooltip(unfoldable == true ? 'Collapse Sidebar' : 'Expand Sidebar')
  }

  useEffect(() => {
    console.log(sidebarShow);
    const setMonth = (year) => {
      const options = [];

      const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      const currentMonth = new Date().getMonth();

      for (var iYear = year; iYear >= year - 1; iYear--) {
        let monthIndex = 0;
        if (iYear === year) {
          monthIndex = currentMonth;
        }
        else {
          monthIndex = months.length - 1;
        }
        for (let iMonth = monthIndex; iMonth >= 0; iMonth--) {
          const monthName = months[iMonth];
          const correctMonthFormat = monthName + ", " + iYear;
          options.push(<CDropdownItem key={`${iYear}-${monthName}`} value={correctMonthFormat}>{correctMonthFormat}</CDropdownItem>);
        }
      }

      setMonths(options);
    };

    setMonth(year);
  }, [year]);

  useEffect(() => {
    const fetchEmployeeNames = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}/empname`);
        let names = response.data.data.map(employee => employee.name);
        const empNames = [];
        for (let i = 0; i < names.length; i++) {
          empNames.push(<CDropdownItem key={`${i}-${names[i]}`} value={names[i]}>{names[i]}</CDropdownItem>);
        }
        setEmployeeNames(empNames);
      } catch {
        console.error("error fetching employee names.");
      }
    };
    fetchEmployeeNames();
  }, []);

  return (
    <UserContextProvider>
      <CSidebar
        className="border-end"
        colorScheme="dark"
        position="fixed"
        unfoldable={unfoldable}
        visible={sidebarShow}
        onVisibleChange={(visible) => {
          dispatch({ type: 'set', sidebarShow: visible });
        }}
      >
        <CSidebarHeader className="border-bottom">
          <CSidebarBrand to="/">
            <CRow>
              <CCol>
                <img src={logo} alt='Logo'
                  style={{
                    marginInlineStart: '8px', 
                    backgroundColor: 'white',
                    padding: '5px', borderRadius: '5px',
                    width: '40px', height: '40px'
                  }} />
              </CCol>
              <CCol>
                {!unfoldable && (
                  <img src={logoname} alt='Company'
                    style={{
                      backgroundColor: 'white',
                      padding: '5px', borderRadius: '5px',
                      width: '150px', height: '40px'
                    }} />
                )}

              </CCol>
            </CRow>
          </CSidebarBrand>
          <CCloseButton
            className="d-lg-none"
            dark
            onClick={() => dispatch({ type: 'set', sidebarShow: false })}
          />
        </CSidebarHeader>
        <AppSidebarNav items={navigation} />
        <CSidebarFooter className="border-top d-none d-lg-flex">
          <CTooltip
            content={sidebarTooltip}
            trigger={['hover']}
          >
            <CSidebarToggler
              onClick={sidebarToggle}
            />
          </CTooltip>
        </CSidebarFooter>
      </CSidebar>
    </UserContextProvider>

  )
}

export default React.memo(AppSidebar)
