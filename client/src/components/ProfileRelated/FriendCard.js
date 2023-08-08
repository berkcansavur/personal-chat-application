// FriendCard.js
import React from "react";
import "./FriendCard.css";

function FriendCard({ friend }) {
  return (
    <div className="friend-card">
      <img src="https://www.anagard.com/blog/wp-content/uploads/2014/02/2011-03-12-twitter-egg.png" alt={friend.name} />
      <h5>{friend.name}</h5>
      <h5>{friend.email}</h5>
    </div>
  );
}

export default FriendCard;
