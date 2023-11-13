const db = require("../models");
const Workshop = db.workshop;

exports.findAll = (req, res) => {
  const title = req.query.WorkshopName;
  var condition = title
    ? { WorkshopName: { $regex: new RegExp(title), $options: "i" } }
    : {};
  Workshop.find(condition)
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

exports.findOne = (req, res) => {
  const name = req.params.id;
  Workshop.findById(name)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Workshop with id " + name });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Workshop with id=" + name });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;
  Workshop.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Workshop with id=${id}. Maybe Workshop was not found!`,
        });
      } else res.send({ message: "Workshop was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Workshop with id=" + id,
      });
    });
};
