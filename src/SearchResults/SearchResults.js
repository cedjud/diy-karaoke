import React from "react";
import { Link } from "react-router-dom";
import styles from "./SearchResults.module.css";

const SearchResults = ({ results }) => {
  return (
    <>
      <h2 className={styles.heading}>search result</h2>
      <ul className={styles.list}>
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
