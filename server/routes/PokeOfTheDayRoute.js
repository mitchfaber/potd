require("dotenv").config();
const express = require("express");
const router = express.Router();

let mysql = require("mysql");

let con = mysql.createConnection({
	host: "mitchfaber.ca",
	user: "mitchfab_faberm",
	password: "9kHhJDR5",
	database: "mitchfab_pokemon",
});

con.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
});

router.get("/", (req, res) => {
	res.send("Pokemon of the day");
});

module.exports = router;
