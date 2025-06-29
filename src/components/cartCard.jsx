import axios from "axios";
import { useEffect, useState } from "react";
import { deleteItem, updateCartItem } from "../utils/cartFunction";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

export default function CartCard({ productId, qty, onRemove }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(qty);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        toast.error("Error loading product");
        setLoading(false);
      });
  }, [productId]);

  useEffect(() => {
    if (quantity !== qty) {
      updateCartItem(productId, quantity);
      if (onRemove) onRemove(productId);
    }
  }, [quantity]);

  const handleRemove = () => {
    deleteItem(productId);
    if (onRemove) onRemove(productId);
    toast.success("Item removed from cart");
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  if (loading) return null; 

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-4 border border-gray-100">
      <div className="flex items-center space-x-4">
        <img
          src={product?.images[0]}
          className="w-20 h-20 object-cover rounded-lg"
          alt={product?.productName}
        />
        <div>
          <h3 className="font-bold text-gray-900">{product?.productName}</h3>
          <p className="text-sm text-gray-500">ID: {productId}</p>
          <div className="flex items-center mt-2">
            <button
              onClick={handleDecrease}
              className="p-1 text-gray-500 hover:text-gray-700"
              disabled={quantity <= 1}
            >
              <FiMinus size={16} />
            </button>
            <span className="mx-2 w-8 text-center">{quantity}</span>
            <button
              onClick={handleIncrease}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <FiPlus size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="text-right mr-4">
          <p className="font-medium text-gray-900">
            LKR {product?.lastPrice.toFixed(2)}
          </p>
          <p className="font-bold text-yellow-500">
            LKR {(product?.lastPrice * quantity).toFixed(2)}
          </p>
        </div>
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 transition-colors p-2"
          aria-label="Remove item"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
}