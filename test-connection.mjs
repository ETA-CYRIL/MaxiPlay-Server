// test-connection.js
import mongoose from "mongoose";
console.log("first")
const uri = "mongodb+srv://eta4272_db_user:NbtjzePNu0jzBPOq@cluster0.i5eihcc.mongodb.net/maxiPlay?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
  .then(() => console.log("✅ Connected successfully"))
  .catch(err => console.error("❌ Connection failed:", err.message))
  .finally(() => mongoose.disconnect());
