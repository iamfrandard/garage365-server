const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const verifySignUp = require("../server/app/middlewares/verifySignUp");
const dbConfig = require("./app/config/db.config");

const app = express();

var corsOptions = {
  origin: ["http://localhost:8081"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/app/images", express.static("app/images"));

app.use(
  cookieSession({
    name: "Garage365",
    secret: "COOKIE_SECRET",
    httpOnly: true,
  })
);

const db = require("./app/models");
const Role = db.role;

//Base de datos - Local
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoBD - READY");
    initial();
  })
  .catch((err) => {
    console.error("Error de conexion", err);
    process.exit();
  });

//Base de datos - Online
// db.mongoose
//   .connect(
//     `mongodb+srv://admin:Facebook22@garage365.iboufc5.mongodb.net/?retryWrites=true&w=majority`,
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => {
//     console.log("MongoBD - READY");
//     initial();
//   })
//   .catch((err) => {
//     console.error("Error de conexion", err);
//     process.exit();
//   });
//
app.post("/api/auth/checkEmail", verifySignUp.checkDuplicateUsernameOrEmail);

app.post(
  "/api/auth/getUserIdByEmail",
  verifySignUp.getUserIDByEmail,
  (req, res) => {
    res.status(200).send({ userId: req.userID });
  }
);

app.post(
  "/api/auth/register",
  verifySignUp.checkDuplicateUsernameOrEmail,
  (req, res) => {
    User.create(req.body)
      .then((user) => {
        res.status(201).send(user);
      })
      .catch((err) => {
        res.status(400).send({ error: "Could not create user", message: err });
      });
  }
);

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a Garage 365" });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/appointment.routes")(app);
require("./app/routes/appointmentClient.routes")(app);
require("./app/routes/appointmentWorkshop.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server - READY");
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("Error", err);
        }
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
      });
    }
  });
}
