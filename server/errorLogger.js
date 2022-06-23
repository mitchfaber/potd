function logError(err) {
	const fs = require("fs");
	fs.writeFile("/Logs/error.log", err, (error) => {
		if (error) console.log(error);
	});
}

module.exports = logError;
