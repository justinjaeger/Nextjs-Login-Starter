import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from 'containers/Header';
import LoginContainer from 'containers/LoginContainer';
import Notification from 'components/Notification';
import { motion } from "framer-motion"

export default function App(props) { 

  const [loggedIn, setLoggedIn] = useState(props.loggedIn);
  const [loginDropdown, setLoginDropdown] = useState(props.loginDropdown);
  const [loginRoute, setLoginRoute] = useState(props.loginRoute);
  const [loginMessage, setLoginMessage] = useState(props.loginMessage);
  const [loginError, setLoginError] = useState(props.loginError);
  const [username, setUsername] = useState(props.username);
  const [email, setEmail] = useState(props.email);
  const [resendEmailLink, setResendEmailLink] = useState(false);
  const [reEnterEmailForPasswordReset, setReEnterEmailForPasswordReset] = useState(false);
  const [reEnterEmailForSignup, setReEnterEmailForSignup] = useState(false);
  const [notification, setNotification] = useState(props.notification);
  const [notificationBox, setNotificationBox] = useState(props.notificationBox);

  // LOG IN
  function login(userData) {
    console.log('logging user in with this data: ', userData)
    setUsername(userData.username);
    setLoggedIn(true);
    setLoginDropdown(false);
    setLoginRoute('/blank');
    setLoginMessage('');
    setLoginError('');
  };

  // LOG OUT
  function logout() {
    axios.get('/api/login/logout')
    .then(res => {
      if (res.data.error) return setError(res.data.error);
      setLoggedIn(false);
      setUsername('');
    })
    .catch(err => {
      console.log('err, could not log out', err.response);
    })
  };

  // X OUT
  function xOut() {
    setLoginDropdown(false);
    setLoginMessage('');
  };

  // REROUTE (has to be its own function cause error messages need to be deleted)
  function redirect(entry) {
    setLoginRoute(entry);
    setLoginError('');
    setLoginMessage('');
    setResendEmailLink(false);
    setReEnterEmailForPasswordReset(false);
    setReEnterEmailForSignup(false);
    setLoginDropdown(true);
  };

  return (
    <div id="App">

      { notificationBox &&
        <Notification 
          setRoute={redirect}
          email={email}
          username={username} setUsername={setUsername}
          setLoginDropdown={setLoginDropdown}
          setMessage={setLoginMessage}
          notification={notification} setNotification={setNotification}
          notificationBox={notificationBox} setNotificationBox={setNotificationBox}
        />
      }

      <Header
        loggedIn={loggedIn}
        logout={logout}
        setRoute={redirect} 
        username ={username}
        setLoginDropdown={setLoginDropdown}
        setMessage={setLoginMessage}
      />

      { loginDropdown && 
        <LoginContainer
          loggedIn={loggedIn} setLoggedIn={setLoggedIn}
          route={loginRoute} setRoute={redirect}
          username={username} setUsername={setUsername}
          email={email} setEmail={setEmail}
          message={loginMessage} setMessage={setLoginMessage}
          error={loginError} setError={setLoginError}
          xOut={xOut}
          login={login}
          resendEmailLink={resendEmailLink}
          setResendEmailLink={setResendEmailLink}
          reEnterEmailForPasswordReset={reEnterEmailForPasswordReset}
          setReEnterEmailForPasswordReset={setReEnterEmailForPasswordReset}
          reEnterEmailForSignup={reEnterEmailForSignup}
          setReEnterEmailForSignup={setReEnterEmailForSignup}
          setLoginDropdown={setLoginDropdown}
          notification={notification} setNotification={setNotification}
          setNotificationBox={setNotificationBox}
        />
      }

    </div>
  );
}
