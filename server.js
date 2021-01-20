const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

var corsOptions = {
  origin: "https://floating-scrubland-13461.herokuapp.com/?fbclid=IwAR1bICZ7SIPl1j7S8dovvokPAP7z9zJGbfsl-iJ-GlUzDlRx-dYiacM3msE",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

// routes
// require("./app/controllers/ListEbook")(app);
require("./app/routes/AccountRote")(app);
require("./app/routes/AuthRote")(app);
require("./app/routes/GenerateUrlRote")(app);
require("./app/routes/EbookRote")(app);
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "admin",
  });
}
// ------------------------------------------------------
