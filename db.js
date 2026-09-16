import { Sequelize, DataTypes } from "sequelize";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is requuired");
}

// const dbName = process.env.PGDATABASE;
// const dbUserName = process.env.PGUSER;
// const dbPassword = process.env.PGPASSWORD;
// const dbURL = process.env.PGHOST_UNPOOLED;

const databaseUrl = process.env.DATABASE_URL;
const PORT = process.env.PORT;

// database connection - fixed the "Sequelize" typo
const sequelize = new Sequelize(dbName, dbUserName, dbPassword, {
  host: dbURL,
  port: PORT,
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
});
const sequelize = new Sequelize(databaseUrl, {
  dailect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
});
// define database schema
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
