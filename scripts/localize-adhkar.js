const fs = require('fs');
const path = require('path');

const ADHKAR_DIR = path.join(__dirname, '../src/data/adhkar-items');
const TRANSLATIONS_PATH = path.join(__dirname, '../src/lib/translations.json');

const translations = JSON.parse(fs.readFileSync(TRANSLATIONS_PATH, 'utf8'));
const categoryTitles = translations.ar.category_titles;

const WORD_MAP = {
    'Morning': 'الصباح',
    'Evening': 'المساء',
    'Sleep': 'النوم',
    'Sleeping': 'النوم',
    'Waking': 'الاستيقاظ',
    'Prayer': 'الصلاة',
    'Salah': 'الصلاة',
    'Dua': 'دعاء',
    'Supplication': 'دعاء',
    'Dhikr': 'ذكر',
    'Adhkar': 'أذكار',
    'Travel': 'السفر',
    'Mosque': 'المسجد',
    'Home': 'المنزل',
    'House': 'المنزل',
    'Toilet': 'الخلاء',
    'Restroom': 'الخلاء',
    'Wudu': 'الوضوء',
    'Arafah': 'عرفة',
    'Haj': 'الحج',
    'Hajj': 'الحج',
    'Umrah': 'العمرة',
    'Quran': 'القرآن',
    'Azan': 'الأذان',
    'Adhan': 'الأذان',
    'Food': 'الطعام',
    'Eat': 'الأكل',
    'Eating': 'الأكل',
    'Drink': 'الشراب',
    'Drinking': 'الشراب',
    'Clothes': 'الملابس',
    'Dressing': 'لبس الثوب',
    'Undressing': 'خلع الثوب',
    'Rain': 'المطر',
    'Wind': 'الرياح',
    'Thunder': 'الرعد',
    'Crescent': 'الهلال',
    'Moon': 'القمر',
    'Graves': 'القبور',
    'Funeral': 'الجنازة',
    'Sick': 'المريض',
    'Illness': 'المرض',
    'Sneeze': 'العطاس',
    'Sneezing': 'العطاس',
    'Marriage': 'الزواج',
    'Married': 'المتزوج',
    'Baby': 'المولود',
    'Congratulation': 'التهنئة',
    'Debt': 'الدين',
    'Anxiety': 'الهم',
    'Sorrow': 'الحزن',
    'Distress': 'الكرب',
    'Anger': 'الغضب',
    'Enemy': 'العدو',
    'Market': 'السوق',
    'Vehicle': 'الركوب',
    'Riding': 'الركوب',
    'Fasting': 'الصيام',
    'Breaking': 'الإفطار',
    'Sujood': 'السجود',
    'Ruku': 'الركوع',
    'Tashahhud': 'التشهد',
    'Istikhara': 'الاستخارة',
    'Qunut': 'القنوت',
    'Witr': 'الوتر',
    'Gathering': 'المجلس',
    'Repentance': 'التوبة',
    'Istighfar': 'الاستغفار',
    'Protection': 'التحصين',
    'Evil Eye': 'العين',
    'Devil': 'الشيطان',
    'Satan': 'الشيطان',
    'Ramadan': 'رمضان',
    'Laylatul Qadr': 'ليلة القدر',
    'Friday': 'الجمعة',
    'Entering': 'دخول',
    'Exiting': 'خروج',
    'Leaving': 'خروج',
    'Before': 'قبل',
    'After': 'بعد',
    'When': 'عند',
    'During': 'أثناء',
    'For': 'لـ',
    'Of': 'ـ',
    'The': 'الـ'
};

function translateTitle(englishTitle) {
    // 1. Check direct category mapping first (slug based usually)
    // But here we rely on text analysis + common phrases

    // Simple heuristic: specific phrases
    if (englishTitle.includes('Morning Adhkar')) return 'أذكار الصباح';
    if (englishTitle.includes('Evening Adhkar')) return 'أذكار المساء';
    if (englishTitle.includes('After Prayer')) return 'أذكار بعد الصلاة';
    if (englishTitle.includes('Before Sleep')) return 'أذكار النوم';
    if (englishTitle.includes('Waking Up')) return 'أذكار الاستيقاظ';

    // Word-by-word substitution attempt (very naive but better than English)
    // We try to find keywords and reconstruct.
    // Arabic structure is usually "Dua [Topic]" e.g. "Dua for Rain" -> "دعاء المطر"

    let isDua = englishTitle.toLowerCase().includes('dua') || englishTitle.toLowerCase().includes('supplication');
    let isDhikr = englishTitle.toLowerCase().includes('dhikr') || englishTitle.toLowerCase().includes('adhkar');
    let prefix = isDua ? 'دعاء' : (isDhikr ? 'ذكر' : '');

    // Common patterns
    if (englishTitle.toLowerCase().includes('entering')) {
        let target = detectTarget(englishTitle, ['Mosque', 'Home', 'Toilet', 'Market', 'Town']);
        if (target) return `دعاء دخول ${target}`;
    }
    if (englishTitle.toLowerCase().includes('exiting') || englishTitle.toLowerCase().includes('leaving')) {
        let target = detectTarget(englishTitle, ['Mosque', 'Home', 'Toilet']);
        if (target) return `دعاء الخروج من ${target}`;
    }

    // Look for any mapped keyword
    for (let [en, ar] of Object.entries(WORD_MAP)) {
        if (englishTitle.includes(en) && en !== 'Dua' && en !== 'Dhikr') {
            // Found a topic.
            return prefix ? `${prefix} ${ar}` : ar;
        }
    }

    return prefix ? `${prefix} ${englishTitle}` : englishTitle;
}

function detectTarget(title, candidates) {
    for (let c of candidates) {
        if (title.includes(c)) return WORD_MAP[c];
    }
    return null;
}

// Additional manual overrides for specific difficult files
const MANUAL_OVERRIDES = {
    'ayatul-kursi': 'آية الكرسي',
    'surah-ikhlas': 'سورة الإخلاص',
    'surah-falaq': 'سورة الفلق',
    'surah-nas': 'سورة الناس',
    'surah-fatiha': 'سورة الفاتحة',
    'surah-mulk': 'سورة الملك',
    'surah-sajdah': 'سورة السجدة',
    'surah-waqiah': 'سورة الواقعة',
    'surah-yasin': 'سورة يس',
    'surah-kahf': 'سورة الكهف'
};

const files = fs.readdirSync(ADHKAR_DIR);

files.forEach(file => {
    if (!file.endsWith('.json')) return;

    const filePath = path.join(ADHKAR_DIR, file);
    try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let modified = false;
        const slug = file.replace('.json', '');

        // 1. Top Level Title
        if (!content.title_ar) {
            // Check translation.json keys mostly snake_case
            const transKey = slug.replaceAll('-', '_');
            if (categoryTitles[transKey]) {
                content.title_ar = categoryTitles[transKey];
            } else {
                content.title_ar = translateTitle(content.title);
            }
            // Fallback description
            if (content.title_ar && !content.description_ar) {
                content.description_ar = `من الأذكار والأدعية الصحيحة: ${content.title_ar}`;
            }
            modified = true;
        }

        // 2. Items
        if (content.items && Array.isArray(content.items)) {
            content.items.forEach(item => {
                if (!item.title_ar) {
                    if (MANUAL_OVERRIDES[item.slug]) {
                        item.title_ar = MANUAL_OVERRIDES[item.slug];
                        modified = true;
                    } else if (item.source && item.source.collection === 'Quran') {
                        // Keep English or try simple mapping?
                        // Quran usually has Surah names.
                        if (item.title.includes('Surah')) {
                            // Try to map surah name?
                            let surahName = item.title.replace('Surah ', '');
                            // Maybe just leave it for now or generic
                        }
                    }
                    // If we didn't set it, the UI falls back to English title or "title_ar" (if we want to force generic?)
                    // The UI logic is: {language === 'ar' ? (adhkar.title_ar || adhkar.title) : adhkar.title}
                    // We can just leave it undefined if we can't translate it, 
                    // BUT the user said "Use... fallback Arabic translation". 
                    // So let's try to infer from title same as main title.
                    if (!item.title_ar) {
                        const inferred = translateTitle(item.title);
                        if (inferred !== item.title) {
                            item.title_ar = inferred;
                            modified = true;
                        }
                    }
                }
            });
        }

        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(content, null, 4));
            console.log(`Updated ${file}`);
        }
    } catch (e) {
        console.error(`Error processing ${file}:`, e);
    }
});
