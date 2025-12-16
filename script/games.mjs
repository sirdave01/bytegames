import { initHamburger } from "./hambutton.mjs";
import { initLiveClock } from "./liveclock.mjs";
import { initDarkMode } from "./modetoggle.mjs";
import { initFooterDate } from "./footer.mjs";
import { initTicTacToe } from "./tictactoe.mjs";
import { initSnake } from "./snake.mjs";
import { initRPS } from "./rps.mjs";
import { initPong } from "./pong.mjs";
import { initMemory } from "./memorygame.mjs";

document.addEventListener("DOMContentLoaded", () => {
    initHamburger();
    initLiveClock();
    initDarkMode();
    initFooterDate();
    initTicTacToe();
    initSnake();
    initRPS();
    initPong();
    initMemory();
});