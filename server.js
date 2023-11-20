const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const verifySignUp = require("./app/middlewares/verifySignUp");
const dbConfig = require("./app/config/db.config");
const authJwt = require("./app/middlewares/authJwt");
const User = require("./app/models/user.model");
const Workshop = require("./app/models/workshop.model");
const Message = require("./app/models/message.model");
const Session = require("./app/models/sesion.model");
const tallerStatsRoutes = require("./app/routes/reportes.routes");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(stripeSecretKey);

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://garage365.netlify.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

var corsOptions = {
  origin: ["https://garage365.netlify.app"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/app/images", express.static("app/images"));
app.use("/taller/reportes", tallerStatsRoutes);

app.use(
  cookieSession({
    name: "Garage365",
    secret: "COOKIE_SECRET",
    httpOnly: true,
  })
);

io.on("connection", (socket) => {
  socket.on("join_taller", async (data) => {
    const { tallerId, userId, userName, tallerName } = data;
    socket.join(`taller-${tallerId}`);

    socket.on("leave_taller", (tallerId) => {
      socket.leave(`taller-${tallerId}`);
    });

    let session = await Session.findOne({ userId, expertId: tallerId });

    if (!session) {
      session = new Session({ userId, expertId: tallerId });
      await session.save();
      socket.emit("session", { _id: session._id, isNewSession: true });
    } else {
      socket.emit("session", { _id: session._id, isNewSession: false });
    }

    socket.sessionId = session._id;
    socket.userId = userId;
    socket.userName = userName;
    socket.tallerId = tallerId;
    socket.tallerName = tallerName;

    socket.emit("session_id", session._id);

    socket.emit("session", { _id: session._id });
  });

  socket.on("send_message", async (messageData) => {
    try {
      const newMessage = new Message({
        content: messageData.content,
        userId: messageData.userId,
        userName: messageData.userName,
        tallerId: socket.expertId || messageData.tallerId,
        tallerName: messageData.tallerName,
        sessionId: socket.sessionId,
        sender: messageData.sender,
      });

      await newMessage.save();

      io.to(`taller-${newMessage.tallerId}`).emit("new_message", newMessage);
    } catch (error) {
      console.error("Error al guardar el mensaje:", error);
    }
  });

  socket.on("end_session", async () => {
    try {
      const session = await Session.findById(socket.sessionId);
      if (session) {
        session.endedAt = new Date();
        await session.save();
      }
    } catch (error) {
      console.error("Error al finalizar la sesión:", error);
    }
  });

  socket.on("disconnect", () => {});
});

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(
    `mongodb+srv://owner:1230@garage365db.u8qultk.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoBD - READY");
    initial();
  })
  .catch((err) => {
    console.error("Error de conexion", err);
    process.exit();
  });

app.post("/api/auth/checkEmail", verifySignUp.checkDuplicateUsernameOrEmail);

app.post(
  "/api/auth/getUserIdByEmail",
  verifySignUp.getUserIDByEmail,
  (req, res) => {
    if (req.userID) {
      return res.status(200).send({ userId: req.userID });
    } else if (req.workshopID) {
      return res.status(200).send({ workshopId: req.workshopID });
    } else {
      return res.status(500).send({ message: "Internal error: No ID found" });
    }
  }
);

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, description } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "dop",
      description: description,
    });
    res.status(200).json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

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
app.get("/api/auth/getUserInfo", [authJwt.verifyToken], (req, res) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      res.status(403).send({ message: "User not found" });
      return;
    }

    res.status(200).send({
      brands: user.vehicles.map((vehicle) => vehicle.vehicleBrand),
      addresses: [user.address + user.address2],
      Username: user.firstName + " " + "" + user.lastName,
    });
  });
});

app.get("/api/auth/getUserInfoUser", [authJwt.verifyToken], (req, res) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      res.status(403).send({ message: "User not found" });
      return;
    }

    res.status(200).send({
      addresses: [user.address + user.address2],
      Username: user.firstName + " " + "" + user.lastName,
    });
  });
});

app.get("/api/workshops", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const brand = req.query.brand || "";
  const address = req.query.address || "";
  const workshops = getWorkshops(page, brand, address);
  const totalWorkshops = countTotalWorkshops(brand, address);

  res.json({
    workshops: workshops,
    totalWorkshops: totalWorkshops,
  });
});

app.get("/api/appointment", async (req, res) => {
  const { brand, address } = req.query;

  let query = {};

  if (brand) {
    query.vehicleBrand = new RegExp(brand, "i");
  }

  if (address) {
    query["locations.address"] = new RegExp(address, "i");
  }

  try {
    const results = await Workshop.find(query);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error del servidor");
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a Garage 365" });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/appointment.routes")(app);
require("./app/routes/appointmentClient.routes")(app);
require("./app/routes/appointmentWorkshop.routes")(app);
require("./app/routes/resetpasswordusers.routes")(app);
require("./app/routes/chat.routes")(app);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
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
