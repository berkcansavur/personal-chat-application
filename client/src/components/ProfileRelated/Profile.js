import React, { useEffect, useState } from "react";
import  { useDispatch, useSelector } from 'react-redux';
import CardItem from "../CardItem";
import FriendCard from "./FriendCard";
import { getProfileData } from "../../features/user/userSlice";
import "./Profile.css";
import { useNotification } from '../Contexts/notification.context';
function Profile() {
  const { userProfileInfo, loading } = useSelector( (state) => state.user );
  const { loggedIn } = useSelector( (state) => state.auth );
  const token = sessionStorage.getItem("token");
  const dispatch = useDispatch();
  const {  notificationsList, getlast10Notifications } = useNotification();
  console.log("Profile",userProfileInfo)
  useEffect(() => {
    dispatch(getProfileData(token))
    getlast10Notifications();
  }, [token]);

    return (
      <div className="profile-container">
        <div className="profile__info">
          <div className="profile__pic-wrap">
            <img className="profile__pic profile__pic--default" src="https://www.anagard.com/blog/wp-content/uploads/2014/02/2011-03-12-twitter-egg.png" alt="Profile" />
          </div>
            <p className="profile__name">Name: {loggedIn ? (loading ? 'loading...' : userProfileInfo ? userProfileInfo.name: null ) : null }</p>
            <p className="profile__email">Email: {loggedIn ? (loading ? 'loading...' : userProfileInfo ? userProfileInfo.email :null ) : null }</p>
            <div className="notification-area">
          <h6>Notifications:</h6>
          <ul className="notification-list">
            { loggedIn ? (notificationsList ? notificationsList.map((notification, index) => (
              <li key={index}>
                <span>{`[ ${notification.NotificationType} ] : `+notification.ReturnNotificationMessage}</span>
                </li>
            )): 'Loading...') : null}
          </ul>
        </div>
        </div>
        <div className="content-container">
          <div className="cards-container">
            <h6>Chat Groups:</h6>
            <div className="cards__container">
              <div className="cards__wrapper">
                <ul className="cards__items">
                {loggedIn ? (loading ? (
                    'Loading...'
                  ) : userProfileInfo && userProfileInfo.ChatGroups ? (
                    userProfileInfo.ChatGroups.map((chatGroup) => (
                      <CardItem
                        key={chatGroup._id}
                        src="images/chat-group.jpg"
                        label="Chat Group"
                        path={`/chat/${chatGroup._id}`}
                        chatGroupName={chatGroup.chatGroupName}
                      />
                    ))
                  ) : null) : null}
                </ul>
              </div>
            </div>
          </div>
          <div className="friends-container">
            <h6>Friends:</h6>
            <div className="friend-cards">
            {loggedIn ? (loading ? (
                'Loading...'
              ) : userProfileInfo && userProfileInfo.Friends ? (
                userProfileInfo.Friends.map((friend) => (
                  <FriendCard key={friend.email} friend={friend} />
                ))
              ) : null) : null }
            </div>
          </div>
        </div>
      </div>
    );

 

}

export default Profile;
