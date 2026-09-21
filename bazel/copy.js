const fs = require('fs');

const [,, src, out] = process.argv;

if (!src || !out) {
    console.error('Usage: node copy.js <src> <out>');
    process.exit(1);
}

fs.copyFileSync(src, out);
