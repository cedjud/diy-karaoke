import React, { useState } from "react";

const Search = ({ searchAction, results }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        placeholder="Song, artists, etc.."
        onChange={e => {
          setInputValue(e.target.value);
        }}
      />
      <button onClick={() => searchAction(inputValue)}>search</button>
    </div>
  );
};

export default Search;
