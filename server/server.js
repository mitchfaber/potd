const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const sqlUtil = require("./lib/sql");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

// Schedule task
const scheduler = require("node-schedule");
const rule = new scheduler.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
rule.second = 0;
rule.tz = "America/Halifax";

let today = new Date();
let dd = String(today.getDate()).padStart(2, "0");
let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
let yyyy = today.getFullYear();
today = yyyy + "-" + mm + "-" + dd;

app.use(cors());
app.use(express.json());

const potdRouter = require("./routes/PokeOfTheDayRoute");
app.use("/", potdRouter);

app.listen(8080, () => {
	const job = scheduler.scheduleJob(rule, function () {
		randomNum().then((result) => {
			getFromAPI(result, today).then((e) => {
				sqlUtil.setPotdSql(e.name, e.id, today);
				console.log(e);
			});
		});
	});

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
			writeCache(res.data, today).then((result) => {
				resolve(result);
			});
		});
	});
}

async function randomNum() {
	return Math.floor(Math.random() * 898) + 1;
}
