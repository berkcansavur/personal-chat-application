import React, { useState, useEffect } from "react";
import axios from "axios";
import FriendCard from "../FriendCard";
import Footer from "../Footer";
import "../NetworkRelated/Network.css"
import { Button } from "../Button";

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

  const handleSearch = async () => {
    try {
      // Kullanıcı adına veya e-posta adresine göre arama yap
      const response = await axios.get(
        `http://localhost:3001/app/search-user?searchText=${searchText}`,{
            headers: {
                Authorization: `Bearer ${token}`,
              },
        }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFriendAdded = async (friendEmail) => {
    // Yeni arkadaş eklendiğinde "currentUserFriends" durumunu güncelle
    setCurrentUserFriends((prevFriends) => [...prevFriends, friendEmail]);
    const friendsData = await axios.get(`http://localhost:3001/app/get-friends`,{
      headers:{
        Authorization: `Authorization: Bearer ${token}`,
      }
    });
    setCurrentUserFriends(friendsData.data.map((friend) => friend.email));
  };

  const handleFriendRemoved = async (friendEmail) => {
    // Arkadaş çıkarıldığında "currentUserFriends" durumunu güncelle
    setCurrentUserFriends((prevFriends) => prevFriends.filter((email) => email !== friendEmail));
    
  };

  return (
    <>
    <div className="network">
      <input className="network-name-input"
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Button 
      toOperation='search-friend'
      buttonStyle='btn--outline'
      onClick={handleSearch}>Search</Button>
      <div className="friend-cards">
        {searchResults.map((friend) => (
          <FriendCard
            key={friend._id}
            friend={friend}
            currentUserFriends={currentUserFriends}
            onFriendAdded={handleFriendAdded}
            onFriendRemoved={handleFriendRemoved}
          />
        ))}
      </div>
    </div>
       <Footer/>
    </>
  );
}

export default Network;
