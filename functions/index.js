const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

const handleGetLyrics = require("./modules/handleGetLyrics");
const handleGetSongs = require("./modules/handleGetSongs");

exports.getLyrics = functions.https.onRequest((req, res) =>
  cors(req, res, () => handleGetLyrics(req, res))
);
exports.searchTracks = functions.https.onRequest((req, res) =>
  cors(req, res, () => handleGetSongs(req, res))
);
