const db = require("../models");
const Appointment = db.appointment;
const Workshop = db.workshop;
const User = db.user;
const authJwt = require("../middlewares/authJwt.js");

exports.create = (req, res) => {
  const appointment = new Appointment({
    UserID: authJwt.getMyVariable(),
    Workshop: req.body.Workshop,
    Schedule: req.body.Schedule,
    Confirm: req.body.Confirm ? req.body.Confirm : false,
  });

  appointment
    .save(appointment)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Appointment.",
      });
    });
};

exports.findAll = async (req, res) => {
  const UserID = authJwt.getMyVariable();

  let WorkshopName;
  try {
    const workshop = await Workshop.findOne({ _id: UserID });

    if (workshop) {
      WorkshopName = workshop.WorkshopName;
    } else {
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving workshop.",
    });
    return;
  }

  let condition = WorkshopName
    ? { Workshop: { $regex: new RegExp(WorkshopName), $options: "i" } }
    : {};

  try {
    const data = await Appointment.find(condition);
    const data2 = [];
    let userMap = {};

    for (const doc of data) {
      if (userMap[doc.UserID]) {
        continue;
      }
      const user = await User.findOne({ _id: doc.UserID });
      userMap[doc.UserID] = true;
      data2.push(user);
    }
    res.send({ appointments: data, user: data2 });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving appointments.",
    });
  }
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Appointment.findById(id)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "Not found Appointment with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Appointment with id=" + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Appointment.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Appointment with id=${id}. Maybe Appointment was not found!`,
        });
      } else res.send({ message: "Appointment was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Appointment with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Appointment.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Appointment with id=${id}. Maybe Appointment was not found!`,
        });
      } else {
        res.send({
          message: "Appointment was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Appointment with id=" + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  Appointment.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      });
    });
};

exports.findAllPublished = (req, res) => {
  Appointment.find({ Confirm: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};
