// Inside your App component
import React, { Suspense, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import UserContextProvider from './context/UserContextProvider';
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';
import Config from "./Config";
import '@babel/polyfill';
import moment from "moment";
import { useIdleTimer } from "react-idle-timer";

// Containers
import Admin from './layout/Admin';
import User from './layout/User';

// Pages
const Login = React.lazy(() => import('./components/views/pages/login/Login'));

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const storedTheme = useSelector((state) => state.theme);

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const isSessionExpired = () => {
    if (user) {
      const expireAt = user?.expireAt;
      const currentTime = moment().valueOf();
      const isExpired = moment(currentTime).isAfter(expireAt);
      if (isExpired) {
        window.location.href = "/";
        dispatch(Remove_User());
      }
    }
  };

  const { getRemainingTime } = useIdleTimer({
    onIdle: () => isSessionExpired(),
    timeout: 1000 * 60 * Config.idleTime,
  });

  useEffect(() => isSessionExpired(), []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, [])

  // Accessing remaining idle time
  const remainingIdleTime = getRemainingTime();

  useEffect(() => {
    if (remainingIdleTime !== null) {
      // Do something with the remaining idle time
      console.log(remainingIdleTime);
      // Example: Display a countdown or perform an action when idle time is low
      if (remainingIdleTime <= 10000) {
        // Example action when idle time is less than or equal to 10 seconds (10,000 milliseconds)
        console.log(remainingIdleTime);
      }
    }
  }, [remainingIdleTime]);

  if (!user)
    return (
      <UserContextProvider>
        <ToastContainer
          position="top-center"
          autoClose={10000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
        />
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >
          <Routes>
            <Route exact path="/" name="Login Page" element={<Login />} />
          </Routes>
        </Suspense>
      </UserContextProvider>
    );

  return (
    <UserContextProvider>
      <ToastContainer
        position="top-center"
        autoClose={10000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Admin */}
          {user?.userType == 1 && (
            <>
              <Route path="*" name="Home" element={<Admin />} />
            </>
          )}

          {/* User */}
          {user?.userType == 2 && (
            <>
              <Route path="*" name="Home" element={<User />} />
            </>
          )}
        </Routes>

      </Suspense>
    </UserContextProvider>
  );
}

export default App;
