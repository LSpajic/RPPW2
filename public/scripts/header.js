document.addEventListener('DOMContentLoaded', () => {
  const cartCounter = document.getElementById('cart-counter');

  function updateCartCounter(count) {
    if (!cartCounter) return;

    cartCounter.textContent = count;

    if (parseInt(count, 10) === 0) {
      cartCounter.classList.add('hidden');
    } else {
      cartCounter.classList.remove('hidden');
    }
  }

  async function fetchCartCount() {
    try {
      const res = await fetch('/cart/count');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      updateCartCounter(data.count || 0);
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  }

  fetchCartCount();

  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      fetchCartCount();
    }
  });
});