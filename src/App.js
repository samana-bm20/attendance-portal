import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import UserContextProvider from './context/UserContextProvider'
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';
import Config from "./Config";
import '@babel/polyfill';
import moment from "moment";
// Containers
import { useIdleTimer } from "react-idle-timer";
import Admin from './layout/Admin';
import SupperAdmin from './layout/SupperAdmin';
import User from './layout/User';
// Pages
const Login = React.lazy(() => import('./components/views/pages/login/Login'));
const Register = React.lazy(() => import('./components/views/pages/register/Register'));

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const storedTheme = useSelector((state) => state.theme);

  const user = useSelector((state) => state.UserReducer.user);

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
            <Route exact path="/register" name="Register Page" element={<Register />} />
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

          {/* Finance */}
          {user?.userType == 2 && (
            <>
              <Route path="*" name="Home" element={<Admin />} />
            </>
          )}

          {/* Admin */}
          {user?.userType == 1 && (
            <>
              <Route path="*" name="Home" element={<SupperAdmin />} />
            </>
          )}

          {/* Ops */}
          {user?.userType == 3 && (
            <>
              <Route path="*" name="Home" element={<User />} />
            </>
          )}
        </Routes>

      </Suspense>
    </UserContextProvider>
  );
}

export default App
