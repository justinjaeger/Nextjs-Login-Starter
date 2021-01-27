import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Header from 'containers/Header';
import LoginContainer from 'containers/LoginContainer';

export default function Home(props) { 

  // const { username } = props;

  const [loggedIn, setLoggedIn] = useState(props.loggedIn);
  const [loginDropdown, showLoginDropdown] = useState(false);
  const [loginRoute, setLoginRoute] = useState('/');
  const [loginMessage, setLoginMessage] = useState('');
  const [loginError, setLoginError] = useState('');
  const [username, setUsername] = useState(props.username);
  const [email, setEmail] = useState(''); 

  useEffect(() => {
    console.log('useEffect firing');

    /* authenticated cookie exists affter we click the verification link in our email */
    if (document.cookie.includes('authenticated')) {
      const username = decodeURIComponent(document.cookie.split('XXX')[1]);
      setLoginRoute("/login");
      showLoginDropdown(true);
      setUsername(username);
      setLoginMessage("Email verified. Please enter your password");
    };

    /* reset_password cookie exists after we click the reset password link in our email */
    if (document.cookie.includes('reset_password')) {
      const email = decodeURIComponent(document.cookie.split('XXX')[1]);
      setLoginRoute("/resetPassword");
      showLoginDropdown(true);
      setEmail(email);
      setLoginMessage(`Please enter a new password for ${email}`);
    };

  }, [loggedIn]);

  // LOG IN
  function login(userData) {
    console.log('logging user in with this data: ', userData)
    setUsername(userData.username);
    setLoggedIn(true);
    showLoginDropdown(false);
    setLoginMessage('');
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
    showLoginDropdown(false);
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
        showLoginDropdown={showLoginDropdown}
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
        />
      }
    </div>
  );
};
 
/**
 * Fetch all SSR (user specific) props and passes them to the above component
 */

const URL = process.env.DEV_ROUTE;

export async function getServerSideProps(context) {

/* Checks if user is logged in. If so, it populates the page with user data */

    const res = await fetch(`${URL}/api/user/home`);
    const data = await res.json();

    return (data.username === undefined)
      ? {
          props: {
            loggedIn: false,
            username: '',
          }
        }
      : {
          props: { 
            loggedIn: true,
            username: data.username,
          }
        }
  };
