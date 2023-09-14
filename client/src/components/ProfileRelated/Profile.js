import React, { useEffect, useState } from "react";
import axios from "axios";
import CardItem from "../CardItem";
import FriendsList from "./FriendsList";
import FriendCard from "./FriendCard";
import "./Profile.css";
import { useNotification } from '../Contexts/notification.context';
function Profile() {
  const [ user, setUser ] = useState({});
  const [ friends, setFriends ] = useState([]);
  const [ friendToAdd, setFriendToAdd ] = useState(null);
  const [selectedChatGroup, setSelectedChatGroup] = useState(null);
  const token = sessionStorage.getItem("token");
  const { notificationsList } = useNotification();
  
  useEffect(() => {
    const getProfileData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/app/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setFriends(response.data.Friends); 
      } catch (error) {
        console.error(error);
      }
    };
    getProfileData();
  }, [token]);
  

  const handleSelectChatGroup = async (chatGroupId) => {
    try {
      const response = await axios.get(`http://localhost:3001/app/get-chat-group/${chatGroupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedChatGroup(response.data);

    } catch (error) {
      console.error(error);
    }
  };
 return (
  
    <div className="profile-container">
      <div className="profile__info">
        <div className="profile__pic-wrap">
          <img className="profile__pic profile__pic--default" src="https://www.anagard.com/blog/wp-content/uploads/2014/02/2011-03-12-twitter-egg.png" alt="Profile" />
        </div>
          <p className="profile__name">Name: {user.name}</p>
          <p className="profile__email">Email: {user.email}</p>
          <div className="notification-area">
        <h6>Notifications:</h6>
        <ul className="notification-list">
          {notificationsList.map((notification, index) => (
            <li key={index}>{notification.ReturnNotificationMessage}</li>
          ))}
        </ul>
      </div>
      </div>

      

      <div className="content-container">
        
        
        <div className="cards-container">
          <h6>Chat Groups:</h6>
          <div className="cards__container">
            <div className="cards__wrapper">
              <ul className="cards__items">
                {user.ChatGroups &&
                  user.ChatGroups.map((chatGroup) => (
                    <CardItem
                      key={chatGroup._id}
                      src="images/chat-group.jpg"
                      label="Chat Group"
                      path={`/chat/${chatGroup._id}`}
                      chatGroupName={chatGroup.chatGroupName}
                      onSelectChatGroup={() => handleSelectChatGroup(chatGroup._id)}
                    />
                  ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="friends-container">
          <h6>Friends:</h6>
          <div className="friend-cards">
            {friends.map((friend) => (
              <FriendCard key={friend.email} friend={friend} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

}

export default Profile;
