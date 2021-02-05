import React, { useEffect } from 'react';
import axios from 'axios';
import { motion } from "framer-motion"

function Blank(props) { 

  const { 
    email, setEmail,
    username, setUsername,
    setRoute,
    setLoginDropdown,
    setMessage,
    notification, setNotification, 
    notificationBox, setNotificationBox
  } = props;

  console.log('username in notification', username)

  // When you click "Incorrect Email?"poaspoaspoasa
  function deleteUserAndSignUpAgain() {
    // Delete the user by email
    axios.post('/api/signup/deleteUser', { email })
    .then(res => {
      if (res.data.error) return setError(res.data.error);
      setRoute('/signup');
      setUsername(username);
      setNotificationBox(false);
      setMessage(res.data.message);
      setLoginDropdown(true);
    })
    .catch(err => {
      console.log('err in notification.jsx', err.response);
    })
  };

  // RENDER NOTIFICATION MESSAGE
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
      <motion.div id="notification" 
        animate={ notificationBox ? { opacity: 1 } : { opacity: 0 }  } 
        initial={{ opacity: 0 }}
        transition={{ delay: 0, duration: 0.5 }}
      >
        <button id="notif-x-button" onClick={() => setNotificationBox(false)}>X</button>
        {renderNotification(notification)}
      </motion.div>
    </>
  );
}

export default Blank;
