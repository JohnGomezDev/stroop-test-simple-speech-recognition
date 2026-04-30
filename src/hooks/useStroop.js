import { useCallback, useEffect, useState, useRef } from "react";
import { colorLabels, colors } from "../lib/consts";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const testTime = 45;
const debounceTime = 300;

const useStroop = () => {
  const [display, setDisplay] = useState(null);
  const [displayKey, setDisplayKey] = useState(0);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(testTime);
  const [score, setScore] = useState({
    correct: 0,
    incorrect: 0,
  });
  const [result, setResult] = useState(null);

  const debounceTimer = useRef(null);
  const displayRef = useRef(null);
  const lastTranscript = useRef("");
  const lastProcessedTranscript = useRef("");

  const { listening, resetTranscript, transcript } = useSpeechRecognition();

  const generateRandom = useCallback(() => {
    const randomReal = Math.floor(Math.random() * colors.length);
    const randomLabel = Math.floor(Math.random() * colors.length);
    const next = {
      ...colors[randomReal],
      label: colorLabels[randomLabel],
    };

    displayRef.current = next;
    setDisplay(next);

    setDisplayKey((prev) => prev + 1);
  }, []);

  const start = () => {
    setStarted(true);
    setTime(testTime);
    setScore({ correct: 0, incorrect: 0 });
    generateRandom();
    SpeechRecognition.startListening({ language: "es-CO", continuous: true });
  };

  const stop = () => {
    SpeechRecognition.stopListening();
    clearTimeout(debounceTimer.current);
    lastTranscript.current = "";
    lastProcessedTranscript.current = "";
    displayRef.current = null;
    resetTranscript();
    setStarted(false);
    setDisplay(null);
  };

  useEffect(() => {
    if (!started) return;

    if (time <= 0) {
      stop();
      return;
    }
    const timer = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(timer);
  }, [started, time]);

  useEffect(() => {
    if (!transcript || !started) return;

    lastTranscript.current = transcript;

    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const spoken = lastTranscript.current.toLowerCase().trim();
      if (!spoken || spoken === lastProcessedTranscript.current) return;

      const expected = displayRef.current?.real?.toLowerCase().trim();
      if (!expected) return;

      lastProcessedTranscript.current = spoken;

      if (spoken.includes(expected)) {
        setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
        setResult("correct");
      } else {
        setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
        setResult("incorrect");
      }

      SpeechRecognition.stopListening();
      lastTranscript.current = "";
      lastProcessedTranscript.current = "";
      generateRandom();

      setTimeout(() => {
        SpeechRecognition.startListening({
          language: "es-CO",
          continuous: true,
        });
      }, 150);

      setTimeout(() => setResult(null), 500);
    }, debounceTime);

    return () => clearTimeout(debounceTimer.current);
  }, [transcript, started, generateRandom]);

  return {
    start,
    stop,
    display,
    displayKey,
    started,
    time,
    score,
    result,
  };
};

export default useStroop;
