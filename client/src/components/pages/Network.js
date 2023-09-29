import React, { useState, useEffect } from "react";
import axios from "axios";
import FriendCard from "../Features/FriendCard";
import Footer from "../Features/Footer";
import "../NetworkRelated/Network.css"
import { Button } from "../Features/Button";
import io from 'socket.io-client';
import { useDispatch, useSelector } from "react-redux";
import { getUsersFriends } from "../../features/user/userSlice";
const socket = io("http://localhost:3001");

function Network() {
  const token = sessionStorage.getItem("token");
  const {userProfileInfo} = useSelector((state)=> state.user);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentUserFriends, setCurrentUserFriends] = useState([]);
  const dispatch = useDispatch();
  const { loggedIn } = useSelector((state)=> state.auth)
    useEffect(() => {
      const fetchFriends = async () => {
        try {
          dispatch(getUsersFriends(token)).then((result)=>{
            if(result.payload){
              setCurrentUserFriends(result.payload.map((friend) => friend.email));
            }
            
          })
        } catch (error) {
          console.error(error);
        }
      };
      fetchFriends();
    }, [token,]);
  
    useEffect(()=>{
      
       if(userProfileInfo){ 
        socket.emit('events', { 
          eventName: 'searchUserEvent', 
          socketId: socket.id, 
          userId: userProfileInfo._id});
        socket.on('searchUser',({
          users,
          userId
        })=>{
          if(userId === userProfileInfo._id && users){
            console.log(users)
            setSearchResults(users);
          }
          
        })
        return () => {
          socket.off('searchUser');
        }}
    },[socket.id, userProfileInfo,searchText]);
  
    useEffect(() => {
      handleSearchFriendsOfUser();
    }, [searchText]);
    
    
  
    const handleSearchFriendsOfUser = async ()=>{
      if(userProfileInfo){
        if (searchText.trim() === "") {
          setSearchResults([]);
          return;
        }
        try {
          socket.emit('searchUserEvent',{
            searchText: searchText,
            userId: userProfileInfo._id
          })
        } catch (error) {
          console.error(error);
        }
      }
      
    }
    const handleFriendAdded = async (friendEmail) => {
      setCurrentUserFriends((prevFriends) => [...prevFriends, friendEmail]);
      setSearchResults((prevResults) =>
        prevResults.map((friend) =>
          friend.email === friendEmail
            ? { ...friend, isFriend: true }
            : friend
        )
      );
    };
  
    const handleFriendRemoved = async (friendEmail) => {
      setCurrentUserFriends((prevFriends) =>
        prevFriends.filter((email) => email !== friendEmail)
      );
      setSearchResults((prevResults) =>
        prevResults.map((friend) =>
          friend.email === friendEmail
            ? { ...friend, isFriend: false }
            : friend
        )
      );
    };

    if(loggedIn && userProfileInfo){
      return (
        <>
        <div className="network">
          <div className="search-bar">
            <input className="network-name-input"
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value)}}
            />
            <Button 
            toOperation='search-friend'
            buttonStyle='btn--outline'
            onClick={handleSearchFriendsOfUser}>Search</Button>
          </div>
          <div className="friend-cards">
          {searchResults ? searchResults.length > 0 ? (
                searchResults.map((friend) => (
                  <FriendCard
                    key={friend._id}
                    friend={friend}
                    currentUserFriends={currentUserFriends}
                    onFriendAdded={handleFriendAdded}
                    onFriendRemoved={handleFriendRemoved}
                  />
                ))
              ) : (
                <h6>{searchText.trim() === "" ? "Enter username or email" : "No results found"}</h6>
              ): null}
          </div>
        </div>
           <Footer/>
        </>
      );
    }else{
      return (
        <>
        <div className='chatgroup'>
                <div className='chatgroup__container'>
                    <h2>You need to register for search users</h2>

                        <div className='sign-up__wrapper'>
                            <p>Don't you have an account? Click to create one.</p>
                                <form>
                                <Button toOperation='signup' buttonStyle='btn--outline'>Create an Account</Button>
                                </form>
                        </div>

                </div>
            </div>
        <Footer/>
        </>
        
    )
    }
  
}

export default Network;
