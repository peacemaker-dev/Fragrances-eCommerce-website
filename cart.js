// cart.js (cleaned + optimized)

const cartContainer = document.getElementById("cart-items");
const totalPriceEl = document.getElementById("total-price");
const emptyCartEl = document.getElementById("empty-cart");
const clearBtn = document.getElementById("clear-cart");

// Load cart data
function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  renderCart(cart);
}

// Render available cart items
function renderCart(cart) {
  if (!cartContainer) return;

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    if (emptyCartEl) emptyCartEl.style.display = "block";
    if (totalPriceEl) totalPriceEl.textContent = "0.00";
    return;
  }

  if (emptyCartEl) emptyCartEl.style.display = "none";

  let total = 0;

  cart.forEach((item, index) => {
    const price = Number(item.price || 0);
    const qty = Number(item.quantity || 1);
    const itemTotal = price * qty;

    total += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <img src="${item.image || ''}" alt="${item.name}" class="cart-img">

      <div class="item-details">
        <h4>${item.name}</h4>
        <p class="item-price">R${price.toLocaleString()}</p>

        <div class="quantity-select">
          <label for="qty-${index}">Qty</label>
          <select id="qty-${index}" data-index="${index}">
            ${[1, 2, 3, 4, 5].map(n => `<option value="${n}">${n}</option>`).join("")}
          </select>
        </div>
      </div>

      <div class="item-right">
        <p><strong>Subtotal:</strong> R${itemTotal.toLocaleString()}</p>
        <button class="remove-item" data-id="${item.id}">Remove</button>
      </div>
    `;

    cartContainer.appendChild(cartItem);

    // Set current quantity
    const qtySelect = cartItem.querySelector(`#qty-${index}`);
    if (qtySelect) qtySelect.value = String(qty);

    // Quantity change event
    qtySelect.addEventListener("change", e => {
      const newQty = Number(e.target.value);
      let updated = JSON.parse(localStorage.getItem("cart")) || [];
      updated[index].quantity = newQty;
      localStorage.setItem("cart", JSON.stringify(updated));
      renderCart(updated); // re-render UI
    });
  });

  // Update total price
  if (totalPriceEl) {
    totalPriceEl.textContent = total.toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}

// Remove item
function removeItem(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => String(item.id) !== String(id));
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart(cart);
}

// Listen for remove button clicks
if (cartContainer) {
  cartContainer.addEventListener("click", e => {
    if (e.target.classList.contains("remove-item")) {
      const id = e.target.dataset.id;
      removeItem(id);
    }
  });
}

// Clear entire cart
function clearCart() {
  localStorage.removeItem("cart");
  renderCart([]);
}

// Clear cart button
if (clearBtn) {
  clearBtn.addEventListener("click", clearCart);
}

// Initialize cart on page load
loadCart();
