const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");
const app = express();
const dbConfig = require("./app/config/db.config");
const corsOptions = {
  origin: "http://localhost:8888",
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
db.mongoose
  .connect(`${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

require("./app/routers/auth.routes")(app);
require("./app/routers/file.routes")(app);
require("./app/routers/firebase.routes")(app);
require("./app/routers/shipper.routes")(app);
require("./app/routers/order.routes")(app);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Do an tot nghiep." });
});

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
