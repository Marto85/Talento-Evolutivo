const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/talento-evolutivo";

    await mongoose.connect(uri);

    console.log("✓ Conectado a MongoDB");
    return mongoose.connection;
  } catch (error) {
    console.error("✗ Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("✓ Desconectado de MongoDB");
  } catch (error) {
    console.error("✗ Error desconectando de MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, disconnectDB };
