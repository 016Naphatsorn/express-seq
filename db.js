import { Sequelize, DataTypes } from "sequelize";

// Database connection
const sequelize = new Sequelize(
  "product_db",
  "dev_user",
  "dev_password",
  {
    host: "localhost",
    port: 5436,
    dialect: "postgres",
    logging: false,
  },
);

// Define database schema
const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // ชื่อเด็ก
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // อายุ
    // ข้อมูลเก่าอาจไม่มี
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // เวลาเข้า เช่น 21:50
    // ข้อมูลเก่าอาจไม่มี
    checkIn: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },

    // เวลาออก เช่น 22:50
    // ข้อมูลเก่าอาจไม่มี
    checkOut: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },

    // ระยะเวลาเล่น เช่น 60 นาที
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 60,
    },

    // เบอร์โทรผู้ปกครอง
    parentPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    tableName: "products",
  },
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();

    console.log("Connected to PostgreSQL!!!");

    await sequelize.sync({ alter: true });

    console.log("Table synchronized");
  } catch (error) {
    console.error("Connection failed", error);
    process.exit(1);
  }
};

export { sequelize, Product, connectDB };
