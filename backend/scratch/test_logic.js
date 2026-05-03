import bcrypt from 'bcryptjs';

async function testLogin() {
    const enteredPassword = "9b9mqtgr";
    const storedPassword = "9b9mqtgr";
    
    let isPasswordCorrect = false;
    try {
        isPasswordCorrect = await bcrypt.compare(enteredPassword, storedPassword);
        console.log("Bcrypt compare result:", isPasswordCorrect);
    } catch (e) {
        console.log("Bcrypt threw error (expected for non-hash):", e.message);
        isPasswordCorrect = (enteredPassword === storedPassword);
    }
    
    if (!isPasswordCorrect && !storedPassword.startsWith('$2')) {
        isPasswordCorrect = (enteredPassword === storedPassword);
        console.log("Fallback plain text match:", isPasswordCorrect);
    }
    
    console.log("Final result:", isPasswordCorrect);
}

testLogin();
