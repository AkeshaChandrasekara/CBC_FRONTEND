// utils/cartFunction.js

export function loadCart(userId) {
  const carts = JSON.parse(localStorage.getItem("carts") || "{}");
  return carts[userId] || [];
}

export function addToCart(userId, productId, qty) {
  const carts = JSON.parse(localStorage.getItem("cart") || "{}");
  const cart = carts[userId] || [];

  const index = cart.findIndex(item => item.productId === productId);

  if (index === -1) {
    cart.push({ productId, qty });
  } else {
    const newQty = cart[index].qty + qty;
    if (newQty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].qty = newQty;
    }
  }

  carts[userId] = cart;
  localStorage.setItem("cart", JSON.stringify(carts));
}

export function saveCart(userId, cart) {
  const cart = JSON.parse(localStorage.getItem("cart") || "{}");
  cart[userId] = cart;
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function clearCart(userId) {
  const cart= JSON.parse(localStorage.getItem("cart") || "{}");
  delete cart[userId];
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function deleteItem(userId, productId) {
  const carts = JSON.parse(localStorage.getItem("cart") || "{}");
  const cart = cart[userId] || [];
  
  const index = cart.findIndex(item => item.productId === productId);
  
  if (index !== -1) {
    cart.splice(index, 1);
    carts[userId] = cart;
    localStorage.setItem("cart", JSON.stringify(carts));
  }
}