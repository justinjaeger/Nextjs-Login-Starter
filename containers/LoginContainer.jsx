import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Login from 'components/loginComponents/Login';
import SignUp from 'components/loginComponents/SignUp';
import ForgotPassword from 'components/loginComponents/ForgotPassword';
import ResetPassword from 'components/loginComponents/ResetPassword';
import Blank from 'components/loginComponents/Blank';

const LoginContainer = (props) => {

  const { 
    route, setRoute, 
    username, setUsername,
    email, setEmail,
    message, setMessage,
    error, setError,
    resendEmailLink, setResendEmailLink,
    reEnterEmailLink, setReEnterEmailLink,
    changeEmailLink, setChangeEmailLink,
    xOut,
    login,
    setLoginDropdown,
    setNotification, setNotificationBox
  } = props;

  // RESEND VERIFICATION EMAIL
  function sendVerificationEmail(email, username) {
    const payload = { email, username };
    axios.post('/api/signup/resendVerification', payload)
    .then(res => {
      if (res.data.error) return setError(res.data.error);
      setRoute('/blank');
      setMessage(res.data.message);
      setResendEmailLink(false);
      // setReEnterEmailLink(true);
    })
    .catch(err => {
      console.log('err, could not resend verification email', err.response);
    })
  };

  // TAKE USER TO RESET PASSWORD SCREEN
  function loadPasswordReset() {
    setRoute('/forgotPassword');
    setReEnterEmailLink(false);
  };

  // TAKE USER TO SIGNUP SCREEN
  function loadSignup() {
    setRoute('/signup');
    setChangeEmailLink(false);
  };
  

  // =============================== //
  
  return (
    <div id="login-container">

      <button onClick={() => xOut()} className="x-button">X</button>

      { message && <div className="login-message">{message}</div>}

      { (route === '/login') &&
        <Login 
          setRoute={setRoute}
          username={username}
          login={login}
          setMessage={setMessage}
          setError={setError}
          setResendEmailLink={setResendEmailLink}
          setReEnterEmailLink={setReEnterEmailLink}
        />
      }

      { (route === '/signup') &&
        <SignUp 
          username={username}
          actualSetEmail={setEmail}
          actualSetUsername={setUsername}
          setRoute={setRoute}
          setMessage={setMessage}
          setError={setError}
          setResendEmailLink={setResendEmailLink}
          setReEnterEmailLink={setReEnterEmailLink}
          setLoginDropdown={setLoginDropdown}
          setNotification={setNotification}
          setNotificationBox={setNotificationBox}
        />
      }

      { (route === '/forgotPassword') &&
        <ForgotPassword 
          setRoute={setRoute}
          setMessage={setMessage}
          setError={setError}
          setReEnterEmailLink={setReEnterEmailLink}
        />
      }

      { (route === '/resetPassword') &&
        <ResetPassword 
          email={email}
          setRoute={setRoute}
          setMessage={setMessage}
          setError={setError}
          login={login}
        />
      }

      { (route === '/blank') && 
        <Blank />
      }

      { error && <div className="error-message">{error}</div>}
      
      { resendEmailLink && 
        <div className="login-message">
          <button 
            onClick={() => {sendVerificationEmail(resendEmailLink.email, resendEmailLink.username)}} 
            className="click-here-button"
            >Click here 
          </button> to resend email
        </div> }

      { reEnterEmailLink && 
        <div className="login-message">
          <button 
            onClick={() => {loadPasswordReset()}} 
            className="click-here-button" 
            >Re-enter email
          </button>
        </div> }

      { changeEmailLink && 
        <div className="login-message">
          <button 
            onClick={() => {loadSignup()}} 
            className="click-here-button" 
            >Change email
          </button>
        </div> }

    </div>
  );  
};

export default LoginContainer;
