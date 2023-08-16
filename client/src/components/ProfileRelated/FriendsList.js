// FriendsList.js
import React from "react";
import FriendCard from "./FriendCard";
import "./FriendsList.css";

function FriendsList({ friends }) {
  return (
    
    <div className="friends-list">
      <h6>Friends:</h6>
      <div className="cards__container">
        <div className="friend-cards">
          {friends.map((friend) => (
            <FriendCard key={friend.email} friend={friend} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FriendsList;
