const db = require("../models");
const User = db.user;
const Workshop = db.workshop;
var bcrypt = require("bcrypt");
const saltRounds = 10;

exports.findAll = (req, res) => {
  const title = req.query.WorkshopName;
  var condition = title
    ? { WorkshopName: { $regex: new RegExp(title), $options: "i" } }
    : {};

  User.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found User with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving User with id=" + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }

  const id = req.params.id;

  if (!req.body.password) {
    return res.status(400).send({
      message: "Password field is missing.",
    });
  }

  // Hashear la contraseña antes de almacenarla
  bcrypt.hash(req.body.password, saltRounds, (err, hashedPassword) => {
    if (err) {
      return res.status(500).send({ message: "Error hashing password" });
    }

    User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { useFindAndModify: false, new: true }
    )
      .then((data) => {
        if (!data) {
          // Si no se encuentra el usuario, intenta buscar en Workshop
          Workshop.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { useFindAndModify: false, new: true }
          )
            .then((workshopData) => {
              if (!workshopData) {
                res.status(404).send({
                  message: `Cannot update entity with id=${id}. Not found in both User and Workshop!`,
                });
              } else {
                res.send({
                  message: "Password was updated successfully in Workshop.",
                });
              }
            })
            .catch((err) => {
              res.status(500).send({
                message: "Error updating Workshop with id=" + id,
              });
            });
        } else {
          res.send({ message: "Password was updated successfully in User." });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating User with id=" + id,
        });
      });
  });
};
