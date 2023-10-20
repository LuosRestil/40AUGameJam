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
  if (key === 'ArrowUp' || key === 'w') {
    console.log('up');
    gameContext.userInput.up = true;
  }
  if (key === 'ArrowLeft' || key === 'a') {
    console.log('left');
    gameContext.userInput.left = true;
  }
  if (key === 'ArrowRight' || key === 'd') {
    console.log('right');
    gameContext.userInput.right = true;
  }
});

document.addEventListener('keyup', (evt: KeyboardEvent) => {
  const key = evt.key;
  if (key === 'ArrowUp' || key === 'w') {
    gameContext.userInput.up = false;
  }
  if (key === 'ArrowLeft' || key === 'a') {
    gameContext.userInput.left = false;
  }
  if (key === 'ArrowRight' || key === 'd') {
    gameContext.userInput.right = false;
  }
});

new Game().run();