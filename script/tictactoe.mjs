// tictactoe game console

import { getHighScore, saveHighScore } from "./storage.mjs";

const container = document.querySelector('#tictactoe');
let board = [];
let currentPlayer = 'X';
let gameActive = true;

export function initTicTacToe() {
    const mode = document.querySelector('#modeSelect').value;
    board = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;

    container.innerHTML = `
    <h2>Tic Tac Toe</h2>
    <p id="tttStatus">${mode === '1p' ? "Your turn (X)" : "Player X's turn"}</p>
    <div id="tttBoard"></div>
    <p class="high-score">Best Wins: <span id="tttBest">${getHighScore('tictactoe')}</span></p>
    <button id="tttReset">Reset Game</button>
  `;

    const boardEl = container.querySelector('#tttBoard');
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('ttt-cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        boardEl.appendChild(cell);
    }

    container.querySelector('#tttReset').addEventListener('click', initTicTacToe);
}

function handleCellClick(index) {
    const mode = document.querySelector('#modeSelect').value;
    if (board[index] !== '' || !gameActive) return;
    if (mode === '1p' && currentPlayer === 'O') return; // AI turn, block human click

    board[index] = currentPlayer;
    container.querySelector(`[data-index="${index}"]`).textContent = currentPlayer;

    if (checkWin(currentPlayer)) {
        endGame(`${mode === '1p' ? (currentPlayer === 'X' ? 'You' : 'AI') : 'Player ' + currentPlayer} wins! 🎉`);
        saveHighScore('tictactoe', parseInt(getHighScore('tictactoe')) + 1);
        container.querySelector('#tttBest').textContent = getHighScore('tictactoe');
    } else if (board.every(cell => cell !== '')) {
        endGame("Draw! 🤝");
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        container.querySelector('#tttStatus').textContent =
            mode === '1p' ? `${currentPlayer === 'X' ? 'Your' : 'AI'} turn` : `Player ${currentPlayer}'s turn`;

        if (mode === '1p' && currentPlayer === 'O' && gameActive) {
            setTimeout(aiMove, 600);
        }
    }
}

function checkWin(player) {
    const wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    return wins.some(combo => combo.every(i => board[i] === player));
}

function endGame(message) {
    gameActive = false;
    container.querySelector('#tttStatus').textContent = message;
}

function aiMove() {
    if (!gameActive) return;
    // Simple AI: win if possible → block → random
    const player = 'O';
    const opponent = 'X';
    const empty = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);

    // Win
    for (let i of empty) {
        board[i] = player;
        if (checkWin(player)) { makeMove(i); return; }
        board[i] = '';
    }
    // Block
    for (let i of empty) {
        board[i] = opponent;
        if (checkWin(opponent)) { board[i] = player; makeMove(i); return; }
        board[i] = '';
    }
    // Random
    const move = empty[Math.floor(Math.random() * empty.length)];
    board[move] = player;
    makeMove(move);
}

function makeMove(index) {
    container.querySelector(`[data-index="${index}"]`).textContent = 'O';
    handleCellClick(index); // Reuse logic
}