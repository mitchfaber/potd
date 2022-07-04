require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const sqlUtil = require("./../lib/Sql");

// --------- ROUTES
router.get("/dateLimits", (req, res) => {
	//check min/max dates for the datepicker client side.
	sqlUtil.getMinMaxDates().then((result) => {
		res.send(result);
	});
});

router.get("/spotlight/:date", (req, res) => {
	// picks pokemon for specified date, returns nothing found if it has not been generated for that day.
	let prevSpotlightDate = req.params.date;
	sqlUtil.getPotdSql(prevSpotlightDate).then((result) => {
		if (result.length === 0) {
			console.log("no sql record found");
			res.send({ message: "No pokemon found..." });
		} else {
			getCache(prevSpotlightDate).then((cacheRes) => {
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
function getFromAPI(pokeID, today) {
	return new Promise((resolve) => {
		let flavorTexts = [];
		let pokemon = {};
		axios
			.get(`https://pokeapi.co/api/v2/pokemon-species/${pokeID}`)
			.then((res) => {
				res.data.flavor_text_entries.map((e) => {
					if (flavorTexts.length <= 0) {
						//if we have one flavor text, don't add more (for now)
						if (e.language.name === "en") {
							// add the english one. Maybe add language choice at some point.
							flavorTexts.push({
								version: e.version.name,
								text: e.flavor_text.replace(/[\f\n]/g, " "),
							});
						}
					}
				});
				//add flavor texts array to pokemon object for sending.
				pokemon.flavorTexts = flavorTexts;
			})
			.then(() => {
				axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeID}`).then((res) => {
					//add general information for sending.
					pokemon.general = res.data;
					writeCache(pokemon, today).then((result) => {
						// pokemon.general = result;
						resolve(result);
					});
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

function getCache(today) {
	return new Promise((resolve) => {
		resolve(myCache.get(today));
	});
}

module.exports = router;
