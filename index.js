import express from "express";
import cors from "cors";
import { Product, connectDB } from "./db.js";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect database
connectDB();

// =====================================================
// GET /
// =====================================================
app.get("/", (req, res) => {
  return res.json({
    message: "Brix Land Happy API is running",
  });
});

// =====================================================
// CREATE - ลงทะเบียนเข้าเล่น
// =====================================================
app.post("/api/products", async (req, res) => {
  try {
    const {
      name,
      age,
      checkIn,
      checkOut,
      duration,
      parentPhone,
    } = req.body;

    // ตรวจสอบข้อมูล
    if (
      !name ||
      !age ||
      !checkIn ||
      !checkOut ||
      !duration ||
      !parentPhone
    ) {
      return res.status(400).json({
        message: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
    }

    const newProduct = await Product.create({
      name,
      age: Number(age),
      checkIn,
      checkOut,
      duration: Number(duration),
      parentPhone,
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Create error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
});

// =====================================================
// GET ALL - ดูรายการทั้งหมด
// =====================================================
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [["id", "DESC"]],
    });

    return res.json(products);
  } catch (error) {
    console.error("Get all error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
});

// =====================================================
// GET BY ID - ดูข้อมูลตาม ID
// =====================================================
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "ไม่พบข้อมูลผู้ใช้บริการ",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Get by ID error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
});

// =====================================================
// UPDATE - แก้ไขข้อมูล
// =====================================================
app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      age,
      checkIn,
      checkOut,
      duration,
      parentPhone,
    } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "ไม่พบข้อมูลผู้ใช้บริการ",
      });
    }

    // อัปเดตเฉพาะค่าที่ส่งมา
    await product.update({
      name: name ?? product.name,
      age: age !== undefined ? Number(age) : product.age,
      checkIn: checkIn ?? product.checkIn,
      checkOut: checkOut ?? product.checkOut,
      duration:
        duration !== undefined
          ? Number(duration)
          : product.duration,
      parentPhone: parentPhone ?? product.parentPhone,
    });

    return res.status(200).json(product);
  } catch (error) {
    console.error("Update error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
});

// =====================================================
// DELETE - ลบข้อมูล
// =====================================================
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "ไม่พบข้อมูลผู้ใช้บริการ",
      });
    }

    await product.destroy();

    return res.status(200).json({
      message: "ลบข้อมูลสำเร็จ",
      deleteProduct: product,
    });
  } catch (error) {
    console.error("Delete error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
});

// =====================================================
// START SERVER
// =====================================================
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
