import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import Razorpay from "razorpay";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const app = express();
const PORT = 5000;
const MONGO_URL = "mongodb://127.0.0.1:27017/LoginPage";

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "cert.pem")),
};

const razorpay = new Razorpay({
  key_id: "rzp_test_SjXEqbILXUgWv2",
  key_secret: "beJb1fbm5xAaaUTzEwhmNyQR",
});

// --- Nodemailer Setup ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  pool: true, // Use connection pooling for faster delivery
  auth: {
    user: 'skilllbridgeofficial@gmail.com',
    pass: 'fmqc xloi sddb pcwn'
  }
});

const studentImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  }
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

const userSchema = new mongoose.Schema({
  username: String,
  password: String
}, {
  collection: "LoginCollection",
  versionKey: false
});

const User = mongoose.model("User", userSchema);

const studentSchema = new mongoose.Schema({
  fullName: String,
  gender: String,
  religion: String,
  motherTongue: String,
  universityPRN: { type: String, unique: true, sparse: true },
  motherName: String,
  university: String,
  collegeName: String,
  course: String,
  year: String,
  contact: String,
  email: { type: String, unique: true, sparse: true },
  state: String,
  city: String,
  weakSubject: String,
  studentPhotoName: String,
  studentPhoto: {
    data: Buffer,
    contentType: String
  },
  username: { type: String, sparse: true },
  password: { type: String, sparse: true },
  submittedAt: { type: Date, default: Date.now }
}, {
  collection: "Student_Login_Record",
  versionKey: false
});

const Student = mongoose.model("Student", studentSchema);

const mentorSchema = new mongoose.Schema({
  fullName: String,
  dob: String,
  gender: String,
  phone: String,
  email: String,
  religion: String,
  teachingExperience: String,
  specializedSubject: String,
  subjectsTaught: String,
  currentlyTeaching: String,
  instituteName: String,
  highestEducation: String,
  studyFromWhere: String,
  description: String,
  profilePhotoName: String,
  profilePhoto: {
    data: Buffer,
    contentType: String
  },
  mentorUsername: String,
  mentorPassword: String,
  status: { type: String, default: 'Pending' },
  submittedAt: { type: Date, default: Date.now }
}, {
  collection: "Mentor_Login_Record",
  versionKey: false
});

mentorSchema.index({ email: 1, phone: 1 }, { unique: true });

const Mentor = mongoose.model("Mentor", mentorSchema);

const feedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true, trim: true },
  fullName: { type: String, required: true, trim: true },
  feedback: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  submittedAt: { type: Date, default: Date.now }
}, {
  collection: "Feed_Back_Record",
  versionKey: false
});

const FeedbackRecord = mongoose.model("FeedbackRecord", feedbackSchema);

const adminSchema = new mongoose.Schema({
  AdminName: { type: String, required: true },
  AdminUsername: { type: String, required: true, unique: true },
  AdminPassword: { type: String, required: true },
  AdminEmail: { type: String, required: true }
}, {
  collection: "Admin_Record",
  versionKey: false
});

const Admin = mongoose.model("Admin", adminSchema);

const bookingSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  mentorId: { type: String, required: true },
  studentName: String,
  studentPhotoUrl: String,
  studentEmail: String,
  studentCourse: String,
  studentYear: String,
  status: { type: String, enum: ['Pending', 'Available', 'Declined'], default: 'Pending' },
  requestedAt: { type: Date, default: Date.now }
}, {
  collection: "Booking_Record",
  versionKey: false
});

const Booking = mongoose.model("Booking", bookingSchema);

const sessionSchema = new mongoose.Schema({
  studentId: String,
  mentorId: String,
  studentName: String,
  mentorName: String,
  joinUrl: String,
  startUrl: String,
  createdAt: { type: Date, default: Date.now }
}, {
  collection: "Session_Record",
  versionKey: false
});

const Session = mongoose.model("Session", sessionSchema);

const reportSchema = new mongoose.Schema({
  mentorName: { type: String, required: true },
  issue: { type: String, required: true },
  reportPhoto: {
    data: Buffer,
    contentType: String
  },
  submittedAt: { type: Date, default: Date.now }
}, {
  collection: "Report_record",
  versionKey: false
});

const Report = mongoose.model("Report", reportSchema);

app.post("/create-admin", async (request, response) => {
  try {
    const { AdminName, AdminUsername, AdminPassword, AdminEmail } = request.body;

    if (!AdminName || !AdminUsername || !AdminPassword || !AdminEmail) {
      return response.status(400).json({ message: "All fields are required." });
    }

    const existingAdmin = await Admin.findOne({ AdminUsername: AdminUsername.trim() });
    if (existingAdmin) {
      return response.status(409).json({ message: "Admin username already exists." });
    }

    const hashedPassword = await bcrypt.hash(AdminPassword.trim(), 10);

    const newAdmin = new Admin({
      AdminName: AdminName.trim(),
      AdminUsername: AdminUsername.trim(),
      AdminPassword: hashedPassword,
      AdminEmail: AdminEmail.trim()
    });

    await newAdmin.save();
    return response.status(201).json({ message: "Admin record saved successfully!" });
  } catch (error) {
    console.error("Create admin error:", error);
    return response.status(500).json({ message: "Failed to save admin record." });
  }
});

app.get("/get-admins", async (_request, response) => {
  try {
    const admins = await Admin.find({}, { AdminPassword: 0 }); // Exclude passwords
    return response.json({ data: admins });
  } catch (error) {
    console.error("Fetch admins error:", error);
    return response.status(500).json({ message: "Failed to fetch admin records." });
  }
});

app.delete("/delete-admin/:id", async (request, response) => {
  try {
    const adminId = request.params.id;
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);
    if (!deletedAdmin) {
      return response.status(404).json({ message: "Admin record not found" });
    }
    return response.json({ message: "Admin logged out and record deleted successfully" });
  } catch (error) {
    console.error("Delete admin error:", error);
    return response.status(500).json({ message: "Failed to delete admin record" });
  }
});

const developerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  securityKey: { type: String, required: true }
}, {
  collection: "Developer_record",
  versionKey: false
});

const DeveloperRecord = mongoose.model("DeveloperRecord", developerSchema);

const blockSchema = new mongoose.Schema({
  fullName: String,
  dob: String,
  gender: String,
  phone: String,
  email: String,
  religion: String,
  teachingExperience: String,
  specializedSubject: String,
  subjectsTaught: String,
  currentlyTeaching: String,
  instituteName: String,
  highestEducation: String,
  studyFromWhere: String,
  description: String,
  profilePhotoName: String,
  profilePhoto: {
    data: Buffer,
    contentType: String
  },
  mentorUsername: String,
  mentorPassword: String,
  blockedAt: { type: Date, default: Date.now }
}, {
  collection: "Block_Record",
  versionKey: false
});

const BlockRecord = mongoose.model("BlockRecord", blockSchema);

function escapeRegex(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Drop duplicate index on initialization
mongoose.connection.on('connected', async () => {
  try {
    await Student.collection.dropIndex("username_1");
    console.log("Dropped old username index from Student collection");
  } catch (error) {
    if (error.message.includes("index not found")) {
      console.log("No old index to drop - collection is clean");
    } else {
      console.log("Index drop info:", error.message);
    }
  }
});

app.get("/", (_request, response) => {
  response.json({ message: "Backend is running" });
});

app.post("/create-order", async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).send("Error creating order");
  }
});

app.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", "beJb1fbm5xAaaUTzEwhmNyQR")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error("Razorpay verification error:", error);
    res.status(500).send("Error verifying payment");
  }
});

app.post("/create-payment-link", async (req, res) => {
  try {
    const { amount, mentorName } = req.body;
    console.log(`Creating payment link for: Amount=${amount}, Mentor=${mentorName}`);
    const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100,
      currency: "INR",
      accept_partial: false,
      description: `Mentor Session: ${mentorName}`,
      reminder_enable: false,
      notes: {
        purpose: "Mentor Session Booking"
      }
    });
    res.json(paymentLink);
  } catch (error) {
    console.error("Razorpay Payment Link error:", error);
    res.status(500).json({ 
      message: "Razorpay API Error", 
      error: error.description || (error.error && error.error.description) || error.message || JSON.stringify(error)
    });
  }
});

app.get("/check-payment-link/:id", async (req, res) => {
  try {
    const paymentLink = await razorpay.paymentLink.fetch(req.params.id);
    res.json(paymentLink);
  } catch (error) {
    console.error("Error fetching payment link:", error);
    res.status(500).json({ error: "Failed to fetch payment link" });
  }
});

app.post("/signup", async (request, response) => {
  try {
    const { username, password } = request.body;

    if (!username || !password) {
      return response.status(400).json({ message: "Username and password are required" });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return response.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return response.status(201).json({ message: "Signup successful" });
  } catch (error) {
    return response.status(500).json({ message: "Signup failed" });
  }
});

app.post("/login", async (request, response) => {
  try {
    const { username, password } = request.body;

    if (!username || !password) {
      return response.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password.trim(), user.password))) {
      return response.status(401).json({ message: "Invalid username or password" });
    }

    return response.json({ message: "Login successful" });
  } catch (error) {
    return response.status(500).json({ message: "Login failed" });
  }
});

app.patch("/student-main-login", async (request, response) => {
  try {
    const { email, username, password } = request.body;

    if (!email || !username || !password) {
      return response.status(400).json({ message: "Email, username and password are required" });
    }

    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    const updatedStudent = await Student.findOneAndUpdate(
      { email: { $regex: new RegExp(`^${escapeRegex(trimmedEmail)}$`, "i") } },
      { username: trimmedUsername, password: hashedPassword },
      { new: true }
    );

    if (!updatedStudent) {
      return response.status(404).json({ message: "Student not found" });
    }

    return response.json({ message: "Credentials updated successfully" });
  } catch (error) {
    console.error("Student main login update error:", error);
    return response.status(500).json({ message: "Failed to update credentials" });
  }
});

app.post("/student-login", async (request, response) => {
  try {
    const { username, password, email } = request.body;

    if (!username || !password || !email) {
      return response.status(400).json({ message: "Username, password and email are required" });
    }

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedEmail = email.trim();

    const student = await Student.findOne({
      username: { $regex: new RegExp(`^${escapeRegex(trimmedUsername)}$`, "i") },
      email: { $regex: new RegExp(`^${escapeRegex(trimmedEmail)}$`, "i") }
    });

    if (!student || !(await bcrypt.compare(trimmedPassword, student.password))) {
      return response.status(404).json({ message: "User , Not Found" });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send email asynchronously to avoid blocking the response
    transporter.sendMail({
      from: 'skilllbridgeofficial@gmail.com',
      to: student.email,
      subject: 'SkillBridge Login OTP',
      html: `<h2>Your OTP for SkillBridge Login</h2>
             <p>Hello ${student.fullName},</p>
             <p>Your 6-digit OTP is: <strong>${generatedOtp}</strong></p>
             <p>Please enter this code to complete your login.</p>`
    }).then(() => {
      console.log("OTP sent to student instantly:", student.email);
    }).catch((mailError) => {
      console.error("Failed to send OTP email:", mailError);
    });

    return response.json({ 
      message: "User , Found",
      studentId: student._id.toString(),
      fullName: student.fullName,
      photoUrl: "", // Student photo not implemented in schema yet, but keeping structure consistent
      otp: generatedOtp // Sending to frontend to verify
    });
  } catch (error) {
    console.error("Student login error:", error);
    return response.status(500).json({ message: "Login process failed" });
  }
});

app.post("/mentor-login", async (request, response) => {
  try {
    const { username, password, email } = request.body;

    if (!username || !password || !email) {
      return response.status(400).json({ message: "Username, password and email are required" });
    }

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedEmail = email.trim();

    // First check if mentor is blocked
    const blockedMentor = await BlockRecord.findOne({
      mentorUsername: { $regex: new RegExp(`^${escapeRegex(trimmedUsername)}$`, "i") },
      mentorPassword: trimmedPassword,
      email: { $regex: new RegExp(`^${escapeRegex(trimmedEmail)}$`, "i") }
    });

    if (blockedMentor) {
      return response.status(403).json({ message: "blocked", redirect: "/Block_page/" });
    }

    const mentor = await Mentor.findOne({
      mentorUsername: { $regex: new RegExp(`^${escapeRegex(trimmedUsername)}$`, "i") },
      email: { $regex: new RegExp(`^${escapeRegex(trimmedEmail)}$`, "i") }
    });

    if (!mentor || !(await bcrypt.compare(trimmedPassword, mentor.mentorPassword))) {
      return response.status(404).json({ message: "User , Not Found" });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send email asynchronously to avoid blocking the response
    transporter.sendMail({
      from: 'skilllbridgeofficial@gmail.com',
      to: mentor.email,
      subject: 'SkillBridge Login OTP',
      html: `<h2>Your OTP for SkillBridge Login</h2>
             <p>Hello ${mentor.fullName},</p>
             <p>Your 6-digit OTP is: <strong>${generatedOtp}</strong></p>
             <p>Please enter this code to complete your login.</p>`
    }).then(() => {
      console.log("OTP sent to mentor instantly:", mentor.email);
    }).catch((mailError) => {
      console.error("Failed to send OTP email:", mailError);
    });

    return response.json({ 
      message: "User , Found",
      mentorId: mentor._id.toString(),
      fullName: mentor.fullName,
      photoUrl: `http://localhost:${PORT}/mentor-photo/${mentor._id.toString()}`,
      otp: generatedOtp // Sending to frontend to verify
    });
  } catch (error) {
    console.error("Mentor login error:", error);
    return response.status(500).json({ message: "Login process failed" });
  }
});

app.post("/resend-otp", async (request, response) => {
  try {
    const { email, role } = request.body;
    if (!email) {
      return response.status(400).json({ message: "Email is required" });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send email asynchronously
    transporter.sendMail({
      from: 'skilllbridgeofficial@gmail.com',
      to: email,
      subject: 'SkillBridge Login OTP - Resend',
      html: `<h2>Your OTP for SkillBridge Login</h2>
             <p>Hello,</p>
             <p>Your new 6-digit OTP is: <strong>${generatedOtp}</strong></p>
             <p>Please enter this code to complete your login.</p>`
    }).then(() => {
      console.log("Resent OTP instantly to:", email);
    }).catch((mailError) => {
      console.error("Failed to resend OTP email:", mailError);
    });

    return response.json({ 
      message: "OTP Resent Successfully",
      otp: generatedOtp
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return response.status(500).json({ message: "Failed to resend OTP" });
  }
});

app.post("/send-registration-otp", async (request, response) => {
  try {
    const { email } = request.body;
    if (!email) {
      return response.status(400).json({ message: "Email is required" });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send email asynchronously
    transporter.sendMail({
      from: 'skilllbridgeofficial@gmail.com',
      to: email,
      subject: 'SkillBridge Registration OTP',
      html: `<h2>Welcome to SkillBridge!</h2>
             <p>Your 6-digit OTP for registration is: <strong>${generatedOtp}</strong></p>
             <p>Please enter this code to verify your email address.</p>`
    }).then(() => {
      console.log("Registration OTP sent to:", email);
    }).catch((mailError) => {
      console.error("Failed to send registration OTP email:", mailError);
    });

    return response.json({ 
      message: "OTP Sent Successfully",
      otp: generatedOtp
    });
  } catch (error) {
    console.error("Registration OTP error:", error);
    return response.status(500).json({ message: "Failed to send OTP" });
  }
});

app.post("/check-student-exists", async (request, response) => {
  try {
    const { email, universityPRN, contact } = request.body;

    const existingByEmail = await Student.findOne({ email });
    const existingByUniversityPRN = await Student.findOne({ universityPRN });
    const existingByContact = await Student.findOne({ contact });

    if (existingByEmail || existingByUniversityPRN || existingByContact) {
      return response.status(409).json({ message: "User Exists" });
    }

    return response.status(200).json({ message: "User does not exist" });
  } catch (error) {
    return response.status(500).json({ message: "Error checking user" });
  }
});

app.post("/student-registration", studentImageUpload.single("studentPhoto"), async (request, response) => {
  try {
    const getBodyField = (fieldName) => {
      const requestBody = request.body || {};
      const directValue = requestBody[fieldName];
      if (typeof directValue === "string" && directValue.trim()) {
        return directValue.trim();
      }
      return "";
    };

    const fullName = getBodyField("fullName");
    const gender = getBodyField("gender");
    const religion = getBodyField("religion");
    const motherTongue = getBodyField("motherTongue");
    const universityPRN = getBodyField("universityPRN");
    const motherName = getBodyField("motherName");
    const university = getBodyField("university");
    const collegeName = getBodyField("collegeName");
    const course = getBodyField("course");
    const year = getBodyField("year");
    const contact = getBodyField("contact");
    const email = getBodyField("email").toLowerCase();
    const state = getBodyField("state");
    const city = getBodyField("city");
    const weakSubject = getBodyField("weakSubject") || "N/A";
    const studentPhotoName = getBodyField("studentPhotoName") || request.file?.originalname || "";

    const fields = { fullName, gender, religion, motherTongue, universityPRN, motherName, university, collegeName, course, year, contact, email, state, city };
    const missingField = Object.keys(fields).find((key) => !fields[key]);

    if (missingField) {
      return response.status(400).json({ message: `All fields are required. Missing: ${missingField}` });
    }

    if (!request.file) {
      return response.status(400).json({ message: "Photo is required." });
    }

    // Check if email, universityPRN, or contact already exists
    const existingStudent = await Student.findOne({ 
      $or: [{ email }, { universityPRN }, { contact }]
    });

    if (existingStudent) {
      return response.status(409).json({ message: "User Exists" });
    }

    const newStudent = new Student({
      fullName,
      gender,
      religion,
      motherTongue,
      universityPRN,
      motherName,
      university,
      collegeName,
      course,
      year,
      contact,
      email,
      state,
      city,
      weakSubject,
      studentPhotoName,
      studentPhoto: {
        data: request.file.buffer,
        contentType: request.file.mimetype
      }
    });

    await newStudent.save();

    return response.status(201).json({ message: "Student registration ho gaya successfully! ✅" });
  } catch (error) {
    console.error("Student registration error:", error);
    if (error.code === 11000) {
      return response.status(409).json({ message: "User Exists" });
    }
    return response.status(500).json({ message: "Student registration fail ho gaya" });
  }
});

app.get("/student-photo/:id", async (request, response) => {
  try {
    const student = await Student.findById(request.params.id).select("studentPhoto");
    if (!student?.studentPhoto?.data) {
      return response.status(404).json({ message: "Photo not found" });
    }

    response.set("Content-Type", student.studentPhoto.contentType || "image/jpeg");
    return response.send(student.studentPhoto.data);
  } catch (error) {
    return response.status(500).json({ message: "Photo fetch fail ho gaya" });
  }
});

app.post("/mentor-registration", studentImageUpload.single("profilePhoto"), async (request, response) => {
  try {
    const getBodyField = (fieldName) => {
      const requestBody = request.body || {};
      const directValue = requestBody[fieldName];
      if (typeof directValue === "string" && directValue.trim()) {
        return directValue.trim();
      }

      const matchedEntry = Object.entries(requestBody).find(([key, value]) => {
        return typeof value === "string" && key.trim().toLowerCase() === fieldName.toLowerCase() && value.trim();
      });

      return matchedEntry ? matchedEntry[1].trim() : "";
    };

    const fullName = getBodyField("fullName");
    const dob = getBodyField("dob");
    const gender = getBodyField("gender");
    const phone = getBodyField("phone");
    const email = getBodyField("email").toLowerCase();
    const teachingExperience = getBodyField("teachingExperience");
    const specializedSubject = getBodyField("specializedSubject");
    const subjectsTaught = getBodyField("subjectsTaught");
    const currentlyTeaching = getBodyField("currentlyTeaching");
    const instituteName = getBodyField("instituteName");
    const highestEducation = getBodyField("highestEducation");
    const studyFromWhere = getBodyField("studyFromWhere");
    const religion = getBodyField("religion");
    const description = getBodyField("description");
    const profilePhotoName = getBodyField("profilePhotoName") || request.file?.originalname || "";

    const fields = {
      fullName,
      dob,
      gender,
      phone,
      email,
      religion,
      teachingExperience,
      specializedSubject,
      subjectsTaught,
      currentlyTeaching,
      highestEducation,
      studyFromWhere,
      description
    };
    const missingField = Object.keys(fields).find((key) => {
      // If currentlyTeaching is "No", instituteName is not required
      if (key === "instituteName" && currentlyTeaching === "No") return false;
      return !fields[key];
    });

    if (missingField) {
      return response.status(400).json({ message: `All fields are required. Missing: ${missingField}` });
    }

    if (!request.file) {
      return response.status(400).json({ message: "Profile photo upload karna zaroori hai." });
    }

    const existingMentor = await Mentor.findOne({ email, phone });
    if (existingMentor) {
      return response.status(409).json({ message: "User Exists" });
    }

    const newMentor = new Mentor({
      fullName,
      dob,
      gender,
      phone,
      email,
      religion,
      teachingExperience,
      specializedSubject,
      subjectsTaught,
      currentlyTeaching,
      instituteName,
      highestEducation,
      studyFromWhere,
      description,
      profilePhotoName,
      profilePhoto: {
        data: request.file.buffer,
        contentType: request.file.mimetype
      }
    });

    await newMentor.save();

    return response.status(201).json({
      message: "Mentor details save ho gaye successfully! ✅",
      mentorId: newMentor._id,
      photoUrl: `http://localhost:${PORT}/mentor-photo/${newMentor._id}`
    });
  } catch (error) {
    console.error("Mentor registration error:", error);

    if (error.code === 11000) {
      return response.status(409).json({ message: "User Exists" });
    }

    if (error.message === "Only image files are allowed") {
      return response.status(400).json({ message: "Sirf image file upload karo." });
    }

    return response.status(500).json({ message: "Mentor registration fail ho gaya" });
  }
});

app.get("/mentor-photo/:id", async (request, response) => {
  try {
    const mentor = await Mentor.findById(request.params.id).select("profilePhoto");
    if (!mentor?.profilePhoto?.data) {
      return response.status(404).json({ message: "Photo not found" });
    }

    response.set("Content-Type", mentor.profilePhoto.contentType || "image/jpeg");
    return response.send(mentor.profilePhoto.data);
  } catch (error) {
    return response.status(500).json({ message: "Photo fetch fail ho gaya" });
  }
});

app.get("/mentor-records", async (_request, response) => {
  try {
    const mentors = await Mentor.find({}, { profilePhoto: 0 }).sort({ submittedAt: -1 });
    const mentorsWithPhotoUrl = mentors.map((mentor) => ({
      ...mentor.toObject(),
      photoUrl: `http://localhost:${PORT}/mentor-photo/${mentor._id}`
    }));

    return response.json({ data: mentorsWithPhotoUrl });
  } catch (error) {
    return response.status(500).json({ message: "Mentor records fetch fail ho gaya" });
  }
});

app.get("/mentor-record/:id", async (request, response) => {
  try {
    const mentor = await Mentor.findById(request.params.id, { profilePhoto: 0 });

    if (!mentor) {
      return response.status(404).json({ message: "Mentor record not found" });
    }

    return response.json({
      data: {
        ...mentor.toObject(),
        photoUrl: `http://localhost:${PORT}/mentor-photo/${mentor._id.toString()}`
      }
    });
  } catch (error) {
    return response.status(500).json({ message: "Mentor record fetch fail ho gaya" });
  }
});

app.get("/student-record/:id", async (request, response) => {
  const studentId = request.params.id;
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return response.status(400).json({ message: "Invalid student id format." });
  }
  console.log("Student record requested for ID:", studentId);
  try {
    const student = await Student.findById(studentId, { studentPhoto: 0 });

    if (!student) {
      console.log("Student not found in DB for ID:", request.params.id);
      return response.status(404).json({ message: "Student record not found" });
    }

    return response.json({
      data: {
        ...student.toObject(),
        photoUrl: `http://localhost:${PORT}/student-photo/${student._id.toString()}`
      }
    });
  } catch (error) {
    console.error("Student record fetch error:", error);
    return response.status(500).json({ message: "Student record fetch fail ho gaya" });
  }
});

app.patch("/student-main-login", async (request, response) => {
  try {
    const { email, username, password } = request.body;

    if (!email || !username || !password) {
      return response.status(400).json({ message: "Email, Username aur password sab required hain." });
    }

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    // Check only in Student collection (excluding current student)
    const studentExists = await Student.findOne({ 
      username: { $regex: new RegExp(`^${trimmedUsername}$`, "i") }, 
      email: { $ne: trimmedEmail } 
    });

    if (studentExists) {
      return response.status(409).json({ message: "User Already Exists!" });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const updatedStudent = await Student.findOneAndUpdate(
      { email: trimmedEmail },
      {
        username: trimmedUsername,
        password: hashedPassword
      },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return response.status(404).json({ message: "Student record not found" });
    }
    
    return response.json({ message: "Student login details updated successfully!" });
  } catch (error) {
    console.error("Student main login error:", error);
    return response.status(500).json({ message: "Failed to update student main login" });
  }
});

app.post("/create-zoom-meeting", async (req, res) => {
  try {
    const { studentId, mentorId, studentName, mentorName } = req.body;
    
    // Check if session already exists
    const existingSession = await Session.findOne({ studentId, mentorId }).sort({ createdAt: -1 });
    if (existingSession) {
      return res.json({ joinUrl: existingSession.joinUrl, startUrl: existingSession.startUrl });
    }

    const mentor = await Mentor.findById(mentorId);

    
    const accountId = 'R1pwlcqZSR2IIUMlRmYbYg';
    const clientId = 'L1VLJXTfTuys9kDTHLWNw';
    const clientSecret = 'HZ0nyVuNaqWFH1Cr1rJgHGZVSVv6ojhR';
    
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const tokenResponse = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      throw new Error("Failed to get Zoom access token");
    }
    
    const meetingResponse = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic: `1-to-1 Mentorship: ${studentName} & ${mentorName}`,
        type: 2, 
        duration: 60,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true,
          waiting_room: false,
          mute_upon_entry: false
        }
      })
    });
    
    const meetingData = await meetingResponse.json();
    
    const newSession = new Session({
      studentId,
      mentorId,
      studentName,
      mentorName,
      joinUrl: meetingData.join_url,
      startUrl: meetingData.start_url
    });
    
    await newSession.save();
    
    if (mentor && mentor.email) {
      const mailOptions = {
        from: '"SkillBridge Notification" <skilllbridgeofficial@gmail.com>',
        to: mentor.email,
        subject: `Payment Received - Session with ${studentName}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 15px; background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%); border: 1px solid #ddd; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <h2 style="color: #7b2cbf; margin-bottom: 20px;">Hello ${mentor.fullName},</h2>
            <p style="font-size: 1.1rem; color: #333; line-height: 1.6;">
              <strong>Good news!</strong> The student <strong>${studentName}</strong> has successfully completed the payment and is currently waiting for you to join and start the session.
            </p>
            <div style="background: rgba(255,255,255,0.8); padding: 20px; border-radius: 10px; margin: 25px 0; border: 1px solid rgba(123, 44, 191, 0.2);">
              <p style="margin: 5px 0;"><strong>Student Name:</strong> ${studentName}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> Payment Successful & Waiting</p>
              <p style="margin: 5px 0;"><strong>Platform:</strong> Zoom Video Call</p>
            </div>
            <p style="font-size: 1.1rem; color: #333; line-height: 1.6;">
              The Zoom meeting has been automatically created. Please check your Dashboard for the meeting link and details.
            </p>
            <hr style="border: none; border-top: 1px solid #ccc; margin: 30px 0;">
            <p style="font-size: 0.8rem; color: #777; text-align: center;">This is an automated request from SkillBridge Mentorship Platform.</p>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("NODEMAILER SUCCESS: Payment email sent to " + mentor.email);
      } catch (mailError) {
        console.error("NODEMAILER ERROR:", mailError);
      }
    }

    res.json({ joinUrl: meetingData.join_url, startUrl: meetingData.start_url });
  } catch (error) {
    console.error("Zoom meeting creation error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/mentor-sessions/:mentorId", async (req, res) => {
  try {
    const sessions = await Session.find({ mentorId: req.params.mentorId }).sort({ createdAt: -1 });
    res.json({ data: sessions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/student-sessions/:studentId", async (req, res) => {
  try {
    const sessions = await Session.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    res.json({ data: sessions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.patch("/mentor-main-login/:id", async (request, response) => {
  try {
    const mentorId = request.params.id;
    const mentorUsername = request.body?.mentorUsername?.trim();
    const mentorPassword = request.body?.mentorPassword?.trim();

    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return response.status(400).json({ message: "Invalid mentor id." });
    }

    if (!mentorUsername || !mentorPassword) {
      return response.status(400).json({ message: "Username aur password dono required hain." });
    }

    // Mentor-only uniqueness check
    const mentorExists = await Mentor.findOne({ 
      mentorUsername: { $regex: new RegExp(`^${mentorUsername}$`, "i") },
      _id: { $ne: mentorId }
    });

    if (mentorExists) {
      return response.status(409).json({ message: "Username Already Exists!" });
    }

    const hashedPassword = await bcrypt.hash(mentorPassword, 10);
    const updatedMentor = await Mentor.findByIdAndUpdate(
      mentorId,
      {
        mentorUsername,
        mentorPassword: hashedPassword
      },
      { new: true, runValidators: true, projection: { profilePhoto: 0 } }
    );

    if (!updatedMentor) {
      return response.status(404).json({ message: "Mentor record not found" });
    }

    return response.json({
      message: "Username aur password same mentor id me save ho gaye.",
      data: {
        ...updatedMentor.toObject(),
        photoUrl: `http://localhost:${PORT}/mentor-photo/${updatedMentor._id}`
      }
    });
  } catch (error) {
    return response.status(500).json({ message: "Mentor login details save nahi ho paaye." });
  }
});

app.delete("/mentor-record/:id", async (request, response) => {
  try {
    const mentorId = String(request.params.id || "").trim();

    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return response.status(400).json({ message: "Invalid mentor id." });
    }

    const deletedMentor = await Mentor.findByIdAndDelete(mentorId);
    if (!deletedMentor) {
      return response.status(404).json({ message: "Mentor record not found" });
    }

    return response.json({ message: "Deleted Successfully" });
  } catch (error) {
    return response.status(500).json({ message: "Mentor delete fail ho gaya." });
  }
});



app.post("/admin-login", async (request, response) => {
  console.log("Hit /admin-login endpoint:", request.body);
  try {
    const { AdminUsername, AdminPassword } = request.body;

    if (!AdminUsername || !AdminPassword) {
      return response.status(400).json({ message: "AdminUsername and AdminPassword are required." });
    }

    const admin = await Admin.findOne({ AdminUsername: AdminUsername.trim() });

    if (!admin) {
      return response.status(401).json({ message: "Invalid AdminUsername or AdminPassword." });
    }

    // Check password (handle both hashed and legacy plain text)
    let isPasswordCorrect = false;
    try {
      isPasswordCorrect = await bcrypt.compare(AdminPassword.trim(), admin.AdminPassword);
    } catch (e) {
      // If bcrypt fails, fallback to plain text check (for legacy records)
      isPasswordCorrect = (AdminPassword.trim() === admin.AdminPassword);
    }
    
    // Additional fallback: if bcrypt didn't throw but returned false, still check plain text if the stored password doesn't look like a hash
    if (!isPasswordCorrect && !admin.AdminPassword.startsWith('$2')) {
       isPasswordCorrect = (AdminPassword.trim() === admin.AdminPassword);
    }

    if (!isPasswordCorrect) {
      return response.status(401).json({ message: "Invalid AdminUsername or AdminPassword." });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send email asynchronously
    transporter.sendMail({
      from: 'skilllbridgeofficial@gmail.com',
      to: admin.AdminEmail, // Sending to the admin's email
      subject: 'Admin Login OTP',
      html: `<h2>Your OTP for Admin Login</h2>
             <p>Hello ${admin.AdminName},</p>
             <p>An attempt to login to the admin panel was made. Your 6-digit OTP is: <strong>${generatedOtp}</strong></p>`
    }).then(() => {
      console.log(`Admin OTP sent instantly to ${admin.AdminEmail}`);
    }).catch((mailError) => {
      console.error("Failed to send Admin OTP email:", mailError);
    });

    return response.status(200).json({ 
      message: "Admin Login successful!", 
      adminId: admin._id.toString(),
      AdminName: admin.AdminName,
      adminEmail: admin.AdminEmail,
      otp: generatedOtp
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return response.status(500).json({ message: "Admin Login failed." });
  }
});

app.post("/admin-otp-resend", async (request, response) => {
  try {
    const { adminEmail } = request.body;
    if (!adminEmail) {
      return response.status(400).json({ message: "Email is required." });
    }

    const admin = await Admin.findOne({ AdminEmail: adminEmail.trim() });
    if (!admin) {
      return response.status(404).json({ message: "Admin not found." });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    await transporter.sendMail({
      from: 'skilllbridgeofficial@gmail.com',
      to: admin.AdminEmail,
      subject: 'Admin Login OTP',
      html: `<h2>Your OTP for Admin Verification</h2>
             <p>Hello ${admin.AdminName},</p>
             <p>Your 6-digit OTP for admin verification is: <strong>${generatedOtp}</strong></p>
             <p>This is a resend request. Please use this latest OTP.</p>`
    });

    return response.json({ message: "OTP sent successfully", otp: generatedOtp });
  } catch (error) {
    console.error("Admin OTP resend error:", error);
    return response.status(500).json({ message: "Failed to send OTP." });
  }
});

// --- Booking & Availability Routes ---

app.post("/booking-request", async (req, res) => {
  try {
    const { studentId, mentorId, studentName, studentPhotoUrl, studentEmail, studentCourse, studentYear } = req.body;
    if (!studentId || !mentorId) {
      return res.status(400).json({ message: "Student and Mentor IDs are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({ message: "Invalid Mentor ID format" });
    }

    // Fetch mentor details to get email
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    // Check if there's already a request
    let targetBooking;
    const existing = await Booking.findOne({ studentId, mentorId });
    
    if (existing) {
      existing.status = 'Pending';
      existing.requestedAt = Date.now();
      existing.studentName = studentName;
      existing.studentPhotoUrl = studentPhotoUrl;
      existing.studentEmail = studentEmail;
      existing.studentCourse = studentCourse;
      existing.studentYear = studentYear;
      await existing.save();
      targetBooking = existing;
    } else {
      targetBooking = new Booking({
        studentId,
        mentorId,
        studentName,
        studentPhotoUrl,
        studentEmail,
        studentCourse,
        studentYear,
        status: 'Pending'
      });
      await targetBooking.save();
    }

    console.log(`Attempting to send email from: skilllbridgeofficial@gmail.com to: ${mentor.email}`);

    // Send Email to Mentor
    const mailOptions = {
      from: '"SkillBridge Notification" <skilllbridgeofficial@gmail.com>',
      to: mentor.email,
      subject: `New Mentorship Request - ${studentName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 15px; background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%); border: 1px solid #ddd; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <h2 style="color: #7b2cbf; margin-bottom: 20px;">Hello ${mentor.fullName},</h2>
          <p style="font-size: 1.1rem; color: #333; line-height: 1.6;">
            <strong>A student has just checked out for your mentorship session!</strong><br/>
            Please log in to your dashboard and navigate to the <strong>Updates</strong> section. Mark yourself as "Available" to confirm the request and start the session.
          </p>
          <div style="background: rgba(255,255,255,0.8); padding: 20px; border-radius: 10px; margin: 25px 0; border: 1px solid rgba(123, 44, 191, 0.2);">
            <p style="margin: 5px 0;"><strong>Student Name:</strong> ${studentName}</p>
            <p style="margin: 5px 0;"><strong>Course:</strong> ${studentCourse}</p>
            <p style="margin: 5px 0;"><strong>Year:</strong> ${studentYear}</p>
          </div>
          <div style="text-align: center;">
            <a href="http://localhost:5173/Mentor_home_page/" style="display: inline-block; padding: 15px 30px; background: #7b2cbf; color: white; text-decoration: none; border-radius: 50px; font-weight: bold; box-shadow: 0 5px 15px rgba(123, 44, 191, 0.3);">Access Updates Section</a>
          </div>
          <hr style="border: none; border-top: 1px solid #ccc; margin: 30px 0;">
          <p style="font-size: 0.8rem; color: #777; text-align: center;">This is an automated request from SkillBridge Mentorship Platform.</p>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("NODEMAILER SUCCESS: Email sent to " + mentor.email, info.response);
    } catch (mailError) {
      console.error("NODEMAILER ERROR:", mailError);
    }

    res.status(201).json({ message: "Request sent and email notified!", data: targetBooking });
  } catch (error) {
    console.error("Booking request error details:", error);
    res.status(500).json({ message: "Failed to send request: " + error.message });
  }
});

app.get("/booking-requests/:mentorId", async (req, res) => {
  try {
    const requests = await Booking.find({ mentorId: req.params.mentorId, status: 'Pending' });
    res.json({ data: requests });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
});

app.patch("/booking-request/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: "Request not found" });
    res.json({ message: "Status updated", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

app.get("/booking-status/:studentId/:mentorId", async (req, res) => {
  try {
    const { studentId, mentorId } = req.params;
    // Only return requests from the last 2 hours to avoid "skipping" the availability step due to old records
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const booking = await Booking.findOne({ 
      studentId, 
      mentorId,
      requestedAt: { $gte: twoHoursAgo }
    }).sort({ requestedAt: -1 });
    res.json({ data: booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch status" });
  }
});

app.delete("/booking-request/:studentId/:mentorId", async (req, res) => {
  const { studentId, mentorId } = req.params;
  console.log(`Clearing requests for Student: ${studentId}, Mentor: ${mentorId}`);
  try {
    // Delete ALL requests for this pair to ensure a total reset
    const result = await Booking.deleteMany({ studentId, mentorId });
    if (result.deletedCount === 0) return res.status(404).json({ message: "No requests found to clear" });
    res.json({ message: "All requests cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear requests" });
  }
});



app.patch("/admin/mentor-status/:id", async (request, response) => {
  try {
    const mentorId = request.params.id;
    const { status } = request.body;

    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return response.status(400).json({ message: "Invalid mentor id." });
    }

    const validStatuses = ['Pending', 'Verified', 'Unverified', 'LoggedOut', 'Banned', 'Spam'];
    if (!validStatuses.includes(status)) {
      return response.status(400).json({ message: "Invalid status value." });
    }

    const updatedMentor = await Mentor.findByIdAndUpdate(
      mentorId,
      { status },
      { new: true, projection: { profilePhoto: 0 } }
    );

    if (!updatedMentor) {
      return response.status(404).json({ message: "Mentor not found" });
    }

    return response.json({ 
      message: `Mentor status updated to ${status}`, 
      data: {
        ...updatedMentor.toObject(),
        photoUrl: `http://localhost:${PORT}/mentor-photo/${updatedMentor._id}`
      }
    });
  } catch (error) {
    console.error("Update mentor status error:", error);
    return response.status(500).json({ message: "Failed to update mentor status." });
  }
});

app.post("/admin/mentor-logout/:id", async (request, response) => {
  try {
    const mentorId = request.params.id;
    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return response.status(400).json({ message: "Invalid mentor id." });
    }
    const deletedMentor = await Mentor.findByIdAndDelete(mentorId);
    if (!deletedMentor) {
      return response.status(404).json({ message: "Mentor not found" });
    }
    return response.json({ message: "Mentor logged out and record deleted." });
  } catch (error) {
    console.error("Mentor logout error:", error);
    return response.status(500).json({ message: "Failed to logout mentor." });
  }
});

app.post("/admin/mentor-block/:id", async (request, response) => {
  try {
    const mentorId = request.params.id;
    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return response.status(400).json({ message: "Invalid mentor id." });
    }
    
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return response.status(404).json({ message: "Mentor not found" });
    }

    // Move to block record
    const blockedMentor = new BlockRecord(mentor.toObject());
    await blockedMentor.save();

    // Delete from original record
    await Mentor.findByIdAndDelete(mentorId);

    return response.json({ message: "Mentor blocked and record moved to Block_Record." });
  } catch (error) {
    console.error("Mentor block error:", error);
    return response.status(500).json({ message: "Failed to block mentor." });
  }
});

app.post("/mentor-feedback-record", async (request, response) => {
  try {
    const userId = String(request.body?.userId || "").trim();
    const fullName = String(request.body?.fullName || "").trim();
    const feedback = String(request.body?.feedback || "").trim();
    const rating = Number(request.body?.rating);

    if (!userId || !fullName || !feedback || !Number.isFinite(rating) || rating < 1 || rating > 5) {
      return response.status(400).json({ message: "UserID, FullName, feedback and valid rating are required." });
    }

    const newFeedbackRecord = new FeedbackRecord({
      userId,
      fullName,
      feedback,
      rating
    });
    await newFeedbackRecord.save();
    return response.status(201).json({ message: "Feedback saved successfully." });
  } catch (error) {
    console.error("Feedback save failed:", error);
    return response.status(500).json({ message: "Failed to save feedback record." });
  }
});

app.post("/developer-registration", async (request, response) => {
  try {
    const { fullName, email, password, securityKey } = request.body;
    if (!fullName || !email || !password || !securityKey) {
      return response.status(400).json({ message: "All fields are required." });
    }
    
    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedSecurityKey = securityKey.trim();

    const existingDeveloper = await DeveloperRecord.findOne({ email: trimmedEmail });
    if (existingDeveloper) {
      return response.status(409).json({ message: "Developer with this email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const newDeveloper = new DeveloperRecord({ 
      fullName: trimmedFullName, 
      email: trimmedEmail, 
      password: hashedPassword, 
      securityKey: trimmedSecurityKey 
    });
    await newDeveloper.save();
    return response.status(201).json({ message: "Developer Account Created Successfully!" });
  } catch (error) {
    console.error("Developer registration error:", error);
    return response.status(500).json({ message: "Failed to create developer account." });
  }
});

app.post("/developer-forgot-otp", async (request, response) => {
  try {
    // Fetch the primary developer record
    const developer = await DeveloperRecord.findOne({});
    if (!developer) return response.status(404).json({ message: "Developer not found." });

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    transporter.sendMail({
      from: 'skilllbridgeofficial@gmail.com',
      to: developer.email,
      subject: 'Developer Password Recovery OTP',
      html: `<h2>Your OTP for Password Recovery</h2>
             <p>Hello ${developer.fullName},</p>
             <p>Your 6-digit OTP for password recovery is: <strong>${generatedOtp}</strong></p>`
    }).catch(err => console.error("OTP send failed", err));

    return response.json({ message: "OTP sent successfully", otp: generatedOtp });
  } catch (error) {
    return response.status(500).json({ message: "Failed to send OTP." });
  }
});

app.post("/verify-security-key", async (request, response) => {
  try {
    const { securityKey, otp, expectedOtp } = request.body;

    // We check both but only need one to be correct
    const isOtpCorrect = otp && expectedOtp && otp === expectedOtp;
    
    let isKeyCorrect = false;
    if (securityKey) {
      const developer = await DeveloperRecord.findOne({ 
        securityKey: securityKey.trim() 
      });
      if (developer) isKeyCorrect = true;
    }

    if (isOtpCorrect || isKeyCorrect) {
      return response.status(200).json({ message: "Authentication Successful!" });
    } else {
      // If one was provided but incorrect, or both were provided and both incorrect
      let errorMessage = "Invalid details.";
      if (otp && !isOtpCorrect && securityKey && !isKeyCorrect) {
        errorMessage = "Invalid Security Key and OTP.";
      } else if (otp && !isOtpCorrect) {
        errorMessage = "Invalid OTP.";
      } else if (securityKey && !isKeyCorrect) {
        errorMessage = "Invalid Security Key.";
      }
      return response.status(401).json({ message: errorMessage });
    }
  } catch (error) {
    console.error("Security key verification error:", error);
    return response.status(500).json({ message: "Verification process failed." });
  }
});

app.post("/developer-login", async (request, response) => {
  try {
    const { fullName, email, password } = request.body;
    if (!fullName || !email || !password) {
      return response.status(400).json({ message: "FullName, Email and Password are required." });
    }

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    const developer = await DeveloperRecord.findOne({
      fullName: { $regex: new RegExp(`^${trimmedFullName}$`, "i") },
      email: trimmedEmail
    });

    if (!developer) {
      return response.status(401).json({ message: "Invalid details. Please check your FullName, Email and Password." });
    }

    // Check password (handle both hashed and legacy plain text)
    let isPasswordCorrect = false;
    try {
      isPasswordCorrect = await bcrypt.compare(password.trim(), developer.password);
    } catch (e) {
      // If bcrypt fails, fallback to plain text check (for legacy records)
      isPasswordCorrect = (password.trim() === developer.password);
    }
    
    // Additional fallback: if bcrypt didn't throw but returned false, still check plain text if the stored password doesn't look like a hash
    if (!isPasswordCorrect && !developer.password.startsWith('$2')) {
       isPasswordCorrect = (password.trim() === developer.password);
    }

    if (!isPasswordCorrect) {
      return response.status(401).json({ message: "Invalid details. Please check your FullName, Email and Password." });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send email asynchronously
    transporter.sendMail({
      from: 'skilllbridgeofficial@gmail.com',
      to: developer.email,
      subject: 'Developer Login OTP',
      html: `<h2>Your OTP for Developer Panel Login</h2>
             <p>Hello ${developer.fullName},</p>
             <p>An attempt to login to the Developer panel was made. Your 6-digit OTP is: <strong>${generatedOtp}</strong></p>`
    }).then(() => {
      console.log(`Developer OTP sent instantly to ${developer.email}`);
    }).catch((mailError) => {
      console.error("Failed to send Developer OTP email:", mailError);
    });

    return response.json({ 
      message: "Login successful",
      developerId: developer._id.toString(),
      fullName: developer.fullName,
      email: developer.email,
      otp: generatedOtp
    });
  } catch (error) {
    console.error("Developer login error:", error);
    return response.status(500).json({ message: "Login process failed" });
  }
});

app.post("/submit-report", studentImageUpload.single("mentorImage"), async (request, response) => {
  try {
    const { mentorName, issue } = request.body;

    if (!mentorName || !issue) {
      return response.status(400).json({ message: "Mentor Name and Issue are required." });
    }

    const newReport = new Report({
      mentorName,
      issue,
    });

    if (request.file) {
      newReport.reportPhoto = {
        data: request.file.buffer,
        contentType: request.file.mimetype
      };
    }

    await newReport.save();
    return response.status(201).json({ message: "Report submitted successfully!" });
  } catch (error) {
    console.error("Submit report error:", error);
    return response.status(500).json({ message: "Failed to submit report." });
  }
});

app.get("/get-reports", async (_request, response) => {
  try {
    // Exclude only the heavy image data, but keep the metadata (like contentType) to know if a photo exists
    const reports = await Report.find({}, { "reportPhoto.data": 0 }).sort({ submittedAt: -1 });
    
    const reportsWithPhotoUrl = reports.map((report) => {
      const reportObj = report.toObject();
      // If reportPhoto exists (even without the data buffer), we provide the URL
      if (report.reportPhoto && report.reportPhoto.contentType) {
        reportObj.photoUrl = `http://127.0.0.1:${PORT}/report-photo/${report._id}`;
      } else {
        reportObj.photoUrl = null;
      }
      return reportObj;
    });
    
    return response.json({ data: reportsWithPhotoUrl });
  } catch (error) {
    console.error("Fetch reports error:", error);
    return response.status(500).json({ message: "Failed to fetch reports." });
  }
});

app.get("/report-photo/:id", async (request, response) => {
  try {
    const report = await Report.findById(request.params.id).select("reportPhoto");
    if (!report?.reportPhoto?.data) {
      return response.status(404).json({ message: "Photo not found" });
    }
    response.set("Content-Type", report.reportPhoto.contentType || "image/jpeg");
    return response.send(report.reportPhoto.data);
  } catch (error) {
    return response.status(500).json({ message: "Photo fetch fail" });
  }
});

// --- Forgot Password: Send OTP to Mentor ---
app.post("/forgot-mentor-password", async (request, response) => {
  try {
    const { email } = request.body;
    if (!email) return response.status(400).json({ message: "Email is required" });

    const mentor = await Mentor.findOne({
      email: { $regex: new RegExp(`^${escapeRegex(email.trim())}$`, "i") }
    });
    if (!mentor) return response.status(404).json({ message: "No mentor found with this email" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    transporter.sendMail({
      from: 'skilllbridgeofficial@gmail.com',
      to: mentor.email,
      subject: 'SkillBridge - Password Reset OTP',
      html: `<h2>Password Reset Request</h2>
             <p>Hello ${mentor.fullName},</p>
             <p>Your 6-digit OTP to reset your password is: <strong>${otp}</strong></p>
             <p>This OTP is valid for one-time use only.</p>`
    }).catch(err => console.error("Failed to send mentor reset OTP:", err));

    return response.json({ message: "OTP sent to your registered email", otp, mentorId: mentor._id.toString() });
  } catch (error) {
    console.error("Forgot mentor password error:", error);
    return response.status(500).json({ message: "Server error" });
  }
});

// --- Reset Mentor Password ---
app.post("/reset-mentor-password", async (request, response) => {
  try {
    const { mentorId, newPassword } = request.body;
    if (!mentorId || !newPassword) return response.status(400).json({ message: "Mentor ID and new password are required" });

    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
    const updated = await Mentor.findByIdAndUpdate(mentorId, { mentorPassword: hashedPassword }, { new: true });
    if (!updated) return response.status(404).json({ message: "Mentor not found" });

    return response.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset mentor password error:", error);
    return response.status(500).json({ message: "Server error" });
  }
});

// --- Forgot Password: Send OTP to Student ---
app.post("/forgot-student-password", async (request, response) => {
  try {
    const { email } = request.body;
    if (!email) return response.status(400).json({ message: "Email is required" });

    const student = await Student.findOne({
      email: { $regex: new RegExp(`^${escapeRegex(email.trim())}$`, "i") }
    });
    if (!student) return response.status(404).json({ message: "No student found with this email" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    transporter.sendMail({
      from: 'skilllbridgeofficial@gmail.com',
      to: student.email,
      subject: 'SkillBridge - Password Reset OTP',
      html: `<h2>Password Reset Request</h2>
             <p>Hello ${student.fullName},</p>
             <p>Your 6-digit OTP to reset your password is: <strong>${otp}</strong></p>
             <p>This OTP is valid for one-time use only.</p>`
    }).catch(err => console.error("Failed to send student reset OTP:", err));

    return response.json({ message: "OTP sent to your registered email", otp, studentId: student._id.toString() });
  } catch (error) {
    console.error("Forgot student password error:", error);
    return response.status(500).json({ message: "Server error" });
  }
});

// --- Reset Student Password ---
app.post("/reset-student-password", async (request, response) => {
  try {
    const { studentId, newPassword } = request.body;
    if (!studentId || !newPassword) return response.status(400).json({ message: "Student ID and new password are required" });

    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
    const updated = await Student.findByIdAndUpdate(studentId, { password: hashedPassword }, { new: true });
    if (!updated) return response.status(404).json({ message: "Student not found" });

    return response.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset student password error:", error);
    return response.status(500).json({ message: "Server error" });
  }
});

// --- Forgot Password: Send OTP to Admin ---
app.post("/forgot-admin-password", async (request, response) => {
  try {
    const { email } = request.body;
    if (!email) return response.status(400).json({ message: "Email is required" });

    const admin = await Admin.findOne({
      AdminEmail: { $regex: new RegExp(`^${escapeRegex(email.trim())}$`, "i") }
    });
    if (!admin) return response.status(404).json({ message: "No admin found with this email" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    transporter.sendMail({
      from: 'skilllbridgeofficial@gmail.com',
      to: admin.AdminEmail,
      subject: 'SkillBridge Admin - Password Reset OTP',
      html: `<h2>Admin Password Reset Request</h2>
             <p>Hello ${admin.AdminName},</p>
             <p>Your 6-digit OTP to reset your admin password is: <strong>${otp}</strong></p>
             <p>This OTP is valid for one-time use only.</p>`
    }).catch(err => console.error("Failed to send admin reset OTP:", err));

    return response.json({ message: "OTP sent to your registered email", otp, adminId: admin._id.toString() });
  } catch (error) {
    console.error("Forgot admin password error:", error);
    return response.status(500).json({ message: "Server error" });
  }
});

// --- Reset Admin Password ---
app.post("/reset-admin-password", async (request, response) => {
  try {
    const { adminId, newPassword } = request.body;
    if (!adminId || !newPassword) return response.status(400).json({ message: "Admin ID and new password are required" });

    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
    const updated = await Admin.findByIdAndUpdate(adminId, { AdminPassword: hashedPassword }, { new: true });
    if (!updated) return response.status(404).json({ message: "Admin not found" });

    return response.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset admin password error:", error);
    return response.status(500).json({ message: "Server error" });
  }
});

// --- Forgot Password: Send OTP to Developer ---
app.post("/forgot-dev-password", async (request, response) => {
  try {
    const { email } = request.body;
    if (!email) return response.status(400).json({ message: "Email is required" });

    const developer = await DeveloperRecord.findOne({
      email: { $regex: new RegExp(`^${escapeRegex(email.trim())}$`, "i") }
    });
    if (!developer) return response.status(404).json({ message: "No developer found with this email" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    transporter.sendMail({
      from: 'skilllbridgeofficial@gmail.com',
      to: developer.email,
      subject: 'SkillBridge Developer - Password Reset OTP',
      html: `<h2>Developer Password Reset Request</h2>
             <p>Hello ${developer.fullName},</p>
             <p>Your 6-digit OTP to reset your developer password is: <strong>${otp}</strong></p>
             <p>This OTP is valid for one-time use only.</p>`
    }).catch(err => console.error("Failed to send dev reset OTP:", err));

    return response.json({ message: "OTP sent to your registered email", otp, devId: developer._id.toString() });
  } catch (error) {
    console.error("Forgot dev password error:", error);
    return response.status(500).json({ message: "Server error" });
  }
});

// --- Reset Developer Password ---
app.post("/reset-dev-password", async (request, response) => {
  try {
    const { devId, newPassword } = request.body;
    if (!devId || !newPassword) return response.status(400).json({ message: "Dev ID and new password are required" });

    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
    const updated = await DeveloperRecord.findByIdAndUpdate(devId, { password: hashedPassword }, { new: true });
    if (!updated) return response.status(404).json({ message: "Developer not found" });

    return response.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset dev password error:", error);
    return response.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
