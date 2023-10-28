import "./style.css";
import { Game } from './Game';
import { GameContext } from "./GameContext";

const canvas = document.getElementById("gamecanvas") as HTMLCanvasElement;
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const gameContext = GameContext.getInstance();
gameContext.ctx = ctx;

new Game().run();