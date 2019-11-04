const apiUrl = process.env.REACT_APP_API_HOST_DEV;

export const geniusSearch = async (searchTerm = `it's not unusual`) => {
  const url = `${apiUrl}searchTracks?searchTerm=${encodeURI(searchTerm)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const geniusGetSong = async (id = 64434) => {
  const url = `${apiUrl}getLyrics?songId=${id}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
