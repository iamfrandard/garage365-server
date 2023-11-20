exports.allAccess = (req, res) => {
  res.status(200).send("Contenido Público");
};

exports.userBoard = (req, res) => {
  res.status(200).send("Contenido del Usuario");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Contenido del Admin");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Contenido del Taller");
};
