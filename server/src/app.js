const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 8000;
const cors = require("cors");
const database = require("./config/database");
database.connect();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fileRoutes = require("./routes/fileuplaod");

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// // middlewares
app.use((req, res, next) => {
  console.log("http method->" + req.method + ",URL->" + req.url);
  next();
});


app.use("/api", fileRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Agnet ERP API");
});

app.listen(PORT, () => {
  console.log(`Server started at Port ${PORT}`);
});