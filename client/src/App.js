import React, { useEffect, useState } from "react";
import "./App.css";
import VideoInput from "./components/videoInput";

// Modal for asking API key
const ApiKeyModal = ({ onSave, errorMessage }) => {
  const [apiKey, setApiKey] = useState("");

  // Handle form submission
  const handleSave = () => {
    if (apiKey) {
      onSave(apiKey);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Enter Your YouTube API Key</h2>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Paste your API key here"
        />
        <p>
          Don't have a key? Follow{" "}
          <a
            href="https://developers.google.com/youtube/v3/getting-started"
            target="_blank"
            rel="noopener noreferrer"
          >
            this guide
          </a>{" "}
          to create one.
        </p>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

function App() {
  const [apiKey, setApiKey] = useState(null); // Stores the YouTube API key
  const [showModal, setShowModal] = useState(false); // Modal for API input
  const [errorMessage, setErrorMessage] = useState(""); // Stores any error messages

  useEffect(() => {
    // Check if the API key is already in localStorage
    const storedApiKey = localStorage.getItem("youtube_api_key");
    if (storedApiKey) {
      validateApiKey(storedApiKey); // Validate the stored key
    } else {
      setShowModal(true); // Show modal if no API key is stored
    }
  }, []);

  // Validate the provided YouTube API key by making a simple API call
  const validateApiKey = (key) => {
    fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=Ks-_Mh1QhMc&key=${key}`
    )
      .then((response) => {
        if (response.ok) {
          // If valid, store it in localStorage and hide the modal
          localStorage.setItem("youtube_api_key", key);
          setApiKey(key);
          setShowModal(false);
        } else {
          // Show error if the key is invalid
          setErrorMessage("Invalid API key. Please try again.");
          setShowModal(true);
        }
      })
      .catch(() => {
        setErrorMessage("There was an error validating your API key.");
        setShowModal(true);
      });
  };

  // Handle saving the API key from the modal
  const handleSaveApiKey = (key) => {
    setErrorMessage(""); // Clear any previous error
    validateApiKey(key); // Validate the new key
  };

  return (
    <div className="App">
      {showModal && (
        <ApiKeyModal
          onSave={handleSaveApiKey}
          errorMessage={errorMessage} // Pass error message to the modal
        />
      )}

      {apiKey ? (
        <div>
          {/* Once authenticated, show the VideoInput component */}
          <VideoInput youtubeApiKey={apiKey} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
