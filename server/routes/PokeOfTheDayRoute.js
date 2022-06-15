require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();
const mysql = require("mysql");
const scheduler = require("node-schedule");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

let today;

// ---------SQL CONNECTION

// --------- Scheduled task to create new random num, and pick new pokemon to cache at midnight
scheduler.scheduleJob("0 0 * * *", () => {
	randomNum().then((result) => {
		today = new Date();
		let dd = String(today.getDate()).padStart(2, "0");
		let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
		let yyyy = today.getFullYear();
		today = yyyy + "-" + mm + "-" + dd;
		axios
			.get(`https://pokeapi.co/api/v2/pokemon/${result}`)
			.then((res) => {
				console.log("api");
				if (myCache.set(today, res.data, 86400)) {
					// console.log(myCache.get(today));
					pokeSpotlight = myCache.get(today);
				}
			})
			.then(() => {
				console.log("axios then");
				res.send(pokeSpotlight);
			});
	});
});

// --------- ROUTES
router.get("/", (req, res) => {
	today = new Date();
	let dd = String(today.getDate()).padStart(2, "0");
	let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	let yyyy = today.getFullYear();
	today = yyyy + "-" + mm + "-" + dd;

	getPotdSql(today).then((result) => {
		console.log("Done checking POTD");
	});
	randomNum().then((result) => {
		pokeSpotlight = myCache.get(today);
		if (pokeSpotlight !== undefined) {
			console.log("cache");
			res.send(pokeSpotlight);
		} else {
			axios
				.get(`https://pokeapi.co/api/v2/pokemon/${result}`)
				.then((res) => {
					console.log("api");
					if (myCache.set(today, res.data, 86400)) {
						// console.log(myCache.get(today));
						pokeSpotlight = myCache.get(today);
						//setPotdSql(pokeSpotlight.name, pokeSpotlight.id, today);
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

async function getPotdSql(todaysDate) {
	let con = mysql.createConnection({
		host: process.env.url,
		user: process.env.username,
		password: process.env.password,
		database: process.env.dbname,
	});
	await con.connect(function (err) {
		if (err) throw err;
		let sql = "SELECT * FROM PokemonOfTheDay WHERE Date = ?";
		con.query(sql, [todaysDate], (err, result) => {
			if (err) throw err;
			console.log(result);
			return result;
		});
		console.log("Connected!");
	});
}

async function setPotdSql(pokeName, pokeID, todaysDate) {
	let con = mysql.createConnection({
		host: process.env.url,
		user: process.env.username,
		password: process.env.password,
		database: process.env.dbname,
	});
	await con.connect(function (err) {
		if (err) throw err;
		let sql = "INSERT INTO PokemonOfTheDay (PokemonName, PokedexNum, Date) VALUES (?,?,?)";
		con.query(sql, [pokeName, pokeID, todaysDate], (err, result) => {
			if (err) throw err;
		});
		console.log("Connected!");
	});
}

module.exports = router;
