import axios from "axios";


export default function Products() {

  axios.get("http://localhost:5000/api/products").then((res) => {
    console.log(res.data);
  });
  return <h1 className="text-2xl font-bold">Products Content</h1>;
}