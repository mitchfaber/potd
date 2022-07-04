const mysql = require("mysql");

module.exports.getPotdSql = async function getPotdSql(today) {
	let con = mysql.createConnection({
		host: process.env.url,
		user: process.env.username,
		password: process.env.password,
		database: process.env.dbname,
		port: process.env.dbport,
	});
	return new Promise((resolve) => {
		con.connect(function (err) {
			if (err) {
				handleDisconnect();
			}
			let sql = `SELECT * FROM PokemonOfTheDay WHERE Date = ?`;
			con.query(sql, [today], (err, result) => {
				if (err) {
					handleDisconnect();
				}
				resolve(result);
			});
		});

		con.on("connect", function (err) {
			if (err) console.log(err);
			console.log("Db connected");
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
};

module.exports.setPotdSql = async function setPotdSql(pokeName, pokeID, today) {
	let con = mysql.createConnection({
		host: process.env.url,
		user: process.env.username,
		password: process.env.password,
		database: process.env.dbname,
		port: process.env.dbport,
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
};

module.exports.getMinMaxDates = function getMinMaxDates() {
	let con = mysql.createConnection({
		host: process.env.url,
		user: process.env.username,
		password: process.env.password,
		database: process.env.dbname,
		port: process.env.dbport,
	});
	return new Promise((resolve) => {
		con.connect(function (err) {
			if (err) {
				handleDisconnect();
			}
			let sql = "SELECT MAX(Date)  as max,Min(DATE) as min FROM PokemonOfTheDay";
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
};

function handleDisconnect() {
	con = mysql.createConnection({
		host: process.env.url,
		user: process.env.username,
		password: process.env.password,
		database: process.env.dbname,
		port: process.env.dbport,
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
