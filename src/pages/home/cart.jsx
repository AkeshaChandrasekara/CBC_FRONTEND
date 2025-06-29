import { useEffect, useState } from "react";
import { loadCart } from "../../utils/cartFunction"; 
import CartCard from "../../components/cartCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [labeledTotal, setLabeledTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshCart = () => {
    const updatedCart = loadCart();
    setCart(updatedCart);
    setLoading(false);
    
    if (updatedCart.length > 0) {
      axios.post(import.meta.env.VITE_BACKEND_URL + "/api/orders/quote", {
        orderedItems: updatedCart,
      })
      .then((res) => {
        if (res.data.total != null) {
          setTotal(res.data.total);
          setLabeledTotal(res.data.total);
        }
      })
      .catch(err => {
        toast.error("Error calculating totals");
        console.error(err);
      });
    } else {
      setTotal(0);
      setLabeledTotal(0);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const handleRemoveItem = (productId) => {
    refreshCart();
    toast.success("Cart updated");
  };

  function onOrderCheckOutClick() {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    navigate("/shipping", {
      state: {
        items: loadCart()
      }
    });    
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Your cart is empty</p>
            <button
              onClick={() => navigate('/products')}
              className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <CartCard
                key={item.productId}
                productId={item.productId}
                qty={item.qty}
                onRemove={handleRemoveItem} 
              />
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 bottom-0 max-w-md ml-auto sticky top-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">LKR. {labeledTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount:</span>
              <span className="text-yellow-500">- LKR. {(labeledTotal - total).toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between text-base">
              <span className="font-bold text-gray-900">Grand Total:</span>
              <span className="font-bold text-gray-900">LKR. {total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={onOrderCheckOutClick} 
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}