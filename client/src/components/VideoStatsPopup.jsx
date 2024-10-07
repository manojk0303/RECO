import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

// Keyframes for loading animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled Components for the popup
const PopupWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  max-width: 500px;
  width: 80%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  background-color: #ff5c5c;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ff1c1c;
  }
`;

// Styled spinner for loading animation
const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;

const VideoStatsPopup = ({ videoId, accessToken, onClose }) => {
  const [videoStats, setVideoStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  console.log(videoId, accessToken, onClose);
  useEffect(() => {
    const fetchVideoStats = async () => {
      try {
        const response = await fetch(
          `https://youtube.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&id=${videoId}&key=${accessToken}`
        );
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          setVideoStats(data.items[0]);
        } else {
          setError(true); // No data available
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching video stats: ", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchVideoStats();
  }, [videoId, accessToken]);

  if (loading) {
    return (
      <PopupWrapper>
        <PopupContent>
          <Spinner /> {/* Display spinner while loading */}
          <p>Loading video stats...</p>
        </PopupContent>
      </PopupWrapper>
    );
  }

  if (error || !videoStats) {
    return (
      <PopupWrapper>
        <PopupContent>
          <h3>No data found for this video.</h3>
          <CloseButton onClick={onClose}>Close</CloseButton>
        </PopupContent>
      </PopupWrapper>
    );
  }

  const { viewCount, likeCount, commentCount } = videoStats.statistics || {};
  const { title, channelTitle } = videoStats.snippet;

  return (
    <PopupWrapper>
      <PopupContent>
        <h2>{title}</h2>
        <p>
          <strong>Channel:</strong> {channelTitle}
        </p>
        <p>
          <strong>Views:</strong> {viewCount || "N/A"}
        </p>
        <p>
          <strong>Likes:</strong> {likeCount || "N/A"}
        </p>
        <p>
          <strong>Comments:</strong> {commentCount || "N/A"}
        </p>
        <CloseButton onClick={onClose}>Close</CloseButton>
      </PopupContent>
    </PopupWrapper>
  );
};

export default VideoStatsPopup;
