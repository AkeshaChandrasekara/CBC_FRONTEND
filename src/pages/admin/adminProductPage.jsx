import axios from "axios";
import { useState, useEffect } from "react";

export default function Products() {
  const [products, setProducts] = useState([
    {
      productId: 'BP1001',
      productName: 'Hydrating Facial Serum',
      altNames: ['Moisture Boost Serum', 'Glow Serum'],
      images: [
        'https://example.com/images/serum1.jpg',
        'https://example.com/images/serum2.jpg'
      ],
      price: 29.99,
      lastPrice: 39.99,
      stock: 120,
      description: 'A deeply hydrating facial serum enriched with hyaluronic acid and vitamin C to boost skin radiance and moisture retention.'
    },
    {
      productId: 'BP1005',
      productName: 'Hydrating Facial Serum',
      altNames: ['Moisture Boost Serum', 'Glow Serum'],
      images: [
        'https://example.com/images/serum1.jpg',
        'https://example.com/images/serum2.jpg'
      ],
      price: 29.99,
      lastPrice: 39.99,
      stock: 120,
      description: 'A deeply hydrating facial serum enriched with hyaluronic acid and vitamin C to boost skin radiance and moisture retention.'
    }
  ])
  console.log(products);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then((res) => {
      console.log(res.data);
      setProducts(res.data);
    }).then(() => {
      console.log("done");
    }).catch((err) => {
      console.log(err);
    })
  }, []);

  return (
    <div>
      <h1>Products</h1>

      {products.map((product,index) => {
        return (
          <div key={product._id}>
            {index}
            <h2>{product.productName}</h2>
           
          </div>
        );
      })}

    </div>
  );
}