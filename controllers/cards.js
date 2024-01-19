const { v4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const dataPath = "../data/cards.json";
const result = { error: null, data: null };

exports.list = async (req, res) => {
  try {
    const rawData = fs.readFileSync(path.resolve(__dirname, dataPath));
    const data = JSON.parse(rawData);
    res.status(200).json({ ...result, data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ ...result, error: err });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const rawData = fs.readFileSync(path.resolve(__dirname, dataPath));
    const data = JSON.parse(rawData);
    const card = data.find((card) => card.id === id);
    if (card.length === 0)
      return res.status(404).json({
        ...result,
        error: { err: "La carte spécifié n'existe pas", data: null },
      });

    res.status(200).json({ ...result, data: card });
  } catch (err) {
    console.log(err);
    res.status(500).json({ ...result, error: err });
  }
};

exports.create = async (req, res) => {
  try {
    const { nom, photo, degats, pv } = req.body;
    if (
      nom === undefined ||
      photo === undefined ||
      degats === undefined ||
      pv === undefined
    )
      return res.json({
        ...result,
        error: { err: "Tout les champs sont obligatoire", added: false },
      });
    const exists = JSON.parse(fs.readFileSync(path.resolve(__dirname, dataPath))).filter(
      (card) => card.nom === nom
    );
    if (exists.length > 0)
      return res.status(400).json({
        ...result,
        error: { err: "La carte spécifié existe déja", added: false },
      });

    const id = v4();
    const rawData = fs.readFileSync(path.resolve(__dirname, dataPath));
    const data = JSON.parse(rawData);
    data.push({ id, nom, photo, degats, pv });
    const stringifyData = JSON.stringify(data);

    fs.writeFileSync(fs.realpathSync(path.resolve(__dirname, dataPath)), stringifyData);
    res.status(200).json({ ...result, data: { added: true } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ ...result, error: { ...err, added: false } });
  }
};

exports.update = async (req, res) => {
  try {
    const rawData = JSON.parse(fs.readFileSync(path.resolve(__dirname, dataPath)));
    const { id } = req.params;
    const exists = rawData.filter((card) => card.id === id);
    if (exists.length === 0)
      return res.json({
        ...result,
        error: { err: "L'utilisateur spécifié n'existe pas", updated: false },
      });

    const { nom, photo, degats, pv } = req.body;
    const newData = {
      nom: nom || exists[0].nom,
      photo: photo || exists[0].photo,
      degats: degats || exists[0].degats,
      pv: pv || exists[0].pv,
    };
    const data = JSON.stringify(
      rawData.map((card) => (card.id === id ? { ...card, ...newData } : card))
    );

    fs.writeFileSync(path.resolve(__dirname, dataPath), data);
    res.status(200).json({ ...result, data: { updated: true } });
  } catch (err) {
    console.log(err);
    res.json({ ...result, error: { ...err, updated: false } });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const rawData = JSON.parse(fs.readFileSync(path.resolve(__dirname, dataPath)));
    const exists = rawData.filter((card) => card.id === id);
    if (exists.length === 0)
      return res.status(400).json({
        ...result,
        error: { err: "La carte spécifié n'existe pas", added: false },
      });

    const data = JSON.stringify(rawData.filter((card) => card.id !== id));
    fs.writeFileSync(path.resolve(__dirname, dataPath), data);
    res.status(200).json({ ...result, data: { deleted: true } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ ...result, error: { ...err, deleted: false } });
  }
};
