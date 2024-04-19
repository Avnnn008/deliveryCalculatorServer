const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cdekController = require("./controllers/cdekController");
const dellinController = require("./controllers/dellinController");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ extended: true }));
app.post("/cdek", cdekController);
app.post("/dellin", dellinController);

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO).then(() => console.log("DB connected"));
app.listen(PORT, () => console.log(`Listening port ${PORT}`));
