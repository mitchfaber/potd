require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();
const mysql = require("mysql");
// const scheduler = require("node-schedule");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

// --------- ROUTES
router.get("/spotlight", (req, res) => {
	let today = new Date();
	let dd = String(today.getDate()).padStart(2, "0");
	let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	let yyyy = today.getFullYear();
	today = yyyy + "-" + mm + "-" + dd;

	getPotdSql(today).then((result) => {
		console.log(result.length);
		if (result.length === 0) {
			console.log("no sql record found");
			// No record in SQL for today, get random num and write to sql.
			randomNum().then((result) => {
				getCache(today).then((cacheRes) => {
					if (cacheRes !== undefined) {
						console.log("cache");
						setPotdSql(cacheRes.name, cacheRes.id, today);
						res.send(cacheRes);
					} else {
						console.log("api");
						getFromAPI(result, today).then((e) => {
							setPotdSql(e.name, e.id, today);
							res.send(e);
						});
					}
				});
			});
		} else {
			getCache(today).then((cacheRes) => {
				console.log(cacheRes);
				if (cacheRes !== undefined) {
					console.log("cache");
					res.send(cacheRes);
				} else {
					console.log("api");
					getFromAPI(result[0].PokedexNum, today).then((result) => {
						res.send(result);
					});
				}
			});
		}
	});
});

router.get("/spotlight/:date", (req, res) => {
	let prevSpotlightDate = req.params.date;
	getPotdSql(prevSpotlightDate).then((result) => {
		console.log(result.length);
		if (result.length === 0) {
			console.log("no sql record found");
			res.send("No pokemon found...");
		} else {
			getCache(prevSpotlightDate).then((cacheRes) => {
				console.log(cacheRes);
				if (cacheRes !== undefined) {
					console.log("cache");
					res.send(cacheRes);
				} else {
					console.log("api");
					getFromAPI(result[0].PokedexNum, prevSpotlightDate).then((result) => {
						res.send(result);
					});
				}
			});
		}
	});
});

// functions
async function randomNum() {
	return Math.floor(Math.random() * 898) + 1;
}

function getFromAPI(pokeID, today) {
	return new Promise((resolve) => {
		axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeID}`).then((res) => {
			writeCache(res.data, today).then((result) => {
				resolve(result);
			});
		});
	});
}

function writeCache(data, today) {
	return new Promise((resolve) => {
		myCache.set(today, data, 86400);
		resolve(myCache.get(today));
	});
}

async function getCache(today) {
	return new Promise((resolve) => {
		resolve(myCache.get(today));
	});
}

async function getAllPotd() {
	let con = mysql.createConnection({
		host: process.env.url,
		user: process.env.username,
		password: process.env.password,
		database: process.env.dbname,
	});
	return new Promise((resolve) => {
		con.connect(function (err) {
			if (err) {
				handleDisconnect();
			}
			let sql = "SELECT * FROM PokemonOfTheDay ORDER BY Date";
			con.query(sql, (err, result) => {
				if (err) {
					handleDisconnect();
				}
				resolve(result);
			});
		});
		con.on("error", function (err) {
			console.log("db error", err);

			if (err.code === "PROTOCOL_CONNECTION_LOST") {
				// Connection to the MySQL server is usually lost due to either server restart
				handleDisconnect();
			} else {
				throw err;
			}
		});
	});
}

async function getPotdSql(today) {
	let con = mysql.createConnection({
		host: process.env.url,
		user: process.env.username,
		password: process.env.password,
		database: process.env.dbname,
	});
	return new Promise((resolve) => {
		con.connect(function (err) {
			if (err) {
				handleDisconnect();
			}
			let sql = "SELECT * FROM PokemonOfTheDay WHERE Date = ?";
			con.query(sql, [today], (err, result) => {
				if (err) {
					handleDisconnect();
				}
				resolve(result);
			});
		});

		con.on("error", function (err) {
			console.log("db error", err);

			if (err.code === "PROTOCOL_CONNECTION_LOST") {
				// Connection to the MySQL server is usually lost due to either server restart
				handleDisconnect();
			} else {
				throw err;
			}
		});
	});
}

async function setPotdSql(pokeName, pokeID, today) {
	let con = mysql.createConnection({
		host: process.env.url,
		user: process.env.username,
		password: process.env.password,
		database: process.env.dbname,
	});

	await con.connect(function (err) {
		if (err) {
			handleDisconnect();
		}
		let sql = "INSERT INTO PokemonOfTheDay (PokemonName, PokedexNum, Date) VALUES (?,?,?)";
		con.query(sql, [pokeName, pokeID, today], (err, result) => {
			if (err) {
				handleDisconnect();
			}
		});
	});

	con.on("error", function (err) {
		console.log("db error", err);
		if (err.code === "PROTOCOL_CONNECTION_LOST") {
			// Connection to the MySQL server is usually lost due to either server restart
			handleDisconnect();
		} else {
			throw err;
		}
	});
}

function handleDisconnect() {
	con = mysql.createConnection({
		host: process.env.url,
		user: process.env.username,
		password: process.env.password,
		database: process.env.dbname,
	});

	con.connect(function (err) {
		// The server is either down or restarting (takes a while sometimes).
		if (err) {
			console.log("error when connecting to db:", err);
			// Introduce a delay before attempting to reconnect, to avoid a hot loop
			setTimeout(handleDisconnect, 2000);
		}
	});
	con.on("error", function (err) {
		console.log("db error", err);
		if (err.code === "PROTOCOL_CONNECTION_LOST") {
			// Connection to the sql server is usually lost due to either server restart
			handleDisconnect();
		} else {
			throw err;
		}
	});
}

module.exports = router;
