require("dotenv").config();
console.log(process.env.password);
const express = require("express");
const router = express.Router();

let mysql = require("mysql");

let con = mysql.createConnection({
	host: process.env.url,
	user: process.env.username,
	password: process.env.password,
	database: process.env.dbname,
});

con.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
});

router.get("/", (req, res) => {
	res.send("Pokemon of the day");
});

module.exports = router;
