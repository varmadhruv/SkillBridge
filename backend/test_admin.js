import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  AdminName: { type: String, required: true },
  AdminUsername: { type: String, required: true, unique: true },
  AdminPassword: { type: String, required: true }
}, {
  collection: "admin_record",
  versionKey: false
});

const Admin = mongoose.model("Admin", adminSchema);

async function test() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/LoginPage");
    console.log("Connected to MongoDB");

    const newAdmin = new Admin({
      AdminName: "Test Admin",
      AdminUsername: "testadmin" + Date.now(),
      AdminPassword: "password123"
    });

    await newAdmin.save();
    console.log("Admin saved successfully!");
    
    const admins = await Admin.find({});
    console.log("Admins in DB:", admins);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
