export function getCurrentUserEmail() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    return null;
  }
  try {
   
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    console.log("Token payload:", payload);
    return payload.email || payload.sub;
  } catch (e) {
    console.error("Error parsing token:", e);
    return null;
  }
}
export function loadCart() {
  const email = getCurrentUserEmail();
  if (!email) {
    return []; 
  }
  const cart = localStorage.getItem(`cart_${email}`);
  return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart) {
  const email = getCurrentUserEmail();
  if (!email) {
    return; 
  }
  localStorage.setItem(`cart_${email}`, JSON.stringify(cart));
}

export function clearCart() {
  const email = getCurrentUserEmail();
  if (!email) return;
  localStorage.removeItem(`cart_${email}`);
}
export function addToCart(productId, qty) {
  const email = getCurrentUserEmail();
  if (!email) {
    toast.error("Please login first to add products to your cart");
    return false;
  }
  
  console.log("Adding to cart - productId:", productId, "qty:", qty);
  const cart = loadCart();
  console.log("Current cart before update:", cart);
  
  const index = cart.findIndex((item) => item.productId == productId);

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
  
  console.log("Cart after update:", cart);
  saveCart(cart);
  return true;
}

export function deleteItem(productId) {
  const cart = loadCart();
  const index = cart.findIndex((item) => item.productId == productId);
  if (index !== -1) {
    cart.splice(index, 1);
    saveCart(cart);
  }
}