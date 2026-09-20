import "dotenv/config";
import { Sequelize, DataTypes } from "sequelize";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required in environment variables");
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

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

  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  checkIn: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  checkOut: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  parentPhone: {
    type: DataTypes.STRING,
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