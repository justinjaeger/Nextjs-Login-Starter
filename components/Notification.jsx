import React, { useEffect } from 'react';
import axios from 'axios';

function Blank(props) { 

  const { notification, setNotification, email, username, setRoute } = props;

  function deleteUserAndSignUpAgain() {
    console.log('email', email)
    // Delete the user by email
    axios.get('/api/signup/deleteUser', { email })
    .then(res => {
      if (res.data.error) return setError(res.data.error);
      setRoute('/signup');
      setNotification(false);
    })
    .catch(err => {
      console.log('err in notification.jsx', err.response);
    })
  };

  // RENDER NOTIFICATION
  function renderNotification(type) {
    switch (type) {
      case 'please verify email':
        return [
        <div>Please verify the email sent to: {email} </div>,
        <button 
          id="notif-click-here"
          onClick={() => deleteUserAndSignUpAgain()}
          > Incorrect Email?
        </button>
        ];
      default:
        return type;
    };
  };

  return (
    <>
      {notification && [
        <div id="notification">
          <button id="notif-x-button" onClick={() => setNotification(false)}>X</button>
        {renderNotification(notification)}</div>
      ]}
    </>
  );
}

export default Blank;
