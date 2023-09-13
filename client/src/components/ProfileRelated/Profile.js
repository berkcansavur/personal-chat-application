import React, { useEffect, useState } from "react";
import axios from "axios";
import CardItem from "../CardItem";
import FriendsList from "./FriendsList";
import "./Profile.css";
import Navbar from "../Navbar";

function Profile() {
  const [ user, setUser ] = useState({});
  const [ friends, setFriends ] = useState([]);
  const [ friendToAdd, setFriendToAdd ] = useState(null);
  const [selectedChatGroup, setSelectedChatGroup] = useState(null);
  const token = sessionStorage.getItem("token");

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
    <>
      <div className="container">
        <div className="profile__info">
          <div className="profile__pic-wrap">
            <img className="profile__pic profile__pic--default" src="https://www.anagard.com/blog/wp-content/uploads/2014/02/2011-03-12-twitter-egg.png" alt="Profile" />
          </div>
          <div className="profile__details">
            <p className="profile__name">Name: {user.name}</p>
            <p className="profile__email">Email: {user.email}</p>
          </div>
        </div>
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
        <FriendsList friends={friends} friendToAdd={friendToAdd} setFriendToAdd={setFriendToAdd} />       
      </div>
    </>
  );
}

export default Profile;
