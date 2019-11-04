const fetch = require("node-fetch");
const { buildSearchUrl } = require("../utils");

const parseSearchResponse = data => {
  const { response } = data;

  if (!response && !response.hits) {
    return "no results";
  } else {
    // console.log(response.hits);
    const results = response.hits.map(hit => ({
      fullTitle: hit.result.full_title,
      title: hit.result.title,
      id: hit.result.id,
      apiPath: hit.result.api_path,
      url: hit.result.url,
      thumbnail: hit.result.song_art_image_thumbnail_url,
      thumbnailFallback: hit.result.header_image_thumbnail_url,
      artist: hit.result.primary_artist && hit.result.primary_artist.name
    }));
    return results;
  }
};

const handleGetSongs = async (req, res) => {
  const { method, query } = req;

  if (method !== "GET") {
    res.status(405).send("Method Not Allowed");
  }

  const searchTerm = query.searchTerm;

  if (!searchTerm) {
    res.status(400).send("Search term missing");
  }

  try {
    const url = buildSearchUrl(searchTerm);
    const searchResults = await fetch(url);
    const searchResultsJSON = await searchResults.json();
    const results = parseSearchResponse(searchResultsJSON);

    res.json(results);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

module.exports = handleGetSongs;
