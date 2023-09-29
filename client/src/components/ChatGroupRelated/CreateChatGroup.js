import React, { useState } from 'react';
import './CreateChatGroup.css';
import { Button } from '../Features/Button';
import { useDispatch, useSelector } from 'react-redux';
import { createChatGroup } from '../../features/chatgroups/chatgroupSlice';
import { useNavigate } from 'react-router-dom';


const ChatGroupPage = () => {
  const [chatGroupName, setChatGroupName] = useState('');
  const { loggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleCreateChatGroup = async () => {
      dispatch(createChatGroup(chatGroupName)).then((result) => {
        if(result.payload){
            navigate('/profile')
        }
      })
  };
  if(loggedIn){
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
  }else{
    return (
        <div className='chatgroup'>
                <div className='chatgroup__container'>
                    <h2>You need to register for creating a chat group</h2>

                        <div className='sign-up__wrapper'>
                            <p>Don't you have an account? Click to create one.</p>
                                <form>
                                <Button toOperation='signup' buttonStyle='btn--outline'>Create an Account</Button>
                                </form>
                        </div>

                </div>
            </div>
    )
  }
  
};

export default ChatGroupPage;
