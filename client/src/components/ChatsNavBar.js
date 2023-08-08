import axios from 'axios';
import { Button } from './Button';
import './Chats.css';
import { useState } from 'react';
function CreateChatGroup(){
    const[chatGroupName, setChatGroupName] = useState('');
    const handleSubmit = (e)=>{
        e.preventDefault();
        console.log();
        axios.post('http://localhost:3001/chat-groups/create-chat-group',{
            chatGroupName:chatGroupName
        })
        
    }
    return (
        <div className='chats__container'>
            <h1>Chat Groups</h1>
            <Button type='submit' toOperation='create-chat-group' buttonStyle='btn--outline' >Create New Chat Group</Button>
        </div>
    )
}
export default CreateChatGroup;