import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
import "../ChatGroupRelated/Chat.css";
import Footer from '../Features/Footer';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getChatGroupData, getChatGroupUsersData, getLast20Messages } from "../../features/chatgroups/chatgroupSlice";
const socket = io("http://localhost:3001");

function Chat() {
  const navigate = useNavigate();
  const { chatGroupId } = useParams();
  const [message, setMessage] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const { loggedIn } = useSelector( (state) => state.auth );
  const { chatGroupData, loading } = useSelector((state) => state.chatGroups);
  const { userProfileInfo } = useSelector((state) => state.user);
  const [chatGroupUsers, setChatGroupUsers] = useState([]);
  const [chatGroup, setChatGroup] = useState({});
  const token = sessionStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  console.log("MessageList: ",messagesList)
  useEffect(() => {
      const getChatGroupUsers = async () => {
        try {
          dispatch(getChatGroupUsersData(chatGroupId)).then((result) => {
            setChatGroupUsers(result.payload);
            setIsLoading(false);
          }); 
          
        } catch (error) {
          console.error(error);
        }
      };
      getChatGroupUsers();
  }, [isLoading, chatGroupId, token]);

  useEffect(() => {
    const getChatGroup = async () => {
      try {
        dispatch(getChatGroupData(chatGroupId)).then(()=>{
          setChatGroup(chatGroupData);
        })
      } catch (error) {
        console.log(error);
      }
    };
    getChatGroup();
  }, [chatGroupId, token]);
  useEffect(() => {
    const getlast20Messages = async () => {
      try {
        dispatch(getLast20Messages(chatGroupId)).then((result)=>{
          setMessagesList(result.payload);
        })
      } catch (error) {
        console.log(error);
      }
    };
    getlast20Messages();
  }, [chatGroupId, token]);
  
  useEffect(() => {

    socket.emit('join', { chatGroupID: chatGroupId, user: { socketId: socket.id, ...userProfileInfo} } );
    
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
      socket.emit('createMessage', { chatGroupID: chatGroupId, senderUser:userProfileInfo._id, text: message });
      setMessage("");
    }
  }

  const handleNewMessage = (newMessage) => {
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
                    {loggedIn ? 
                    ( loading ? 'Loading...' : 
                    ( 
                      messagesList ?
                      messagesList.map(( msg, index ) => (
                        <li key={index}>
                            <div>
                                <span className="username">{ msg.senderUser }:</span>
                                <span className="message">{ msg.text }</span>
                            </div>
                        </li>
                        )) : 
                        'Messages could not retrieved...' 
                        )) : 
                        null}
                </ul>
                <div className="message-input">
                    <input
                        type='text'
                        value={ message }
                        onChange={ e => setMessage( e.target.value )}
                    />
                    <button onClick={ handleSubmitNewMessage } >Submit</button>
                </div>
            </div>
            <button onClick={ navigateToChatGroup } className="chat-group__card-button">
                Chat Group Settings
            </button>
        </div>
        <Footer />
    </>
    );
}

export default Chat;
