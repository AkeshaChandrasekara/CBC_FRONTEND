import axios from "axios";
import { useEffect, useState } from "react";
import { deleteItem, updateItemQuantity } from "../utils/cartFunction";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi"; 

export default function CartCard(props) {
  const productId = props.productId;
  const initialQty = props.qty;
  const { onRemove, isSelected, onSelect, product: propProduct, onQuantityChange } = props;

  const [product, setProduct] = useState(propProduct || null);
  const [loaded, setLoaded] = useState(!!propProduct);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(initialQty);

  useEffect(() => {
    setQuantity(initialQty); 
  }, [initialQty]);

  useEffect(() => {
    if (!loaded && !propProduct) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId)
        .then((response) => {
          if (response.data != null) {
            setProduct(response.data);
            setPrice(response.data.lastPrice || response.data.price);
            setLoaded(true);
          } else {
            deleteItem(productId);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (propProduct) {
      setPrice(propProduct.lastPrice || propProduct.price);
    }
  }, [productId, loaded, propProduct]);

  const handleRemove = () => {
    deleteItem(productId);
    if (onRemove) {
      onRemove(productId);
    }
  };

  const handleQuantityChange = (newQty) => {
    if (newQty < 1) return;
    
    setQuantity(newQty);
    updateItemQuantity(productId, newQty);
    
    if (onQuantityChange) {
      onQuantityChange(productId, newQty);
    }
  };

  const incrementQuantity = () => {
    handleQuantityChange(quantity + 1);
  };

  const decrementQuantity = () => {
    handleQuantityChange(quantity - 1);
  };

  return (
    <>
      {!loaded ? (
        <div className="animate-pulse bg-gray-200 rounded-lg h-24 w-full"></div>
      ) : (
        <div className={`flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all 
        duration-300 mb-4 border ${isSelected ? 'border-pink-500' : 'border-pink-100'}`}>
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="h-5 w-5 text-pink-600 rounded focus:ring-pink-500"
            />
            <img
              src={product?.images?.[0]}
              className="w-20 h-20 object-cover rounded-lg"
              alt={product?.productName}
            />
            <div>
              <h3 className="font-bold text-gray-900">{product?.productName}</h3>
              <p className="text-sm text-gray-500">ID: {productId}</p>
              <p className="text-sm text-gray-600">
                LKR {price.toFixed(2)} 
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
         
            <div className="flex items-center justify-center mr-6">
              <button 
                onClick={decrementQuantity}
                className="w-7 h-7 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center transition-colors"
                disabled={quantity <= 1}
              >
                <FiMinus size={14} />
              </button>
              
              <span className="px-3 py-1 mx-2 bg-white text-center min-w-[2rem] text-sm font-medium">
                {quantity}
              </span>
              
              <button 
                onClick={incrementQuantity}
                className="w-7 h-7 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center transition-colors"
              >
                <FiPlus size={14} />
              </button>
            </div>
            
            <div className="text-right mr-4">
              <p className="font-bold text-black">
                LKR {(price * quantity).toFixed(2)}
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
      )}
    </>
  );
}