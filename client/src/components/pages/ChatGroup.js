import React, { useEffect, useState } from "react";
import axios from "axios";
import "../ChatGroupRelated/ChatGroupPage.css";
import { useParams } from "react-router-dom";
import Footer from '../Footer';

export default function Chats() {

  const [friends, setFriends] = useState([]);
  const [chatGroup, setChatGroup] = useState({});
  const [chatGroupUsers, setChatGroupUsers] = useState([]);
  const { chatGroupId } = useParams();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const getChatGroupData = async () => {
      try {
        const chatGroupData = await axios.get(
          `http://localhost:3001/app/get-chat-group/${chatGroupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChatGroup(chatGroupData.data);
      } catch (error) {
        console.log(error);
      }
    };
    getChatGroupData();
  }, [chatGroupId, token]);

  useEffect(() => {
    const getFriendsOfUser = async () => {
      try {
        const response = await axios.get("http://localhost:3001/app/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFriends(response.data.Friends);
      } catch (error) {
        console.error(error);
      }
    };
    getFriendsOfUser();
  }, [token]);

  useEffect(() => {
    const getChatGroupUsersData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/app/get-chatgroups-friends-data/${chatGroupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChatGroupUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getChatGroupUsersData();
  }, [chatGroupId,token]);

  const handleAddFriendToChatGroup = async (friendId) => {
    try {
      await axios.post(
        `http://localhost:3001/app/add-friends-to-chat-group/${chatGroupId}/${friendId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
        const chatGroupData = await axios.get(
          `http://localhost:3001/app/get-chat-group/${chatGroupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChatGroup(chatGroupData.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemoveFriendFromChatGroup = async (friendId) => {
    try {
      await axios.post(
        `http://localhost:3001/app/remove-friends-to-chat-group/${chatGroupId}/${friendId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
        const chatGroupData = await axios.get(
          `http://localhost:3001/app/get-chat-group/${chatGroupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChatGroup(chatGroupData.data);
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <>
    <div className="chat-group__container">
      <div className="chat-group__bg"></div>
      <h2 className="chat-group__name">{chatGroup.chatGroupName}</h2>
      <p className="chat-group__email">Chat Group ID: {chatGroup._id}</p>
      <div className="chat-group__cards-container">
        <div className="chat-group__cards-wrapper">
          <h3 className="chat-group__section-title">Group Members</h3>
          <ul>
          {chatGroupUsers.map((user) => (
            <div className="chat-group__card" key={user._id}>
              <h4 className="chat-group__card-title">{user.name}</h4>
              <p className="chat-group__card-email">{user.email}</p>
              <button
                className="chat-group__card-button remove-button"
                onClick={() => handleRemoveFriendFromChatGroup(user._id)}
              >
                Remove Friend From Group
              </button>

            </div>
          ))}
          </ul>
        </div>
        <div className="chat-group__cards-wrapper">
          <h3 className="chat-group__section-title">Friends</h3>
          <ul>
          {friends.map((friend) => (
            <div className="chat-group__card" key={friend._id}>
              <h4 className="chat-group__card-title">{friend.name}</h4>
              <p className="chat-group__card-email">{friend.email}</p>
              <button
                className="chat-group__card-button add-button"
                onClick={() => handleAddFriendToChatGroup(friend._id)}
              >
                Add Friend to Group
              </button>
            </div>
          ))}
          </ul>
        </div>
        
      </div>
    </div>
    <Footer/>
    </>
  );
}
