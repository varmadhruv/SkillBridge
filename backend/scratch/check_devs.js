import mongoose from 'mongoose';

async function checkDevs() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/LoginPage');
        console.log("Connected to DB");
        
        const developerSchema = new mongoose.Schema({
            fullName: String,
            email: String,
        }, { collection: "Developer_record" });
        
        const DeveloperRecord = mongoose.model("DeveloperRecord", developerSchema);
        const devs = await DeveloperRecord.find({});
        console.log("Developers found:", JSON.stringify(devs, null, 2));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDevs();
