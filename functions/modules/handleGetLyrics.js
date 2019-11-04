const fetch = require("node-fetch");
const $ = require("cheerio");

const { getYoutubeId, buildSongUrl } = require("../utils");

const parseSongData = songData => {
  const { response } = songData;

  if (response && response.song) {
    const { song } = response;

    const parsedData = {
      lyricPath: song.url,
      coverArt: song.header_image_url
    };

    const youtubeData = song.media.filter(medium => {
      console.log(medium.provider);
      return medium.provider === "youtube";
    });

    if (youtubeData && youtubeData.length > 0) {
      const youtubeUrl = youtubeData[0].url;
      parsedData.youtubePath = youtubeUrl;
      parsedData.youtubeId = getYoutubeId(youtubeUrl);
    }

    console.log("parsedData:", parsedData);

    return parsedData;
  }
};

const handleGetLyrics = async (req, res) => {
  const { method, query } = req;

  if (method !== "GET") {
    res.send("wrong method");
  }

  const songId = query.songId;

  if (!songId) {
    res.send("no song id");
  }

  try {
    const url = buildSongUrl(songId);
    const songRequest = await fetch(url);
    const songData = await songRequest.json();

    const parsedSongData = parseSongData(songData);
    const htmlTest = await fetch(parsedSongData.lyricPath);
    const htmlText = await htmlTest.text();

    let lyrics = $(".lyrics > p", htmlText).text();

    const lyricsArray = lyrics.split("\n");
    const filteredLyricsArray = lyricsArray.filter(line => line !== "");

    const wordArray = filteredLyricsArray.reduce((acc, line, index) => {
      let parsedLine = line.split(" ").map(word => ({
        word: word,
        line: index
      }));

      return acc.concat(parsedLine);
    }, []);

    parsedSongData.lyrics = filteredLyricsArray;
    parsedSongData.words = wordArray;

    console.log(parsedSongData);

    res.json(parsedSongData);
  } catch (err) {
    console.error(err);
    res.send(err);
  }
};

module.exports = handleGetLyrics;
