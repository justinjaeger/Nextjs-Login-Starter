import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cookies from 'next-cookies';
import { useCookie } from 'next-cookie'

import App from 'containers/App';

export default function Home(props) { 

  return (
    <div id="App">
      <App 
        loggedIn={props.loggedIn}
        loginDropdown={props.loginDropdown}
        loginRoute={props.loginRoute}
        loginMessage={props.loginMessage}
        loginError={props.loginError}
        username={props.username}
        email={props.email}
        resendEmailLink={props.resendEmailLink}
      />
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
  const cooks = cookies(context); // for getting cookies

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
    // return axios.post(`${process.env.DEV_ROUTE}/api/user/main`, payload)
    return axios.post(`${process.env.DEV_ROUTE}/api/user`, payload)
      .then(res => {
        console.log('RESULTING DATA', res.data)
        /* Create tokens in browser if applicable */
        const cookie = useCookie(context);
        if (res.data.deleteToken) cookie.remove('access_token');
        if (res.data.newToken) cookie.set('access_token', res.data.newToken, { httpOnly: true });

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
