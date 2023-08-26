const mongoose = require("mongoose");

require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.on("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

async function mongoConnect() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error("Error starting server:", error);
    throw error;
  }
}

async function monoDisconnect() {
  await mongoose.connection.close();
}

module.exports = { mongoConnect, monoDisconnect };
