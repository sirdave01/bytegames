import { initHamburger } from "./hambutton.mjs";
import { initLiveClock } from "./liveclock.mjs";
import { initDarkMode } from "./modetoggle.mjs";
import { initFooterDate } from "./footer.mjs";

document.addEventListener("DOMContentLoaded", () => {
    initHamburger();
    initLiveClock();
    initDarkMode();
    initFooterDate();
});