import React, { useEffect, useState } from 'react';
import FollowerUnit from 'components/dashboardComponents/FollowerUnit';

function FollowerList(props) { 

  const { array } = props;

  console.log('Rendering Array')

  /* Create array of components */
  const list = [];
  for (let i=0; i<array.length; i++) list.push(
    <FollowerUnit username={array[i].username} />
  );

  console.log('list', list)

  return (
    <>
      <div id="follower-list">List: {list}</div>
    </>
  );
}

export default FollowerList;
