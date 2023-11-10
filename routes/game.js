const router = require("express").Router();
const Game = require("../models/game");

// Endpoint to add a game
router.post("/add-game", async (req, res) => {
  // debugger;
  try {
    const { room_no, user_id } = req.body;

    const existingGame = await Game.findOne({ room_no });

    if (existingGame) {
      if (existingGame.x_user_id && existingGame.o_user_id) {
        res.status(200).json(existingGame);
      } else if (!existingGame.o_user_id) {
        if (existingGame.x_user_id !== user_id) {
          existingGame.o_user_id = user_id;
          await existingGame.save();
          res.status(200).json(existingGame);
        } else {
          res.status(400).json("X and O user IDs cannot be the same.");
        }
      }
    } else {
      const newGame = new Game({
        x_user_id: user_id,
        current_player: user_id,
        room_no,
      });
      await newGame.save();
      // console.log("newGame", newGame);
      res.status(201).json(newGame);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/get-game/:room_no", async (req, res) => {
  try {
    const room_no = req.params.room_no;
    const game = await Game.findOne({ room_no });

    if (game) {
      res.status(200).json(game);
    } else {
      res.status(404).json("Game not found for the provided room number.");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/get-players/:room_no", async (req, res) => {
  try {
    const room_no = req.params.room_no;
    const game = await Game.findOne({ room_no });

    if (game) {
      const { x_user_id, o_user_id } = game;
      res.status(200).json({ x_user_id, o_user_id });
    } else {
      res.status(404).json("Game not found for the provided room number.");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/update-score/:room_no", async (req, res) => {
  try {
    // console.log(req.body);
    const data = req.body;
    const room_no = data.roomNo;
    // debugger;
    const game = await Game.findOne({ room_no });

    if (!game) {
      return res
        .status(404)
        .json("Game not found for the provided room number.");
    }

    if (data.wonUser !== undefined && data.wonUser === "x") {
      game.x_score += 1;
    }

    if (data.wonUser !== undefined && data.wonUser === "o") {
      game.o_score += 1;
    }

    await game.save();

    const updatedGame = await Game.findOne({ room_no });

    res.status(200).json(updatedGame);
    // console.log("done", updatedGame);
  } catch (err) {
    res.status(500).json(err);
  }
});

async function updateCurrentGame(roomNo, newGameArray, userIdForNextMove) {
  try {
    // debugger;
    const game = await Game.findOne({ room_no: roomNo });

    if (!game) {
      return { success: false, message: "Game not found" };
    }

    game.current_game = newGameArray;
    if (userIdForNextMove) game.current_player = userIdForNextMove;

    await game.save();

    return { success: true, message: "Game updated successfully" };
  } catch (error) {
    return { success: false, message: "Error updating game" };
  }
}

async function getOUserIdByRoomNo(roomNo) {
  try {
    const game = await Game.findOne({ room_no: roomNo });

    if (!game) {
      return { success: false, message: "Game not found" };
    }

    const oUserId = game.o_user_id;

    return oUserId;
  } catch (error) {
    return { success: false, message: "Error retrieving o_user_id" };
  }
}

module.exports = {
  router,
  updateCurrentGame,
  getOUserIdByRoomNo,
};
