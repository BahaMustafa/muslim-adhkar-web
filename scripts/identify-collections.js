const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../temp_adhkar_source.json');
const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

// Identify middle range collections
// 36 to 96
const start = 36;
const end = 96;

for (let i = start; i <= end; i++) {
    const category = sourceData[i - 1];
    if (category) {
        console.log(`Collection-${i}: ${category.category}`);
    }
}
