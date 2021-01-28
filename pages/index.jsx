import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cookies from 'next-cookies'

import Header from 'containers/Header';
import LoginContainer from 'containers/LoginContainer';

export default function Home(props) { 

  const [loggedIn, setLoggedIn] = useState(props.loggedIn);
  const [loginDropdown, setLoginDropdown] = useState(false);
  const [loginRoute, setLoginRoute] = useState('/');
  const [loginMessage, setLoginMessage] = useState('');
  const [loginError, setLoginError] = useState('');
  const [username, setUsername] = useState(props.username);
  const [email, setEmail] = useState(''); 
  const [resendEmailLink, displayResendEmailLink] = useState(false);

  useEffect(() => {
    console.log('useEffect firing');
    console.log('props', props);

    if (props.renderFromCookie) {
      console.log('rendering from cookie')
      if (props.loginRoute) setLoginRoute(props.loginRoute);
      if (props.email) setLoginRoute(props.email);
      if (props.loginDropdown) setLoginDropdown(props.loginDropdown);
      if (props.loginMessage) setLoginMessage(props.loginMessage);
    };

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

const DEV_ROUTE = process.env.DEV_ROUTE;

export async function getServerSideProps(context) {

  console.log('getting server side props');

  /* Check for cookies */
  const cooks = cookies(context);

  if (cooks.authenticated) { // exists after you authenticate email
    console.log('rendering authenticated cookie')
    const username = decodeURIComponent(cooks.authenticated.split('XXX')[1]); // make this better
    return { props: {
      renderFromCookie: true,
      loggedIn: false,
      loginRoute: '/login',
      loginDropdown: true,
      username: username,
      loginMessage: 'Email verified. Please enter your password.'
    }};
  }

  else if (cooks.reset_password) { // exists after you reset password
    console.log('rendering reset_password cookie')
    const email = decodeURIComponent(document.cookie.split('XXX')[1]);
    return { props: {
      renderFromCookie: true,
      loggedIn: false,
      username: '',
      loginRoute: '/resetPassword',
      loginDropdown: true,
      email: email,
      loginMessage: `Please enter a new password for ${email}.`
    }};
  }
  /* If no access token, return no data */
  else if (!cooks.access_token) { 
    console.log('no access token')
    return {
      props: {
        loggedIn: false,
        username: '',
        renderFromCookie: false,
      }
    }
  }

  /* Check if access_token is valid. If so, it populates the page with user data */
  console.log('found access token')

  const payload = { access_token: cooks.access_token };
  return axios.post(`${DEV_ROUTE}/api/user/home`, payload)
    .then(res => {
      return (res.data.loggedIn)
        ? {
            props: {
              loggedIn: true,
              username: res.data.username,
              renderFromCookie: false,
            }
          }
        : {
            props: { 
              loggedIn: false,
              username: '',
              renderFromCookie: false,
            }
          }
      
    })
    .catch(err => {
      console.log('something went wrong while verifying access token', err);
      return {};
    })

};
