  async function updateCart(name, action) {
    try {
      const method = action === 'remove' ? 'DELETE' : 'POST';
      const res = await fetch(`/cart/${action}/${encodeURIComponent(name)}`, {
        method,
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Network error');

      const data = await res.json();
      const cart = data.cart || {};

      // Update quantities in the table rows
      document.querySelectorAll('#cart-items tr').forEach(row => {
        const itemName = row.getAttribute('data-name');
        if (!itemName) return;

        const qtySpan = row.querySelector('.quantity-value');
        const qty = cart[itemName] || 0;

        if (qty === 0) {
          // Remove the row if quantity is zero
          row.remove();
        } else {
          qtySpan.textContent = qty;
        }
      });

      // If no items left, show empty message
      if (Object.keys(cart).length === 0) {
        const tbody = document.getElementById('cart-items');
        tbody.innerHTML = `<tr><td colspan="2" style="text-align: center;">Vaša košarica je prazna</td></tr>`;
      }

      // Update cart bubble count in header
      const countRes = await fetch('/cart/count');
      if (countRes.ok) {
        const countData = await countRes.json();
        const bubble = document.getElementById('cart-counter');
        if (bubble) {
          bubble.textContent = countData.count;
          if (countData.count === 0) {
            bubble.classList.add('hidden');
          } else {
            bubble.classList.remove('hidden');
          }
        }
      }

    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  }

  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      updateCart(name, 'add');
    });
  });

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      updateCart(name, 'remove');
    });
  });