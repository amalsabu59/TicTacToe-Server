const checkWin = (playerData) => {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const condition of winConditions) {
    const [a, b, c] = condition;

    if (
      playerData[a] &&
      playerData[a] === playerData[b] &&
      playerData[a] === playerData[c]
    ) {
      // A player has won
      //   dispatch(updateScore({ roomNo: room, wonUser: playerData[a] }));

      return playerData[a]; // Return the winning symbol ("x" or "o")
    }
  }

  // Check for a tie
  if (
    Array.isArray(playerData) &&
    playerData.every((cell) => cell !== null) &&
    !playerData.includes("")
  ) {
    // sendWinner("tie");
    return "tie"; // All cells are filled, and there is no winner
  }

  return null; // No winner or tie yet
};

module.exports = checkWin;
