import React from "react";
import { Bar } from "react-chartjs-2";
import styled, { keyframes } from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registering required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Animation for the modal
const fadeIn = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
`;

// Styled components for modal
const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 80%;
  max-width: 50%;
  max-height: 80vh; /* Ensure modal fits within 80% of viewport height */
  overflow-y: auto; /* Scroll if content exceeds container height */
  animation: ${fadeIn} 0.3s ease-out;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 1.2rem;
`;

const GraphWrapper = styled.div`
  height: 60vh; /* Set the height of the graph within 80vh container */
  width: 100%; /* Ensure the graph takes full width of the container */
  padding-top: 10px;
`;

const Analysis = ({ comments, onClose }) => {
  const data = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        label: "# of Comments",
        data: [
          comments.Positive.length,
          comments.Negative.length,
          comments.Neutral.length,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)", // Positive color
          "rgba(255, 99, 132, 0.6)", // Negative color
          "rgba(255, 206, 86, 0.6)", // Neutral color
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2>Sentiment Analysis</h2>
        <GraphWrapper>
          <Bar
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: true, // Ensure aspect ratio is maintained
              scales: {
                x: {
                  ticks: {
                    font: {
                      size: 14, // Adjust font size for readability
                    },
                  },
                },
                y: {
                  ticks: {
                    font: {
                      size: 14, // Adjust font size for readability
                    },
                  },
                },
              },
            }}
          />
        </GraphWrapper>
      </ModalContainer>
    </>
  );
};

export default Analysis;
