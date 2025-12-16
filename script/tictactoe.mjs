let gameStarted = false;

import { getHighScore, saveHighScore } from "./storage.mjs";

const container = document.querySelector('#tictactoe');
let board = Array(9).fill('');
let currentPlayer = 'X';
let playerWins = 0, opponentWins = 0, draws = 0;
let gameActive = true;

// Sounds
const placeSound = new Audio('sounds/place.mp3');
const winSound = new Audio('sounds/win.mp3');

export function initTicTacToe() {
    const mode = document.querySelector('#modeSelect').value;
    playerWins = 0; opponentWins = 0; draws = 0;

    container.innerHTML = `
        <h2>Tic Tac Toe</h2>
        <p id="tttScores">X Wins: 0 | O Wins: 0 | Draws: 0</p>
        <p id="tttStatus">${mode === '1p' ? 'Your turn (X)' : "Player 1's turn (X)"}</p>
        <div id="tttBoard"></div>
        <p class="high-score">Best Wins vs AI: <span id="tttBest">${getHighScore('tictactoe')}</span></p>
        <button id="tttStart">New Round</button>
        <button id="tttReset">Reset Scores</button>
    `;

    const boardEl = container.querySelector('#tttBoard');
    boardEl.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('ttt-cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        boardEl.appendChild(cell);
    }

    updateBoard();
    updateScoresDisplay();

    container.querySelector('#tttStart').addEventListener('click', startNewRound);
    container.querySelector('#tttReset').addEventListener('click', () => {
        playerWins = opponentWins = draws = 0;
        updateScoresDisplay();
        startNewRound();
    });
}

function startNewRound() {
    gameStarted = true;
    gameActive = true;
    board = Array(9).fill('');
    currentPlayer = 'X';
    updateBoard();
    updateStatus();
}

function handleCellClick(index) {
    if (!gameStarted || !gameActive || board[index] !== '') return;

    placeSound.currentTime = 0;
    placeSound.play();

    board[index] = currentPlayer;
    updateBoard();

    if (checkWin(currentPlayer)) {
        winSound.currentTime = 0;
        winSound.play();
        endGame(`${currentPlayer} wins the round! 🎉`);
        currentPlayer === 'X' ? playerWins++ : opponentWins++;
        return;
    }
    if (isDraw()) {
        endGame('Draw! 🤝');
        draws++;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();

    const mode = document.querySelector('#modeSelect').value;
    if (mode === '1p' && currentPlayer === 'O' && gameActive) {
        setTimeout(aiMove, 600);
    }
}

function aiMove() {
    let bestMove = -1;
    let bestScore = -Infinity;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    if (bestMove !== -1) {
        board[bestMove] = 'O';
        placeSound.currentTime = 0;
        placeSound.play();
        updateBoard();

        if (checkWin('O')) {
            winSound.currentTime = 0;
            winSound.play();
            endGame('AI wins the round! 😤');
            opponentWins++;
        } else if (isDraw()) {
            endGame('Draw! 🤝');
            draws++;
        } else {
            currentPlayer = 'X';
            updateStatus();
        }
    }
}

function minimax(board, depth, isMaximizing) {
    if (checkWin('O')) return 10 - depth;
    if (checkWin('X')) return depth - 10;
    if (isDraw()) return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = '';
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = '';
            }
        }
        return best;
    }
}

function checkWin(player) {
    const wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    return wins.some(combo => combo.every(i => board[i] === player));
}

function isDraw() {
    return board.every(cell => cell !== '');
}

function endGame(message) {
    gameActive = false;
    container.querySelector('#tttStatus').textContent = message;
    updateScoresDisplay();

    const mode = document.querySelector('#modeSelect').value;
    if (mode === '1p' && message.includes('X wins')) {
        const best = saveHighScore('tictactoe', playerWins);
        container.querySelector('#tttBest').textContent = best;
    }
}

function updateStatus() {
    const mode = document.querySelector('#modeSelect').value;
    const text = currentPlayer === 'X'
        ? (mode === '1p' ? 'Your turn (X)' : "Player 1's turn (X)")
        : (mode === '1p' ? 'AI thinking...' : "Player 2's turn (O)");
    container.querySelector('#tttStatus').textContent = text;
}

function updateBoard() {
    const cells = container.querySelectorAll('.ttt-cell');
    cells.forEach((cell, i) => {
        cell.textContent = board[i];
        cell.classList.remove('X', 'O');
        if (board[i] === 'X') cell.classList.add('X');
        if (board[i] === 'O') cell.classList.add('O');
    });
}

function updateScoresDisplay() {
    container.querySelector('#tttScores').textContent = `X Wins: ${playerWins} | O Wins: ${opponentWins} | Draws: ${draws}`;
}