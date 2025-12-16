import { getHighScore, saveHighScore } from "./storage.mjs";

const container = document.querySelector('#pong');
let canvas, ctx;
let ball, leftPaddle, rightPaddle;
let animationId;

export function initPong() {
    container.innerHTML = `
    <h2>Pong Game 🏓</h2>
    <p id="pongScore">0 : 0</p>
    <p class="high-score">Highest Score: <span id="pongBest">${getHighScore('pong')}</span></p>
    <canvas id="pongCanvas" width="600" height="400"></canvas>
    <p>Left: W/S keys • Right: ↑↓ arrows (2P) | AI plays right (1P)</p>
    <button id="pongReset">Reset Game</button>
  `;

    canvas = container.querySelector('#pongCanvas');
    ctx = canvas.getContext('2d');

    ball = { x: 300, y: 200, dx: 5, dy: 5, radius: 10 };
    leftPaddle = { y: 160, height: 80, score: 0 };
    rightPaddle = { y: 160, height: 80, score: 0 };

    updateScore();

    container.querySelector('#pongReset').addEventListener('click', initPong);

    cancelAnimationFrame(animationId);
    gameLoop();
}

function gameLoop() {
    const mode = document.querySelector('#modeSelect').value;

    // AI for right paddle in 1P
    if (mode === '1p') {
        rightPaddle.y = ball.y - rightPaddle.height / 2;
        rightPaddle.y = Math.max(0, Math.min(400 - rightPaddle.height, rightPaddle.y));
    }

    // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top/bottom collision
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= 400) ball.dy *= -1;

    // Paddle collision
    if (ball.dx < 0 && ball.x - ball.radius < 40 &&
        ball.y > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.height) {
        ball.dx *= -1.05;
        ball.dy += (ball.y - (leftPaddle.y + leftPaddle.height / 2)) * 0.2;
    }
    if (ball.dx > 0 && ball.x + ball.radius > 560 &&
        ball.y > rightPaddle.y && ball.y < rightPaddle.y + rightPaddle.height) {
        ball.dx *= -1.05;
        ball.dy += (ball.y - (rightPaddle.y + rightPaddle.height / 2)) * 0.2;
    }

    // Scoring
    if (ball.x < 0) { rightPaddle.score++; resetBall(1); }
    if (ball.x > 600) { leftPaddle.score++; resetBall(-1); }

    // Draw
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 600, 400);

    ctx.fillStyle = '#fff';
    ctx.fillRect(30, leftPaddle.y, 10, leftPaddle.height);
    ctx.fillRect(560, rightPaddle.y, 10, rightPaddle.height);

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    animationId = requestAnimationFrame(gameLoop);
}

function resetBall(direction) {
    ball.x = 300;
    ball.y = 200;
    ball.dx = 5 * direction;
    ball.dy = Math.random() * 10 - 5;
    updateScore();

    if (leftPaddle.score >= 10 || rightPaddle.score >= 10) {
        const winner = leftPaddle.score >= 10 ? 'Left Player' : 'Right Player / AI';
        const winScore = Math.max(leftPaddle.score, rightPaddle.score);
        const best = saveHighScore('pong', winScore);
        container.querySelector('#pongBest').textContent = best;
        alert(`${winner} wins the match! 🎉${winScore === best ? ' NEW RECORD!' : ''}`);
        cancelAnimationFrame(animationId);
    }
}

function updateScore() {
    container.querySelector('#pongScore').textContent = `${leftPaddle.score} : ${rightPaddle.score}`;
}

// Controls
document.addEventListener('keydown', e => {
    if (document.querySelector('#gameSelect').value !== 'pong') return;
    if (['w', 'W'].includes(e.key)) leftPaddle.y = Math.max(0, leftPaddle.y - 25);
    if (['s', 'S'].includes(e.key)) leftPaddle.y = Math.min(400 - leftPaddle.height, leftPaddle.y + 25);
    if (document.querySelector('#modeSelect').value === '2p') {
        if (e.key === 'ArrowUp') rightPaddle.y = Math.max(0, rightPaddle.y - 25);
        if (e.key === 'ArrowDown') rightPaddle.y = Math.min(400 - rightPaddle.height, rightPaddle.y + 25);
    }
});