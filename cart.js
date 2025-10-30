// cart.js
const cartContainer = document.getElementById("cart-items");
const totalPriceEl = document.getElementById("total-price");
const emptyCartEl = document.getElementById("empty-cart");

function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  renderCart(cart);
}

function renderCart(cart) {
  if (!cartContainer) return;
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    if (emptyCartEl) emptyCartEl.style.display = "block";
    if (totalPriceEl) totalPriceEl.textContent = "0.00";
    return;
  } else {
    if (emptyCartEl) emptyCartEl.style.display = "none";
  }

  let total = 0;

  cart.forEach((item, idx) => {
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    total += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <img src="${item.image || ''}" alt="${item.name}" class="cart-img">
      <div class="item-details">
        <h4>${item.name}</h4>
        <p class="item-price">R${(item.price || 0).toLocaleString()}</p>
        <div class="quantity-select">
          <label for="qty-${idx}">Qty</label>
          <select id="qty-${idx}" data-index="${idx}">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
      <div>
        <p><strong>Subtotal:</strong> R${itemTotal.toLocaleString()}</p>
        <button class="remove-item" data-name="${item.name}">Remove</button>
      </div>
    `;

    cartContainer.appendChild(cartItem);

    // set current quantity
    const qtySelect = cartItem.querySelector(`#qty-${idx}`);
    if (qtySelect) qtySelect.value = String(item.quantity || 1);

    // quantity change handler
    qtySelect && qtySelect.addEventListener("change", (e) => {
      const newQty = parseInt(e.target.value, 10) || 1;
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart[idx].quantity = newQty;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart(cart); // rerender for updated totals and subtotals
    });
  });

  if (totalPriceEl) totalPriceEl.textContent = total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Remove item by name
cartContainer && cartContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-item")) {
    const name = e.target.dataset.name;
    removeItem(name);
  }
});

function removeItem(name) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.name !== name);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart(cart);
}

function clearCart() {
  localStorage.removeItem("cart");
  renderCart([]);
}

// Expose clearCart if you have a button (optional)
const clearBtn = document.getElementById("clear-cart");
if (clearBtn) {
  clearBtn.addEventListener("click", clearCart);
}

// Initialize
loadCart();
