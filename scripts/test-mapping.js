const { getSurahIdFromSlug } = require('./src/lib/quran-mapping');

const slug = 'surah-al-fatihah';
const id = getSurahIdFromSlug(slug);

console.log(`Testing slug "${slug}" -> ID: ${id}`);

if (id === 1) {
    console.log('SUCCESS: Mapping works.');
} else {
    console.log('FAILURE: Mapping failed.');
}
