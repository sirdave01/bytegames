let gameStarted = false;

import { getHighScore, saveHighScore } from "./storage.mjs";

const container = document.querySelector('#tictactoe');
let board = Array(9).fill('');
let currentPlayer = 'X';
let playerWins = 0, opponentWins = 0, draws = 0;
let gameActive = true;

// New variables for the movable variant
let phase = 'placement'; // 'placement' or 'movement'
let xPieces = 0;
let oPieces = 0;
let selectedIndex = null; // For movement phase: selected piece to move

// Sounds
const placeSound = new Audio('/sounds/place.mp3');
const winSound = new Audio('/sounds/win.mp3');

export function initTicTacToe() {
    const mode = document.querySelector('#modeSelect').value;
    playerWins = 0; opponentWins = 0; draws = 0;

    container.innerHTML = `
        <h2>Three Men's Morris (Naija Style Tic Tac Toe)</h2>
        <p id="tttScores">X Wins: 0 | O Wins: 0 | Draws: 0</p>
        <p id="tttStatus">${mode === '1p' ? 'Your turn (X) - Place piece' : "Player 1's turn (X) - Place piece"}</p>
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
    phase = 'placement';
    xPieces = 0;
    oPieces = 0;
    selectedIndex = null;
    removeHighlights();
    updateBoard();
    updateStatus();
}

function handleCellClick(index) {
    if (!gameStarted || !gameActive) return;

    placeSound.currentTime = 0;
    placeSound.play();

    if (phase === 'placement') {
        // Placement: only on empty cells
        if (board[index] !== '') return;

        board[index] = currentPlayer;
        if (currentPlayer === 'X') xPieces++;
        else oPieces++;

        updateBoard();

        if (checkWin(currentPlayer)) {
            endGameWin(currentPlayer);
            return;
        }

        if (xPieces === 3 && oPieces === 3) {
            phase = 'movement';
        }

        switchTurn();
    } else {
        // Movement phase
        if (selectedIndex === null) {
            // Select own piece
            if (board[index] !== currentPlayer) return;

            selectedIndex = index;
            highlightSelected(index);
        } else {
            // Try to move to empty adjacent cell
            if (board[index] !== '' || !isAdjacent(selectedIndex, index)) {
                // Invalid: deselect
                selectedIndex = null;
                removeHighlights();
                return;
            }

            board[index] = currentPlayer;
            board[selectedIndex] = '';
            selectedIndex = null;
            removeHighlights();

            updateBoard();

            if (checkWin(currentPlayer)) {
                endGameWin(currentPlayer);
                return;
            }

            switchTurn();
        }
    }
}

function switchTurn() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();

    const mode = document.querySelector('#modeSelect').value;
    if (mode === '1p' && currentPlayer === 'O' && gameActive) {
        setTimeout(aiMove, 800);
    }
}

function isAdjacent(from, to) {
    const pos = i => ({ row: Math.floor(i / 3), col: i % 3 });
    const f = pos(from);
    const t = pos(to);
    return Math.abs(f.row - t.row) + Math.abs(f.col - t.col) === 1; // Only up/down/left/right
}

function aiMove() {
    let validMoves = [];

    if (phase === 'placement') {
        // Place on any empty cell
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') validMoves.push(i);
        }
    } else {
        // Movement: find own pieces and adjacent empty cells
        for (let i = 0; i < 9; i++) {
            if (board[i] === 'O') {
                for (let j = 0; j < 9; j++) {
                    if (board[j] === '' && isAdjacent(i, j)) {
                        validMoves.push({ from: i, to: j });
                    }
                }
            }
        }
    }

    if (validMoves.length === 0) return;

    let move;
    if (phase === 'placement') {
        move = validMoves[Math.floor(Math.random() * validMoves.length)];
        board[move] = 'O';
    } else {
        move = validMoves[Math.floor(Math.random() * validMoves.length)];
        board[move.to] = 'O';
        board[move.from] = '';
    }

    placeSound.currentTime = 0;
    placeSound.play();
    updateBoard();

    if (checkWin('O')) {
        endGameWin('O');
        return;
    }

    switchTurn();
}

function checkWin(player) {
    const wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    return wins.some(combo => combo.every(i => board[i] === player));
}

function endGameWin(player) {
    winSound.currentTime = 0;
    winSound.play();
    gameActive = false;
    const message = `${player === 'X' ? 'You' : (document.querySelector('#modeSelect').value === '1p' ? 'AI' : 'Player 2')} wins the round! 🎉`;
    container.querySelector('#tttStatus').textContent = message;
    player === 'X' ? playerWins++ : opponentWins++;
    updateScoresDisplay();

    const mode = document.querySelector('#modeSelect').value;
    if (mode === '1p' && player === 'X') {
        const best = saveHighScore('tictactoe', playerWins);
        container.querySelector('#tttBest').textContent = best;
    }
}

function updateStatus() {
    const mode = document.querySelector('#modeSelect').value;
    let text = phase === 'placement' ? 'Place piece' : 'Move piece';
    text = currentPlayer === 'X'
        ? (mode === '1p' ? `Your turn (X) - ${text}` : `Player 1's turn (X) - ${text}`)
        : (mode === '1p' ? `AI ${phase === 'placement' ? 'placing' : 'moving'}...` : `Player 2's turn (O) - ${text}`);
    container.querySelector('#tttStatus').textContent = text;
}

function updateBoard() {
    const cells = container.querySelectorAll('.ttt-cell');
    cells.forEach((cell, i) => {
        cell.textContent = board[i] || '';
        cell.classList.remove('X', 'O');
        if (board[i] === 'X') cell.classList.add('X');
        if (board[i] === 'O') cell.classList.add('O');
    });
}

function highlightSelected(i) {
    removeHighlights();
    container.querySelectorAll('.ttt-cell')[i].classList.add('selected');
}

function removeHighlights() {
    container.querySelectorAll('.ttt-cell').forEach(c => c.classList.remove('selected'));
}

function updateScoresDisplay() {
    container.querySelector('#tttScores').textContent = `X Wins: ${playerWins} | O Wins: ${opponentWins} | Draws: ${draws}`;
}