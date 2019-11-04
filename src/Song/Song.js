import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import classNames from "classnames";
import styles from "./Song.module.css";
import useInterval from "../hooks/useInterval";

const Song = ({ id }) => {
  const [song, setSong] = useState(null);
  const [wordMap, setWordMap] = useState([]);
  const [video, setVideo] = useState(null);

  const [displayLyrics, setDisplayLyrics] = useState([]);

  const [wordIndex, setWordIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);

  const [startOffset, setStartOffset] = useState(Date.now());

  // const [autoPlaying, setAutoplaying] = useState(false);

  // useInterval(() => {
  //   setWordIndex(wordIndex + 1);
  // }, 1000);

  useEffect(() => {
    const geniusGetSong = async id => {
      const url = `http://localhost:5000/nst-prototype/us-central1/getLyrics?songId=${id}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setSong(data);
      } catch (error) {
        console.error(error);
      }
    };

    geniusGetSong(id);
  }, []);

  useEffect(() => {
    if (song && song.words && wordMap.length < 1) {
      const { mappedWords } = mapWordsToLines(song.words, song.words.length);
      setWordMap(mappedWords);
    }
  }, [song, wordMap]);

  useEffect(() => {
    if (song && song.words && wordIndex) {
      const { mappedWords, currentLineIndex } = mapWordsToLines(
        song.words,
        wordIndex
      );
      setDisplayLyrics(mappedWords);
      setLineIndex(currentLineIndex);
    }
  }, [wordIndex, song]);

  useEffect(() => {
    // console.log("song : ", song);
    // console.log("wordMap : ", wordMap);
    // console.log("displayLyrics : ", displayLyrics);
  }, [wordMap, song, displayLyrics]);

  const reset = () => {
    setLineIndex(0);
    setWordIndex(0);
    setDisplayLyrics([]);
    video.stopVideo();
  };

  const handleVideoReady = e => {
    setVideo(e.target);
  };

  // const handleVideoPlay = e => {
  //   setStartOffset(Date.now());
  // };

  const play = () => {
    video.playVideo();
  };

  // const autoplay = () => {
  //   setAutoplaying(true);
  // };

  const mapWordsToLines = (words, index) => {
    const wordSlice = words.slice(0, index);

    let currentLineIndex;
    if (wordSlice.length > 0) {
      currentLineIndex = wordSlice[wordSlice.length - 1].line;
    } else {
      currentLineIndex = 0;
    }

    const mappedWords = wordSlice.reduce((acc, word, index) => {
      if (acc[word.line] === undefined) {
        acc[word.line] = [];
      }

      acc[word.line].push(word);
      return acc;
    }, []);

    return { mappedWords, currentLineIndex };
  };

  const handleClick = () => {
    addStartingTimeStamp();
  };

  const handleEndClick = () => {
    addEndTimeStamp();
    setWordIndex(wordIndex + 1);
  };

  const handlePrevClick = () => {
    if (wordIndex > 0) {
      setWordIndex(wordIndex - 1);
    }
  };

  const addStartingTimeStamp = () => {
    const { words } = song;
    const newWords = [...words];
    const startTime = Date.now() - startOffset;

    newWords[wordIndex] = {
      ...newWords[wordIndex],
      startTime
    };

    setSong({
      ...song,
      words: newWords
    });
  };

  const addEndTimeStamp = () => {
    const { words } = song;
    const newWords = [...words];
    const newWord = newWords[wordIndex];
    const endTime = Date.now() - startOffset;

    newWords[wordIndex] = {
      ...newWords[wordIndex],
      endTime: endTime,
      duration: endTime - newWord.startTime
    };

    setSong({
      ...song,
      words: newWords
    });
  };

  return song ? (
    <section className={styles.container}>
      {/* <YouTube
        videoId={song.youtubeId}
        containerClassName={styles.videoContainer}
        className={styles.video}
        onReady={handleVideoReady}
        // onPlay={handleVideoPlay}
      /> */}

      <div>
        <button onClick={play}>play</button>
        {/* <button onClick={autoplay}>auto play </button> */}
        <button onPointerDown={handlePrevClick}>prev word</button>
        <button onPointerDown={handleClick} onPointerUp={handleEndClick}>
          next word
        </button>
        <button onClick={reset}>reset</button>
      </div>

      <div className={styles.lyrics}>
        {/* Display previous line */}
        {displayLyrics.length > 1 && lineIndex >= 1 && (
          <p className={styles.previousLine}>
            {displayLyrics[lineIndex - 1].map((word, index) => (
              <span key={`previous-word-${index}`}>{word.word}</span>
            ))}
          </p>
        )}
        {/* Display current line */}
        {displayLyrics.length > 0 && (
          <p className={styles.currentLine}>
            {displayLyrics[lineIndex].map((word, index) => (
              <span key={`word-${index}`}>{word.word}</span>
            ))}
          </p>
        )}
        {/* Display current line shadow */}
        {wordMap.length > 0 && (
          <p className={styles.currentLinePreview}>
            {wordMap[lineIndex].map((word, index) => (
              <span key={`word-${index}`}>{word.word}</span>
            ))}
          </p>
        )}
        {wordMap.length > 0 && (
          <p className={styles.nextLine}>
            {wordMap[0].word}
            {wordMap[lineIndex + 1].map((word, index) => (
              <span key={`next-word-${index}`}>{word.word}</span>
            ))}
          </p>
        )}
      </div>
    </section>
  ) : null;
};

export default Song;
