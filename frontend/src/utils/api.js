const API_URL = "http://localhost:5000/api"; // Backend URL

// Fetch leaderboard data
export const getLeaderboard = async () => {
  try {
    const response = await fetch(`${API_URL}/leaderboard`); // ✅ Use backticks
    return await response.json();
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};

// Submit score
export const submitScore = async (username, wpm, accuracy) => {
  try {
    const response = await fetch(`${API_URL}/submit`, { // ✅ Use backticks
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, wpm, accuracy }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error submitting score:", error);
    return null;
  }
};
