import { initHamburger } from "./hambutton.mjs";
import { initLiveClock } from "./liveclock.mjs";
import { initDarkMode } from "./modetoggle.mjs";
import { initFooterDate } from "./footer.mjs";
import { initTicTacToe } from "./tictactoe.mjs";
import { initSnake } from "./snake.mjs";
import { initRPS } from "./rps.mjs";
import { initPong } from "./pong.mjs";
import { initMemory } from "./memorygame.mjs";

const gameSelect = document.getElementById('gameSelect');
const modeSelect = document.getElementById('modeSelect');
let currentGame = '';


gameSelect.addEventListener('change', (e) => {
    document.querySelectorAll('.game-container').forEach(el => el.classList.add('hidden'));
    currentGame = e.target.value;
    if (currentGame) {
        document.getElementById(currentGame).classList.remove('hidden');
        initCurrentGame();
    }
});

modeSelect.addEventListener('change', () => {
    if (currentGame) initCurrentGame();
});

function initCurrentGame() {
    const initMap = {
        tictactoe: initTicTacToe,
        rps: initRPS,
        snake: initSnake,
        memory: initMemory,
        pong: initPong
    };
    if (initMap[currentGame]) initMap[currentGame]();
}

// PWA Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('SW registered'))
        .catch(err => console.log('SW error:', err));
}

initHamburger();
initLiveClock();
initDarkMode();
initFooterDate();