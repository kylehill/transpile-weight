var fs = require("fs")
var dist = (__dirname + "/dist")

var analyzeDirectoryContents = function(path) {
	return fs.readdirSync(path).reduce(function(memory, name) {
		var stat = fs.statSync(path + "/" + name)
		
		if (stat.isDirectory()) {
			memory[name] = analyzeDirectoryContents(path + "/" + name)
		}
		else {
			memory[(name.split(".js")[0])] = stat.size
		}
		
		return memory
	}, {})
}

var fileData = analyzeDirectoryContents(dist)
var files = []
for (var s in fileData.es5) {
	var es5 = fileData.es5[s]
	var es6 = fileData.es6[s]

	if (typeof es5 === "object") {

		for (var f in es5) {
			var es5file = es5[f]
			var es6file = es6[f]

			files.push({
				section: s,
				file: f,
				es5: es5file,
				es6: es6file,
				inflation: es5file/es6file
			})
		}
	}
}

fs.writeFileSync(__dirname + "/comparison_results.json", JSON.stringify(files, null, 2))