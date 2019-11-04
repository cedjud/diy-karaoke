const access_token =
  "5SWnUH4FIc0creuMUBS5BD3MepANvCNJPlOaercsWLNrhKsEQ9o1e4ulr04q5IYj";

const buildSearchUrl = searchTerm =>
  `https://api.genius.com/search?q=${encodeURI(
    searchTerm
  )}&access_token=${access_token}`;

const buildSongUrl = songId =>
  `https://api.genius.com/songs/${songId}?access_token=${access_token}`;

const getYoutubeId = url => {
  let re = /^(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
  let id = url.match(re)[7];
  return id;
};

exports.buildSearchUrl = buildSearchUrl;
exports.buildSongUrl = buildSongUrl;
exports.getYoutubeId = getYoutubeId;
