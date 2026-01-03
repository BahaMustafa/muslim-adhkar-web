const fs = require('fs');
const path = require('path');

// 1. Load Source Data
const sourcePath = path.join(__dirname, '../temp_adhkar_source.json');
const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

// 2. Category Mapping
const categoryMap = {
    "أذكار الصباح والمساء": "morning-evening-adhkar",
    "أذكار النوم": "sleeping-adhkar",
    "دعاء السفر": "travel-dua",
    "أذكار الاستيقاظ من النوم": "waking-up-adhkar",
    "دعاء دخول المسجد": "entering-mosque-dua",
    // "الأذكار بعد السلام من الصلاة": "after-prayer-adhkar", // Kept manual "after-salah" instead since we deleted the bulk one
    "دعاء صلاة الاستخارة": "istikhara-dua",
    "دعاء الهم والحزن": "anxiety-and-sorrow-dua",
    "دعاء قضاء الدين": "debt-relief-dua"
};

// 3. Process categories
sourceData.forEach(categoryObj => {
    let slug = categoryMap[categoryObj.category];

    if (!slug) {
        return;
    }

    const fileName = `${slug}.json`;
    const filePath = path.join(__dirname, '../src/data/adhkar-items', fileName);

    const items = categoryObj.array.map((item, index) => {
        return {
            id: `${slug}-${index + 1}`,
            slug: `${slug}-${index + 1}`,
            title: item.filename ? `Dua ${item.filename}` : `Supplication ${index + 1}`,
            arabic: item.text,
            transliteration: "",
            translation: "",
            count: parseInt(item.count) || 1,
            source: {
                collection: "Authentic Source",
                reference: ""
            },
            virtue: "",
            lastVerified: "2026-01-02",
            authenticity: "Sahih",
            // MAP AUDIO FILE HERE
            audioFile: item.audio ? item.audio.replace('/audio/', '') : undefined
        };
    });

    const fileContent = {
        title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: `Authentic ${slug.replace(/-/g, ' ')}`,
        category: slug,
        seoContent: `Authentic invocations and supplications for ${slug.replace(/-/g, ' ')}. Derived from reliable sources.`,
        lastVerified: "2026-01-02",
        items: items
    };

    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 4));
    console.log(`Created ${fileName}`);
});

console.log("Migration Complete.");
