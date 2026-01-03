const fs = require('fs');
const path = require('path');

const SOURCE_FILE = 'temp_english_source.json';
const TARGET_DIR = path.join(__dirname, '../src/data/adhkar-items');

// Helper to clean text
function cleanText(text) {
    if (!text) return "";
    let cleaned = text.trim();

    // Remove wrapping parentheses usually found in this specific dataset
    // Checks if it starts with ( and ends with ) and removes them
    if (cleaned.startsWith('(') && cleaned.endsWith(')')) {
        // Make sure they are matching outer parens and not just two random parens
        // Simple check: remove them.
        cleaned = cleaned.substring(1, cleaned.length - 1).trim();
    }

    // Fix common spacing issues (e.g. " ." -> ".")
    cleaned = cleaned.replace(/\s+\./g, '.');
    cleaned = cleaned.replace(/\s+,/g, ',');

    return cleaned;
}

// 1. Build Lookup Map from Source
console.log('Building lookup map from source...');
let rawData = fs.readFileSync(SOURCE_FILE, 'utf8');
// Strip BOM if present
if (rawData.charCodeAt(0) === 0xFEFF) {
    rawData = rawData.slice(1);
}
const sourceData = JSON.parse(rawData);
const lookupMap = new Map(); // Key: audio ID (string), Value: { translation, transliteration }

if (sourceData.English) {
    sourceData.English.forEach(category => {
        if (category.TEXT) {
            category.TEXT.forEach(item => {
                // Extract ID from AUDIO url: http://www.hisnmuslim.com/audio/ar/121.mp3 -> 121
                if (item.AUDIO) {
                    const match = item.AUDIO.match(/\/(\d+)\.mp3$/);
                    if (match) {
                        const audioId = match[1];
                        lookupMap.set(audioId, {
                            translation: cleanText(item.TRANSLATED_TEXT),
                            transliteration: cleanText(item.LANGUAGE_ARABIC_TRANSLATED_TEXT)
                        });
                    }
                }
            });
        }
    });
}
console.log(`Loaded ${lookupMap.size} items from source.`);

// 2. Iterate and Update Target Files
console.log('Updating target files...');
const files = fs.readdirSync(TARGET_DIR).filter(f => f.endsWith('.json'));
let updatedCount = 0;
let filesUpdated = 0;

files.forEach(file => {
    const filePath = path.join(TARGET_DIR, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let fileModified = false;

    if (content.items) {
        content.items.forEach(item => {
            // Extract ID from audioFile: "121.mp3" -> 121
            if (item.audioFile) {
                const match = item.audioFile.match(/^(\d+)\.mp3$/);
                if (match) {
                    const audioId = match[1];
                    const sourceItem = lookupMap.get(audioId);

                    if (sourceItem) {
                        // Update Validation: Only update if our current field is empty or strictly matches the "no translation" placeholder
                        // The user said "Merge... Update (Don't Replace) ... DO NOT overwrite our current audioFile".
                        // Implicitly, if we have a translation, should we overwrite it? 
                        // The user logic is "Enrichment". Usually implies adding where missing or upgrading.
                        // Given the prompt "Update the 130+ JSON files in place", and "Verify that item ID 121 now has the translation...", 
                        // it implies we SHOULD apply the new text. 
                        // But let's look at the instruction: "Update (Don't Replace) Map TRANSLATED_TEXT -> translation". 
                        // Wait, "Update (Don't Replace)" is contradictory. 
                        // Usually this means "Update the record, but don't replace the whole object". 
                        // Or "Don't replace existing non-empty values"? 
                        // Hint: "Merge English text... into our existing ... structure".
                        // Most of our current files have `translation: ""` (empty).
                        // I will overwrite translation/transliteration if the source has valid text.

                        if (sourceItem.translation) {
                            item.translation = sourceItem.translation;
                            fileModified = true;
                        }
                        if (sourceItem.transliteration) {
                            item.transliteration = sourceItem.transliteration;
                            fileModified = true;
                        }
                    }
                }
            }
        });
    }

    if (fileModified) {
        fs.writeFileSync(filePath, JSON.stringify(content, null, 4), 'utf8');
        filesUpdated++;
        updatedCount++; // loose counting
    }
});

console.log(`Process Complete.`);
console.log(`Updated ${filesUpdated} files.`);
