const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();

app.use(cors());
app.use(express.json());

app.listen(8080, () => {
	console.log("Server Started");
});

app.get("/", (req, res) => {
	console.log("Get!");
	res.send("Hello POTD");
});
