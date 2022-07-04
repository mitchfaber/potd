require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const sqlUtil = require("./../lib/Sql");

// --------- ROUTES
// router.get("/spotlight", (req, res) => {
// 	let today = new Date();
// 	let dd = String(today.getDate()).padStart(2, "0");
// 	let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
// 	let yyyy = today.getFullYear();
// 	today = yyyy + "-" + mm + "-" + dd;

// 	sqlUtil.getPotdSql(today).then((result) => {
// 		if (result === undefined) {
// 			res.send({ message: "No Pokemon found..." });
// 		} else {
// 			if (result.length === 0) {
// 				res.send({ message: "No Pokemon found..." });
// 			} else {
// 				getCache(today).then((cacheRes) => {
// 					if (cacheRes !== undefined) {
// 						console.log("cache");
// 						res.send(cacheRes);
// 					} else {
// 						console.log("api");
// 						getFromAPI(result[0].PokedexNum, today).then((result) => {
// 							res.send(result);
// 						});
// 					}
// 				});
// 			}
// 		}
// 	});
// });

router.get("/dateLimits", (req, res) => {
	sqlUtil.getMinMaxDates().then((result) => {
		res.send(result);
	});
});

router.get("/spotlight/:date", (req, res) => {
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
		let flavorText = {};
		let flavorTexts = [];
		let pokemon = {};
		axios
			.get(`https://pokeapi.co/api/v2/pokemon-species/${pokeID}`)
			.then((res) => {
				res.data.flavor_text_entries.map((e) => {
					if (e.language.name === "en") {
						// axios.get(e.version.url).then((res) => {
						// 	axios.get(res.data.version_group.url).then((res) => {
						// 		console.log(res.data);
						// 	});
						// });
						if (flavorTexts.length > 0) {
							flavorTexts.forEach((element) => {
								if (element.text === e.flavor_text.replace(/[\f\n]/g, " ")) {
									console.log("Same entry: " + element.version + " and " + e.version.name);
								}
							});
						}
						flavorTexts.push({
							version: e.version.name,
							text: e.flavor_text.replace(/[\f\n]/g, " "),
						});
						// flavorText[e.version.name] = e.flavor_text.replace("/\f/g", " ");
					}
				});
				pokemon.flavorTexts = flavorTexts;
			})
			.then(() => {
				axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeID}`).then((res) => {
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

async function getCache(today) {
	return new Promise((resolve) => {
		resolve(myCache.get(today));
	});
}

module.exports = router;
