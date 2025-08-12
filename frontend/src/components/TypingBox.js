import React, { useState, useEffect } from "react";

const sampleText = "The quick brown fox jumps over the lazy dog.";

const TypingBox = () => {
  const [inputText, setInputText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (inputText.length === 1 && !startTime) {
      setStartTime(Date.now());
    }
  }, [inputText]);

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setInputText(newText);
  
    if (newText.length === sampleText.length) {
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000 / 60; // minutes
      const wordsTyped = sampleText.split(" ").length;
      const calculatedWPM = Math.round(wordsTyped / timeTaken);
  
      const correctChars = newText.split("").filter((char, i) => char === sampleText[i]).length;
      const calculatedAccuracy = Math.round((correctChars / sampleText.length) * 100);
  
      setWpm(calculatedWPM);
      setAccuracy(calculatedAccuracy);
    }
  };
  

  const submitScore = async () => {
    if (!username) {
      alert("Please enter your username!");
      return;
    }

    const data = { username, wpm, accuracy };

    try {
      await fetch("http://localhost:5000/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      alert("Score submitted!");
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Typing Test</h1>
      <p className="mt-2 text-gray-600">{sampleText}</p>
      
      <input
        className="border p-2 w-full mt-2"
        placeholder="Start typing..."
        value={inputText}
        onChange={handleInputChange}
      />
      
      <input
        className="border p-2 w-full mt-2"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button onClick={submitScore} className="bg-blue-500 text-white px-4 py-2 mt-2">
        Submit Score
      </button>

      <p className="mt-2">WPM: {wpm}</p>
      <p>Accuracy: {accuracy}%</p>
    </div>
  );
};

export default TypingBox;