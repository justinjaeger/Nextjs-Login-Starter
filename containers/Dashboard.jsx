import React, { useEffect, useState } from 'react';
import FollowerList from 'components/dashboardComponents/FollowerList';
import axios from 'axios';

function Dashboard(props) { 

  const { loggedIn, profileUsername, username } = props;
  const [followerArray, setFollowerArray] = useState([]);
  const [followingArray, setFollowingArray] = useState([]);
  
  /* Determine if page is YOUR profile or someone else's */
  const isMyProfile = (username === profileUsername) ? true : false;

  useEffect(async () => {
    /* NOTE: FollowerArrays are arrays of objects */
    /* Fetch the user's followers */
    await axios.post('/api/followers/getFollowers', { profileUsername })
      .then(res => {
        console.log('FOLLOWERS 1: ', res.data.followers)
        setFollowerArray(res.data.followers);
      })
      .catch(err => {
        if (err) console.log('something went wrong fetching followers', err);
      })
    /* Fetch who the user is following */
    await axios.post('/api/followers/getFollowing', { profileUsername })
    .then(res => {
      console.log('FOLLOWERS 2: ', res.data.following)
      setFollowingArray(res.data.following);
    })
    .catch(err => {
      if (err) console.log('something went wrong fetching followers', err);
    })
  }, []);

  /* FOLLOW USER */
  function followUser(profileUsername, username) {
    axios.post('/api/followers/followUser', { profileUsername, username })
      .then(res => {
        console.log('finished 1', res.data.followers)
        /* update the followers array */
        setFollowerArray(res.data.followers);
      })
      .catch(err => {
        if (err) console.log('something went wrong fetching followers', err);
      })
  };

  /* UNFOLLOW USER */
  function unfollowUser(profileUsername, username) {
    console.log('clicked unfollow user')
    axios.post('/api/followers/unfollowUser', { profileUsername, username })
      .then(res => {
        console.log('finished 2', res.data.followers)
        /* update the followers array */
        setFollowerArray(res.data.followers);
      })
      .catch(err => {
        if (err) console.log('something went wrong fetching followers', err);
      })
  };

  /* Load the skeleton until the data has been fetched */
  return (
    <>
      { (followerArray===[]) || (!followingArray===[]) &&
        <div>SKELETON...</div>
      }

      <div>Followers: </div>
      <FollowerList 
        array={followerArray}
      />

      <div>Following: </div>
      <FollowerList 
        array={followingArray}
      />

      { isMyProfile &&
        <div>This is your profile and you are logged in</div>
      }

      { !isMyProfile && loggedIn && [
        <div>This is NOT your profile (but you are logged in)</div>,
        <button onClick={() => followUser(profileUsername, username)}>Follow {profileUsername}</button>,
        <button onClick={() => unfollowUser(profileUsername, username)}>Unfollow {profileUsername}</button>
      ]}

      { !loggedIn &&
        <div>you are not logged in</div>
      }
    </>
  );
}

export default Dashboard;
