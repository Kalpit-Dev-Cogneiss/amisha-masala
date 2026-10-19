class Counter extends HTMLElement {
    constructor() {
        super();
        this._observer = null;
        this._hasCounted = false;
    }

    connectedCallback() {
        this._targetNumber = parseInt(this.getAttribute('data-count-to')) || 0;
        this.innerHTML = `<span>0</span>`;

        this._observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this._hasCounted) {
                    this._hasCounted = true;
                    this._startCounting();
                }
            });
        }, { threshold: 0.6 });

        this._observer.observe(this);
    }

    _startCounting() {
        const el = this.querySelector('span');
        const duration = 1500;
        const start = performance.now();

        const step = (timestamp) => {
            const progress = Math.min((timestamp - start) / duration, 1);
            const current = Math.floor(progress * this._targetNumber);
            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = this._targetNumber.toLocaleString();
            }
        };

        requestAnimationFrame(step);
    }

    disconnectedCallback() {
        if (this._observer) {
            this._observer.disconnect();
        }
    }
}

customElements.define('count-up', Counter);
