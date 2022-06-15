require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();
const mysql = require("mysql");
const scheduler = require("node-schedule");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

let today;

// --------- Scheduled task to create new random num, and pick new pokemon to cache at midnight
scheduler.scheduleJob("0 0 * * *", () => {
	randomNum().then((res) => {
		console.log("Midnight run " + res);
	});
});

// ---------SQL CONNECTION
// let con = mysql.createConnection({
// 	host: process.env.url,
// 	user: process.env.username,
// 	password: process.env.password,
// 	database: process.env.dbname,
// });

// con.connect(function (err) {
// 	if (err) throw err;
// 	let sql = "SELECT * FROM PokemonOfTheDay WHERE Date = ?";
// 	con.query(sql, [today], (err, result) => {
// 		if (err) throw err;
// 		todaysMon = result;
// 	});
// 	console.log("Connected!");
// });

// --------- ROUTES
router.get("/", (req, res) => {
	today = new Date();
	let dd = String(today.getDate()).padStart(2, "0");
	let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	let yyyy = today.getFullYear();
	today = yyyy + "-" + mm + "-" + dd;

	randomNum().then((result) => {
		today = "2022-06-13";
		pokeSpotlight = myCache.get(today);

		if (pokeSpotlight !== undefined) {
			console.log("cache");
			res.send(pokeSpotlight);
		} else {
			axios
				.get(`https://pokeapi.co/api/v2/pokemon/${result}`)
				.then((res) => {
					console.log("api");
					if (myCache.set(today, res.data, 600)) {
						// console.log(myCache.get(today));
						pokeSpotlight = myCache.get(today);
					}
				})
				.then(() => {
					console.log("axios then");
					res.send(pokeSpotlight);
				});
		}
	});
});

// functions
async function randomNum() {
	return Math.floor(Math.random() * 898) + 1;
}

async function getSpotlightPoke(pokeID) {
	console.log(pokeID);
}

module.exports = router;
