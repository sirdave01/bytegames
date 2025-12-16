let gameStarted = false;

import { getHighScore, saveHighScore } from "./storage.mjs";

const container = document.querySelector('#memory');
const emojis = ['🚀', '🔥', '💻', '🎮', '🌟', '⚡', '💀', '🎯'];
let cards = [];
let flipped = [];
let moves = 0;
let matched = 0;

// Sounds (add the mp3 files to /sounds/)
const flipSound = new Audio('/sounds/flip.mp3');
const matchSound = new Audio('/sounds/throw.mp3');
const mismatchSound = new Audio('/sounds/sip.mp3');
const winSound = new Audio('/sounds/win.mp3');

export function initMemory() {
    moves = 0;
    matched = 0;
    flipped = [];
    cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    gameStarted = false;

    container.innerHTML = `
        <h2>Memory Card Game</h2>
        <p>Moves: <span id="memMoves">0</span> | Best: <span id="memBest">${getHighScore('memory') === '0' ? 'None' : getHighScore('memory')}</span></p>
        <div id="memoryBoard"></div>
        <button id="memStart">Start / Restart Game</button>
    `;

    const board = container.querySelector('#memoryBoard');
    board.innerHTML = '';

    cards.forEach((emoji, i) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="back">?</div>
            <div class="front">${emoji}</div>
        `;
        card.addEventListener('click', () => flipCard(card));
        board.appendChild(card);
    });

    container.querySelector('#memStart').addEventListener('click', () => {
        gameStarted = true;
        moves = 0;
        matched = 0;
        flipped = [];
        container.querySelector('#memMoves').textContent = 0;
        document.querySelectorAll('.card').forEach(c => {
            c.classList.remove('flipped', 'matched');
        });
    });
}

function flipCard(card) {
    if (!gameStarted || flipped.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    flipSound.currentTime = 0;
    flipSound.play();

    card.classList.add('flipped');
    flipped.push(card);

    if (flipped.length === 2) {
        moves++;
        container.querySelector('#memMoves').textContent = moves;
        setTimeout(checkMatch, 800);
    }
}

function checkMatch() {
    const [c1, c2] = flipped;
    if (c1.querySelector('.front').textContent === c2.querySelector('.front').textContent) {
        matchSound.currentTime = 0;
        matchSound.play();
        c1.classList.add('matched');
        c2.classList.add('matched');
        matched += 2;

        if (matched === cards.length) {
            winSound.currentTime = 0;
            winSound.play();
            const best = saveHighScore('memory', moves, true);
            container.querySelector('#memBest').textContent = best;
            setTimeout(() => alert(`You won in ${moves} moves! ${moves === best ? 'NEW RECORD! 🎉' : 'Best: ' + best}`), 500);
            gameStarted = false;
        }
    } else {
        mismatchSound.currentTime = 0;
        mismatchSound.play();
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
    }
    flipped = [];
}