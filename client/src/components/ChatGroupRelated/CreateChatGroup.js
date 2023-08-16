import React, { useState } from 'react';
import axios from 'axios';
import './CreateChatGroup.css';
import { Button } from '../Button';


const ChatGroupPage = () => {
  const [chatGroupName, setChatGroupName] = useState('');
  const token = sessionStorage.getItem("token");
  const handleCreateChatGroup = async () => {
      await axios.post(
        'http://localhost:3001/app/create-chat-group',
        { chatGroupName },
        {headers:{
          Authorization:`Bearer ${token}`,
        }}
      );
  };

  return (
    <div className='chatgroup'>
            <div className='chatgroup__container'>
                <h2>Create Chat Group</h2>
                <form onSubmit={handleCreateChatGroup}>
                    <p>Chat Group Name:</p>
                    <input
                        className='chatgroup-name-input'
                        required
                        type="text"
                        value={chatGroupName}
                        onChange={(e) => {
                            setChatGroupName(e.target.value);
                        }}
                    />
                    <Button
                        toOperation='create-chat-group'
                        buttonStyle='btn--outline'
                        onClick={handleCreateChatGroup}
                    >
                        Create
                    </Button>
                </form>
            </div>
        </div>
  );
};

export default ChatGroupPage;
