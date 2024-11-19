"use client"
import Header from "./components/Header";
import { useState, useEffect } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({})
  const [products, setproducts] = useState([])
  const [alert, setalert] = useState("")
  const [query, setquery] = useState("")
  const [loading, setloading] = useState(false)
  const [loadingAction, setloadingAction] = useState(false)
  const [dropdown, setdropdown] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/product')
      let rjson = await response.json()
      setproducts(rjson.products)
    }
    fetchProducts()
  }, []);

  const buttonAction = async (action, slug, initialQuantity) => {
    //immediately change the quantity of product with given slug in product
    let index = products.findIndex((item) => item.slug == slug)
    console.log(action, slug)
    let newProducts = JSON.parse(JSON.stringify(products))
    if (action == "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1
    }
    else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1
    }
    setproducts(newProducts)

    //immediately change the quantity of product with given slug in dropdown
    let indexdrop = dropdown.findIndex((item) => item.slug == slug)
    console.log(action, slug)
    let newDropdown = JSON.parse(JSON.stringify(dropdown))
    if (action == "plus") {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1
    }
    else {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1
    }
    setdropdown(newDropdown)
    setloadingAction(true)
    const response = await fetch('/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, slug, initialQuantity })
    });
    let r = await response.json()
    console.log(r)
    setloadingAction(false)
  }

  const addProduct = async (e) => {
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productForm)
      });
      if (response.ok) {
        console.log('Product added successfully')
        setalert("Your Product has been added!")
        

      } else {
        console.log('Error adding product')
      }
    } catch (error) {
      console.error('Error', error);
    }
    const response = await fetch('/api/product')
    let rjson = await response.json()
    setproducts(rjson.products)

  }

  const handlechange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value })
    
    
  }

  const onDropdownedit = async (e) => {
    let value=e.target.value
    setquery(value)
    if (value.length > 3) {
      setloading(true)
      setdropdown([])
      const response = await fetch('/api/search?query=' + query)
      let rjson = await response.json()
      setdropdown(rjson.products)
      setloading(false)
    }
    else {
      setdropdown([])
    }
  }

  return (
    <>
      <Header />
      <div className="container bg-red-100 mx-auto my-8 p-4">
        <div className="text-green-500 text-center">{alert}</div>

        {/* Display Current Stock */}

        <h1 className="text-3xl font-semibold mb-6">Search a Product</h1>
        {/* Search a product */}
        <div className="flex mb-2">
          <input onChange={onDropdownedit} type="text" placeholder="Enter a product name" className="flex-1 border border-gray-300" />
          <select className="border border-gray-300 px-4 py-2 rounded-r-md">
            <option value="">All</option>
            <option value="category 1">Category 1</option>
            <option value="category 2">Category 2</option>
          </select>
        </div>
        {loading && <div className="flex justify-center items-center"><svg fill="#000000" height="180px" width="180px" version="1.1" id="Layer_1" viewBox="0 0 330 330">
          <circle cx="50" cy="50" r="32" strokeWidth="8" stroke="#000" strokeDasharray="50.2655 50.2655" fill="none" strokeLinecap="round">
            <animateTransform
              attributeName="transform"
              type="rotate"
              repeatCount="indefinite"
              dur="1.5s"
              values="0 50 50;360 50 50">
            </animateTransform>
          </circle>
        </svg></div>

        }
        <div className="dropcontainer absolute w-[72vw]  border-1 bg-purple-100 rounded-md">
          {dropdown.map(item => {
            return <div key={item.slug} className="container flex justify-between  my-1 p-2 border-b-2">
              <span className="slug">{item.slug}({item.quantity} available for ₹{item.price})</span>
              <div className="mx-5 flex items-center">
                <button onClick={() => { buttonAction("minus", item.slug, item.quantity) }} disabled={loadingAction} className="subtract px-6 py-2 bg-purple-500 text-white font-semibold rounded-full shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer disabled:bg-purple-200">-</button>
                <span className="quantity mx-3">{item.quantity}</span>
                <button onClick={() => { buttonAction("plus", item.slug, item.quantity) }} disabled={loadingAction} className="add px-6 py-2 bg-purple-500 text-white font-semibold rounded-full shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer disabled:bg-purple-200">
                  +
                </button>
              </div>

            </div>
          })}</div>
        <h1 className="text-3xl font-semibold mb-6">Add a Product</h1>

        {/* Product Form */}
        <div className="mb-6">
          <input
            type="text"
            name="slug"
            placeholder="Product Slug"
            onChange={handlechange}

            className="border p-2 mr-2 mb-2"
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            onChange={handlechange}

            className="border p-2 mr-2 mb-2"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handlechange}

            className="border p-2 mr-2 mb-2"
          />
          <button onClick={addProduct}

            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Product
          </button>
        </div>

        <h1 className="text-3xl font-semibold mb-6">Display Current Stock</h1>

        {/* Stock Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left border-b border-gray-300">Product Name</th>
                <th className="px-6 py-3 text-left border-b border-gray-300">Quantity</th>
                <th className="px-6 py-3 text-left border-b border-gray-300">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                return <tr key={product.slug} className="hover:bg-gray-100">
                  <td className="px-6 py-2 border-b border-gray-300">{product.slug}</td>
                  <td className="px-6 py-2 border-b border-gray-300">{product.quantity}</td>
                  <td className="px-6 py-2 border-b border-gray-300">₹{product.price}</td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}



