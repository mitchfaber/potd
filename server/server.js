const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const sqlUtil = require("./library/sql");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

// Schedule task
const scheduler = require("node-schedule");
const rule = new scheduler.RecurrenceRule();
rule.second = 0;

let today = new Date();
let dd = String(today.getDate()).padStart(2, "0");
let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
let yyyy = today.getFullYear();
today = yyyy + "-" + mm + "-" + dd;

const job = scheduler.scheduleJob(rule, function () {
	//run at midnight every day
	sqlUtil.getPotdSql(today).then((res) => {
		if (res.length === 0) {
			randomNum().then((result) => {
				getFromAPI(result, today).then((e) => {
					//get new pokemon from the api, and write it to my SQL server and write a cache.
					sqlUtil.setPotdSql(e.name, e.id, today);
				});
			});
		}
	});
});

app.use(cors());
app.use(express.json());

const potdRouter = require("./routes/PokeOfTheDayRoute");
app.use("/", potdRouter);

app.listen(3000, () => {
	console.log("Server Started");
});

function writeCache(data, today) {
	return new Promise((resolve) => {
		myCache.set(today, data, 86400);
		resolve(myCache.get(today));
	});
}

function getFromAPI(pokeID, today) {
	return new Promise((resolve) => {
		axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeID}`).then((res) => {
			//write cache to avoid hitting the api more than necessary. Get from cache is in the router.
			writeCache(res.data, today).then((result) => {
				resolve(result);
			});
		});
	});
}

async function randomNum() {
	return Math.floor(Math.random() * 898) + 1;
}
