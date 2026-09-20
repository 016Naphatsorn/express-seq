
import express from "express";
import { Product, connectDB } from "./db.js";
import cors from "cors";

const app = express();

// Render จะกำหนด PORT ให้เอง
// ถ้ารันในเครื่องจะใช้ port 5000
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

// Test
app.get("/", (req, res) => {
  return res.json({ message: "Server is running!" });
});

// สร้าง Product
app.post("/api/products", async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined || price === null) {
      return res
        .status(400)
        .json({ message: "Name & Price are required fields!!" });
    }

    const newProduct = await Product.create({
      name: name,
      price: Number(price),
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Server error!", error);
    return res.status(500).json({ error: error.message });
  }
});

// ดู Product ทั้งหมด
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.findAll();

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ดู Product ตาม ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not Found!" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// อัพเดท Product
app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    if (!name && price === undefined) {
      return res
        .status(400)
        .json({ message: "Name or Price is required!" });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not Found!" });
    }

    await product.update({
      name: name || product.name,
      price: price !== undefined ? Number(price) : product.price,
    });

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ลบ Product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not Found!" });
    }

    await product.destroy();

    return res.status(200).json({
      message: "Product is deleted successfully",
      deleteProduct: product,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

