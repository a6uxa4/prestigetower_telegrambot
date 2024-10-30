const express = require("express");
const { AddSubmissions } = require("../controllers/submissions.controller");

const router = express.Router();

router.post("", AddSubmissions);

module.exports = router;
