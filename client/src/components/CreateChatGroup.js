import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import { Button } from './Button';


const ChatGroupPage = () => {
  const [chatGroupName, setChatGroupName] = useState('');
  const token = sessionStorage.getItem("token");
  const handleCreateChatGroup = async () => {
      const response = await axios.post(
        'http://localhost:3001/app/create-chat-group',
        { chatGroupName },
        {headers:{
          Authorization:`Bearer ${token}`,
        }}
      );
  };

  return (
    <div className='sign-up'>
        <div className='sign-up__container'>

                <form onSubmit={handleCreateChatGroup}>
                    <p>Chat Group Name</p>
                    <input className='signup-input'
                    required
                    type="text"
                    value= {chatGroupName}
                    onChange={(e)=> {
                      setChatGroupName(e.target.value)
                    }}
                    />
                    <Button toOperation= 'submit' buttonStyle='btn--outline'>Create</Button>
                </form>
        </div>
    </div>
  );
};

export default ChatGroupPage;
