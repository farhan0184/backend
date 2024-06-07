import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app = express();
app.use(express.json());

dotenv.config()

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log("MongoDb is connected");
    }).catch(err => {
        console.log(err)
    })

// mongose schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

const port = 5000;
app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello World" });
});


// login with google
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ email, password });
        const savedUser = await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// get all user
app.get('/users', async (req, res) => {
    try {
        // const users = await User.find({}, '-password'); // Exclude the password field
        const users = await User.find();
        res.status(200).json({ message: "Success", data: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


// shahariar0184
// farhan