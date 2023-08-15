import React, { useState, useEffect } from "react";
import axios from "axios";
import FriendCard from "../FriendCard";
import Footer from "../Footer";
import "../NetworkRelated/Network.css"
import { Button } from "../Button";
import io from 'socket.io-client';
const socket = io("http://localhost:3001");

function Network() {
  const token = sessionStorage.getItem("token");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentUserFriends, setCurrentUserFriends] = useState([]);
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get("http://localhost:3001/app/get-friends", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUserFriends(response.data.map((friend) => friend.email));
      } catch (error) {
        console.error(error);
      }
    };
    fetchFriends();
  }, [token]);

  useEffect(()=>{
    socket.emit('events', { eventName: 'searchUserEvent', socketId:socket.id });
    socket.on('searchUser',(users)=>{
      setSearchResults(users);
    })
    return ()=>{
      socket.off('searchUser');
    }
  },[socket.id]);

  useEffect(() => {
    handleSearchFriendsOfUser();
  }, [searchText]);
  const handleSearchFriendsOfUser = async ()=>{
    if (searchText.trim() === "") {
      setSearchResults([]);
      return;
    }
    try {
      socket.emit('searchUser',{ searchText: searchText} );
    } catch (error) {
      console.error(error);
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
      {searchResults.length > 0 ? (
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
          )}
      </div>
    </div>
       <Footer/>
    </>
  );
}

export default Network;
