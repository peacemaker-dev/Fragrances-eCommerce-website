// checkout.js
// Handles multi-step checkout, order ID generation, rendering summary from cart,
// and sending order via WhatsApp to +27 81 712 0030.

// NOTE: uploaded products.json path (used for tooling or future enhancements)
const PRODUCTS_JSON_LOCAL_PATH = "/mnt/data/products.json"; // developer note: transform to a URL in your environment if needed

// WhatsApp recipient (international format without spaces or +)
const WHATSAPP_NUMBER = "27817120030"; // +27 81 712 0030 -> 27817120030

// DOM elements (step sections)
const stepElems = {
  step1: document.getElementById("step-1"),
  step2: document.getElementById("step-2"),
  step3: document.getElementById("step-3")
};

const stepHeaders = Array.from(document.querySelectorAll(".checkout-steps .step"));

// Buttons
const btnStep1Next = document.getElementById("btn-step1-next");
const btnStep2Back = document.getElementById("btn-step2-back");
const btnStep2Next = document.getElementById("btn-step2-next");
const btnStep3Back = document.getElementById("btn-step3-back");
const btnPlaceOrder = document.getElementById("btn-place-order");

// Form controls (step 1)
const inputFullName = document.getElementById("full-name");
const inputPhone = document.getElementById("phone");
const inputEmail = document.getElementById("email");
const selectProvince = document.getElementById("province");
const inputCity = document.getElementById("city");
const inputSuburb = document.getElementById("suburb");
const inputStreet = document.getElementById("street");
const inputAddressNotes = document.getElementById("address-notes");

// Delivery controls (step 2)
const deliveryCourier = document.getElementById("delivery-courier");
const deliveryPaxi = document.getElementById("delivery-paxi");
const paxiDetails = document.getElementById("paxi-details");
const paxiBranchInput = document.getElementById("paxi-branch");
// Meet-up delivery
const deliveryMeetup = document.getElementById("delivery-meetup");
const meetupLocations = document.getElementById("meetup-locations");
const meetupSpot = document.getElementById("meetup-spot");

// COD radio container
const codOptionWrapper = document.getElementById("cod-option");


// Payment controls (step 3)
const payEft = document.getElementById("pay-eft");
const payCod = document.getElementById("pay-cod");
const bankNameEl = document.getElementById("bank-name");
const bankAccountEl = document.getElementById("bank-account");
const bankHolderEl = document.getElementById("bank-holder");
const bankBranchEl = document.getElementById("bank-branch");

// Summary elements (step 3)
const orderIdEl = document.getElementById("order-id");
const summaryItemsEl = document.getElementById("summary-items");
const summarySubtotalEl = document.getElementById("summary-subtotal");
const summaryDeliveryEl = document.getElementById("summary-delivery");
const summaryTotalEl = document.getElementById("summary-total");

// messages container
const checkoutMessages = document.getElementById("checkout-messages");

// internal state
let currentStep = 1;
let orderId = "";
let cart = []; // will be loaded from localStorage
let subtotal = 0;

// helper: change step UI
function goToStep(step) {
  currentStep = step;
  // show/hide sections
  Object.keys(stepElems).forEach(key => {
    const el = stepElems[key];
    if (!el) return;
    const stepNum = Number(el.dataset.step);
    el.hidden = stepNum !== step;
  });

  // update header active state
  stepHeaders.forEach(h => {
    const s = Number(h.dataset.step);
    if (s === step) h.classList.add("active");
    else h.classList.remove("active");
  });

  // If stepping to review, ensure summary is up to date
  if (step === 3) {
    renderOrderSummary();
  }
}

// simple validation for required fields in step 1
function validateStep1() {
  if (!inputFullName.value.trim()) {
    showMessage("Please enter your full name.", "error");
    inputFullName.focus();
    return false;
  }
  const phone = inputPhone.value.trim();
  if (!phone) {
    showMessage("Please enter your phone number.", "error");
    inputPhone.focus();
    return false;
  }
  if (!selectProvince.value) {
    showMessage("Please select your province.", "error");
    selectProvince.focus();
    return false;
  }
  if (!inputCity.value.trim()) {
    showMessage("Please enter your city or town.", "error");
    inputCity.focus();
    return false;
  }
  if (!inputStreet.value.trim()) {
    showMessage("Please enter your street address.", "error");
    inputStreet.focus();
    return false;
  }
  return true;
}

// show messages
function showMessage(text, type = "info", timeout = 2500) {
  if (!checkoutMessages) return;
  checkoutMessages.textContent = text;
  checkoutMessages.className = type === "error" ? "msg error" : "msg info";
  setTimeout(() => {
    checkoutMessages.textContent = "";
    checkoutMessages.className = "";
  }, timeout);
}

// generate short order ID: GMF- + 6 digits
function generateOrderId() {
  const num = Math.floor(100000 + Math.random() * 900000); // 6 digits
  return `GMF-${num}`;
}

// load cart from localStorage
function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem("cart") || "[]";
    cart = JSON.parse(raw);
    if (!Array.isArray(cart)) cart = [];
  } catch (e) {
    cart = [];
    console.error("Error parsing cart from localStorage", e);
  }
}

// render order summary items and subtotal
function renderOrderSummary() {
  loadCartFromStorage();
  summaryItemsEl.innerHTML = "";
  subtotal = 0;

  if (!cart || cart.length === 0) {
    summaryItemsEl.innerHTML = `<p>Your cart is empty. Please add items before checking out.</p>`;
    summarySubtotalEl.textContent = "R0.00";
    summaryDeliveryEl.textContent = "Pending";
    summaryTotalEl.textContent = "Pending";
    orderIdEl.textContent = "—";
    return;
  }

  cart.forEach(item => {
    const price = Number(item.price || 0);
    const qty = Number(item.quantity || 1);
    const itemTotal = price * qty;
    subtotal += itemTotal;

    const row = document.createElement("div");
    row.className = "summary-row";
    row.innerHTML = `
      <div class="row-left" style="display:flex; gap:10px; align-items:center;">
        <img src="${item.image || ''}" alt="${escapeHtml(item.name)}" style="width:56px;height:56px;object-fit:cover;border-radius:6px;">
        <div>
          <div style="font-weight:600">${escapeHtml(item.name)}</div>
          <div style="font-size:0.9rem;color:#555;">Qty: ${qty}</div>
        </div>
      </div>
      <div class="row-right" style="text-align:right;">
        <div>Price: R${price.toLocaleString()}</div>
        <div style="font-weight:700">R${itemTotal.toLocaleString()}</div>
      </div>
    `;
    summaryItemsEl.appendChild(row);
  });

  summarySubtotalEl.textContent = `R${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Delivery & Total are pending until you confirm on WhatsApp
  summaryDeliveryEl.textContent = "Pending";
  summaryTotalEl.textContent = "Pending";

  // Create or show order id
  if (!orderId) orderId = generateOrderId();
  orderIdEl.textContent = orderId;
}

// small escape helper
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
// Delivery method toggles
function updateDeliveryUI() {
  // Reset fields
  paxiDetails.style.display = "none";
  meetupLocations.style.display = "none";
  codOptionWrapper.style.display = "none";
  payEft.checked = true;

  const now = new Date();
  const month = now.getMonth() + 1; // 1-12

  if (deliveryCourier.checked) {
    // Courier selected
    codOptionWrapper.style.display = "none"; // no COD
  }

  if (deliveryPaxi.checked) {
    // PAXI selected
    paxiDetails.style.display = "block";
    codOptionWrapper.style.display = "none"; // no COD
  }

  if (deliveryMeetup.checked) {
    // Meet-Up selected
    meetupLocations.style.display = "block";

    // Disable meet-ups in Jan & Dec
    if (month === 1 || month === 12) {
      showMessage("Meet-ups are not available in January or December.", "error");
      deliveryCourier.checked = true;
      meetupLocations.style.display = "none";
      codOptionWrapper.style.display = "none";
      return;
    }

    // Enable COD only when meet-up is active
    codOptionWrapper.style.display = "block";
  }
}
// wire up UI behavior
function setupUI() {
  // Step 1 next
  btnStep1Next?.addEventListener("click", () => {
    if (!validateStep1()) return;
    goToStep(2);
  });

  // step 2 back/next
  document.getElementById("btn-step2-back")?.addEventListener("click", () => goToStep(1));
  document.getElementById("btn-step2-next")?.addEventListener("click", () => goToStep(3));

  // step 3 back
  btnStep3Back?.addEventListener("click", () => goToStep(2));
  deliveryCourier?.addEventListener("change", updateDeliveryUI);
  deliveryPaxi?.addEventListener("change", updateDeliveryUI);
  deliveryMeetup?.addEventListener("change", updateDeliveryUI);


  // payment toggles: bank details visible when EFT selected
  const bankDetailsBlock = document.getElementById("bank-details");
  function toggleBankDetails() {
    if (payEft && payEft.checked) bankDetailsBlock.style.display = "block";
    else bankDetailsBlock.style.display = "none";
  }
  payEft?.addEventListener("change", toggleBankDetails);
  payCod?.addEventListener("change", toggleBankDetails);
  // initial state
  toggleBankDetails();

  // Place order
  btnPlaceOrder?.addEventListener("click", handlePlaceOrder);
}

// Build message for WhatsApp
function buildWhatsAppMessage(data) {
  // data includes orderId, customer, address, delivery, payment, items, subtotal
  let lines = [];
  lines.push(`New Order: ${data.orderId}`);
  lines.push("");
  lines.push("Customer:");
  lines.push(`Name: ${data.customer.name}`);
  lines.push(`Phone: ${data.customer.phone}`);
  if (data.customer.email) lines.push(`Email: ${data.customer.email}`);
  lines.push("");
  lines.push("Address:");
  lines.push(`${data.customer.street || ""} ${data.customer.suburb || ""}`);
  lines.push(`${data.customer.city || ""}, ${data.customer.province || ""}`);
  if (data.customer.notes) lines.push(`Notes: ${data.customer.notes}`);
  lines.push("");
  lines.push("Delivery:");
  lines.push(`${data.delivery.method}`);
  if (data.delivery.method === "PAXI") {
    lines.push(`PAXI Branch: ${data.delivery.paxiBranch || "—"}`);
  }
  if (data.delivery.method === "Meet-Up") {
    lines.push(`Meet-up Spot: ${data.delivery.meetupSpot || "—"}`);
  }

  lines.push("Delivery fee: To be confirmed");
  lines.push("");
  lines.push("Payment:");
  lines.push(`${data.payment.method}`);
  if (data.payment.method === "EFT") {
    lines.push(`Bank: ${data.bank.name}`);
    lines.push(`Account: ${data.bank.account}`);
    lines.push(`Acc name: ${data.bank.holder}`);
    lines.push(`Branch: ${data.bank.branch}`);
    lines.push(`Reference: ${data.orderId}`);
  } else {
    lines.push("COD requested (availability to be confirmed)");
  }
  lines.push("");
  lines.push("Items:");
  data.items.forEach((it, idx) => {
    lines.push(`${idx + 1}. ${it.name} (x${it.quantity}) - R${(Number(it.price || 0)).toLocaleString()}`);
  });
  lines.push("");
  lines.push(`Subtotal: R${data.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  lines.push("Delivery Fee: Pending");
  lines.push("Total: Pending");
  lines.push("");
  lines.push("Please confirm delivery fee and COD availability. Thank you.");

  return encodeURIComponent(lines.join("\n"));
}

// handle place order flow
function handlePlaceOrder() {
  // final validation: ensure cart not empty
  loadCartFromStorage();
  if (!cart || cart.length === 0) {
    showMessage("Your cart is empty. Add items before placing an order.", "error");
    return;
  }

  // ensure order id exists
  if (!orderId) orderId = generateOrderId();

  // build customer & address
  const customer = {
    name: inputFullName.value.trim(),
    phone: inputPhone.value.trim(),
    email: inputEmail.value.trim(),
    province: selectProvince.value,
    city: inputCity.value.trim(),
    suburb: inputSuburb.value.trim(),
    street: inputStreet.value.trim(),
    notes: inputAddressNotes.value.trim()
  };

  // basic validation for safety
  if (!customer.name || !customer.phone || !customer.province || !customer.city || !customer.street) {
    showMessage("Please complete all required fields before placing the order.", "error");
    return;
  }

  let deliveryMethod = "Courier Guy";

  if (deliveryPaxi.checked) deliveryMethod = "PAXI";
  if (deliveryMeetup.checked) deliveryMethod = "Meet-Up";

  const paxiBranch = paxiBranchInput?.value?.trim() || "";

  let paymentMethod = "EFT";

  if (payCod.checked && deliveryMeetup.checked) {
    paymentMethod = "COD";
  }

  // bank details (pulled from DOM so you can edit in HTML)
  const bank = {
    name: bankNameEl?.textContent || "",
    account: bankAccountEl?.textContent || "",
    holder: bankHolderEl?.textContent || "",
    branch: bankBranchEl?.textContent || ""
  };

  // prepare data object
  const data = {
    orderId,
    customer,
    delivery: {
      method: deliveryMethod,
      paxiBranch,
      meetupSpot: meetupSpot?.value || ""
    },
    payment: { method: paymentMethod },
    bank,
    items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
    subtotal
  };

  // build WhatsApp message and open
  const message = buildWhatsAppMessage(data);
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  // open whatsapp in new tab
  window.open(waUrl, "_blank");

  // After opening WhatsApp, we clear the cart and show a confirmation message (you can change this behavior)
  localStorage.removeItem("cart");
  renderOrderSummary(); // re-render (will now show empty)
  showMessage(`Order ${orderId} opened in WhatsApp. We will confirm delivery fee and COD availability.`, "info", 4000);

  // Optionally, redirect to a "thank you" page after a short pause
  setTimeout(() => {
    // if you have a thank-you page, redirect here. Otherwise just stay.
    // window.location.href = "thank-you.html";
  }, 1800);
}

// init
document.addEventListener("DOMContentLoaded", () => {
  // load cart and initial summary
  loadCartFromStorage();
  orderId = generateOrderId();
  renderOrderSummary();

  // populate bank details placeholders (replace these with real details)
  // For now these are left as whatever is in your HTML; if empty you can set defaults here:
  bankNameEl.textContent = "Capitec Bank";
  // bankAccountEl.textContent = "123456789";
  bankHolderEl.textContent = "Grootman Fragrances";
  // bankBranchEl.textContent = "000000";

  setupUI();
  updateDeliveryUI();
  goToStep(1);
});