class PaginateInfinite extends HTMLElement {
  constructor() {
    super();

    const paginateButton = this.querySelector('[data-paginate-infinite-btn]');
    if (paginateButton) {
      paginateButton.addEventListener('click', this.onClickHandler.bind(this));
    } else {
      console.error('Button with data-paginate-infinite-btn not found!');
    }

    if (this.dataset.trigger == 'infinite') {
      new IntersectionObserver(this.handleIntersectionObserver.bind(this), {
        rootMargin: '0px 0px 0px 0px',
      }).observe(this);
    }
  }


  onClickHandler() {
    this.querySelector('[data-paginate-infinite-btn]').innerHTML = `
        <div class="spinner-border spinner-border-sm mx-auto" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `
    const url = this.dataset.url;
    PaginateInfinite.renderDataFromFetch(url);
  }

  handleIntersectionObserver(entries, observer) {
    if (!entries[0].isIntersecting) return;
    observer.unobserve(this);
    this.onClickHandler();
  }

  static renderDataFromFetch(url) {
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        const html = responseText;
        PaginateInfinite.renderProductsList(html);
        PaginateInfinite.renderPaginate(html);
        PaginateInfinite.initializeAddToCartListeners();
        PaginateInfinite.initializeWishlistListeners();
        new CartAddDrawerOpener();
        fc_change();
        theme?.ShippingBar?.init();
      })
      .catch((e) => {
        console.error(e);
      });
  }
  static initializeAddToCartListeners() {
    const productAddToCart = document.querySelectorAll('#ProductGridContainer [data-section-type="product"]');
    productAddToCart.forEach(form => {
      new theme.Product(form);
    });
  }

  static initializeWishlistListeners() {
    const wishlistButtons = document.querySelectorAll('[button-wishlist]');
    const BUTTON_ACTIVE_CLASS = 'active';
    wishlistButtons.forEach(button => {
      const productHandle = button.dataset.productHandle || false;
      if (!productHandle) return console.error('[Shopify Wishlist] Missing `data-product-handle` attribute. Failed to update the wishlist.');
      if (wishlistContains(productHandle)) button.classList.add(BUTTON_ACTIVE_CLASS);
      button.addEventListener('click', () => {
        updateWishlist(productHandle);
        button.classList.toggle(BUTTON_ACTIVE_CLASS);
      });
    });
  }

  static renderProductsList(html) {
    const container = document.querySelector('[data-items-list]');
    const productsList = new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector('[data-items-list]');
    container.insertAdjacentHTML('beforeend', productsList.innerHTML);
  }

  static renderPaginate(html) {
    const container = document
      .querySelector('[data-paginate-infinite-container]');
    const paginate = new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector('[data-paginate-infinite-container]');
    container.replaceWith(paginate);
  }
}
customElements.define('paginate-infinite', PaginateInfinite);
