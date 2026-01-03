const fs = require('fs');
const path = require('path');
const https = require('https');

// --- CONFIGURATION ---
const DATA_DIR = path.join(__dirname, '../src/data/adhkar-items');
const AUDIO_DIR = path.join(__dirname, '../public/audio/adhkar');
const SOURCE_BASE_URL = 'https://raw.githubusercontent.com/rn0x/Adhkar-json/main/audio/';

// Ensure audio directory exists
if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// --- HELPER: DOWNLOAD FUNCTION ---
async function downloadFile(filename) {
    const url = `${SOURCE_BASE_URL}${filename}`;
    const destination = path.join(AUDIO_DIR, filename);

    if (fs.existsSync(destination)) {
        console.log(`[SKIP] ${filename} already exists.`);
        return;
    }

    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destination);
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(() => {
                        console.log(`[SUCCESS] Downloaded ${filename}`);
                        resolve();
                    });
                });
            } else if (response.statusCode === 404) {
                console.log(`[MISSING] File not found on server: ${filename}`);
                fs.unlink(destination, () => { }); // Delete empty file
                resolve(); // Resolve to verify we continue
            } else {
                console.log(`[ERROR] Server returned ${response.statusCode} for ${filename}`);
                fs.unlink(destination, () => { });
                resolve();
            }
        }).on('error', (err) => {
            fs.unlink(destination, () => { });
            console.error(`[ERROR] Network error for ${filename}: ${err.message}`);
            resolve();
        });
    });
}

// --- MAIN Logic ---
async function main() {
    // 1. Identify Missing Files
    console.log("Scanning JSON files for audio references...");
    const files = fs.readdirSync(DATA_DIR).filter(file => file.endsWith('.json'));

    // We need to look at the ORIGINAL source to map IDs to audio filenames properly 
    // because our new JSON schema might not have preserved the original 'filename' or 'audio' field 
    // if the migration script didn't explicitly map it to `audioFile`.
    // Let's check if the migration script SAVED the audio info. 
    // Re-reading 'src/data/adhkar-items/*.json' only works if we put the audio filename in there.

    // CRITICAL: The previous migration script (migrate.js) did NOT map 'audio' or 'filename' 
    // from the source JSON to the new JSONs. It only mapped text, count, etc.
    // So we must read from `temp_adhkar_source.json` to know which audio file belongs to which item,
    // OR we just download ALL audio files referenced in `temp_adhkar_source.json` regardless of structure.

    // Strategy: Download ALL audio files found in `temp_adhkar_source.json` to the local folder.
    // Later, we can re-run migration to link them if needed, but the primary task IS downloading.

    const sourcePath = path.join(__dirname, '../temp_adhkar_source.json');
    if (!fs.existsSync(sourcePath)) {
        console.error("Source file temp_adhkar_source.json not found!");
        process.exit(1);
    }

    const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    let downloadQueue = [];

    sourceData.forEach(category => {
        if (category.audio) {
            const cleanAudio = category.audio.replace('/audio/', '');
            downloadQueue.push(cleanAudio);
        }
        if (category.array) {
            category.array.forEach(item => {
                if (item.audio) {
                    const cleanItemAudio = item.audio.replace('/audio/', '');
                    downloadQueue.push(cleanItemAudio);
                }
            });
        }
    });

    // Deduplicate
    downloadQueue = [...new Set(downloadQueue)];
    console.log(`Found ${downloadQueue.length} unique audio files to sync.`);

    // 2. Download Files
    for (const filename of downloadQueue) {
        await downloadFile(filename);
    }

    console.log("Audio Sync Completed.");
}

main();
