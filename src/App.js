import React, { useState } from "react";
import { withRouter, Switch, Route } from "react-router-dom";

import Song from "./Song/Song";
import Search from "./Search/Search";
import SearchResults from "./SearchResults/SearchResults";

import { geniusSearch } from "./utils";

import styles from "./App.module.css";

function App({ history }) {
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = async searchTerm => {
    console.log("here");
    try {
      const search = await geniusSearch(searchTerm);
      setSearchResults(search);
      history.push("/search");
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <header>
        <div>
          <h1>DIY Karaoke</h1>
          <Search searchAction={handleSearch} />
        </div>
      </header>

      <main>
        <Switch>
          <Route
            path="/search"
            render={() => <SearchResults results={searchResults} />}
          />
          <Route
            path="/song/:songId"
            render={({ match }) => <Song id={match.params.songId} />}
          />
        </Switch>
      </main>
    </div>
  );
}

export default withRouter(App);
