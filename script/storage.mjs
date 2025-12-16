// building the storage system for high scores

export function getHighScores() {

    const key = `high_${game}`;
    const value = localStorage.getItem(key);
    return value !== null ? value : "0";
}

export function saveHighScore(game, score, lowerBetter = false) {

    const key = `high_${game}`;
    let best = localStorage.getItem(key);
    if (best === null) lowerBetter ? Infinity : 0;

    else best = parseFloat(best);

    let newBest;
    if (lowerBetter) {
        newBest = score < best ? score : best;
    } else {
        newBest = score > best ? score : best;
    }

    if (newBest !== best) {
        localStorage.setItem(key, newBest);
    }
    return newBest;
}