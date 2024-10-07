import React, { useState } from "react";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import styled, { keyframes } from "styled-components";
import Analysis from "./Analysis";
import ReplyComponent from "./ReplyComponent";
import VideoStatsPopup from "./VideoStatsPopup"; // Import the popup component
import LoadingMeme from "./LoadingMeme";

// Animations
const fadeIn = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
  `;

const bounce = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  `;

// Styled Components for better UI with animations and responsiveness
const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  animation: ${fadeIn} 0.8s ease-in-out;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
  animation: ${fadeIn} 1s ease-in-out;
`;

const InputBox = styled.input`
  width: 80%;
  padding: 12px;
  font-size: 16px;
  margin-right: 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  &:focus {
    border-color: #007bff;
    box-shadow: 0px 6px 12px rgba(0, 123, 255, 0.2);
  }

  @media (max-width: 768px) {
    width: 70%;
    margin-bottom: 10px;
  }
`;

const AnalyzeButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  background-color: #28a745;
  color: white;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  animation: ${bounce} 2s infinite;

  &:hover {
    background-color: #218838;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StatsButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 10px;
  transition: background-color 0.3s ease;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const GraphButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 10px;
  transition: background-color 0.3s ease;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #117a8b;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TabContent = styled.div`
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const Comment = styled.div`
  font-size: 16px;
  margin: 8px 0;
  padding: 12px;
  border-radius: 8px;
  background-color: ${(props) =>
    props.sentiment === "Positive"
      ? "#d4edda"
      : props.sentiment === "Negative"
      ? "#f8d7da"
      : "#fff3cd"};
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const ReplyButton = styled.button`
  padding: 6px 12px;
  font-size: 12px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #5a6268;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const LoadingMessage = styled.p`
  font-size: 16px;
  color: #007bff;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const ErrorMessage = styled.p`
  font-size: 16px;
  color: red;
  margin-top: 10px;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const VideoInput = ({ youtubeApiKey }) => {
  const [videoId, setVideoId] = useState("");
  const [showStats, setShowStats] = useState(false); // State to show/hide stats popup
  const [showReplyBox, setShowReplyBox] = useState(null); // Track reply box visibility for each comment

  const [comments, setComments] = useState({
    Positive: [],
    Negative: [],
    Neutral: [],
  });
  const [batchLoading, setBatchLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false); // State for showing analysis modal
  // const API = "https://4aa1-34-138-238-70.ngrok-free.app";
  const API = process.env.URL;

  const extractVideoId = (url) => {
    const shortPattern =
      /https:\/\/www\.youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/;
    const shortMatch = url.match(shortPattern);
    if (shortMatch) {
      return shortMatch[1];
    }

    const shareablePattern = /https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/;
    const shareableMatch = url.match(shareablePattern);
    if (shareableMatch) {
      return shareableMatch[1];
    }

    const standardPattern = /v=([a-zA-Z0-9_-]+)/;
    const standardMatch = url.match(standardPattern);
    if (standardMatch) {
      return standardMatch[1];
    }

    return null;
  };

  const fetchComments = async (videoId) => {
    try {
      let pageToken = null;
      let fetchedAll = false;
      setBatchLoading(true);
      setError("");

      while (!fetchedAll) {
        const token = youtubeApiKey;
        const response = await axios.post(API + "/analyze", {
          videoId,
          pageToken,
          token,
        });

        const { Positive, Negative, Neutral, nextPageToken, allFetched } =
          response.data;
        console.log(response.data);

        setComments((prev) => ({
          Positive: [...new Set([...prev.Positive, ...Positive])],
          Negative: [...new Set([...prev.Negative, ...Negative])],
          Neutral: [...new Set([...prev.Neutral, ...Neutral])],
        }));

        fetchedAll = allFetched;
        pageToken = nextPageToken;
      }

      setBatchLoading(false);
    } catch (error) {
      setBatchLoading(false);
      setError("Error fetching comments. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = extractVideoId(videoId);
    if (id) {
      fetchComments(id);
    } else {
      setError("Invalid YouTube link. Please enter a valid link.");
    }
  };

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  const toggleReplyBox = (index) => {
    setShowReplyBox((prevState) => (prevState === index ? null : index));
  };

  return (
    <Container>
      <Heading>Analyze YouTube Comments</Heading>
      <form onSubmit={handleSubmit}>
        <InputBox
          type="text"
          placeholder="Enter YouTube video URL"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
        />
        <AnalyzeButton type="submit">Analyze</AnalyzeButton>
      </form>
      <StatsButton onClick={toggleStats}>Show Video Stats</StatsButton>
      {showStats && (
        <VideoStatsPopup
          videoId={extractVideoId(videoId)}
          accessToken={youtubeApiKey}
          onClose={() => {
            setShowStats(!showStats);
          }}
        />
      )}
      <GraphButton onClick={() => setShowAnalysis(true)}>
        Show Analysis Graph
      </GraphButton>
      {showAnalysis && (
        <Analysis comments={comments} onClose={() => setShowAnalysis(false)} />
      )}

      {/* {batchLoading && <LoadingMessage>Analyzing...</LoadingMessage>}
       */}
      {batchLoading && (
        <>
          <LoadingMessage>Analyzing...</LoadingMessage>
          <LoadingMeme /> {/* Display memes while loading */}
        </>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {comments.Positive.length > 0 && (
        <Tabs>
          <TabList>
            <Tab>Positive ({comments.Positive.length})</Tab>
            <Tab>Negative ({comments.Negative.length})</Tab>
            <Tab>Neutral ({comments.Neutral.length})</Tab>
          </TabList>

          <TabPanel>
            <TabContent>
              {comments.Positive.map((comment, index) => (
                <div key={index}>
                  <Comment sentiment="Positive">{comment.text}</Comment>{" "}
                  {/* Access the 'text' field */}
                  <ReplyButton onClick={() => toggleReplyBox(index)}>
                    Reply
                  </ReplyButton>
                  {showReplyBox === index && (
                    <ReplyComponent
                      comment={comment}
                      youtubeApiKey={youtubeApiKey}
                    />
                  )}
                </div>
              ))}
            </TabContent>
          </TabPanel>

          <TabPanel>
            <TabContent>
              {comments.Negative.map((comment, index) => (
                <div key={index}>
                  <Comment sentiment="Negative">{comment.text}</Comment>{" "}
                  {/* Access the 'text' field */}
                  <ReplyButton onClick={() => toggleReplyBox(index)}>
                    Reply
                  </ReplyButton>
                  {showReplyBox === index && (
                    <ReplyComponent
                      comment={comment}
                      youtubeApiKey={youtubeApiKey}
                    />
                  )}
                </div>
              ))}
            </TabContent>
          </TabPanel>

          <TabPanel>
            <TabContent>
              {comments.Neutral.map((comment, index) => (
                <div key={index}>
                  <Comment sentiment="Neutral">{comment.text}</Comment>{" "}
                  {/* Access the 'text' field */}
                  <ReplyButton onClick={() => toggleReplyBox(index)}>
                    Reply
                  </ReplyButton>
                  {showReplyBox === index && (
                    <ReplyComponent
                      comment={comment}
                      youtubeApiKey={youtubeApiKey}
                    />
                  )}
                </div>
              ))}
            </TabContent>
          </TabPanel>
        </Tabs>
      )}
    </Container>
  );
};

export default VideoInput;
