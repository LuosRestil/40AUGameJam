import "./style.css";
import { Game } from './Game';

const canvas = document.getElementById("gamecanvas") as HTMLCanvasElement;
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

new Game(ctx).run();