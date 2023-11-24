const Session = require("../models/sesion.model");
const Message = require("../models/message.model");
const db = require("../models");
const User = require("../models/user.model");
const _Workshop = db.workshop;
const _User = db.user;
const mailer = require("../config/mailer");
const fs = require("fs");

exports.startSession = async (req, res) => {
  try {
    const userId = req.userId;
    const expertId = await selectExpert();

    const session = new Session({ userId, expertId });
    await session.save();

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSessionsForUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const sessions = await Session.find({ userId });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessagesForSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const messages = await Message.find({ sessionId: sessionId });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los mensajes." });
  }
};

// Enviar un mensaje en una sesión de chat
exports.sendMessage = async (req, res) => {
  try {
    const { sessionId, content } = req.body;

    const message = new Message({
      sessionId,
      content,
      userId: req.user.role === "user" ? req.userId : undefined,
      expertId: req.user.role === "expert" ? req.userId : undefined,
    });

    await message.save();

    // Aquí se emitiría el mensaje a través de Socket.io, implementa esta parte según tu configuración

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Finalizar una sesión de chat
exports.endSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    await Session.findByIdAndUpdate(sessionId, { endedAt: new Date() });

    // Informa al cliente a través de Socket.io que la sesión ha terminado, implementa esta parte según tu configuración

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener mensajes de una sesión de chat
exports.getMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const messages = await Message.find({ sessionId }).sort("createdAt");

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener mensajes sin respuesta para un experto específico
exports.getUnansweredMessagesForExpert = async (req, res) => {
  try {
    const expertId = req.userId; // Asumiendo que el ID del experto está en el token

    // Encuentra los mensajes donde el expertId coincide y no han sido respondidos
    const unansweredMessages = await Message.find({
      expertId,
      responded: false,
    }).sort("createdAt");

    res.status(200).json(unansweredMessages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    // Actualizar el mensaje a leído
    const message = await Message.findByIdAndUpdate(
      messageId,
      { responded: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: "Mensaje no encontrado" });
    }

    res.status(200).json({ message: "Mensaje marcado como leído." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener sesiones de chat para un experto específico
exports.getSessionsForExpert = async (req, res) => {
  try {
    const expertId = req.userId; // Asumiendo que el ID del experto está en el token
    const sessions = await Session.find({ expertId });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    await Session.findByIdAndRemove(sessionId);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActiveUnreadSessionsForExpert = async (req, res) => {
  try {
    const expertId = req.query.expertId;

    // Buscar todas las sesiones que involucren al experto.
    const sessions = await Session.find({
      expertId: expertId,
      endedAt: null, // Para encontrar sesiones que aún están activas.
    })
      .populate("userId")
      .populate("expertId");

    // Si no hay sesiones, devolver una respuesta.
    if (!sessions.length) {
      return res
        .status(200)
        .json({ message: "No active sessions found for this expert." });
    }

    // Buscar mensajes no respondidos para estas sesiones.
    const unreadMessages = await Message.find({
      sessionId: { $in: sessions.map((session) => session._id) },
      responded: false,
      sender: { $ne: expertId },
    });

    const user = await _User.findById(updatedAppointment.UserID);
    if (!user) {
      return res.status(404).send({
        message: `User with id was not found!`,
      });
    }

    const workshop = await _Workshop.findOne({
      WorkshopName: updatedAppointment.Workshop,
    });
    if (!workshop) {
      return res.status(404).send({
        message: `Workshop with name was not found!`,
      });
    }

    const userEmail = user.email;
    const workshopEmail = workshop.email;

    const _workshop = workshop.WorkshopName;

    let _name = user.firstName + " " + user.lastName;

    let statusChanges = fs.readFileSync(
      "./app/mails/unreadmessage.html",
      "utf8"
    );

    statusChanges = statusChanges.replace("{{workshop}}", _workshop);
    statusChanges = statusChanges.replace("{{schedule}}", _user);

    if (unreadMessages.length > 0) {
      const uniqueUserIds = [
        ...new Set(unreadMessages.map((msg) => msg.userId)),
      ];
      for (const userId of uniqueUserIds) {
        const user = await User.findById(userId);
        if (user && user.email) {
          await mailer.send.sendMail({
            from: '"Garage365" <danielchalasrd@gmail.com>',
            to: workshopEmail,
            subject: "Tienes mensajes sin leer - {{Workshop}}",
            text: "Tienes mensajes no leídos en tu sesión de chat. Por favor, revisa tu sesión para leerlos.",
            html: statusChanges,
          });

          /*await mailer.send.sendMail({
            from: '"Garage365" <danielchalasrd@gmail.com>',
            to: workshopEmail,
            subject: "Mensaje sin leer - {{User}}",
            text: "",
            html: statusChanges,
          });*/
        }
      }
    }

    // Si no hay mensajes sin leer, devolver una respuesta.
    if (!unreadMessages.length) {
      return res.status(200).json({
        message: "No unread messages in active sessions for this expert.",
      });
    }

    // Crear una lista de sesiones con mensajes no leídos.
    const activeUnreadSessions = sessions.filter((session) =>
      unreadMessages.some((message) => message.sessionId.equals(session._id))
    );

    res.status(200).json({ activeUnreadSessions });
  } catch (error) {
    console.error("Error fetching active unread sessions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
