import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    onSearch(searchText);
  };

  return (
    <div>
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button onClick={handleSearch}>Ara</button>
    </div>
  );
}

export default SearchBar;
