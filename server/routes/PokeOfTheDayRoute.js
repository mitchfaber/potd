require("dotenv").config();
const express = require("express");
const router = express.Router();
const scheduler = require("node-schedule");
let todaysMon;

let mysql = require("mysql");

scheduler.scheduleJob("0 0 * * *", () => {});
let con = mysql.createConnection({
	host: process.env.url,
	user: process.env.username,
	password: process.env.password,
	database: process.env.dbname,
});

con.connect(function (err) {
	if (err) throw err;
	let today = new Date();
	let dd = String(today.getDate()).padStart(2, "0");
	let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	let yyyy = today.getFullYear();
	today = yyyy + "-" + mm + "-" + dd;
	console.log(today);
	let sql = "SELECT * FROM PokemonOfTheDay WHERE Date = ?";
	con.query(sql, [today], (err, result) => {
		if (err) throw err;
		todaysMon = result;
	});
	console.log("Connected!");
});

router.get("/", (req, res) => {
	res.send("Pokemon of the day");
});

module.exports = router;
