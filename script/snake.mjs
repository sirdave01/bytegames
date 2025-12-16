let gameStarted = false;

import { getHighScore, saveHighScore } from "./storage.mjs";

const container = document.querySelector('#snake');
let canvas, ctx;
let snake, food, dx, dy, score, interval;

export function initSnake() {
    container.innerHTML = `
        <h2>Snake Game</h2>
        <p>Score: <span id="snakeScore">0</span> | Best: <span id="snakeBest">${getHighScore('snake')}</span></p>
        <canvas id="snakeCanvas" width="400" height="400"></canvas>
        <p>Use arrow keys to move</p>
        <button id="snakeStart">Start Game</button>
        <button id="snakeReset">Reset Game</button>
    `;

    canvas = container.querySelector('#snakeCanvas');
    ctx = canvas.getContext('2d');
    resetGameState();

    container.querySelector('#snakeReset').addEventListener('click', initSnake);
    container.querySelector('#snakeStart').addEventListener('click', () => {
        gameStarted = true;
        interval = setInterval(gameLoop, 100);
    });
}

function resetGameState() {
    score = 0;
    snake = [{ x: 200, y: 200 }];
    dx = 20; dy = 0;
    spawnFood();
    container.querySelector('#snakeScore').textContent = score;
    clearInterval(interval);
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20
    };
}

function gameLoop() {
    if (!gameStarted || collision()) {
        clearInterval(interval);
        if (collision()) {
            const newBest = saveHighScore('snake', score);
            container.querySelector('#snakeBest').textContent = newBest;
            alert(`Game Over! Score: ${score}${score === newBest ? ' - NEW RECORD! 🎉' : ''}`);
        }
        return;
    }

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        container.querySelector('#snakeScore').textContent = score;
        spawnFood();
    } else {
        snake.pop();
    }

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 400, 400);

    ctx.fillStyle = 'lime';
    snake.forEach(s => ctx.fillRect(s.x + 1, s.y + 1, 18, 18));

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x + 2, food.y + 2, 16, 16);
}

function collision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) return true;
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    return false;
}

document.addEventListener('keydown', e => {
    if (document.querySelector('#gameSelect').value !== 'snake') return;
    if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -20; }
    if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 20; }
    if (e.key === 'ArrowLeft' && dx === 0) { dx = -20; dy = 0; }
    if (e.key === 'ArrowRight' && dx === 0) { dx = 20; dy = 0; }  
});