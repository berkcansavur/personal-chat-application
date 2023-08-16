import React, { useEffect, useState } from "react";
import axios from "axios";
import "../ChatGroupRelated/ChatGroupPage.css";
import { useNavigate, useParams } from "react-router-dom";
import Footer from '../Footer';
import io from 'socket.io-client';
const socket = io("http://localhost:3001");

export default function Chats() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [chatGroup, setChatGroup] = useState({});
  const [chatGroupUsers, setChatGroupUsers] = useState([]);
  const { chatGroupId } = useParams();
  const token = sessionStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };
    getChatGroupData();
  }, [chatGroupId, token]);

  useEffect(()=>{
    socket.emit('events', { eventName: 'getChatGroupUsersEvent', socketId: socket.id } );
    socket.on('getChatGroupUsers', (users)=>{
      setChatGroupUsers(users);
    });
    return () => {
      socket.off('getChatGroupUsers');
    }
  },[socket.id]);

  useEffect(()=>{
    handleGetFriendsOfChatGroup();
  }, [chatGroupId]);

  const handleGetFriendsOfChatGroup = async ()=>{
    try {
      socket.emit( 'getChatGroupUsers', { chatGroupId: chatGroupId } )
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (!isLoading) {
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
    }
  }, [isLoading, token]);

  const navigateToChat = () => {
    navigate(`/chat/${chatGroupId}`);
  }

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
      handleGetFriendsOfChatGroup();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFriendFromChatGroup = async (friendId) => {
    try {
      await axios.post(
        `http://localhost:3001/app/remove-friends-from-chat-group/${chatGroupId}/${friendId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleGetFriendsOfChatGroup();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteChatGroup = async () => {
    try {
      await axios.delete(`http://localhost:3001/app/delete-chat-group/${chatGroupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      navigate('/profile');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
    <div className="chat-group__container">
      <div className="chat-group__bg"></div>
      <h2 className="chat-group__name">{chatGroup.chatGroupName}</h2>
      <div className="chat-group__cards-container">
        <div className="chat-group__cards-wrapper">
          <h3 className="chat-group__section-title">Group Members</h3>
          {chatGroupUsers && chatGroupUsers.map((user) => (
            <div className="chat-group__card" key={user._id}>
              <h4 className="chat-group__card-title">{user.name}</h4>
              <p className="chat-group__card-email">{user.email}</p>
              <button
                className="chat-group__card-button remove-button"
                onClick={() => {
                  handleRemoveFriendFromChatGroup(user._id);
                  handleGetFriendsOfChatGroup()}}
              >
                Remove Friend From Group
              </button>

            </div>
          ))}
        </div>
        <div className="chat-group__cards-wrapper">
          <h3 className="chat-group__section-title">Friends</h3>
          {friends && friends.map((friend) => (
            <div className="chat-group__card" key={friend._id}>
              <h4 className="chat-group__card-title">{friend.name}</h4>
              <p className="chat-group__card-email">{friend.email}</p>
              <button
                className="chat-group__card-button add-button"
                onClick={() => {
                  handleAddFriendToChatGroup(friend._id);
                  handleGetFriendsOfChatGroup()}}
              >
                Add Friend to Group
              </button>
            </div>
          ))}
        </div>
        <div>
          <button onClick={navigateToChat} className="chat-group__card-button" >
            Go to Chat
          </button>
        </div>
      </div>
      <div>
      <button className="chat-group__card-button remove-button" onClick={() => handleDeleteChatGroup(chatGroupId)}> Delete Chat Group</button>
      </div>
    </div>
    <Footer/>
    </>
  );
}

