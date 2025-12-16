import { getHighScore, saveHighScore } from "./storage.mjs";

const container = document.getElementById('flappybird'); // Add <div id="flappybird"> in index.html
let canvas, ctx;
let bird, pipes, gravity, velocity, score, gameActive, animationId;

// Optional sounds (add later)
const flapSound = new Audio('../sounds/flap.mp3');
const pointSound = new Audio('../sounds/point.mp3');
const hitSound = new Audio('../sounds/hit.mp3');

export function initFlappyBird() {
    container.innerHTML = `
    <h2>Flappy Bird 🐦</h2>
    <p>Score: <span id="fbScore">0</span> | Best: <span id="fbBest">${getHighScore('flappy')}</span></p>
    <canvas id="fbCanvas" width="400" height="600"></canvas>
    <p>Click or Space/Up to flap • Avoid pipes!</p>
    <button id="fbReset">Restart</button>
  `;

    canvas = container.querySelector('#fbCanvas');
    ctx = canvas.getContext('2d');

    bird = { x: 100, y: 300, size: 30, velocity: 0 };
    pipes = [];
    gravity = 0.5;
    velocity = 0;
    score = 0;
    gameActive = true;

    spawnPipe();
    container.querySelector('#fbScore').textContent = score;

    canvas.addEventListener('click', flap);
    document.addEventListener('keydown', e => {
        if ([' ', 'ArrowUp'].includes(e.key)) { e.preventDefault(); flap(); }
    });

    container.querySelector('#fbReset').addEventListener('click', initFlappyBird);

    cancelAnimationFrame(animationId);
    gameLoop();
}

function flap() {
    if (!gameActive) return;
    velocity = -8;
    // flapSound.currentTime = 0; flapSound.play();
}

function spawnPipe() {
    if (!gameActive) return;
    const gap = 150;
    const minHeight = 100;
    const topHeight = Math.random() * (canvas.height - gap - minHeight * 2) + minHeight;
    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - topHeight - gap,
        passed: false
    });
}

function gameLoop() {
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bird physics
    velocity += gravity;
    bird.y += velocity;

    // Draw bird
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2);
    ctx.fill();

    // Pipes
    pipes.forEach((pipe, i) => {
        pipe.x -= 2;

        // Draw top pipe
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(pipe.x, 0, 80, pipe.top);
        // Bottom pipe
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, 80, pipe.bottom);

        // Score
        if (!pipe.passed && pipe.x + 80 < bird.x) {
            score++;
            pipe.passed = true;
            container.querySelector('#fbScore').textContent = score;
            // pointSound.play();
        }

        // Collision
        if (
            bird.x + bird.size > pipe.x && bird.x - bird.size < pipe.x + 80 &&
            (bird.y - bird.size < pipe.top || bird.y + bird.size > canvas.height - pipe.bottom)
        ) {
            gameOver();
        }

        // Remove old pipes
        if (pipe.x + 80 < 0) pipes.splice(i, 1);
    });

    // Ground / Ceiling collision
    if (bird.y + bird.size > canvas.height || bird.y - bird.size < 0) gameOver();

    // Spawn new pipe
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) spawnPipe();

    if (gameActive) animationId = requestAnimationFrame(gameLoop);
}

function gameOver() {
    gameActive = false;
    // hitSound.play();
    const best = saveHighScore('flappy', score);
    container.querySelector('#fbBest').textContent = best;
    alert(`Game Over! Score: ${score}${score === best ? ' - NEW HIGH SCORE! 🎉' : ''}`);
}