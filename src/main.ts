import "./style.css";
import { Game } from './Game';

document.addEventListener('keydown', startGame);

const titleScreen = document.getElementById("title-screen") as HTMLDivElement;

function startGame(evt: KeyboardEvent) {
  if (evt.key === 'r') {
    titleScreen.style.display = 'none';

    const canvas = document.getElementById("gamecanvas") as HTMLCanvasElement;
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  
    new Game(ctx).run();
  
    document.removeEventListener('keydown', startGame);
  }
}

const bgcanvas = document.getElementById("bgcanvas") as HTMLCanvasElement;
bgcanvas.style.position = 'absolute';
bgcanvas.style.top = '0px';
bgcanvas.style.left = '0px';
bgcanvas.width = document.body.clientWidth;
bgcanvas.height = document.body.clientHeight;
const bgctx = bgcanvas.getContext('2d') as CanvasRenderingContext2D;
// draw starfield
bgctx.fillStyle = 'black';
bgctx.fillRect(0, 0, bgcanvas.width, bgcanvas.height);
bgctx.fillStyle = '#555';
for (let i = 0; i < 550; i++) {
  const x = Math.random() * bgcanvas.width;
  const y = Math.random() * bgcanvas.height;
  const radius = Math.random() * 3;
  bgctx.beginPath();
  bgctx.arc(x, y, radius, 0, Math.PI * 2);
  bgctx.fill();
}