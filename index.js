const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/connectDB');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const PORT = process.env.PORT || 6060;

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/v1/user", userRoutes);

app.get("/", (req,res) => {
  res.send("You have sucessfully reached the server");
});

app.listen(PORT, () => {
    console.log(`Server is up and running on PORT ${PORT}`);
});