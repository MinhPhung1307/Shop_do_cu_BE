const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to DB
mongoose
  .connect(
    `mongodb+srv://ShopUTH:${process.env.MONGO_DB}@minhphung.exhsh77.mongodb.net/?retryWrites=true&w=majority&appName=MinhPhung`
  )
  .then(() => console.log("Connected DB!"))
  .catch(() => console.log("Connect failure!"));


app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

routes(app);

app.listen(PORT, () => {
  console.log(`Server is running in port: ${PORT}`);
});
