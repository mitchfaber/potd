const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", (req, res) => {
	axios.get("https://pokeapi.co/api/v2/generation").then((result) => {
		res.send(result.data);
	});
});

module.exports = router;
