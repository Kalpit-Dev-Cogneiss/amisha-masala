// ===== fetch config =====
window.fetchConfig = window.fetchConfig || ((type = 'json') => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: `application/${type}`,
  },
}));

// ===== debounce =====
window.debounce = window.debounce || function (fn, wait = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
};

class CartAddDrawerOpener {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('form[action*="/cart/add"]').forEach((form) => {
      form.addEventListener('submit', () => {
        setTimeout(() => {
          this.fetchAndRenderCart();
        }, 800);
      });
    });
  }

  fetchAndRenderCart() {
    fetch(window.Shopify.routes.root + 'cart.js')
      .then(res => res.json())
      .then(cart => {
        const cartDrawer = document.querySelector('cart-drawer');
        const cartItemsContainer = cartDrawer?.querySelector('cart-items');
        if (!cartDrawer || !cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';

        cart.items.forEach((item) => {
          cartItemsContainer.innerHTML += `
            <div
              class="cart_item py-3 border-bottom"
              data-cart-item
              data-cart-item-key="${item.key}"
              data-cart-item-url="${item.url}"
              data-cart-item-title="${item.title}"
              data-cart-item-index="${item.index || 1}"
              data-cart-item-quantity="${item.quantity}"
            >
              <div class="row gx-3">
                <div class="col-3">
                  <div class="item__image">
                    <a href="${item.url}">
                      <img
                        class="img-fluid${item.image ? '' : ' hide'}"
                        src="${theme.Images.getSizedImageUrl(item.image, 'x200')}"
                        loading="lazy"
                        alt="${item.image?.alt || item.title}"
                        width="100"
                        height="100"
                      >
                    </a>
                  </div>
                </div>
                <div class="col-9">
                  <div class="d-flex justify-content-between">
                    <div class="cart__item-title">
                      <a href="${item.url}">
                        <h3 class="fs-16 mb-0">${item.product_title}</h3>
                      </a>
                    </div>
                    <div class="cart__item-price">
                      ${theme.Currency.formatMoney(item.final_price, theme.moneyFormat)}
                    </div>
                  </div>
          
                  <div class="cart__item-options fs-12 ${(item.options_with_values || []).length === 1 && item.options_with_values[0].name === 'Title' ? 'hide' : ''}">
                    ${(item.options_with_values || [])
                      .filter(option => option.name !== 'Title')
                      .map(option => `<span class="product-option opacity-75">${option.name}: ${option.value}</span>`)
                      .join('')}
                  </div>
                  
          
                  <div data-group-quantity-remove class="d-flex align-items-center justify-content-between mt-2">
                    <div class="cart__item-quantitty quantity-selector d-flex">
                      <button
                        class="quantity__button disabled"
                        name="minus"
                        type="button"
                        onclick="updateQuantity(this, -1)"
                      >-</button>
                      <input
                        id="updates_large_${item.key}"
                        class="cart__qty-input"
                        type="number"
                        name="updates[]"
                        value="${item.quantity}"
                        min="0"
                        pattern="[0-9]*"
                        data-quantity-input
                        data-quantity-item="${item.index || 1}"
                        data-quantity-input-desktop
                        data-role="product-quantity-desktop"
                      >
                      <button
                        class="quantity__button"
                        name="plus"
                        type="button"
                        onclick="updateQuantity(this, 1)"
                      >+</button>
                    </div>
                    <div class="cart__item-remove">
                      <a data-item-remove href="/cart/change?line=${item.index || 1}&quantity=0">
                        <i class="rm-icon bi bi-trash3 fs-14"></i><div class="rm-loading spinner-border spinner-border-sm" role="status"></div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        });

        cartDrawer.classList.add('show-cart__drawer');
        document.body.classList.add('bg--show-cart__drawer');
        cartDrawer.querySelector('.cart__drawer-form')?.classList.remove('hide');
        cartDrawer.querySelector('.cart__drawer-empty')?.classList.add('hide');

        cartDrawer.querySelector('.subtotal_price').textContent = theme.Currency.formatMoney(cart.total_price, theme.moneyFormat);
      });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CartAddDrawerOpener();
  
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-item-remove]');
    const item = btn?.closest('[data-cart-item]');
    if (!btn || !item) return;
  
    e.preventDefault();
    
    btn.classList.add('loading');

    fetch('/cart/change.js', {
      ...fetchConfig(),
      body: JSON.stringify({ id: item.dataset.cartItemKey, quantity: 0 })
    })
    .then(res => {
      if (!res.ok) throw new Error('Remove failed');
      return res.json();
    })
    .then(() => {
      fetch('/cart.js')
        .then(res => res.json())
        .then(cart => {
          const cartDrawer = document.querySelector('cart-drawer');
          const cartItemsContainer = cartDrawer?.querySelector('cart-items');

          if (cart.items.length === 0) {
            cartItemsContainer.innerHTML = '';
            cartDrawer.querySelector('.cart__drawer-form')?.classList.add('hide');
            cartDrawer.querySelector('.cart__drawer-empty')?.classList.remove('hide');

            document.querySelectorAll('.cart-goal').forEach(bar => {
              const threshold = parseInt(bar.dataset.treshold || 0, 10);
              const promoteText = bar.dataset.promote;
              const valueLeft = theme.Currency.formatMoney(threshold, theme.moneyFormat);

              bar.querySelector('.description').innerHTML = promoteText.replace('[amount]', valueLeft);
              bar.querySelector('.progress-bar').style.width = '0%';
              bar.querySelector('.cart-goal-icon').style.right = '100%';
            });
          } else {
            new CartAddDrawerOpener().fetchAndRenderCart();
            theme?.ShippingBar?.init();
          }
          btn.classList.remove('loading');
        });
    })
    .catch(err => {
      console.error('Remove failed:', err);
      btn.classList.remove('loading');
    });
  });
});

// ===== Cart Drawer =====
class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.initEvents();
  }

  initEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.site-header__cart')) {
        e.preventDefault();
        this.classList.add('show-cart__drawer');
        document.body.classList.add('bg--show-cart__drawer');
      }
      if (e.target.closest('.cross')) {
        this.closeDrawer();
      }
    });

    document.addEventListener('mouseup', (e) => {
      if (!this.contains(e.target)) {
        this.closeDrawer();
      }
    });
  }

  closeDrawer() {
    this.classList.remove('show-cart__drawer');
    document.body.classList.remove('bg--show-cart__drawer');
  }
}
customElements.define('cart-drawer', CartDrawer);