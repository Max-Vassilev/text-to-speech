import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaPlay, FaPause, FaUndo, FaDownload } from "react-icons/fa";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  const generateAudio = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/tts", { text }, { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      setAudioUrl(url);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="app-container">
      <button className="theme-toggle" onClick={toggleDarkMode}>
        {darkMode ? "🌞" : "🌙"}
      </button>
      <div className="card">
        <h1>AI Text-to-Speech</h1>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
        />
        <button
          className={`generate-btn ${loading ? "loading" : ""}`}
          onClick={generateAudio}
        >
          {loading ? "Generating..." : "Generate Audio"}
        </button>
        {audioUrl && (
          <div className="audio-controls">
            <button onClick={() => audioRef.current.play()}><FaPlay /></button>
            <button onClick={() => audioRef.current.pause()}><FaPause /></button>
            <button onClick={() => { audioRef.current.currentTime = 0; }}><FaUndo /></button>
            <a href={audioUrl} download="speech.mp3">
              <button><FaDownload /></button>
            </a>
            <audio ref={audioRef} src={audioUrl} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
