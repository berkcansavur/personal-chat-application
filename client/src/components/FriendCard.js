import React, { useState, useEffect } from "react";
import axios from "axios";
import './FriendCard.css';

function FriendCard({ friend, currentUserFriends, onFriendAdded, onFriendRemoved }) {
  const token = sessionStorage.getItem("token");
  const [isFriend, setIsFriend] = useState(currentUserFriends.includes(friend.email));

  useEffect(() => {
    setIsFriend(currentUserFriends.includes(friend.email));
  }, [currentUserFriends, friend.email]);

  const handleFriendAction = async (action) => {
    try {
      // Arkadaş olarak eklemek veya çıkarmak için API çağrısı yap
      const endpoint = action === "add" ? "add-friend" : "remove-friend";
      const response = await axios.post(
        `http://localhost:3001/app/${endpoint}/${friend._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Yanıtı işleyerek duruma göre uyarı ver ve düğmeyi güncelle
      if (response.status === 200) {
        if (action === "add") {
          alert(`${friend.name} is now your friend!`);
          setIsFriend(true);
          onFriendAdded(friend.email);
        } else {
          alert(`${friend.name} is removed from your friends list!`);
          setIsFriend(false);
          onFriendRemoved(friend.email);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="friend-card">
      <img src={friend.avatarUrl} alt={friend.name} />
      <h5>{friend.name}</h5>
      {isFriend ? (
        <button onClick={() => handleFriendAction("remove")}>Remove Friend</button>
      ) : (
        <button onClick={() => handleFriendAction("add")}>Add Friend</button>
      )}
    </div>
  );
}

export default FriendCard;
