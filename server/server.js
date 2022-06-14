const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const genRouter = require("./routes/GenRoute");
app.use("/generation", genRouter);

const potdRouter = require("./routes/PokeOfTheDayRoute");
app.use("/", potdRouter);

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

app.listen(8080, () => {
	console.log("Server Started");
});
