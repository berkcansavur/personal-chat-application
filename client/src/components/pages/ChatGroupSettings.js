import React, { useEffect, useState } from "react";
import  { useDispatch, useSelector } from 'react-redux';
import { 
  getChatGroupData, 
  addUserToChatGroup,
  removeUserFromChatGroup, 
  deleteChatGroup} from "../../features/chatgrops/chatgroupSlice";
import "../ChatGroupRelated/ChatGroupPage.css";
import { useNavigate, useParams } from "react-router-dom";
import Footer from '../Footer';
import io from 'socket.io-client';
import { useNotification } from "../Contexts/notification.context";
const socket = io("http://localhost:3001");

export default function Chats() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [chatGroup, setChatGroup] = useState({});
  const [chatGroupUsers, setChatGroupUsers] = useState([]);
  const { chatGroupId } = useParams();
  const { getCurrentDate } = useNotification();
  const token = sessionStorage.getItem("token");
  const { userProfileInfo } = useSelector((state) => state.user);
  useEffect(() => {
    const getChatGroup = async () => {
      try {
        dispatch(getChatGroupData(chatGroupId)).then((result) => {
          setChatGroup(result.payload);
        })
        
      } catch (error) {
        console.log(error);
      }
    };
    getChatGroup();
  }, [chatGroupId, token]);

  useEffect(()=>{
    socket.emit('events', {
      eventName: 'getChatGroupUsersEvent',
      socketId: socket.id, 
      userId: userProfileInfo._id});
    socket.on('getChatGroupUsers', ({
      users,
      userId
    })=>{
      
      if(userId === userProfileInfo._id && users) {
        setChatGroupUsers(users);
      }
      
    });
    return () => {
      socket.off('getChatGroupUsers');
    }
  },[socket.id, userProfileInfo, chatGroupUsers]);

  useEffect(()=>{
    handleGetFriendsOfChatGroup();
  },[addUserToChatGroup,removeUserFromChatGroup,userProfileInfo]);

  const handleGetFriendsOfChatGroup = async ()=>{
    try {
      socket.emit( 'getChatGroupUsersEvent', { 
        chatGroupId : chatGroupId, 
        userId : userProfileInfo._id
      })
      
    } catch (error) {
      console.log(error);
    }
  }

  const navigateToChat = () => {
    navigate(`/chat/${chatGroupId}`);
  }
  const handleSubmitAddFriendToChatGroupNotification = (friendId) =>{
    
    const newNotification = {
      UserToBeAdded: friendId, 
      AddedByFriendName: userProfileInfo.name,
      AddedToChatGroupName: chatGroup.chatGroupName, 
      AddedTime: getCurrentDate(),
    };
    socket.emit('addedToChatGroupNotification', {
      UserToBeAdded:newNotification.UserToBeAdded,
      AddedByFriendName:newNotification.AddedByFriendName,
      AddedToChatGroupName:newNotification.AddedToChatGroupName,
      AddedTime:newNotification.AddedTime

    })
  }
  const handleSubmitRemoveFriendFromChatGroupNotification = (friendId) =>{
    
    const newNotification = {
      UserToBeRemoved: friendId, 
      RemovedByFriendName: userProfileInfo.name,
      RemovedFromChatGroupName: chatGroup.chatGroupName, 
      RemovedTime: getCurrentDate(),
    };
    socket.emit('removedFromChatGroupNotification', {
      UserToBeRemoved:newNotification.UserToBeRemoved,
      RemovedByFriendName:newNotification.RemovedByFriendName,
      RemovedFromChatGroupName:newNotification.RemovedFromChatGroupName,
      RemovedTime:newNotification.RemovedTime

    })
  }
  const handleAddFriendToChatGroup = async (friendId) => {
    try {
      const parameters = {
        chatGroupId,
        friendId
      }
      dispatch(addUserToChatGroup(parameters)).then(()=>{
        handleGetFriendsOfChatGroup();
      });
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFriendFromChatGroup = async (friendId) => {
    try {
      const parameters = {
        chatGroupId,
        friendId
      }
      dispatch(removeUserFromChatGroup(parameters)).then(()=>{
        handleGetFriendsOfChatGroup();
      });
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteChatGroup = async () => {
    try {
      dispatch(deleteChatGroup(chatGroupId)).then(()=>{
        navigate('/profile');
      });
      
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
                  handleGetFriendsOfChatGroup();
                  handleSubmitRemoveFriendFromChatGroupNotification(user._id);
                }}
              >
                Remove Friend From Group
              </button>

            </div>
          ))}
        </div>
        <div className="chat-group__cards-wrapper">
          <h3 className="chat-group__section-title">Friends</h3>
          {userProfileInfo.Friends && userProfileInfo.Friends.map((friend) => (
            <div className="chat-group__card" key={friend._id}>
              <h4 className="chat-group__card-title">{friend.name}</h4>
              <p className="chat-group__card-email">{friend.email}</p>
              <button
                className="chat-group__card-button add-button"
                onClick={() => {
                  handleAddFriendToChatGroup(friend._id);
                  handleGetFriendsOfChatGroup();
                  handleSubmitAddFriendToChatGroupNotification(friend._id);}}
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

