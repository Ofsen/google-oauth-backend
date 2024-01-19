const express = require("express");
const router = express.Router();

const { list, create, update, remove, getOne } = require("../controllers/cards");

router.get("/cards", list);
router.get("/cards/:id", getOne);
router.post("/cards", create);
router.put("/cards/:id", update);
router.delete("/cards/:id", remove);

module.exports = router;
