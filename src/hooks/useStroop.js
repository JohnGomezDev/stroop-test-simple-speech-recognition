import { useCallback, useEffect, useState } from "react";
import { colorLabels, colors } from "../lib/consts";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const testTime = 45;

const useStroop = () => {
  const [display, setDisplay] = useState(null);

  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(testTime);

  const [score, setScore] = useState({
    correct: 0,
    incorrect: 0,
  });

  const { resetTranscript, transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const generateRandom = useCallback(() => {
    resetTranscript();

    const randomReal = Math.floor(Math.random() * colors.length);
    const randomLabel = Math.floor(Math.random() * colors.length);

    setDisplay({
      ...colors[randomReal],
      label: colorLabels[randomLabel],
    });
  }, []);

  const start = () => {
    setTime(testTime);
    setStarted(true);
    generateRandom();
    SpeechRecognition.startListening({ language: "es-CO", continuous: true });
  };

  const stop = () => {
    SpeechRecognition.stopListening();
    setStarted(false);
    setDisplay(null);
    setTime(testTime);
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
    if (display && transcript) {
      if (
        transcript.toLowerCase().trim() === display.real.toLowerCase().trim()
      ) {
        setScore({ ...score, correct: score.correct + 1 });
        generateRandom();
      } else {
        setScore({ ...score, incorrect: score.incorrect + 1 });
        generateRandom();
      }
    }
  }, [transcript, display, generateRandom]);

  return {
    start,
    stop,
    display,
    started,
    time,
    score,
  };
};

export default useStroop;
