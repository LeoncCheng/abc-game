import React, { useState, useEffect, useRef } from 'react';

// Main application component
const App = () => {
    // Define the array of 26 English alphabet letters
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    // Index of the current letter in the alphabet array
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    // Message displayed to the user (e.g., hints or encouragement)
    const [message, setMessage] = useState('');
    // State indicating if the game is completed
    const [gameCompleted, setGameCompleted] = useState(false);

    // Function to play any text using Text-to-Speech (TTS)
    const speakText = (text, lang = 'en-US', rate = 1, pitch = 1) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.volume = 1;
            utterance.rate = rate;
            utterance.pitch = pitch;
            // Stop any ongoing speech before playing new text
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        } else {
            console.warn("Your browser does not support the Web Speech API. Cannot play voice messages.");
            // If the browser does not support TTS, display a message on the UI
            setMessage("您的浏览器不支持语音发音。");
        }
    };

    // Function to play encouragement sound using TTS (in Chinese)
    const playCorrectSoundTTS = () => {
        // Use speakText to play Chinese encouragement with a slightly higher pitch
        speakText('太棒了！', 'zh-CN', 1, 1.2); // Text and language are set to Chinese
    };

    // Function to play the pronunciation of the current letter
    const speakCurrentLetter = (letter) => {
        // Use speakText to play the letter's pronunciation
        speakText(letter, 'en-US', 0.8, 1);
    };

    // Function to handle keyboard press events
    const handleKeyPress = (event) => {
        // If the game is completed, do not process key press events
        if (gameCompleted) return;

        // Get the pressed key and convert it to uppercase to match the alphabet array
        const pressedKey = event.key.toUpperCase();
        // Get the expected letter for the current index
        const expectedLetter = alphabet[currentLetterIndex];

        // Check if the pressed key matches the expected letter
        if (pressedKey === expectedLetter) {
            playCorrectSoundTTS(); // Play encouragement sound (using TTS)
            setMessage('太棒了！'); // Display encouragement message

            // Set a short delay to allow the user to see the encouragement message and animation, then move to the next letter
            setTimeout(() => {
                setMessage(''); // Clear the message
                // Check if there is a next letter
                if (currentLetterIndex < alphabet.length - 1) {
                    // Move to the next letter
                    setCurrentLetterIndex(prevIndex => prevIndex + 1);
                } else {
                    // If all letters are completed, set the game completed state
                    setGameCompleted(true);
                    // After the game is completed, play a concluding remark
                    speakText('恭喜你！你完成了所有字母！', 'zh-CN', 0.9, 1); // Concluding remark is also in Chinese
                }
            }, 700); // 700ms delay
        } else {
            // If the pressed key is incorrect, display a hint message
            const incorrectMessage = `不对哦，请按 ${expectedLetter}！`;
            setMessage(incorrectMessage); // Display the hint message
            // Also play the error hint using TTS, in Chinese
            speakText(incorrectMessage, 'zh-CN', 1, 1);
        }
    };

    // useEffect Hook to add keyboard event listener when the component mounts and remove it when unmounted
    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        // Cleanup function: remove the event listener when the component unmounts to prevent memory leaks
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentLetterIndex, gameCompleted]); // Dependencies array

    // New useEffect Hook to play the pronunciation of the current letter when it changes
    useEffect(() => {
        if (!gameCompleted && currentLetterIndex < alphabet.length) {
            // Ensure the pronunciation is played when a new letter is displayed
            speakCurrentLetter(alphabet[currentLetterIndex]);
        }
    }, [currentLetterIndex, gameCompleted]); // Dependencies: currentLetterIndex and gameCompleted

    // Function to reset the game
    const resetGame = () => {
        setCurrentLetterIndex(0); // Reset current letter index
        setMessage(''); // Clear message
        setGameCompleted(false); // Set game completed state to false
        // After reset, the next useEffect will automatically trigger playing the first letter's pronunciation
    };

    // useEffect to dynamically load Tailwind CSS
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Optional: Load Inter font for better typography
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);

        return () => {
            document.head.removeChild(link);
            document.head.removeChild(fontLink);
        };
    }, []);

    return (
        // Main container, set min-height, center alignment, background color, and font
        <div className="min-h-screen flex items-center justify-center bg-blue-50 font-inter p-4">
            {/* Game card container, set padding, rounded corners, shadow, text alignment, and responsive width */}
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-lg w-full flex flex-col items-center justify-center">
                {gameCompleted ? (
                    // If the game is completed, display celebration message and replay button
                    <div className="flex flex-col items-center">
                        <p className="text-8xl mb-6 animate-bounce">🥳</p> {/* Celebration emoji */}
                        <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-6">
                            恭喜你！你完成了所有字母！
                        </h2>
                        <button
                            onClick={resetGame} // Call resetGame function on button click
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                        >
                            再玩一次
                        </button>
                    </div>
                ) : (
                    // If the game is not completed, display the current letter and message
                    <>
                        <h1 className="text-9xl md:text-[12rem] font-extrabold text-blue-700 mb-6 leading-none">
                            {alphabet[currentLetterIndex]} {/* Display current letter */}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-700 min-h-[2.5rem] mb-4">
                            {message} {/* Display message */}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default App; // Export App component as default
