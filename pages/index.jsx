import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cookies from 'next-cookies';
import { useCookie } from 'next-cookie'
import App from 'containers/App';

export default function Home(props) { 

  return (
    <>
      <App 
        loggedIn={props.loggedIn}
        loginDropdown={props.loginDropdown}
        loginRoute={props.loginRoute}
        loginMessage={props.loginMessage}
        loginError={props.loginError}
        username={props.username}
        email={props.email}
        notification={props.notification}
      />
    </>
  );
};
 

/**
 * Fetch all SSR (user specific) props
 * Begin by declaring all props' default values
 * Depending on what cookies we have and the access token validation,
 * populate the app with specific data
 */

export async function getServerSideProps(context) {

  /* Default values for all props */
  
  const props = { 
    loggedIn: false,
    loginDropdown: false,
    loginRoute: '/',
    loginMessage: '',
    loginError: '',
    username: '',
    email: '',
    notification: false,
  };

  /* Handle cookies */

  const c = cookies(context); // for getting cookies

  if (c.sent_verification) { // cookie exists after you sign up but NOT after you authenticate email
    const username = c.sent_verification.split('*$%&')[0]
    const email = c.sent_verification.split('*$%&')[1]
    props.email = email;
    props.username = username;
    props.notification = 'please verify email';
  };

  if (c.authenticated) { // cookie exists after you authenticate email
    const username = c.authenticated;
    props.loginRoute = '/login';
    props.loginDropdown = true;
    props.username = username;
    props.loginMessage = 'Email verified. Please enter your password.';
  };

  if (c.reset_password) { // cookie exists after you reset password
    const email = c.reset_password;
    props.loginRoute = '/resetPassword';
    props.loginDropdown = true;
    props.email = email;
    props.loginMessage = `Please enter a new password for ${email}.`;
  };

  /* If access token exists, verify it. If so, it populates the page with user data */
  if (c.access_token) { 
    const payload = { access_token: c.access_token };
    /* Request to verify token */
    await axios.post(`${process.env.DEV_ROUTE}/api/user/home`, payload)
      .then(res => {
        console.log('got a result')
        /* Create tokens in browser if applicable */
        const cookie = useCookie(context);
        if (res.data.deleteToken) cookie.remove('access_token');
        if (res.data.newToken) cookie.set('access_token', res.data.newToken, { httpOnly: true });
        /* If token is verified, set props accordingly */
        if (res.data.loggedIn) {
          props.loggedIn = true;
          props.username = res.data.username;
          props.renderFromCookie = false;
        };
      })
      .catch(err => {
        console.log('something went wrong while verifying access token', err);
      })
  };

  /* Return the final props object */
  return { props };
} 
