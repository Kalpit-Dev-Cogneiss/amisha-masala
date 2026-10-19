class VideoPlayer extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const video = this.querySelector('video');
        const playButton = this.querySelector('.playbutton');

        if (!video || !playButton) return;

        playButton.addEventListener('click', () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
        const updateButton = () => {
            if (video.paused) {
                playButton.classList.remove('playing');
            } else {
                playButton.classList.add('playing');
            }
        };

        video.addEventListener('play', updateButton);
        video.addEventListener('pause', updateButton);
        video.addEventListener('ended', updateButton);
        updateButton();
    }
}

customElements.define('video-player', VideoPlayer);
