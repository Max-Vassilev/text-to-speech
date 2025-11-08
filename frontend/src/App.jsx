import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaPlay, FaStop, FaUndo, FaRedo, FaDownload } from "react-icons/fa";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  const BACKEND_URL = "http://172.205.146.11:8000"; // Hardcoded BE URL (IPV4 and port 8000)

  const generateAudio = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/tts`,
        { text },
        { responseType: "blob" }
      );
      const url = URL.createObjectURL(response.data);
      setAudioUrl(url);
      setIsPlaying(false);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const rewind = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
  };

  const forward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10);
  };

  useEffect(() => {
    if (!audioRef.current) return;
    const handleEnded = () => setIsPlaying(false);
    audioRef.current.addEventListener("ended", handleEnded);
    return () => audioRef.current.removeEventListener("ended", handleEnded);
  }, [audioRef]);

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
        <div className="audio-controls">
          <button disabled={!audioUrl} onClick={rewind}>
            <FaUndo />
          </button>
          <button disabled={!audioUrl} onClick={togglePlay}>
            {isPlaying ? <FaStop /> : <FaPlay />}
          </button>
          <button disabled={!audioUrl} onClick={forward}>
            <FaRedo />
          </button>
          <a href={audioUrl || "#"} download="speech.mp3">
            <button disabled={!audioUrl}>
              <FaDownload />
            </button>
          </a>
        </div>
        {audioUrl && <audio ref={audioRef} src={audioUrl} controls />}
      </div>
      <footer className="footer">Powered by gTTS</footer>
    </div>
  );
}

export default App;