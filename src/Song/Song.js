import React, { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import classNames from "classnames";
import styles from "./Song.module.css";
import useInterval from "../hooks/useInterval";
import Lyrics from "../components/Lyrics/Lyrics";

const apiUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_HOST_DEV
    : process.env.REACT_APP_API_HOST_PROD;

const Song = ({ id }) => {
  const [song, setSong] = useState(null);
  const [wordMap, setWordMap] = useState([]);
  const [video, setVideo] = useState(null);

  const [displayLyrics, setDisplayLyrics] = useState([]);

  const [wordIndex, setWordIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);

  const [startOffset, setStartOffset] = useState(Date.now());

  const videoPlaying = useRef(false);
  const autoPlaying = useRef(false);
  const isRecording = useRef(false);

  const altWordIndex = useRef(0);
  const timeoutRef = useRef(null);
  const currentWord = useRef(null);
  const previousWord = useRef(undefined);

  useEffect(() => {
    const geniusGetSong = async id => {
      const url = `${apiUrl}getLyrics?songId=${id}`;
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
    updateDisplayLyrics();
  }, [altWordIndex, song]);

  useEffect(() => {
    // console.log("song : ", song);
    // console.log("wordMap : ", wordMap);
    // console.log("displayLyrics : ", displayLyrics);
  }, [wordMap, song, displayLyrics]);

  const updateDisplayLyrics = () => {
    if (song && song.words && altWordIndex.current) {
      const { mappedWords, currentLineIndex } = mapWordsToLines(
        song.words,
        altWordIndex.current
      );
      setDisplayLyrics(mappedWords);
      setLineIndex(currentLineIndex);
    }
  };

  const reset = () => {
    stop();
  };

  const handleVideoReady = e => {
    setVideo(e.target);
  };

  const handleVideoPlay = e => {
    setStartOffset(Date.now());
  };

  const play = () => {
    videoPlaying.current = true;
    video.playVideo();
  };

  const stop = () => {
    setLineIndex(0);
    setWordIndex(0);
    videoPlaying.current = false;
    altWordIndex.current = 0;
    setDisplayLyrics([]);
    video.stopVideo();
    if (isRecording.current) {
      isRecording.current = false;
    }
    if (autoPlaying.current) {
      autoPlaying.current = false;
      window.clearTimeout(timeoutRef.current);
      reset();
    }
  };

  const autoplay = () => {
    console.log("videoPlaying.current : ", videoPlaying.current);
    if (!videoPlaying.current) {
      play();
    }

    if (!autoPlaying.current) {
      autoPlaying.current = true;
    }

    const { words } = song;
    let currentWord = words[altWordIndex.current];
    let previousWord = words[altWordIndex.current - 1] || 0;

    altWordIndex.current = altWordIndex.current + 1;
    updateDisplayLyrics();

    if (currentWord.duration) {
      timeoutRef.current = window.setTimeout(() => {
        // console.log(currentWord);
        // setWordIndex(wordIndex + 1);

        autoplay();
      }, currentWord.duration + (currentWord.startTime - (previousWord.endTime || 0)));
      // }, currentWord.duration);
    } else {
      console.log("ended");
      autoPlaying.current = false;
      window.clearTimeout(timeoutRef.current);
      // reset();
    }
  };

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
    if (!videoPlaying.current && !autoPlaying.current) {
      play();
    }
    // addStartingTimeStamp();
    updateCurrentWord();
    altWordIndex.current += 1;
  };

  const handleEndClick = () => {
    // addEndTimeStamp();
    updateCurrentWord();
    altWordIndex.current += 1;
  };

  const updateCurrentWord = () => {
    if (!isRecording.current) {
      isRecording.current = true;
    }
    // console.log("altWordIndex : ", altWordIndex.current);
    if (song && song.words && altWordIndex) {
      const currentDate = Date.now();
      let newWords = [...song.words];

      if (currentWord.current && currentWord.current.startTime) {
        previousWord.current = {
          ...currentWord.current,
          endTime: currentDate - startOffset,
          duration: currentDate - startOffset - currentWord.current.startTime
        };
      }

      currentWord.current = {
        ...newWords[altWordIndex.current],
        startTime: currentDate - startOffset
      };

      newWords[altWordIndex.current - 1] = previousWord.current;
      // newWords[altWordIndex.current] = currentWord.current;

      setSong({
        ...song,
        words: newWords
      });

      // console.log("newWords : ", newWords);
      // console.log("current word: ", currentWord.current);
      // console.log("previous word: ", previousWord.current);
    }
  };
  // const handleClick = () => {
  //   if (!videoPlaying.current && !autoPlaying.current) {
  //     play();
  //   }

  //   if (altWordIndex.current > 0) {
  //     addEndTimeStamp();
  //     altWordIndex.current += 1;
  //   }
  //   addStartingTimeStamp();
  // };

  // const handleEndClick = () => {
  //   addEndTimeStamp();
  //   altWordIndex.current += 1;
  //   addStartingTimeStamp();
  // };

  const handlePrevClick = () => {
    if (altWordIndex.current > 0) {
      altWordIndex.current -= 1;
    }
  };

  const addStartingTimeStamp = () => {
    const { words } = song;
    const newWords = [...words];
    const startTime = Date.now() - startOffset;
    const index = altWordIndex.current;

    // console.log("startTimeStamp before:", newWords[index]);
    newWords[index] = {
      ...newWords[index],
      startTime
    };

    // console.log("startTimeStamp after:", newWords[index]);
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
    const index = altWordIndex.current;

    // console.log("endTimeStamp before:", newWords[index]);

    newWords[index] = {
      ...newWords[index],
      endTime: endTime,
      duration: endTime - newWords[index].startTime
    };

    setSong({
      ...song,
      words: newWords
    });
  };

  return song ? (
    <section className={styles.container}>
      <YouTube
        videoId={song.youtubeId}
        containerClassName={styles.videoContainer}
        className={styles.video}
        onReady={handleVideoReady}
        onPlay={handleVideoPlay}
      />

      <Lyrics
        wordMap={wordMap}
        displayLyrics={displayLyrics}
        lineIndex={lineIndex}
      />

      <div className={styles.controls}>
        <button
          className={styles.mainButton}
          onPointerDown={handleClick}
          onPointerUp={handleEndClick}
        >
          next word
          {/* {isRecording.current === true ? "true" : "false"} */}
        </button>
        {/* <button onClick={play}>play</button> */}
        <button
          onClick={stop}
          // disabled={isRecording.current || autoPlaying.current}
        >
          stop
        </button>
        <button onClick={autoplay}>
          Karaoke!
          {/* {autoPlaying.current === true ? "true" : "false"} */}
        </button>
        {/* <button onPointerDown={handlePrevClick}>prev word</button> */}
        {/* <button onClick={reset}>reset</button> */}
      </div>
    </section>
  ) : null;
};

export default Song;
