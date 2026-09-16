import { Sequelize, DataTypes } from "sequelize";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required in environment variables");
}

// Database connection using DATABASE_URL with SSL enabled for Render/Cloud DB
const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // จำเป็นสำหรับการเชื่อมต่อบน Render/Supabase/Neon
    },
  },
});

// Define database schema
const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL!!");
    await sequelize.sync({ alter: true });
    console.log("Table synchronized!");
  } catch (error) {
    console.error("Connection failed", error);
    process.exit(1);
  }
};

export { sequelize, Product, connectDB };
