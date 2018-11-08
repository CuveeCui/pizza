const jest = require('jest');
const path = require('path');
const fs = require('fs');

process.env.NODE_ENV = 'test';
process.env.BABEL_ENV = 'test';

let argv = process.argv.slice(2);

if (argv.length <= 0) {
	throw new Error('file path is required');
	process.exit(1)
}

argv = argv.length > 0 && argv[0];

const filePath = path.resolve(argv);
console.log(filePath);
if (fs.existsSync(filePath)) {
	jest.run([filePath, '--coverage=false']);
} else {
	throw new Error('file is not exists');
	process.exit(1);
}