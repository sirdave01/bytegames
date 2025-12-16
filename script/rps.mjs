let gameStarted = false;

import { getHighScore, saveHighScore } from "./storage.mjs";

const container = document.querySelector('#rps');
let playerScore = 0, opponentScore = 0, ties = 0;
let currentTurn = 'player1'; // for 2P
let p1Choice = null;  // CORRECTION: Added this variable to store Player 1's choice in 2P mode (avoids parsing from text, which is error-prone).

export function initRPS() {
    const mode = document.querySelector('#modeSelect').value;
    playerScore = 0; opponentScore = 0; ties = 0;
    currentTurn = 'player1';
    p1Choice = null;  // CORRECTION: Reset on init.

    container.innerHTML = `
    <h2>Rock Paper Scissors ✂️📄🪨</h2>
    <div id="rpsScores"></div>
    <p id="turnInfo">${mode === '1p' ? 'Choose your move!' : "Player 1's turn"}</p>
    <div id="choiceDisplay"></div>
    <div id="computerChoice"></div>
    <div id="rpsResult" class="result"></div>
    <div class="rps-buttons">
      <button data-choice="rock">🪨 Rock</button>
      <button data-choice="paper">📄 Paper</button>
      <button data-choice="scissors">✂️ Scissors</button>
    </div>
    <p class="high-score">Best Wins (vs AI): <span id="rpsBest">${getHighScore('rps')}</span></p>
    <button id="rpsStart">Start Game</button>
    <button id="rpsReset">Reset Scores</button>
  `;

    updateScores();
    container.querySelectorAll('[data-choice]').forEach(btn => {
        btn.addEventListener('click', () => playRound(btn.dataset.choice));
    });
    container.querySelector('#rpsReset').addEventListener('click', initRPS);
    container.querySelector('#rpsStart').addEventListener('click', () => {
        gameStarted = true;
    });
}

function playRound(choice) {
    const mode = document.querySelector('#modeSelect').value;
    if (mode === '1p') {
        const choices = ['rock', 'paper', 'scissors'];
        const computer = choices[Math.floor(Math.random() * 3)];
        const result = getResult(choice, computer);
        container.querySelector('#choiceDisplay').innerHTML = `You: ${getEmoji(choice)} ${choice.toUpperCase()} <br> Computer: ${getEmoji(computer)} ${computer.toUpperCase()}`;
        if (result === 'win') {
            playerScore++;
            // CORRECTION: Added high score saving for 1P wins (updates best if higher).
            const best = saveHighScore('rps', playerScore);
            container.querySelector('#rpsBest').textContent = best;
        } else if (result === 'lose') opponentScore++;
        else ties++;
        updateResult(result);
        updateScores();
        setTimeout(() => {
            container.querySelector('#choiceDisplay').innerHTML = '';
            container.querySelector('#rpsResult').textContent = '';
        }, 3000);
    } else {  // CORRECTION: Added full 2P mode logic (previously missing - clicks did nothing in 2P).
        if (currentTurn === 'player1') {
            p1Choice = choice;  // CORRECTION: Store choice instead of displaying and parsing later.
            container.querySelector('#choiceDisplay').innerHTML = `Player 1: ${getEmoji(choice)} ${choice.toUpperCase()}`;
            currentTurn = 'player2';
            container.querySelector('#turnInfo').textContent = "Player 2's turn";
        } else {
            const result = getResult(p1Choice, choice);
            container.querySelector('#choiceDisplay').innerHTML += ` <br> Player 2: ${getEmoji(choice)} ${choice.toUpperCase()}`;
            if (result === 'win') playerScore++;  // Player 1 wins round
            else if (result === 'lose') opponentScore++;  // Player 2 wins round
            else ties++;
            // CORRECTION: Update result text for 2P (specific to players; no saving high score since it's vs AI only).
            updateResult(result === 'win' ? 'Player 1 wins round!' : result === 'lose' ? 'Player 2 wins round!' : 'Tie round!');
            updateScores();
            setTimeout(() => {
                container.querySelector('#choiceDisplay').innerHTML = '';
                container.querySelector('#rpsResult').textContent = '';
                currentTurn = 'player1';
                container.querySelector('#turnInfo').textContent = "Player 1's turn";
                p1Choice = null;  // CORRECTION: Reset for next round.
            }, 3000);
        }
    }
}

function getResult(p1, p2) {
    if (p1 === p2) return 'tie';
    if ((p1 === 'rock' && p2 === 'scissors') || (p1 === 'paper' && p2 === 'rock') || (p1 === 'scissors' && p2 === 'paper')) return 'win';
    return 'lose';
}

function getEmoji(choice) {
    return choice === 'rock' ? '🪨' : choice === 'paper' ? '📄' : '✂️';
}

function updateResult(res) {
    const el = container.querySelector('#rpsResult');
    if (typeof res === 'string') {
        el.textContent = res;  // CORRECTION: Allow custom string for 2P (previously only handled 'win'/'lose'/'tie').
    } else {
        if (res === 'win') el.textContent = 'You win round! 🎉';
        else if (res === 'lose') el.textContent = 'You lose round! 😤';
        else el.textContent = 'Tie! 🤝';
    }
    el.className = 'result ' + (typeof res === 'string' ? 'tie' : res);  // CORRECTION: Fallback class for custom messages.
}

function updateScores() {
    const mode = document.querySelector('#modeSelect').value;
    container.querySelector('#rpsScores').innerHTML = mode === '1p'
        ? `You: ${playerScore} | Computer: ${opponentScore} | Ties: ${ties}`
        : `Player 1: ${playerScore} | Player 2: ${opponentScore} | Ties: ${ties}`;
}