require("dotenv").config();
const express = require("express");
const router = express.Router();

let mysql = require("mysql");

let con = mysql.createConnection({
	host: "***REMOVED***",
	user: "***REMOVED***",
	password: "***REMOVED***",
	database: "***REMOVED***",
});

con.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
});

router.get("/", (req, res) => {
	res.send("Pokemon of the day");
});

module.exports = router;
