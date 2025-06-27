import axios from "axios";
import { useEffect, useState } from "react";
import { deleteItem } from "../utils/cartFunction";

export default function CartCard(props) {
  const productId = props.productId;
  const qty = props.qty;

  const [product, setProduct] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId)
        .then((response) => {
          if (response.data != null) {
            setProduct(response.data);
            setLoaded(true);
          } else {
            deleteItem(productId);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <>
      {!loaded ? (
        <div className="animate-pulse bg-gray-200 rounded-lg h-24 w-full"></div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 mb-4 border border-gray-100">
          <div className="flex items-center space-x-4">
            <img
              src={product?.images[0]}
              className="w-20 h-20 object-cover rounded-lg"
              alt={product?.productName}
            />
            <div>
              <h3 className="font-bold text-gray-900">{product?.productName}</h3>
              <p className="text-sm text-gray-500">ID: {productId}</p>
              <p className="text-sm text-gray-500">Qty: {qty}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-900">LKR. {product?.lastPrice.toFixed(2)}</p>
            <p className="font-bold text-yellow-500">
              LKR. {(product?.lastPrice * qty).toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </>
  );
}