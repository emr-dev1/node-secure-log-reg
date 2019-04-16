const fs = require("fs");
const path = require("path");
const models_path = path.join(__dirname, "../models");
const my_models = fs.readdirSync(models_path);
const mongoose = require("mongoose");

module.exports = db_name => {
	console.log("db_name is", db_name);
	mongoose.connect(`mongodb://localhost/${db_name}`, { useNewUrlParser: true });
};

for (let file of my_models) {
	if (file.endsWith(".js")) {
		require(path.join(models_path, file));
	}
}