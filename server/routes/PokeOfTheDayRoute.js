const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.send("Pokemon of the day");
});

module.exports = router;
