import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  // =========================
  // FORM STATES
  // =========================

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");

  // =========================
  // PRODUCTS STATE
  // =========================

  const [products, setProducts] = useState([]);

  // =========================
  // EDIT STATE
  // =========================

  const [editingId, setEditingId] = useState(null);

  // =========================
  // SEARCH STATE
  // =========================

  const [search, setSearch] = useState("");

  // =========================
  // GET ALL PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/products`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch products"
        );
      }

      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // =========================
  // LOAD PRODUCTS WHEN PAGE LOADS
  // =========================

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // ADD / UPDATE PRODUCT
  // =========================

  const handleSubmit = async () => {
    try {
      // =========================
      // UPDATE PRODUCT
      // =========================

      if (editingId) {
        const response = await fetch(
          `${API_URL}/api/products/${editingId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              name,
              price: Number(price),
              category,
              stock: Number(stock),
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to update product"
          );
        }

        console.log("Product updated:", data);

        setEditingId(null);
      }

      // =========================
      // CREATE PRODUCT
      // =========================

      else {
        const response = await fetch(
          `${API_URL}/api/products`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              name,
              price: Number(price),
              category,
              stock: Number(stock),
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to create product"
          );
        }

        console.log("Product created:", data);
      }

      // =========================
      // CLEAR FORM
      // =========================

      setName("");
      setPrice("");
      setCategory("");
      setStock("");

      // Refresh product list
      fetchProducts();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // =========================
  // START EDITING
  // =========================

  const handleEdit = (product) => {
    setEditingId(product._id);

    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setStock(product.stock);
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      console.log("Product deleted:", data);

      // Refresh product list
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancelEdit = () => {
    setEditingId(null);

    setName("");
    setPrice("");
    setCategory("");
    setStock("");
  };

  // =========================
  // SEARCH PRODUCTS
  // =========================

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // UI
  // =========================

  return (
    <div className="container">

      {/* =========================
          HEADER
          ========================= */}

      <div className="header">
        <h1>Product Manager</h1>

        <p>
          Manage your products easily
        </p>
      </div>

      {/* =========================
          ADD / EDIT PRODUCT
          ========================= */}

      <div className="form-card">

        <h2>
          {editingId ? "Edit Product" : "Add Product"}
        </h2>

        <div className="form-grid">

          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

        </div>

        <br />

        <button
          className="primary-btn"
          onClick={handleSubmit}
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>

        {editingId && (
          <button
            className="cancel-btn"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        )}

      </div>

      {/* =========================
          PRODUCTS
          ========================= */}

      <div className="products-card">

        <h2>Products</h2>

        {/* SEARCH */}

        <input
          className="search-input"
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* PRODUCTS LIST */}

        <div className="product-list">

          {filteredProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            filteredProducts.map((product) => (

              <div
                className="product-card"
                key={product._id}
              >

                <h3>{product.name}</h3>

                <p className="product-info">
                  Price: ₹{product.price}
                </p>

                <p className="product-info">
                  Category: {product.category}
                </p>

                <p className="product-info">
                  Stock: {product.stock}
                </p>

                <br />

                <button
                  className="edit-btn"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(product._id)
                  }
                >
                  Delete
                </button>

              </div>

            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default App;