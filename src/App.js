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
    const search = await geniusSearch(searchTerm);
    setSearchResults(search);
    history.push("/search");
  };

  return (
    <div className={styles.wrapper}>
      <header>
        <Search searchAction={handleSearch} />
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
