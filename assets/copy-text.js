class CodeCopier extends HTMLElement {
    constructor() {
        super();

        // Access elements using data-* attributes
        this.copyButton = this.querySelector('[data-js-btn]');
        this.copyText = this.querySelector('[data-js-code]');

        // Get values from data-* attributes
        this.successMessage = this.copyButton.getAttribute('data-success') || 'Copied!';
        this.defaultMessage = this.copyButton.getAttribute('data-default') || 'Copy';

        // Set the initial content of the button
        this.copyButton.innerHTML = this.defaultMessage;

        // Add click event listener to the copy button
        this.copyButton.addEventListener('click', this.copyCode.bind(this));
    }

    copyCode(event) {
        event.preventDefault();
        this.copyText.select();
        this.copyText.setSelectionRange(0, 99999);

        // Attempt to copy the content to clipboard
        navigator.clipboard.writeText(this.copyText.value)
            .then(() => {
                this.showTooltip(this.successMessage); // Show success message when copying is successful
            })
            .catch(() => {
                this.showTooltip(this.successMessage); // Show nothing if copying fails
            });
    }

    showTooltip(message) {
        this.copyButton.innerHTML = message;
        // Reset the button text to the default message after 2 seconds
        setTimeout(() => {
            this.copyButton.innerHTML = this.defaultMessage;
        }, 2000);
    }
}

// Register the custom element
customElements.define('code-copier', CodeCopier);
