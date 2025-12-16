import { getHighScore, saveHighScore } from "./storage.mjs";

const container = document.querySelector('#rps');
let playerScore = 0, opponentScore = 0, ties = 0;
let currentTurn = 'player1'; // for 2P

export function initRPS() {
    const mode = document.querySelector('#modeSelect').value;
    playerScore = 0; opponentScore = 0; ties = 0;
    currentTurn = 'player1';

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
    <button id="rpsReset">Reset Scores</button>
  `;

    updateScores();
    container.querySelectorAll('[data-choice]').forEach(btn => {
        btn.addEventListener('click', () => playRound(btn.dataset.choice));
    });
    container.querySelector('#rpsReset').addEventListener('click', initRPS);
}

function playRound(choice) {
    const mode = document.querySelector('#modeSelect').value;
    if (mode === '1p') {
        const choices = ['rock', 'paper', 'scissors'];
        const computer = choices[Math.floor(Math.random() * 3)];
        container.querySelector('#computerChoice').textContent = `Computer chose: ${getEmoji(computer)} ${computer.toUpperCase()}`;

        const result = getResult(choice, computer);
        updateResult(result);
        updateScores();
        if (result === 'win') {
            playerScore++;
            saveHighScore('rps', playerScore);
            container.querySelector('#rpsBest').textContent = getHighScore('rps');
        }
    } else {
        // 2P mode
        if (currentTurn === 'player1') {
            container.querySelector('#choiceDisplay').innerHTML = `Player 1: ${getEmoji(choice)} ${choice.toUpperCase()}`;
            currentTurn = 'player2';
            container.querySelector('#turnInfo').textContent = "Player 2's turn";
        } else {
            const p1Choice = container.querySelector('#choiceDisplay').textContent.split(': ')[1].trim().split(' ')[1].toLowerCase();
            const result = getResult(p1Choice, choice);
            container.querySelector('#choiceDisplay').innerHTML += ` <br> Player 2: ${getEmoji(choice)} ${choice.toUpperCase()}`;
            updateResult(result === 'win' ? 'Player 1 wins round!' : result === 'lose' ? 'Player 2 wins round!' : 'Tie round!');
            setTimeout(() => {
                container.querySelector('#choiceDisplay').innerHTML = '';
                currentTurn = 'player1';
                container.querySelector('#turnInfo').textContent = "Player 1's turn";
                container.querySelector('#rpsResult').textContent = '';
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
    if (res === 'win') el.textContent = 'You win round! 🎉';
    else if (res === 'lose') el.textContent = 'You lose round! 😤';
    else el.textContent = 'Tie! 🤝';
    el.className = 'result ' + res;
}

function updateScores() {
    const mode = document.querySelector('#modeSelect').value;
    container.querySelector('#rpsScores').innerHTML = mode === '1p'
        ? `You: ${playerScore} | Computer: ${opponentScore} | Ties: ${ties}`
        : `Player 1: ${playerScore} | Player 2: ${opponentScore} | Ties: ${ties}`;
}