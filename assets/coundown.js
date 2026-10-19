class CountdownTimer extends HTMLElement {
    constructor() {
        super();
        this.inputClass = 'js-date';  // Changed from 'inputId' to 'inputClass'
        this.outputClass = 'js-countdown';  // Changed from 'outputId' to 'outputClass'
        this.endDate = null;
        this.countdownTimer = null;
    }

    connectedCallback() {
        // Select the element by class and add the 'change' event listener
        this.querySelector(`.${this.inputClass}`).addEventListener('change', this.start.bind(this));
        const selectedDate = this.querySelector(`.${this.inputClass}`).value;
        if (selectedDate) {
            this.endDate = new Date(selectedDate).getTime();
            this.start();
        }
    }

    start() {
        const selectedDate = this.querySelector(`.${this.inputClass}`).value;

        if (!selectedDate) {
            alert("Please select a date.");
            return;
        }

        this.endDate = new Date(selectedDate).getTime();

        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
        }

        this.countdownTimer = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.endDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update the inner HTML of the element with the corresponding class
        this.querySelector(`.${this.outputClass}`).innerHTML = `<span class="info-time">${days}<span class="info">d</span></span> <span class="info-time">${hours}<span class="info">h</span></span> <span class="info-time">${minutes}<span class="info">m</span></span> <span class="info-time">${seconds}<span class="info">s</span></span>`;
        if (distance < 0) {
            clearInterval(this.countdownTimer);
            this.querySelector(`.${this.outputClass}`).innerHTML = "Time out!";
        }
    }
}

customElements.define('countdown-timer', CountdownTimer);
