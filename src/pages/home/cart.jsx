import { useEffect, useState } from "react";
import { loadCart, deleteItem } from "../../utils/cartFunction"; 
import CartCard from "../../components/cartCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [labeledTotal, setLabeledTotal] = useState(0);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const refreshCart = () => {
    if (!currentUser) {
      setCart([]);
      return;
    }
    
    const updatedCart = loadCart(currentUser.id); // Use user ID
    setCart(updatedCart);
    
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/orders/quote", {
        orderedItems: updatedCart,
      })
      .then((res) => {
        if(res.data.total != null){
          setTotal(res.data.total);
          setLabeledTotal(res.data.total);
        }
      });
  };

  useEffect(() => {
    refreshCart();
  }, [currentUser]);

   const handleRemoveItem = (productId) => {
    deleteItem(currentUser.id, productId); 
    refreshCart();
  };

  function onOrderCheckOutClick() {
    navigate("/shipping", {
      state: {
        items: loadCart(currentUser.id) 
      }
    });    
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Your cart is empty</p>
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

      <div className="bg-gray-50 rounded-lg p-4 bottom-0 max-w-md ml-auto">
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
          disabled={cart.length === 0}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}