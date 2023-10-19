import "./style.css";
import { Game } from './Game';
import { GameContext } from "./GameContext";

const canvas = document.getElementById("gamecanvas") as HTMLCanvasElement;
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const gameContext = GameContext.getInstance();
gameContext.ctx = ctx;

// user input
document.addEventListener('keydown', (evt: KeyboardEvent) => {
  const key = evt.key;
  if (key === 'UpArrow' || key === 'w') {
    gameContext.userInput.up = true;
  }
  if (key === 'LeftArrow' || key === 'a') {
    gameContext.userInput.left = true;
  }
  if (key === 'RightArrow' || key === 's') {
    gameContext.userInput.right = true;
  }
});

document.addEventListener('keyup', (evt: KeyboardEvent) => {
  const key = evt.key;
  if (key === 'UpArrow' || key === 'w') {
    gameContext.userInput.up = false;
  }
  if (key === 'LeftArrow' || key === 'a') {
    gameContext.userInput.left = false;
  }
  if (key === 'RightArrow' || key === 's') {
    gameContext.userInput.right = false;
  }
});

new Game().run();