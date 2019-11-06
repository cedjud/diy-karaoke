import React from "react";
import { Link } from "react-router-dom";

const SearchResults = ({ results }) => {
  return (
    <>
      <h1>search result</h1>
      <ul className="results">
        {results &&
          results.map(result => (
            <li key={result.id}>
              <Link to={`/song/${result.id}`}>
                <img src={result.thumbnail} alt="Album art" />
                <span>{result.fullTitle}</span>
              </Link>
            </li>
          ))}
      </ul>
    </>
  );
};

export default SearchResults;
