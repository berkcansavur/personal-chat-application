import React, { useState, useEffect } from "react";
import axios from "axios";
import './FriendCard.css';
import { useNotification } from "./Contexts/notification.context";
import io from 'socket.io-client';

const socket = io("http://localhost:3001");

function FriendCard({ friend, currentUserFriends, onFriendAdded, onFriendRemoved }) {
  const token = sessionStorage.getItem("token");
  const [isFriend, setIsFriend] = useState(currentUserFriends.includes(friend.email));
  const {notificationsList, createNotification} = useNotification();
  const [ user, setUser ] = useState({});
  console.log("Friend Card Notifications List",notificationsList);
  useEffect(() => {
    const getProfileData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/app/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getProfileData();
  }, [token]);
  
  useEffect(()=>{

    socket.emit('createNotification', {
      UserIdToBeNotified:user._id, 
      socketId:socket.id
    });

    socket.on('addFriend', ({
      UserIdToBeNotified,
      ReturnNotificationMessage,
      NotificationType}) => {
        if(UserIdToBeNotified === user._id) {
          createNotification({
          UserIdToBeNotified,
          ReturnNotificationMessage,
          NotificationType
        })
        ;}
      })
      socket.on('removeFriend', ({
        UserIdToBeNotified,
        ReturnNotificationMessage,
        NotificationType}) => {
          if(UserIdToBeNotified === user._id) {
            createNotification({
            UserIdToBeNotified,
            ReturnNotificationMessage,
            NotificationType
          });}
        })
      return () => {
        socket.off('addFriend');
        socket.off('removeFriend');
      }
  });
  
  useEffect(() => {
    setIsFriend(currentUserFriends.includes(friend.email));
  }, [currentUserFriends, friend.email]);
  const getCurrentDate = () => {
    const now = new Date();
    
    return now.toUTCString();
  }
  const handleSubmitAddFriendNotification = () => {
    
    const newNotification = {
      UserToBeAdded: friend._id, 
      AddedByFriendName: user.name, 
      AddedTime: getCurrentDate(),
    };
    socket.emit('addFriendNotification', {
      UserToBeAdded:newNotification.UserToBeAdded,
      AddedByFriendName:newNotification.AddedByFriendName,
      AddedTime:newNotification.AddedTime
    });
  }
  const handleSubmitRemoveFriendNotification = () => {
    const newNotification = {
      UserToBeRemoved: friend._id, 
      RemovedByFriendName: user.name, 
      RemovedTime: getCurrentDate(),
    };
    
    socket.emit('removeFriendNotification', {
      UserToBeRemoved:newNotification.UserToBeRemoved,
      RemovedByFriendName:newNotification.RemovedByFriendName,
      RemovedTime:newNotification.RemovedTime
    });
  }
  const handleFriendAction = async (action) => {
    try {
      const endpoint = action === "add" ? "add-friend" : "remove-friend";
      const response = await axios.post(
        `http://localhost:3001/app/${endpoint}/${friend._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        if (action === "add") {
          setIsFriend(true);
          onFriendAdded(friend.email);
          
          
        } else {
          setIsFriend(false);
          onFriendRemoved(friend.email);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="friend-card">
      <img src={friend.avatarUrl} alt={friend.name} />
      <h5>{friend.name}</h5>
      {isFriend ? (
        <button className="remove-button" onClick={() => {
          handleFriendAction("remove");
          handleSubmitRemoveFriendNotification();
          setIsFriend(false)}}>Remove Friend</button>
      ) : (
        <button className="add-button" onClick={() => { 
          handleFriendAction("add");
          handleSubmitAddFriendNotification();
          setIsFriend(true)}}>Add Friend</button>
      )}
    </div>
  );
}

export default FriendCard;
