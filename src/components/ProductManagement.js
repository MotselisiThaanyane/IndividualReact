import React, { useState, useEffect } from "react";

const ProductManagement = ({ products, setProducts }) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [editProductIndex, setEditProductIndex] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // Ensure price is a number
      const formattedData = data.map((product) => ({
        ...product,
        price: parseFloat(product.price) || 0, // Fallback to 0 if parsing fails
      }));
      setProducts(formattedData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const product = {
      name: productName,
      description: productDescription,
      category: productCategory,
      price: parseFloat(productPrice),
      quantity: parseInt(productQuantity, 10),
    };

    try {
      if (editProductIndex === null) {
        // Add new product
        const response = await fetch("http://localhost:5000/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });
        if (response.ok) {
          await fetchProducts(); // Fetch the updated product list
        }
      } else {
        // Update existing product
        const response = await fetch(
          `http://localhost:5000/api/products/${products[editProductIndex].id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
          }
        );
        if (response.ok) {
          await fetchProducts(); // Fetch the updated product list
          setEditProductIndex(null);
        }
      }

      // Reset the form
      setProductName("");
      setProductDescription("");
      setProductCategory("");
      setProductPrice("");
      setProductQuantity("");
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const editProduct = (index) => {
    const product = products[index];
    setProductName(product.name);
    setProductDescription(product.description);
    setProductCategory(product.category);
    setProductPrice(product.price);
    setProductQuantity(product.quantity);
    setEditProductIndex(index);
  };

  const deleteProduct = async (index) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${products[index].id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) fetchProducts(); // Fetch the updated product list
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <section id="productManagement">
      <h2>Manage Products</h2>
      <form onSubmit={handleProductSubmit}>
        <input
          type="text"
          value={productName}
          placeholder="Product Name"
          required
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="text"
          value={productDescription}
          placeholder="Description"
          required
          onChange={(e) => setProductDescription(e.target.value)}
        />
        <select
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
          required
        >
          <option value="" disabled>
            Choose category
          </option>
          <option value="Hot Beverage">Hot Beverage</option>
          <option value="Cold Beverage">Cold Beverage</option>
          <option value="Baked">Baked</option>
          <option value="Fried Food">Fried Food</option>
          <option value="Junk">Junk</option>
          <option value="Snacks">Snacks</option>
        </select>
        <input
          type="number"
          value={productPrice}
          placeholder="Price"
          required
          onChange={(e) => setProductPrice(e.target.value)}
        />
        <input
          type="number"
          value={productQuantity}
          placeholder="Quantity"
          required
          onChange={(e) => setProductQuantity(e.target.value)}
        />
        <button type="submit">
          {editProductIndex === null ? "Add Product" : "Update Product"}
        </button>
      </form>

      <h3>Existing Products</h3>
      <table id="productTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.category}</td>
              <td>
                {typeof product.price === "number"
                  ? product.price.toFixed(2)
                  : "N/A"}
              </td>
              <td>{product.quantity}</td>
              <td>
                <button onClick={() => editProduct(index)}>Edit</button>
                <button onClick={() => deleteProduct(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ProductManagement;
