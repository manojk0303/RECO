import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";

// Animation for meme fade in
const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

// Styled component for meme
const MemeContainer = styled.div`
  text-align: center;
  margin: 20px 0;
`;

const MemeImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const MemeCaption = styled.p`
  font-size: 16px;
  font-style: italic;
  color: #555;
  margin-top: 10px;
`;

const FunAlternativeMessage = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #ff6347; // Tomato color for emphasis
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 10px;
  background-color: #6200ea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3700b3;
  }
`;

const LoadingMeme = () => {
  const [memes, setMemes] = useState([]); // State to hold fetched memes
  const [currentMemeIndex, setCurrentMemeIndex] = useState(0);
  const [previousMemeIndex, setPreviousMemeIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling
  const [displayedMemes, setDisplayedMemes] = useState([]); // State to track displayed memes

  // Function to shuffle an array (Fisher-Yates shuffle)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Fetch random memes from Reddit meme API
  useEffect(() => {
    const fetchMemes = async () => {
      try {
        // Generate a random number between 1 and 20 (or any range you prefer)
        const randomNum = Math.floor(Math.random() * 200) + 1; // Adjust range as needed
        const response = await axios.get(
          `https://meme-api.com/gimme/${randomNum}`
        );

        if (response.status === 200) {
          const shuffledMemes = shuffleArray(response.data.memes); // Shuffle the memes
          setMemes(shuffledMemes); // Set the shuffled memes
          setLoading(false); // Set loading to false
          setDisplayedMemes(new Array(shuffledMemes.length).fill(false)); // Initialize displayed memes
        }
      } catch (error) {
        setError("Oops! Something went wrong while fetching memes."); // Set error message
        setLoading(false); // Set loading to false
      }
    };

    fetchMemes(); // Call the function to fetch memes
  }, []);

  // Show loading message until memes are fetched
  if (loading) {
    return (
      <MemeContainer>
        <p>Loading memes...</p>
        <FunAlternativeMessage>
          In the meantime, how about a joke? Why did the scarecrow win an award?
          Because he was outstanding in his field!
        </FunAlternativeMessage>
      </MemeContainer>
    );
  }

  // Show error message if fetching memes fails
  if (error) {
    return (
      <MemeContainer>
        <p>{error}</p>
        <FunAlternativeMessage>
          Don't worry, we'll try fetching memes again soon!
        </FunAlternativeMessage>
      </MemeContainer>
    );
  }

  const handleNextMeme = () => {
    // Store current meme as previous and go to the next meme
    setPreviousMemeIndex(currentMemeIndex);

    // Find the next meme index that hasn't been displayed yet
    let nextIndex = (currentMemeIndex + 1) % memes.length;

    // Loop until we find a meme that hasn't been displayed yet
    while (displayedMemes[nextIndex]) {
      nextIndex = (nextIndex + 1) % memes.length;
      if (nextIndex === currentMemeIndex) {
        // If we looped back to the current meme, reset the displayedMemes array
        setDisplayedMemes(new Array(memes.length).fill(false));
        break;
      }
    }

    // Mark the current meme as displayed
    setDisplayedMemes((prev) => {
      const newDisplayed = [...prev];
      newDisplayed[currentMemeIndex] = true;
      return newDisplayed;
    });

    setCurrentMemeIndex(nextIndex); // Update current meme index
  };

  const handlePreviousMeme = () => {
    if (previousMemeIndex !== null) {
      setCurrentMemeIndex(previousMemeIndex); // Go back to the previous meme
      setPreviousMemeIndex(currentMemeIndex); // Update previous meme index to the current one
    }
  };

  return (
    <MemeContainer>
      {memes.length > 0 && (
        <>
          <MemeImage
            src={memes[currentMemeIndex].url}
            alt={memes[currentMemeIndex].title}
          />
          <MemeCaption>
            Here's a fun meme while we load your data...
          </MemeCaption>

          {/* Navigation Buttons */}
          <div>
            <Button onClick={handleNextMeme}>Next Meme</Button>
            {previousMemeIndex !== null && (
              <Button onClick={handlePreviousMeme}>See Previous Meme</Button>
            )}
          </div>
        </>
      )}
    </MemeContainer>
  );
};

export default LoadingMeme;
