import mongoose from "mongoose";

async function renameCollection() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/LoginPage");
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    
    // Check if admin_record exists
    const collections = await db.listCollections({ name: "admin_record" }).toArray();
    
    if (collections.length > 0) {
      await db.collection("admin_record").rename("Admin_Record");
      console.log("Successfully renamed 'admin_record' to 'Admin_Record'");
    } else {
      console.log("'admin_record' collection does not exist (perhaps it was already renamed or never created).");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}

renameCollection();
