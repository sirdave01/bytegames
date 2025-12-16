// Writing the live-clock module to populate the liveclock div in the HTML file

function initLiveClock() {
    const clockEl = document.querySelector('#live-clock');
    if (!clockEl) {
        console.warn('Live clock element not found');
        return;
    }

    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0'); // Format to 2 digits
        const minutes = now.getMinutes().toString().padStart(2, '0'); // Format to 2 digits
        const seconds = now.getSeconds().toString().padStart(2, '0'); // Format to 2 digits

        const timeString = `${hours}:${minutes}:${seconds}`;
        clockEl.textContent = timeString;
    }

    updateClock(); // Initial update
    setInterval(updateClock, 1000); // Update every second
}

export { initLiveClock };