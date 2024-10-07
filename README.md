# YouTube Comment Analyzer and Reply Generator

This project is a web application that allows users to analyze comments on YouTube videos for sentiment and generate replies using advanced AI models. The application consists of a Flask server backend and a React frontend.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [Screenshots](#screenshots)
- [License](#license)

## Features
- Fetch comments from YouTube videos.
- Analyze the sentiment of the comments (Positive, Negative, Neutral).
- Generate replies to comments using AI models.
- Responsive UI with smooth animations.

## Technologies Used
- **Backend**: Flask, Flask-CORS, Google API Client, Transformers (Hugging Face), PyTorch
- **Frontend**: React, Styled Components, React Tabs
- **Deployment**: ngrok for local tunneling to expose the Flask server

## Installation

### Prerequisites
- Python 3.7+
- Node.js and npm
- Google Cloud account with YouTube Data API enabled

### Clone the Repository
```bash
git clone https://github.com/manojk0303/RECO.git
cd RECO
```

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
   
2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
   
3. Replace `YOUR_YOUTUBE_API_KEY` in `script.py` with your actual YouTube Data API key.

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install the required Node.js packages:
   ```bash
   npm install
   ```

## Usage

### Starting the Server
1. Start the Flask server:
   ```bash
   python script.py
   ```
   - The server will expose an ngrok URL that you can use to access the backend.

### Starting the Client
1. In a new terminal, navigate to the client directory and start the React app:
   ```bash
   npm start
   ```

2. Open your web browser and navigate to `http://localhost:3000`.

### Inputting API Key
- When the application loads, you will be prompted to enter your YouTube API key. Follow the on-screen instructions to validate the key.

## API Reference

### Analyze Video Comments
**Endpoint**: `/analyze`  
**Method**: `POST`  
**Request Body**:
```json
{
  "videoId": "VIDEO_ID",
  "pageToken": "PAGE_TOKEN",
  "token": "YOUR_YOUTUBE_API_KEY"
}
```
**Response**:
```json
{
  "Positive": [...],
  "Negative": [...],
  "Neutral": [...],
  "nextPageToken": "NEXT_PAGE_TOKEN",
  "allFetched": true
}
```

### Generate Reply
**Endpoint**: `/generate_reply`  
**Method**: `POST`  
**Request Body**:
```json
{
  "comment": "COMMENT_TEXT"
}
```
**Response**:
```json
{
  "reply": "GENERATED_REPLY"
}
```

## Screenshots

![unnamed](https://github.com/user-attachments/assets/3075a9df-699c-40e7-a74d-973790897485)
![unnamed](https://github.com/user-attachments/assets/a9de31b6-02f8-4deb-8859-d6f7c2f5b5e1)
![unnamed](https://github.com/user-attachments/assets/93c2c7c2-ba70-49c9-8506-f0056f44db33)
![unnamed](https://github.com/user-attachments/assets/66682728-4285-4419-806e-1c0ef58ab561)


## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any improvements or features you'd like to suggest.

## License
This project is open-source and available under the MIT License.
