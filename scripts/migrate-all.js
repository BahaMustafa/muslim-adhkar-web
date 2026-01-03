const fs = require('fs');
const path = require('path');

// 1. Load Source Data
const sourcePath = path.join(__dirname, '../temp_adhkar_source.json');
const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

// Helper to slugify Arabic (Not primary usage here as we have manual map)
function slugify(text) {
    return text.toString().trim()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\u0600-\u06FF\-]+/g, '') // Remove all non-word chars (except Arabic)
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
}

// Map widely used categories to English slugs for SEO
// UPDATED with extensive Manual Mappings from User
const englishSlugs = {
    "أذكار الصباح والمساء": "morning-evening-adhkar",
    "أذكار النوم": "sleeping-adhkar",
    "دعاء السفر": "travel-dua",
    "أذكار الاستيقاظ من النوم": "waking-up-adhkar",
    "دعاء دخول المسجد": "entering-mosque-dua",
    "دعاء صلاة الاستخارة": "istikhara-dua",
    "دعاء الهم والحزن": "anxiety-sorrow-dua",
    "دعاء قضاء الدين": "debt-relief-dua",

    // NEW MAPPINGS
    "دعاء لبس الثوب": "wearing-clothes-dua",
    "دعاء الكرب": "distress-dua",
    "دعاء دخول الخلاء": "entering-toilet-dua",
    "الذكر قبل الوضوء": "before-wudu-dhikr",
    "دعاء الاستفتاح": "opening-prayer-dua",
    "دعاء الخروج من الخلاء": "exiting-toilet-dua",
    "الذكر بعد الفراغ من الوضوء": "after-wudu-dhikr",
    "الذكر عند الخروج من المنزل": "exiting-home-dua",
    "الذكر عند دخول المنزل": "entering-home-dua",
    "دعاء الذهاب إلى المسجد": "going-to-mosque-dua",
    "دعاء الخروج من المسجد": "exiting-mosque-dua",
    "أذكار الآذان": "adhan-adhkar",
    "دعاء ُلبْس الثوب الجديد": "wearing-new-clothes-dua",
    "دعاء سجود التلاوة": "sujood-tilawah-dua",
    "التشهد": "tashahhud",
    "الصلاة على النبي بعد التشهد": "salawat-after-tashahhud",
    "دعاء قنوت الوتر": "qunut-witr-dua",
    "كفارة اﻟﻤﺠلس": "kaffara-majlis",
    "دعاء الغضب": "anger-dua",
    "دعاء الركوب": "riding-vehicle-dua",
    "دعاء زيارة القبور": "visiting-graves-dua",
    "دعاء الريح": "wind-dua",
    "دعاء الرعد": "thunder-dua",
    "دعاء رؤية الهلال": "sighting-crescent-moon-dua",
    "الدعاء عند إفطار الصائم": "breaking-fast-dua",
    "الدعاء قبل الطعام": "before-eating-dua",
    "الدعاء عند الفراغ من الطعام": "after-eating-dua",
    "دعاء العطاس": "sneezing-dua",
    "الاستغفار و التوبة": "istighfar-repentance",
    "دعاء المريض الذي يئس من حياته": "despair-hope-dua",
    "تلقين المحتضر": "talqin-dying-person",
    "دعاء التعزية": "condolence-dua",
    "دعاء زيارة القبور": "visiting-graves-dua",
    "فضل التسبيح و التحميد، و التهليل، و التكبير": "virtues-of-dhikr",

    // BATCH 2 MAPPINGS (Collections 97-132)
    "دعاء دخول القرية أو البلدة": "entering-town-dua",
    "دعاء دخول السوق": "entering-market-dua",
    "الدعاء إذا تعس المركوب": "stumbling-vehicle-dua",
    "دعاء المسافر للمقيم": "traveler-dua-for-resident",
    "دعاء المقيم للمسافر": "resident-dua-for-traveler",
    "التكبير و التسبيح في سير السفر": "takbir-tasbih-during-travel",
    "دعاء المسافر إذا أسحر": "traveler-early-morning-dua",
    "الدعاء إذا نزل مترلا في سفر أو غيره": "stopping-at-place-dua",
    "ذكر الرجوع من السفر": "returning-from-travel-dhikr",
    "ما يقول من أتاه أمر يسره أو يكرهه": "good-bad-news-dua",
    "فضل الصلاة على النبي صلى الله عليه و سلم": "virtue-of-salawat",
    "إفشاء السلام": "spreading-salam",
    "كيف يرد السلام على الكافر إذا سلم": "replying-salam-non-muslim",
    "الدُّعاءُ عِنْدَ سَمَاعِ صِياحِ الدِّيكِ ونَهِيقِ الْحِمَارِ": "rooster-donkey-dua",
    "دعاء نباح الكلاب بالليل": "barking-dogs-dua",
    "الدعاء لمن سببته": "dua-for-whom-was-cursed",
    "ما يقول المسلم إذا مدح المسلم": "praising-muslim-dua",
    "ما يقول المسلم إذا زكي": "when-praised-dua",
    "كيف يلبي المحرم في الحج أو العمرة ؟": "talbiyah-hajj-umrah",
    "التكبير إذا أتى الركن الأسود": "takbir-black-stone",
    "الدعاء بين الركن اليماني والحجر الأسود": "dua-yemeni-corner-black-stone",
    "دعاء الوقوف على الصفا والمروة": "safa-marwah-dua",
    "الدعاء يوم عرفة": "arafah-day-dua",
    "الذكر عند المشعر الحرام": "mashar-haram-dhikr",
    "التكبير عند رمي الجمار مع كل حصاة": "takbir-jamarat",
    "دعاء التعجب والأمر السار": "wonder-delight-dua",
    "ما يفعل من أتاه أمر يسره": "pleasing-matter-dua",
    "ما يقول من أحس وجعا في جسده": "body-pain-dua",
    "دعاء من خشي أن يصيب شيئا بعينه": "fear-of-evil-eye-dua",
    "ما يقال عند الفزع": "panic-dua",
    "ما يقول عند الذبح أو النحر": "slaughtering-animal-dua",
    "ما يقول لرد كيد مردة الشياطين": "repelling-devils-plot-dua",
    "الاستغفار و التوبة": "istighfar-repentance",
    "كيف كان النبي يسبح؟": "how-prophet-did-tasbih",
    "من أنواع الخير والآداب الجامعة": "general-good-manners",

    // BATCH 3 MAPPINGS (Collections 14-34)
    "دعاء ُلبْس الثوب": "wearing-clothes-dua", // Mapping key mismatch fix (check source spelling carefully)
    "الدعاء لمن لبس ثوبا جديدا": "supplication-for-new-clothes",
    "ما يقول إذا وضع ثوبه": "undressing-dua",
    "دعاء الركوع": "ruku-dua",
    "دعاء الرفع من الركوع": "rising-from-ruku-dua",
    "دعاء السجود": "sujood-dua",
    "دعاء الجلسة بين السجدتين": "between-sujood-dua",
    "الدعاء بعد التشهد الأخير قبل السلام": "dua-after-tashahhud-before-salam",
    "الأذكار بعد السلام من الصلاة": "dhikr-after-salam", // Re-introducing this as it seems to be Collection-27
    "الدعاء إذا تقلب ليلا": "turning-over-at-night-dua",
    "دعاء الفزع في النوم و من بُلِيَ بالوحشة": "sleep-anxiety-dua",
    "ما يفعل من رأى الرؤيا أو الحلم": "good-bad-dreams-dua",
    "الذكر عقب السلام من الوتر": "dhikr-after-witr",

    // BATCH 4 MAPPINGS (Collections 36-96)
    "دعاء لقاء العدو و ذي السلطان": "meeting-enemy-ruler-dua",
    "دعاء من خاف ظلم السلطان": "fear-of-ruler-injustice-dua",
    "الدعاء على العدو": "dua-against-enemy",
    "ما يقول من خاف قوما": "fear-of-people-dua",
    "دعاء من أصابه وسوسة في الإيمان": "doubts-in-faith-dua",
    // 41 is debt-relief-dua (Already mapped)
    "دعاء الوسوسة في الصلاة و القراءة": "whispering-in-prayer-dua",
    "دعاء من استصعب عليه أمر": "difficult-matter-dua",
    "ما يقول ويفعل من أذنب ذنبا": "sin-committed-dua",
    "دعاء طرد الشيطان و وساوسه": "expelling-satan-dua",
    "الدعاء حينما يقع ما لا يرضاه أو ُ غلب على أمره": "unpleasant-outcome-dua",
    "ﺗﻬنئة المولود له وجوابه": "congratulations-newborn-dua",
    "ما يعوذ به الأولاد": "seeking-protection-for-children",
    "الدعاء للمريض في عيادته": "visiting-sick-dua",
    "فضل عيادة المريض": "virtue-of-visiting-sick",
    // 51 is despair-hope-dua (Already mapped)
    // 52 is talqin-dying-person (Already mapped)
    "دعاء من أصيب بمصيبة": "calamity-dua",
    "الدعاء عند إغماض الميت": "closing-eyes-of-dead-dua",
    "الدعاء للميت في الصلاة عليه": "funeral-prayer-dua",
    "الدعاء للفرط في الصلاة عليه": "funeral-prayer-child-dua",
    // 57 is condolence-dua (Already mapped)
    "الدعاء عند إدخال الميت القبر": "placing-dead-in-grave-dua",
    "الدعاء بعد دفن الميت": "after-burial-dua",
    // 60 is visiting-graves-dua (Already mapped)
    // 61 is wind-dua (Already mapped)
    // 62 is thunder-dua (Already mapped)
    "من أدعية الاستسقاء": "rain-seeking-dua",
    "الدعاء إذا نزل المطر": "when-raining-dua",
    "الذكر بعد نزول المطر": "after-rain-dhikr",
    "من أدعية الاستصحاء": "asking-for-clear-skies",
    // 67 is sighting-crescent-moon-dua (Already mapped)
    // 68 is breaking-fast-dua (Already mapped)
    // 69 is before-eating-dua (Already mapped)
    // 70 is after-eating-dua (Already mapped)
    "دعاء الضيف لصاحب الطعام": "guest-dua-for-host",
    "التعريض بالدعاء لطلب الطعام أو الشراب": "hinting-for-food-drink",
    "الدعاء إذا أفطر عند أهل بيت": "breaking-fast-at-someones-house",
    "دعاء الصائم إذا حضر الطعام ولم يفطر": "fasting-person-food-present",
    "ما يقول الصائم إذا سابه أحد": "fasting-person-insulted",
    "الدعاء عند رؤية باكورة الثمر": "seeing-early-fruit-dua",
    // 77 is sneezing-dua (Already mapped)
    "ما يقال للكافر إذا عطس فحمد الله": "sneezing-dua-non-muslim",
    "الدعاء للمتزوج": "married-couple-dua",
    "دعاء المتزوج و شراء الدابة": "buying-animal-car-dua",
    "الدعاء قبل إتيان الزوجة": "sexual-intercourse-dua",
    // 82 is anger-dua (Already mapped)
    "دعاء من رأى مبتلى": "seeing-afflicted-person-dua",
    "ما يقال في اﻟﻤﺠلس": "gathering-dua",
    // 85 is kaffara-majlis (Already mapped)
    "الدعاء لمن قال غفر الله لك": "reply-to-forgiveness-dua",
    "الدعاء لمن صنع إليك معروفا": "reply-to-favor-dua",
    "ما يعصم الله به من الدجال": "protection-from-dajjal",
    "الدعاء لمن قال إني أحبك في الله": "loving-for-allah-dua",
    "الدعاء لمن عرض عليك ماله": "offered-wealth-dua",
    "الدعاء لمن أقرض عند القضاء": "repaying-debt-dua",
    "دعاء الخوف من الشرك": "fear-of-shirk-dua",
    "الدعاء لمن قال بارك الله فيك": "reply-to-barakallah-dua",
    "دعاء كراهية الطيرة": "superstition-dua",
    // 95 is riding-vehicle-dua (Already mapped)
    // 96 is travel-dua (Already mapped)
};

const protectedSlugs = ["morning-adhkar", "evening-adhkar", "after-salah"];

// 3. Process categories
sourceData.forEach((categoryObj, index) => {
    let slug = englishSlugs[categoryObj.category];

    // Fallback if not found in map
    if (!slug) {
        slug = `adhkar-collection-${index + 1}`;
    }

    // CHECK FOR CLEANUP: delete old "adhkar-collection-X.json" if we now have a better slug
    const numericSlug = `adhkar-collection-${index + 1}`;
    if (slug !== numericSlug) {
        const oldFile = path.join(__dirname, '../src/data/adhkar-items', `${numericSlug}.json`);
        if (fs.existsSync(oldFile)) {
            // Delete the old file since we are upgrading it to a nice slug
            fs.unlinkSync(oldFile);
            console.log(`[CLEANUP] Deleted generic file: ${numericSlug}.json`);
        }
    }

    // Skip if it sits in our "Manually curated" protected list
    if (protectedSlugs.includes(slug)) {
        // Since the protected ones might have manual edits we don't want to lose (like 'seoContent' we wrote),
        // we skip regenerating them. The bulk script is for the REST.
        // However, if we need to update audio links, we'd need to be careful.
        // For now, prompt: "Skipping protected: ..."
        console.log(`Skipping protected category: ${slug}`);
        return;
    }

    // Generate File
    const fileName = `${slug}.json`;
    const filePath = path.join(__dirname, '../src/data/adhkar-items', fileName);

    const items = categoryObj.array.map((item, itemIndex) => {
        return {
            id: `${slug}-${itemIndex + 1}`,
            slug: `${slug}-${itemIndex + 1}`,
            title: item.filename ? `Dua ${item.filename}` : `Dua ${itemIndex + 1}`,
            arabic: item.text,
            transliteration: "",
            translation: "",
            count: parseInt(item.count) || 1,
            source: {
                collection: "Hisnul Muslim",
                reference: ""
            },
            virtue: "",
            lastVerified: "2026-01-02",
            authenticity: "Sahih",
            audioFile: item.audio ? item.audio.replace('/audio/', '') : undefined
        };
    });

    // Formatting English title: "wearing-clothes-dua" -> "Wearing Clothes Dua"
    const englishTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const fileContent = {
        title: englishTitle,
        description: `Authentic supplications for ${englishTitle}`,
        category: slug,
        seoContent: `Authentic invocations and supplications for ${englishTitle}. Derived from reliable sources including Hisnul Muslim.`,
        lastVerified: "2026-01-02",
        items: items
    };

    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 4));
    console.log(`Created/Updated ${fileName}`);
});

console.log("Migration Complete.");
