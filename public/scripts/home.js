  
document.addEventListener('DOMContentLoaded', () => {
  const categoryLinks = document.querySelectorAll('.category-link');
  const productList = document.getElementById('product-list');
  const headerTitle = document.querySelector('.current-category h1');
  const cartCounter = document.getElementById('cart-counter');

  function updateCartCounter() {
    if (!cartCounter) return;
    const totalCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    cartCounter.textContent = totalCount;
    cartCounter.classList.toggle('hidden', totalCount === 0);
  }

  function renderProducts(products, categoryName) {
    if (!products || !products.length) {
      productList.innerHTML = '<p>No products found in this category.</p>';
      return;
    }

    productList.innerHTML = products.map(product => {
      const quantity = cart[product.name] || 0;

      return `
        <div class="product-card" style="position: relative;">
          ${quantity > 0 ? `<div class="numberCircle">${quantity}</div>` : ''}
          <img src="${product.image}" alt="${product.name}" class="product-image" />
          <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-category">${categoryName}</p>
            <form class="add-to-cart-form" action="/cart/add/${encodeURIComponent(product.name)}" method="post" 
                  data-product-name="${product.name}" data-product-category="${categoryName}">
              <input type="hidden" name="category" value="${categoryName}" />
              <button type="submit" class="add-to-cart"></button>
            </form>
          </div>
        </div>
      `;
    }).join('');
  }

  function updateQuantityCircles() {
    const cards = productList.querySelectorAll('.product-card');
    cards.forEach(card => {
      const nameElem = card.querySelector('.product-name');
      if (!nameElem) return;
      const productName = nameElem.textContent;
      const quantity = cart[productName] || 0;

      let numberCircle = card.querySelector('.numberCircle');

      if (quantity > 0) {
        if (!numberCircle) {
          numberCircle = document.createElement('div');
          numberCircle.className = 'numberCircle';
          card.style.position = 'relative';
          card.insertBefore(numberCircle, card.firstChild);
        }
        numberCircle.textContent = quantity;
      } else if (numberCircle) {
        numberCircle.remove();
      }
    });
  }

  async function onCategoryClick(e) {
    e.preventDefault();
    const link = e.currentTarget;
    const categoryName = link.dataset.categoryName.trim();

    categoryLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    if (headerTitle) headerTitle.textContent = categoryName;

    try {
      const res = await fetch(`/home/getProducts/${encodeURIComponent(categoryName)}`);
      if (!res.ok) throw new Error('Failed to fetch products');

      const products = await res.json();
      renderProducts(products, categoryName);
      updateQuantityCircles();
    } catch (error) {
      console.error(error);
      productList.innerHTML = '<p>Greška pri dohvaćanju proizvoda.</p>';
    }
  }

  async function onAddToCartSubmit(e) {
    if (!e.target.matches('.add-to-cart-form')) return;

    e.preventDefault();

    const form = e.target;
    const productName = form.dataset.productName;
    const category = form.dataset.productCategory;

    try {
      const res = await fetch(`/cart/add/${encodeURIComponent(productName)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ category })
      });

      if (!res.ok) throw new Error('Failed to add to cart');

      cart[productName] = (cart[productName] || 0) + 1;

      updateCartCounter();
      updateQuantityCircles();
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Greška pri dodavanju u košaricu.');
    }
  }

  async function refreshCartData() {
    try {
      const res = await fetch('/cart/data');
      if (!res.ok) throw new Error('Failed to fetch cart data');

      const data = await res.json();
      cart = data.cart || {};

      updateCartCounter();
      updateQuantityCircles();
    } catch (error) {
      console.error('Failed to refresh cart data:', error);
    }
  }

  categoryLinks.forEach(link => link.addEventListener('click', onCategoryClick));
  document.body.addEventListener('submit', onAddToCartSubmit);
  window.addEventListener('pageshow', event => {
    if (event.persisted) refreshCartData();
  });
  refreshCartData();
  updateCartCounter();
});