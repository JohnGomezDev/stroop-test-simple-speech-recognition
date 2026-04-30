import useStroop from "./hooks/useStroop";
import { useSpeechRecognition } from "react-speech-recognition";
import "./App.css";

function App() {
  const { listening, transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const { start, stop, started, display, displayKey, time, score, result } =
    useStroop();

  if (!browserSupportsSpeechRecognition) {
    return (
      <span>Este navegador no es compatible con el reconocimiento de voz.</span>
    );
  }

  return (
    <main>
      <div className="card">
        <h1>Test de Stroop</h1>
        <p className="subtitle">
          Lee el <em>color</em> de la tinta, no la palabra escrita
        </p>

        {!started ? (
          <button onClick={start}>Iniciar test</button>
        ) : (
          <button onClick={stop}>Detener test</button>
        )}

        <div className="timer-box">
          <span className="timer-label">Tiempo</span>
          <span className="timer-value" id="time">
            {time}
          </span>
        </div>

        <div>
          <h3>{listening ? "Escuchando..." : "Apagado"}</h3>
          <p>{transcript}</p>
        </div>

        <pre>{JSON.stringify(score, null, 2)}</pre>

        <div className="display-box">
          <h2
            key={displayKey}
            className="word-display"
            id="word"
            style={{ color: display?.hex ?? "#000000" }}
          >
            {display?.label ?? "- -"}
          </h2>

          {result && (
            <div key={result + displayKey} className={`result ${result}`}>
              {result === "correct" ? "✓" : "✗"}
            </div>
          )}
        </div>

        {time === 0 && (
          <>
            <div className="score-box" id="score-box">
              <div className="score-icon correct">✓</div>
              <span className="score-text">Respuestas correctas</span>
              <span className="score-number" id="score-num">
                {score.correct}
              </span>
            </div>
            <div className="score-box" id="score-box">
              <div className="score-icon incorrect">✗</div>
              <span className="score-text">Respuestas incorrectas</span>
              <span className="score-number" id="score-num">
                {score.incorrect}
              </span>
            </div>
          </>
        )}
      </div>

      <p className="legal">Hecho por: John Gómez - Desarrollador web</p>
    </main>
  );
}

export default App;
