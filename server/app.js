const express = require("express");
const { google } = require("googleapis");
const app = express();
const session = require("express-session");
const cors = require("cors");

// Enable CORS
app.use(cors());
app.use(express.json()); // To parse incoming JSON request body

const oauth2Client = new google.auth.OAuth2(
  "384236824967-h33v7t61466snt54vlpikubag1u946a6.apps.googleusercontent.com", // Replace with your OAuth client ID
  "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", // Replace with your OAuth client secret
  "http://localhost:3000/oauth2callback"
); // R

// Route to initiate Google OAuth
app.get("/auth/google", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube.force-ssl"],
    prompt: "consent",
  });
  res.redirect(authUrl);
});

// OAuth2 callback route
app.get("/oauth2callback", async (req, res) => {
  const { code } = req.query;

  if (code) {
    try {
      // Get the tokens after user authenticates
      const { tokens } = await oauth2Client.getToken(code);

      // Redirect to frontend with token as query param
      console.log("Access Token:", tokens.access_token); // Added logging for verification
      res.redirect(`http://localhost:3000?access_token=${tokens.access_token}`);
    } catch (err) {
      console.error("Error getting OAuth tokens:", err);
      res.status(500).send("Authentication failed");
    }
  } else {
    res.status(400).send("Authorization code missing");
  }
});

// app.listen(5001, () => console.log("Server running on http://localhost:5001"));
app.post("/send_reply", async (req, res) => {
  const { commentId, reply, token } = req.body;

  console.log("Received request:", { commentId, reply, token }); // Log the received data

  if (!token) {
    console.log("No token provided");
    return res.status(401).send({ error: "User not authenticated" });
  }

  try {
    // Set token credentials
    oauth2Client.setCredentials({ access_token: token });
    console.log("OAuth2 Client set with access token.");

    const youtube = google.youtube("v3");

    const response = await youtube.commentThreads.insert({
      part: "snippet",
      resource: {
        snippet: {
          videoId: commentId,
          topLevelComment: {
            snippet: {
              textOriginal: reply,
            },
          },
        },
      },
    });

    console.log("Reply successfully posted:", response.data); // Log success
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Error from YouTube API:", error); // Log the error for debugging
    res.status(500).send({ error: error.message });
  }
});

app.listen(5001, () => console.log("Server running on http://localhost:5001"));
