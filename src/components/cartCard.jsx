import axios from "axios";
import { useEffect, useState } from "react";
import { deleteItem } from "../utils/cartFunction";
import { FiTrash2 } from "react-icons/fi"; 

export default function CartCard(props) {
  const productId = props.productId;
  const qty = props.qty;
  const { onRemove, isSelected, onSelect, product: propProduct } = props;

  const [product, setProduct] = useState(propProduct || null);
  const [loaded, setLoaded] = useState(!!propProduct);
  const [price, setPrice] = useState(0);

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
              <p className="text-sm text-gray-500">Qty: {qty}</p>
              <p className="text-sm text-gray-600">
                LKR {price.toFixed(2)} 
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-right mr-4">
              <p className="font-bold text-black">
                LKR {(price * qty).toFixed(2)}
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