import React, { useEffect, useState } from "react";

function LoggedOut(props) {
  const { setRoute, setLoginDropdown, setMessage } = props;

  function handleClick(route) {
    // Displays login dropdown and sets route
    setLoginDropdown(true);
    setRoute(route);
    setMessage('');
  };

  return (
    <>
      <button onClick={() => handleClick('/login')} className="header-button" >Log In</button>
      <button onClick={() => handleClick('/signup')} className="header-button">Sign Up</button>
    </>
  );
}

export default LoggedOut;
