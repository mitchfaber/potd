const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const genRouter = require("./routes/GenRoute");
app.use("/generation", genRouter);

const potdRouter = require("./routes/PokeOfTheDayRoute");
app.use("/", potdRouter);

app.listen(8080, () => {
	console.log("Server Started");
});
