import express from "express";
import { Product, connectDB } from "./db.js";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();


// ===============================
// หน้าแรก
// ===============================
app.get("/", (req, res) => {
  res.json({
    message: "Server is running!"
  });
});


// ===============================
// เพิ่มข้อมูลเด็ก
// ===============================
app.post("/api/products", async (req, res) => {
  try {
    const {
      name,
      age,
      checkIn,
      checkOut,
      duration,
      parentPhone
    } = req.body;

    if (
      !name ||
      age === undefined ||
      !checkIn ||
      !checkOut ||
      duration === undefined ||
      !parentPhone
    ) {
      return res.status(400).json({
        message: "กรุณากรอกข้อมูลให้ครบถ้วน"
      });
    }

    const newProduct = await Product.create({
      name,
      age: Number(age),
      checkIn,
      checkOut,
      duration: Number(duration),
      parentPhone
    });

    res.status(201).json(newProduct);

  } catch (error) {
    console.error("Create error:", error);

    res.status(500).json({
      message: "ไม่สามารถบันทึกข้อมูลได้",
      error: error.message
    });
  }
});


// ===============================
// ดูข้อมูลเด็กทั้งหมด
// ===============================
app.get("/api/products", async (req, res) => {
  try {

    const products = await Product.findAll({
      order: [["id", "DESC"]]
    });

    res.json(products);

  } catch (error) {

    console.error("Get error:", error);

    res.status(500).json({
      error: error.message
    });

  }
});


// ===============================
// ดูข้อมูลตาม ID
// ===============================
app.get("/api/products/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "ไม่พบข้อมูล"
      });
    }

    res.json(product);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


// ===============================
// แก้ไขข้อมูล
// ===============================
app.put("/api/products/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const {
      name,
      age,
      checkIn,
      checkOut,
      duration,
      parentPhone
    } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "ไม่พบข้อมูล"
      });
    }

    await product.update({

      name: name ?? product.name,

      age:
        age !== undefined
          ? Number(age)
          : product.age,

      checkIn:
        checkIn ?? product.checkIn,

      checkOut:
        checkOut ?? product.checkOut,

      duration:
        duration !== undefined
          ? Number(duration)
          : product.duration,

      parentPhone:
        parentPhone ?? product.parentPhone

    });

    res.json(product);

  } catch (error) {

    console.error("Update error:", error);

    res.status(500).json({
      error: error.message
    });

  }

});


// ===============================
// ลบข้อมูล
// ===============================
app.delete("/api/products/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "ไม่พบข้อมูล"
      });
    }

    await product.destroy();

    res.json({
      message: "ลบข้อมูลสำเร็จ"
    });

  } catch (error) {

    console.error("Delete error:", error);

    res.status(500).json({
      error: error.message
    });

  }

});


// ===============================
// Start Server
// ===============================
app.listen(PORT, "0.0.0.0", () => {

  console.log(
    `Server is running on port ${PORT}`
  );

});