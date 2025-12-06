require('dotenv').config();

console.log('Checking environment variables...');
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
if (process.env.JWT_SECRET) {
    console.log('JWT_SECRET length:', process.env.JWT_SECRET.length);
} else {
    console.log('JWT_SECRET is MISSING!');
}
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
