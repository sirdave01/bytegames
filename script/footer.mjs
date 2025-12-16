// creating and eventlistener to dynamically populate the footer of the page's year and last modified date

function initFooterDate() {
    const yearEl = document.querySelector(`#currentyear`);
    const modEl = document.querySelector(`#lastModified`);

    if (yearEl) yearEl.textContent = new Date().getFullYear();

    if (modEl) {
        modEl.textContent = `Last Modified: ${new Date(document.lastModified).toLocaleString()}`;
    }
}

export { initFooterDate };