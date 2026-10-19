class PredictiveSearch extends HTMLElement {
    constructor() {
        super();

        this.input = this.querySelector('input[type="search"]');
        this.predictiveSearchResults = this.querySelector("#predictive-search");

        const modalElement = document.getElementById("modalSearch");
        if (modalElement) {
            modalElement.addEventListener("shown.bs.modal", () => this.onModalOpen());
        }

        this.input.addEventListener(
            "input",
            this.debounce((event) => {
                this.onChange(event);
            }, 300).bind(this)
        );
    }

    onModalOpen() {
        const searchTerm = this.input.value.trim() || "popular";
        this.getSearchResults(searchTerm);
        this.input.focus();
    }

    onChange() {
        const searchTerm = this.input.value.trim();
        this.getSearchResults(searchTerm);
    }

    getSearchResults(searchTerm = "") {
        fetch(
            `/search/suggest?q=${searchTerm}&resources[type]=product,query,collection,page,article&resources[limit]=12&section_id=predictive-search`
        )
            .then((response) => {
                if (!response.ok) {
                    const error = new Error(response.status);
                    this.close();
                    throw error;
                }
                return response.text();
            })
            .then((text) => {
                const resultsMarkup = new DOMParser()
                    .parseFromString(text, "text/html")
                    .querySelector("#shopify-section-predictive-search").innerHTML;
                this.predictiveSearchResults.innerHTML = resultsMarkup;
                this.open();
            })
            .catch((error) => {
                this.close();
                console.error(error);
            });
    }

    open() {
        // Show the element with animation
        this.predictiveSearchResults.style.display = "block";
        setTimeout(() => {
            this.predictiveSearchResults.classList.add('animation-show'); // Trigger fade-in
        }, 10); // Short delay to allow for style changes to be applied
    }

    close() {
        // Fade-out the element
        this.predictiveSearchResults.classList.remove('animation-show'); // Trigger fade-out
        setTimeout(() => {
            this.predictiveSearchResults.style.display = "none"; // Hide the element after animation
        }, 500); // Matches the duration of the fade-out (500ms)
    }


    debounce(fn, wait) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        };
    }
}

customElements.define("predictive-search", PredictiveSearch);
