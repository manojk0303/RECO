// utils.js
export const extractVideoId = (url) => {
  // Check if it's a YouTube short link (e.g., "https://www.youtube.com/shorts/VIDEO_ID")
  const shortPattern = /https:\/\/www\.youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/;
  const shortMatch = url.match(shortPattern);
  if (shortMatch) {
    return shortMatch[1]; // Extract the video ID from YouTube Shorts
  }

  // Check if it's a shareable YouTube link (e.g., "https://youtu.be/VIDEO_ID")
  const shareablePattern = /https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/;
  const shareableMatch = url.match(shareablePattern);
  if (shareableMatch) {
    return shareableMatch[1]; // Extract the video ID from shareable links
  }

  // Check for the standard YouTube URL pattern (e.g., "https://www.youtube.com/watch?v=VIDEO_ID")
  const standardPattern = /v=([a-zA-Z0-9_-]+)/;
  const standardMatch = url.match(standardPattern);
  if (standardMatch) {
    return standardMatch[1]; // Extract the video ID from standard YouTube links
  }

  return null; // Return null if no valid video ID is found
};
