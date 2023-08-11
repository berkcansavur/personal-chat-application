import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
import "../ChatGroupRelated/Chat.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
const socket = io("http://localhost:3001");

function Chat() {
    const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const [ user, setUser ] = useState({});
  const [chatGroup, setChatGroup] = useState({});
  const { chatGroupId } = useParams();
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
      } catch (error) {
        console.error(error);
      }
    };
    getProfileData();
  }, [token]);

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
    // Mesajları dinlemek için socket üzerine abone olun
    socket.on('message', ({ chatGroup, senderUser, text }) => {
      handleNewMessage({ chatGroup, senderUser, text });
    });

    // Component unmount olduğunda socket bağlantısını temizle
    return () => {
      socket.off('message');
    };
  }, []);

  const handleSubmitNewMessage = () => {
    if (message.trim() !== "") {
      socket.emit('createMessage', { chatGroup: chatGroupId, senderUser:user.UserID, text: message });
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
    <div className="chat-container">
      <div>
        <ul id='messages'>
          {messagesList.map((msg, index) => (
            <li key={index}>
              <div>
                <span className="username">{msg.senderUser}:</span>
                <span className="message">{msg.text}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="message-input">
          <input
            type='text'
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <button onClick={handleSubmitNewMessage}>Submit</button>
        </div>
      </div>
      <button onClick={navigateToChatGroup} className="chat-group__card-button">
            Go to Chat Group Settings
          </button>
    </div>
  );
}

export default Chat;
