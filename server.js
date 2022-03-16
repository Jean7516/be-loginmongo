const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();

var corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

// Solicitud del tipo de contenido -application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta
app.get("/", (req, res) => {
  res.json({ message: "Welcome." });
});
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// Estableciendo puertos y solicitudes
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Conexion con base de datos
const db = require("./app/models");
const Role = db.role;
console.log(process.env.HOST)
db.mongoose
  .connect(`mongodb://${process.env.HOST}:${process.env.PORTDB}/${process.env.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });
      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'moderator' to roles collection");
      });
      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}
