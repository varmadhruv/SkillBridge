import mongoose from 'mongoose';

const MONGO_URL = "mongodb://127.0.0.1:27017/LoginPage";

const reportSchema = new mongoose.Schema({
  mentorName: String,
  issue: String,
  submittedAt: { type: Date, default: Date.now }
}, { collection: "Report_record" });

const Report = mongoose.model("Report", reportSchema);

async function cleanup() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    const reports = await Report.find({}).sort({ submittedAt: -1 }).limit(2);
    if (reports.length > 0) {
      const ids = reports.map(r => r._id);
      const result = await Report.deleteMany({ _id: { $in: ids } });
      console.log(`Deleted ${result.deletedCount} reports:`, ids);
    } else {
      console.log("No reports found to delete.");
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

cleanup();
