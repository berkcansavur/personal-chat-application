import React, { useEffect, useState } from "react";
import axios from "axios";
import "../ChatGroupRelated/ChatGroupPage.css";
import { useParams } from "react-router-dom";

export default function Chats() {
  const [friends, setFriends] = useState([]);
  const [chatGroup, setChatGroup] = useState({});
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
    const getFriendsofUser = async () => {
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
    getFriendsofUser();
  }, [token]);

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
        null, // Burada payload olarak null gönderiyoruz, çünkü payload gerekmiyor.
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
    <div className="chat-group__container">
      <h5 className="chat-group__name">{chatGroup.chatGroupName}</h5>
      <h6 className="chat-group__email">Chat Group ID: {chatGroup._id}</h6>
      <h6>Group Members:</h6>
      <ul>
        {chatGroup.users &&
          chatGroup.users.map((user) => (
            <li key={user.email}>
                {user._id}
                <button onClick={() => handleRemoveFriendFromChatGroup(user._id)}>
                Remove Friend From {chatGroup.chatGroupName}        
                </button>
            </li>
          ))}
      </ul>
      <h6>Friends:</h6>
      <ul>
        {friends &&
          friends.map((friend) => (
            <li key={friend._id}>
              {friend.email}
              <button onClick={() => handleAddFriendToChatGroup(friend._id)}>
                Add Friend to {chatGroup.chatGroupName}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
