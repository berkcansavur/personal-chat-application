import React, { useState, useEffect } from "react";
import axios from "axios";
import FriendCard from "../FriendCard";

function Network() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/app/search-user?searchText=${searchText}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="network">
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <div className="friend-card">
        {searchResults.map((friend) => (
          <FriendCard key={friend.id} friend={friend}  />
        ))}
      </div>
    </div>
  );
}

export default Network;
