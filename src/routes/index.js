const path = require('path');
const fs = require('fs');

const notIncludes = ['index'];
const files = []

fs.readdirSync(__dirname).forEach(file => {
	const fileParse = path.parse(file);

	if (fileParse.ext === '.js' && !notIncludes.includes(fileParse.name)) {
		const name = `${file.replace('.js', '')}`;
        files.push(require(`./${name}`));
	}
})

module.exports = files