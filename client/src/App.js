import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/pages/Home';
import Chats from './components/pages/Chats';
import SignUp from './components/pages/SignUp';
import LogIn from './components/pages/LogIn';
import Chat from './components/pages/Chat';
import UserProfile from './components/pages/UserProfile';
import CreateChatGroupPage from './components/pages/CreatechatGroup';
import Network from './components/pages/Network';
import ChatGroup from './components/pages/ChatGroup';
function App() {
  return(
    <>
    <Router>
    <Navbar/>
    <Routes>
      <Route path='/' exact Component={Home}/>
      <Route path='/chats' Component={Chats}/>
      <Route path='/network' Component={Network}/>
      <Route path='/sign-up' Component={SignUp}/>
      <Route path='/log-in' Component={LogIn}/>
      <Route path='/chat/:chatGroupId' Component={Chat}/>
      <Route path='/profile' Component={UserProfile}/>
      <Route path='/create-chat-group' Component={CreateChatGroupPage}/>
      <Route path='/chat-group/:chatGroupId' Component={ChatGroup}/>
    </Routes>
    </Router>
    </>
      
  );
}

export default App;
