const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const User = require("./models/User");

dotenv.config();
mongoose.connect(process.env.MONGO_URL);
const port = process.env.PORT;
const jwtSecret = process.env.JWT_SECRET;

const app = express();
app.use(express.json());
// app.use(
//   cors({
//     origin: "*",
//     credentials: true
//   })
// );

app.use(cors());
app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", cors(), async (req, res) => {
  const { username, password } = req.body;
  // console.log(req.body)

  // await User.create({username, password});
  // res.json()
  try {
    const createdUser = await User.create({ username, password });
    jwt.sign({ userId: createdUser._id }, jwtSecret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).status(201).json({id: createdUser._id});
    });
  } catch (err) {
    if (err) throw err;
    res.status(500).json("error");
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
