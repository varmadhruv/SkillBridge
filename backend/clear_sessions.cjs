const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://127.0.0.1:27017/SkillBridge";

async function inspectAndClear() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections found:", collections.map(c => c.name));
    
    const sessionCollection = collections.find(c => c.name.toLowerCase() === 'sessions');
    if (sessionCollection) {
      const result = await mongoose.connection.db.collection(sessionCollection.name).deleteMany({});
      console.log(`Deleted ${result.deletedCount} sessions from '${sessionCollection.name}'`);
    } else {
      console.log("No sessions collection found.");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

inspectAndClear();
