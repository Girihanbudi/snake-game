"use client";

import { CSSProperties, useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import Canvas, {
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
} from "./classes/Canvas";
import Snake from "./classes/Snake";
import Fruit from "./classes/Fruit";
import Controller from "./classes/Controller";
import ScoreManager from "./classes/ScoreManager";
import GameManager from "./classes/GameManager";
import Dialog from "./Dialog";

let gameIntervalId: NodeJS.Timeout | null = null;

const sty_Empty: CSSProperties = {
  backgroundColor: "#172A46",
  borderColor: "#1E3B50",
  borderWidth: 1,
};

const sty_Snake: CSSProperties = {
  backgroundColor: "#52ff80",
};

const sty_Fruit: CSSProperties = {
  backgroundColor: "#ff1f1f",
};

// Game State
const controller = new Controller<() => void>();

const snake = new Snake(
  "Snake",
  sty_Snake,
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT
);

const fruit = new Fruit(
  "Fruit",
  sty_Fruit,
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
  snake
);

const gameManager = new GameManager();
const score = new ScoreManager();

export interface GameProps {
  tileSize?: number;
  width?: number;
  height?: number;

  styEmpty?: CSSProperties;
  stySnake?: CSSProperties;
  styFruit?: CSSProperties;
}

export function SnakeGame({
  tileSize = 25,
  width = 30,
  height = 20,
  styEmpty = sty_Empty,
  stySnake = sty_Snake,
  styFruit = sty_Fruit,
}: GameProps) {
  // Reactive State
  const [player, setPlayer] = useState<string>("");
  const [speed, setSpeed] = useState<number>(4);
  const [paused, setPaused] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(true);
  const [timer, setTimer] = useState<number>(0);
  const [gameTime, setGameTime] = useState<string>("0s");
  const [canvas, setCanvas] = useState<Canvas>(
    new Canvas(width, height, tileSize, styEmpty)
  );
  const [currentScore, setCurrentScore] = useState<number>(0);

  useEffect(() => {
    // Bind action lists to controller
    controller.bindAction(
      {
        name: "pause",
        func: () => {
          gameManager.pause();
          setPaused(gameManager.isPaused());
        },
      },
      "Escape"
    );
    controller.bindAction(
      {
        name: "moveTop",
        func: () => snake.changeMovement("TOP"),
      },
      "w",
      "W",
      "keytop"
    );
    controller.bindAction(
      {
        name: "moveLeft",
        func: () => snake.changeMovement("LEFT"),
      },
      "a",
      "A",
      "keyleft"
    );
    controller.bindAction(
      {
        name: "moveBottom",
        func: () => snake.changeMovement("BOTTOM"),
      },
      "s",
      "S",
      "keydown"
    );
    controller.bindAction(
      {
        name: "moveRight",
        func: () => snake.changeMovement("RIGHT"),
      },
      "d",
      "D",
      "keyright"
    );

    // Bind our controller to global event listener
    const keyboardEvent = (e: KeyboardEvent) => {
      // console.log("key pressed ===", e);
      const event = controller.getActionFunc(e.key);
      if (event) event();
    };
    window.addEventListener("keyup", keyboardEvent, false);
  }, []);

  /** This function will be called every time the game started */
  function onStart() {
    // Close the dialog
    setOpenMenu(false);

    // Init the snake
    snake.setNewBoundary(width, height);
    snake.setNewStyle(stySnake);
    snake.changeMovement("RIGHT");
    snake.setNewSpawnLocation();

    // Init the fruit
    fruit.setNewBoundary(width, height);
    fruit.setNewStyle(styFruit);
    fruit.setNewSpawnLocation();

    // Start scoring
    score.startScoring();
    setGameTime(score.getGameTime());
    setCurrentScore(score.getScore());

    // Start the game after all initiated
    gameManager.start();
  }

  /** This function will be called every interval of the game */
  function onUpdate() {
    // If the game is not started yet or currently paused then return
    if (!gameManager.isPlaying()) return;
    if (gameManager.isPaused()) return;

    // Check if the snake is dead, then set the game to over
    if (snake.isDead()) {
      onEnd();
      return;
    }

    setTimer(Date.now());
    setGameTime(score.updateGameTime());

    // Check collision between snake and fruit
    if (snake.positionMatch(fruit.pos)) {
      // If collide then eat, spawn new location and add current score
      snake.eat();
      fruit.setNewSpawnLocation();
      setCurrentScore(score.addScore());
    } else {
      // If not collide then just keep the snake moving
      snake.move();
    }
    // Redraw the canvas
    canvas.drawCanvas(...snake.getWholeBodiesAsGameObject(), fruit);
    setCanvas(canvas);
  }

  /** This function will be called when the game is over (the snake is dead) */
  function onEnd() {
    if (gameIntervalId !== null) {
      clearInterval(gameIntervalId);
      gameIntervalId = null;
    }
    gameManager.gameOver();
    setOpenMenu(true);

    setGameTime(score.updateGameTime());
    score.submitScore(player);
  }

  /** This function is used to trigger the game to be started
   * It will set the interval based on 1 seconds divided by choosen speed
   */
  const startGame = () => {
    onStart();
    const intervalId = setInterval(function () {
      onUpdate();
    }, 1000 / speed);
    gameIntervalId = intervalId;
  };

  return (
    <Box
      sx={{
        p: 4,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Stack spacing={6} alignItems="center">
        {/* Title of the game */}
        <Typography variant="h3">{process.env.NEXT_PUBLIC_TITLE}</Typography>
        {/* Game Play Information Component */}
        <Stack direction="row" spacing={10} sx={{ textAlign: "center" }}>
          <Box>
            <Typography color="aqua" fontWeight="bold">
              User Name
            </Typography>
            <Typography variant="caption">{player}</Typography>
          </Box>

          <Box>
            <Typography color="aqua" fontWeight="bold">
              Time
            </Typography>
            <Typography variant="caption">{gameTime}</Typography>
          </Box>

          <Box>
            <Typography color="aqua" fontWeight="bold">
              Score
            </Typography>
            <Typography variant="caption">{currentScore}</Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            width: canvas.getCanvasWidth(),
            height: canvas.getCanvasHeight(),
          }}
        >
          {canvas.getTiles().map((tile, i) => (
            <Box
              key={i}
              sx={{
                flex: `1 0 ${100 / width}%`, // divide by the number of tiles horizontally to perform correct grid
                width: tileSize,
                height: tileSize,
              }}
              style={tile.getStyle()}
            >
              {/* <Typography variant="caption">
                {tile.getPos().x},{tile.getPos().y}
              </Typography> */}
            </Box>
          ))}
          {/* Paused backdrop component */}
          {paused && (
            <Box
              sx={{
                position: "absolute",
                width: width * tileSize,
                height: height * tileSize,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h2">GAME PAUSED</Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Stack>
      <Dialog
        open={openMenu}
        start={startGame}
        lastTimeElapsed={gameTime}
        lastScore={currentScore}
        player={player}
        handlePlayerChange={(e) => {
          if (e.target.value.length <= 15) setPlayer(e.target.value);
        }}
        speed={speed}
        handleSpeedChange={(e) => setSpeed(+e.target.value)}
      />
    </Box>
  );
}

export default SnakeGame;
