import { getCurrentUserEmail } from "./cartFunction";
import toast from "react-hot-toast";
import axios from "axios";

export const getWishlistFromStorage = () => {
  const email = getCurrentUserEmail();
  if (!email) return [];
  const wishlist = localStorage.getItem(`wishlist_${email}`);
  return wishlist ? JSON.parse(wishlist) : [];
};


export const saveWishlistToStorage = (wishlist) => {
  const email = getCurrentUserEmail();
  if (!email) return;
  localStorage.setItem(`wishlist_${email}`, JSON.stringify(wishlist));
};

export const addToWishlist = async (productId) => {
  const email = getCurrentUserEmail();
  if (!email) {
    toast.error("Please login to add to wishlist");
    return false;
  }

  const token = localStorage.getItem("token");
  
  try {
  
    if (token) {
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/wishlist/add", 
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  } catch (error) {
    console.error("Backend wishlist error, using localStorage:", error);
  }
  
 
  const currentWishlist = getWishlistFromStorage();
  if (!currentWishlist.includes(productId)) {
    const updatedWishlist = [...currentWishlist, productId];
    saveWishlistToStorage(updatedWishlist);
  }
  
  window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  return true;
};


export const removeFromWishlist = async (productId) => {
  const email = getCurrentUserEmail();
  if (!email) return false;

  const token = localStorage.getItem("token");
  
  try {
   
    if (token) {
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/wishlist/remove", 
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  } catch (error) {
    console.error("Backend wishlist error, using localStorage:", error);
  }
  
  const currentWishlist = getWishlistFromStorage();
  const updatedWishlist = currentWishlist.filter(id => id !== productId);
  saveWishlistToStorage(updatedWishlist);
  
  window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  return true;
};

export const isInWishlist = (productId) => {
  const wishlist = getWishlistFromStorage();
  return wishlist.includes(productId);
};


export const getWishlistCount = () => {
  const wishlist = getWishlistFromStorage();
  return wishlist.length;
};

export const getWishlistWithProducts = async () => {
  const wishlistIds = getWishlistFromStorage();
  
  if (wishlistIds.length === 0) return [];
  
  try {

    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products");
    const allProducts = response.data;
    
    return allProducts.filter(product => wishlistIds.includes(product.productId));
  } catch (error) {
    console.error("Error fetching product details:", error);

    return wishlistIds.map(productId => ({
      productId,
      productName: "Product",
      lastPrice: 0,
      price: 0,
      images: ["/placeholder-image.jpg"],
      stock: 0
    }));
  }
};