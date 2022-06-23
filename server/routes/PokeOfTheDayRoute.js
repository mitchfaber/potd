const errorLogger = require("./../errorLogger");
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();
const mysql = require("mysql");
// const scheduler = require("node-schedule");
const NodeCache = require("node-cache");
const e = require("express");
const myCache = new NodeCache();

// --------- ROUTES
router.get("/", (req, res) => {
	let today = new Date();
	console.log(today);
	let dd = String(today.getDate()).padStart(2, "0");
	let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	let yyyy = today.getFullYear();
	today = yyyy + "-" + mm + "-" + dd;
	console.log(today);

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

router.get("/:date", (req, res) => {
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

async function getPotdSql(today) {
	let con = mysql.createConnection({
		host: process.env.url,
		user: process.env.username,
		password: process.env.password,
		database: process.env.dbname,
	});
	return new Promise((resolve) => {
		con.connect(function (err) {
			if (err) errorLogger.logError(err);
			let sql = "SELECT * FROM PokemonOfTheDay WHERE Date = ?";
			con.query(sql, [today], (err, result) => {
				if (err) errorLogger.logError(err);
				resolve(result);
			});
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
		if (err) errorLogger.logError(err);
		let sql = "INSERT INTO PokemonOfTheDay (PokemonName, PokedexNum, Date) VALUES (?,?,?)";
		con.query(sql, [pokeName, pokeID, today], (err, result) => {
			if (err) errorLogger.logError(err);
		});
	});
}

module.exports = router;
