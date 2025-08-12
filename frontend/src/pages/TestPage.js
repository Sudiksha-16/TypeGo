import { useState, useEffect } from 'react';
import axios from 'axios';

const TestPage = () => {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isTestComplete, setIsTestComplete] = useState(false);

  const fetchNewText = () => {
    axios
      .post("http://localhost:5000/generate-text", {})
      .then((response) => {
        const fullText = response.data.text;
        const limitedText = fullText.split(" ").slice(0, 20).join(" "); // Limit text to 20 words
        setText(limitedText);
        setUserInput('');
        setStartTime(null);
        setWpm(0);
        setAccuracy(100);
        setIsTestComplete(false);
      })
      .catch(() => setText("Practice makes perfect. Keep typing!"));
  };

  useEffect(() => {
    fetchNewText();
  }, []);

  const handleInputChange = (e) => {
    if (!startTime) setStartTime(Date.now());
    setUserInput(e.target.value);
    calculateWPM(e.target.value);
    calculateAccuracy(e.target.value);
  };

  const calculateWPM = (input) => {
    const wordsTyped = input.trim().split(/\s+/).filter(word => word).length;
    const elapsedTime = (Date.now() - startTime) / 60000;
    setWpm(elapsedTime > 0 ? Math.round(wordsTyped / elapsedTime) : 0);
  };

  const calculateAccuracy = (input) => {
    const correctChars = input.split('').filter((char, i) => char === text[i]).length;
    const totalChars = Math.max(input.length, text.length);
    setAccuracy(totalChars === 0 ? 100 : Math.round((correctChars / totalChars) * 100));
  };

  const handleDone = () => {
    setIsTestComplete(true);

    axios.post("http://localhost:5000/submit-score", {
      user: "testUser", // Replace with actual user ID if needed
      wpm,
      accuracy
    })
    .then(() => alert("Score saved successfully!"))
    .catch(() => alert("Failed to save score"));
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4">TypeGo</h2>
      
      <p className="text-lg bg-gray-200 p-4 rounded-md w-3/4">
        {text.split('').map((char, i) => {
          let color = userInput[i] === undefined ? 'text-black' : userInput[i] === char ? 'text-green-500' : 'text-red-500';
          return <span key={i} className={color}>{char}</span>;
        })}
      </p>
      
      <textarea 
        className="mt-4 p-2 w-3/4 border rounded-md" 
        value={userInput} 
        onChange={handleInputChange} 
        placeholder="Start typing here..."
        disabled={isTestComplete} // Disable input after clicking "Done"
      />
      
      <p className="mt-4 text-xl">WPM: {wpm} | Accuracy: {accuracy}%</p>
      
      <div className="mt-4 flex gap-4">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={fetchNewText}
        >
          Restart
        </button>

        {!isTestComplete && (
          <button 
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={handleDone}
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
};

export default TestPage;
