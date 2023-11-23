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

exports.getWorkshops = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const brand = req.query.brand;
  const address = req.query.address;

  const filter = {};
  if (brand) filter.brand = brand;
  if (address) filter.address = address;

  try {
    const workshops = await Workshop.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalWorkshops = await Workshop.countDocuments(filter);
    const totalPages = Math.ceil(totalWorkshops / limit);
    res.status(200).json({
      currentPage: page,
      totalWorkshops,
      totalPages,
      workshopsPerPage: limit,
      workshops,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.search = (req, res) => {
  try {
    const value = req.query.value;
    if (!value) {
      return res
        .status(400)
        .send({ message: "Valor de búsqueda no puede estar vacío" });
    }

    Workshop.find({
      $or: [
        { WorkshopName: new RegExp(value, "i") },
        { vehicleBrand: new RegExp(value, "i") },
        { "locations.address": new RegExp(value, "i") },
      ],
    })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: err.message || "Error durante la búsqueda" });
      });
  } catch (error) {
    res.status(500).send({ message: "Error inesperado durante la búsqueda" });
  }
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

exports.getAllBrands = (req, res) => {
  Workshop.find()
    .distinct("vehicleBrand")
    .then((data) => res.send(data))
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving brands.",
      });
    });
};

exports.getAllAddresses = (req, res) => {
  Workshop.aggregate([
    { $unwind: "$locations" },
    { $group: { _id: "$locations.address" } },
  ])
    .then((data) => {
      const addresses = data.map((item) => item._id);
      res.send(addresses);
    })
    .catch((err) =>
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving addresses.",
      })
    );
};
