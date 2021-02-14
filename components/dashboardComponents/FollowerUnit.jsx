import React, { useEffect, useState } from 'react';

function FollowerUnit(props) { 

  const { username } = props;

  console.log('FOLLOWER UNIT: ', username)

  return (
    <>
      <div id="follower-unit">USER: {username}</div>
    </>
  );
}

export default FollowerUnit;
