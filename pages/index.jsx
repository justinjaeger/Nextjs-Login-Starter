import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cookies from 'next-cookies'

import Header from 'containers/Header';
import LoginContainer from 'containers/LoginContainer';

export default function Home(props) { 

  const [loggedIn, setLoggedIn] = useState(props.loggedIn);
  const [loginDropdown, setLoginDropdown] = useState(props.loginDropdown);
  const [loginRoute, setLoginRoute] = useState(props.loginRoute);
  const [loginMessage, setLoginMessage] = useState(props.loginMessage);
  const [loginError, setLoginError] = useState(props.loginError);
  const [username, setUsername] = useState(props.username);
  const [email, setEmail] = useState(props.email); 
  const [resendEmailLink, displayResendEmailLink] = useState(props.resendEmailLink);

  useEffect(() => {
    console.log('useEffect firing');

  }, [loggedIn]);

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
  };

  return (
    <div id="App">
      <Header
        loggedIn={loggedIn}
        logout={logout}
        setRoute={redirect} 
        username ={username}
        setLoginDropdown={setLoginDropdown}
        setMessage={setLoginMessage}
      />

      { (loginDropdown===true) && 
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
          displayResendEmailLink={displayResendEmailLink}
        />
      }
    </div>
  );
};
 
/**
 * Fetch all SSR (user specific) props and passes them to the above component
 */

export async function getServerSideProps(context) {

  console.log('getting server side props');

  /* Default values for all props */
  const props = { 
    loggedIn: false,
    loginDropdown: false,
    loginRoute: '/',
    loginMessage: '',
    loginError: '',
    username: '',
    email: '',
    resendEmailLink: false,
  };

  /* Check for cookies */
  const cooks = cookies(context);

  if (cooks.authenticated) { // exists after you authenticate email
    console.log('rendering authenticated cookie')
    const username = cooks.authenticated;
    props.loginRoute = '/login';
    props.loginDropdown = true;
    props.username = username;
    props.loginMessage = 'Email verified. Please enter your password.';
  };

  if (cooks.reset_password) { // exists after you reset password
    console.log('rendering reset_password cookie')
    const email = cooks.reset_password;

    props.loginRoute = '/resetPassword';
    props.loginDropdown = true;
    props.email = email;
    props.loginMessage = `Please enter a new password for ${email}.`;
  };

  if (cooks.access_token) { 
    /* Check if access_token is valid. If so, it populates the page with user data */
    const payload = { access_token: cooks.access_token };
    return axios.post(`${process.env.DEV_ROUTE}/api/user/main`, payload)
      .then(res => {
        if (res.data.loggedIn) {
          props.loggedIn = true;
          props.username = res.data.username;
          props.renderFromCookie = false;
        };
        return { props };
      })
      .catch(err => {
        console.log('something went wrong while verifying access token', err);
        return { props };
      })
  };

  return { props };

};
