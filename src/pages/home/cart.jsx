import { useEffect, useState } from "react";
import { loadCart, deleteItem, clearCart } from "../../utils/cartFunction"; 
import CartCard from "../../components/cartCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  const toggleItemSelection = (productId) => {
    setSelectedItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const refreshCart = () => {
    const updatedCart = loadCart();
    setCart(updatedCart);
    
    const itemsToCalculate = selectedItems.length > 0
      ? updatedCart.filter(item => selectedItems.includes(item.productId))
      : updatedCart;
    
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/orders/quote", {
        orderedItems: itemsToCalculate,
      })
      .then((res) => {
        if(res.data.total != null){
          setTotal(res.data.total);
          setSubtotal(res.data.labeledTotal || res.data.total);
        }
      });
  };

  useEffect(() => {
    refreshCart();
  }, [selectedItems]);

  const handleRemoveItem = (productId) => {
    deleteItem(productId);
    setSelectedItems(prev => prev.filter(id => id !== productId));
    refreshCart();
  };

  function onOrderCheckOutClick() {
    const cartItems = loadCart();
    const itemsToCheckout = selectedItems.length > 0
      ? cartItems.filter(item => selectedItems.includes(item.productId))
      : cartItems;
    
    navigate("/shipping", {
      state: {
        items: itemsToCheckout
      }
    });

    if (selectedItems.length > 0) {
      selectedItems.forEach(productId => deleteItem(productId));
    } else {
      clearCart();
    }
    
    setTimeout(() => {
      refreshCart();
      setSelectedItems([]);
    }, 500);
  }

  const discount = total - subtotal;

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-white to-pink-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
      
      <div className="p-6 mb-4">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex items-center justify-center h-[12vh]">
               <div className="bg-white w-2/3 rounded-xl shadow-md p-6 text-center border border-pink-100">
      <FiShoppingCart className="text-3xl text-pink-600 mx-auto mb-2" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
      <p className="text-gray-600 mb-6">Add some products to your cart to continue shopping</p>
      <button
        onClick={() => navigate('/products')}
        className="bg-gradient-to-r from-pink-600 to-pink-700 text-white font-medium py-2 
        px-4 rounded-lg hover:from-pink-700 hover:to-pink-800 transition-all duration-300"
      >
        Browse Products
      </button>
    </div>
    </div>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <CartCard
                key={item.productId}
                productId={item.productId}
                qty={item.qty}
                onRemove={handleRemoveItem}
                isSelected={selectedItems.includes(item.productId)}
                onSelect={() => toggleItemSelection(item.productId)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg p-4 bottom-0 max-w-md ml-auto">
        {selectedItems.length > 0 && (
          <div className="mb-2 text-sm text-gray-600">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </div>
        )}
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium">LKR. {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount:</span>
            <span className={`${discount > 0 ? 'text-yellow-500' : 'text-gray-600'}`}>
              {discount > 0 ? `- LKR. ${discount.toFixed(2)}` : `LKR. 0.00`}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between text-base">
            <span className="font-bold text-gray-900">Amount to Pay:</span>
            <span className="font-bold text-gray-900">LKR. {subtotal.toFixed(2)}</span>
          </div>
        </div>
        
        <button 
          onClick={onOrderCheckOutClick} 
          className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 text-sm"
          disabled={cart.length === 0}
        >
          {selectedItems.length > 0 ? 'Checkout Selected' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
}