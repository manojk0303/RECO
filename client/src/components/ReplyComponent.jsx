import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
// Styled components for reply section
const ReplyBox = styled.textarea`
  width: 80%;
  padding: 12px;
  margin-top: 10px;
  font-size: 16px;
  border-radius: 8px;
  border: 2px solid #ccc;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const ReplyButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const ReplyComponent = ({ comment, youtubeApiKey }) => {
  const [reply, setReply] = useState("");
  const [autoReply, setAutoReply] = useState("");
  const [error, setError] = useState("");
  // const API = "https://c61a-34-16-173-133.ngrok-free.app";
  // const API = "https://b713-34-16-173-133.ngrok-free.app";
  // const API = "https://2fff-34-138-24-165.ngrok-free.app";
  const API = process.env.URL;

  useEffect(() => {
    // Check if user is authenticated on load
    const token = localStorage.getItem("access_token");
    if (!token) {
      // Trigger authentication if no token is found
      window.location.href = `${"http://localhost:5001"}/auth/google`;
    }
  }, []);

  // Function to generate auto reply
  const generateAutoReply = async () => {
    try {
      console.log(
        "Generating auto-reply for comment:",
        comment.text,
        youtubeApiKey
      );
      const response = await axios.post(API + "/generate_reply", {
        comment: comment.text,
        api_key: youtubeApiKey,
      });

      if (response.data.reply) {
        console.log("Auto reply generated:", response.data.reply);
        setAutoReply(response.data.reply);
        setReply(response.data.reply); // Auto-fill reply box with generated reply
      }
    } catch (err) {
      setError("Failed to generate auto-reply.");
    }
  };

  const sendReply = async (commentId, reply) => {
    const token = localStorage.getItem("access_token");

    console.log("Access token from localStorage:", token); // Log the token

    if (!token) {
      console.log("No token found in localStorage, redirecting to auth...");
      window.location.href = `${API}/auth/google`;
      return;
    }

    try {
      const data = { commentId, reply, token };
      console.log(data);
      const response = await fetch("http://localhost:5001/send_reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Double-check the bearer token format
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Reply sent successfully:", result);
      } else {
        console.error("Error sending reply:", result.error);
      }
    } catch (error) {
      console.error("Error during sendReply:", error); // Log any potential errors in the request
    }
  };

  return (
    <div>
      <ReplyBox
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Write your reply..."
      />
      <ReplyButton onClick={generateAutoReply}>Generate Auto Reply</ReplyButton>
      {/* <ReplyButton onClick={() => sendReply(comment.commentId, reply)}>
        Send Reply
      </ReplyButton> */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ReplyComponent;
