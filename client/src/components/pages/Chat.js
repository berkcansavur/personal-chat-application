import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
import "../ChatGroupRelated/Chat.css";
import axios from "axios";
import Footer from '../Footer';
import { useNavigate, useParams } from "react-router-dom";
const socket = io("http://localhost:3001");

function Chat() {
  const navigate = useNavigate();
  const { chatGroupId } = useParams();
  const [message, setMessage] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const [ user, setUser ] = useState({});
  const [chatGroupUsers, setChatGroupUsers] = useState([]);
  const [chatGroup, setChatGroup] = useState({});
  const token = sessionStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  
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
          setIsLoading(false);
        } catch (error) {
          console.error(error);
        }
      };
      getChatGroupUsersData();
  }, [isLoading, chatGroupId, token]);

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
    const getlast20Messages = async () => {
      try {
        const last20Messages = await axios.get(
          `http://localhost:3001/app/get-last-20-messages/${chatGroupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessagesList(last20Messages.data);
      } catch (error) {
        console.log(error);
      }
    };
    getlast20Messages();
  }, [chatGroupId, token]);
  
  useEffect(() => {

    socket.emit('join', { chatGroupID: chatGroupId, user: { socketId: socket.id, ...user} } );
    
    socket.on('message', ({ chatGroup, senderUser, text }) => {
      if (chatGroup === chatGroupId) {
        handleNewMessage({ chatGroup, senderUser, text });
      }
    });

    return () => {
      socket.off('message');
    };
  }, [chatGroupId]);

  const handleSubmitNewMessage = () => {
    if (message.trim() !== "") {
      socket.emit('createMessage', { chatGroupID: chatGroupId, senderUser:user._id, text: message });
      setMessage(""); // Reset the message input
    }
  }

  const handleNewMessage = (newMessage) => {
    // Check if new message already exists
    if (!messagesList.some(msg => msg.text === newMessage.text && msg.senderUser === newMessage.senderUser)) {
      setMessagesList(prevMessages => [...prevMessages, newMessage]);
    }
  }
  const navigateToChatGroup = () => {
    navigate(`/chat-group/${chatGroupId}`);
  }

  return (
    <>
        <div className="chat-container">
            <div>
                <div className="chat-info">
                    <p>Chat Group Name: { chatGroup.chatGroupName }</p>
                    <p>Chat Group Users: { chatGroupUsers.map( ( cgUser ) => cgUser.name ).join(", ")}</p>
                </div>
                <ul id='messages'>
                    {messagesList.map(( msg, index ) => (
                        <li key={index}>
                            <div>
                                <span className="username">{ msg.senderUser }:</span>
                                <span className="message">{ msg.text }</span>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="message-input">
                    <input
                        type='text'
                        value={ message }
                        onChange={ e => setMessage( e.target.value )}
                    />
                    <button onClick={ handleSubmitNewMessage }>Submit</button>
                </div>
            </div>
            <button onClick={ navigateToChatGroup } className="chat-group__card-button">
                Go to Chat Group Settings
            </button>
        </div>
        <Footer />
    </>
    );
}

export default Chat;
