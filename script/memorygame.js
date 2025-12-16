import { getHighScore, saveHighScore } from "./storage.mjs";

const container = document.querySelector('#memory');
const emojis = ['🚀', '🔥', '💻', '🎮', '🌟', '⚡', '💀', '🎯'];
let cards = [];
let flipped = [];
let moves = 0;
let matched = 0;

export function initMemory() {
    moves = 0;
    matched = 0;
    flipped = [];
    cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

    container.innerHTML = `
    <h2>Memory Card Game</h2>
    <p>Moves: <span id="memMoves">0</span> | Best: <span id="memBest">${getHighScore('memory') === '0' ? 'None' : getHighScore('memory')}</span></p>
    <div id="memoryBoard"></div>
    <button id="memReset">Reset Game</button>
  `;

    const board = container.querySelector('#memoryBoard');
    cards.forEach((emoji, i) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.dataset.index = i;

        card.innerHTML = `
      <div class="back">?</div>
      <div class="front">${emoji}</div>
    `;

        card.addEventListener('click', () => flipCard(card));
        board.appendChild(card);
    });

    container.querySelector('#memReset').addEventListener('click', initMemory);
}

function flipCard(card) {
    if (flipped.length === 2) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

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
    if (c1.dataset.emoji === c2.dataset.emoji) {
        c1.classList.add('matched');
        c2.classList.add('matched');
        matched += 2;

        if (matched === cards.length) {
            const best = saveHighScore('memory', moves, true); // true = lower better
            container.querySelector('#memBest').textContent = best;
            setTimeout(() => {
                alert(`You won in ${moves} moves! ${moves === best ? 'NEW RECORD! 🎉' : 'Best is ' + best}`);
            }, 500);
        }
    } else {
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
    }
    flipped = [];
}