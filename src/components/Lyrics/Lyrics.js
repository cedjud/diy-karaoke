import React from "react";

import styles from "./Lyrics.module.css";

const Lyrics = ({ displayLyrics, lineIndex, wordMap }) => {
  return (
    <div className={styles.lyrics}>
      {/* Display previous line */}
      {displayLyrics.length > 1 &&
        lineIndex >= 1 &&
        lineIndex < displayLyrics.length && (
          <p className={styles.previousLine}>
            {displayLyrics[lineIndex - 1].map((word, index) => (
              <span key={`previous-word-${index}`}>{word.word}</span>
            ))}
          </p>
        )}
      {/* Display current line */}

      <div className={styles.currentLines}>
        {displayLyrics.length > 0 && lineIndex < displayLyrics.length && (
          <p className={styles.currentLine}>
            {displayLyrics[lineIndex].map((word, index) => (
              <span key={`word-${index}`}>{word.word}</span>
            ))}
          </p>
        )}

        {/* Display current line shadow */}
        {wordMap.length > 0 && lineIndex < wordMap.length && (
          <p className={styles.currentLinePreview}>
            {wordMap[lineIndex].map((word, index) => (
              <span key={`word-${index}`}>{word.word}</span>
            ))}
          </p>
        )}
      </div>
      {wordMap.length > 0 && lineIndex < wordMap.length - 1 && (
        <p className={styles.nextLine}>
          {wordMap[0].word}
          {wordMap[lineIndex + 1].map((word, index) => (
            <span key={`next-word-${index}`}>{word.word}</span>
          ))}
        </p>
      )}
    </div>
  );
};

export default Lyrics;
