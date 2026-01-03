const fs = require('fs');
const path = require('path');

// 1. The User's Wishlist
const wishlist = `
أذكار النوم
أذكار الاستيقاظ من النوم
دعاء دخول الخلاء
دعاء الخروج من الخلاء
الذكر قبل الوضوء
الذكر بعد الفراغ من الوضوء
الذكر عند الخروج من المنزل
الذكر عند دخول المنزل
دعاء الذهاب إلى المسجد
دعاء دخول المسجد
دعاء الخروج من المسجد
أذكار الآذان
دعاء ُلبْس الثوب
دعاء ُلبْس الثوب الجديد
الدعاء لمن لبس ثوبا جديدا
ما يقول إذا وضع ثوبه
دعاء الاستفتاح
دعاء الركوع
دعاء الرفع من الركوع
دعاء السجود
دعاء الجلسة بين السجدتين
دعاء سجود التلاوة
التشهد
الصلاة على النبي بعد التشهد
الدعاء بعد التشهد الأخير قبل السلام
الأذكار بعد السلام من الصلاة
دعاء صلاة الاستخارة
الدعاء إذا تقلب ليلا
دعاء الفزع في النوم و من بُلِيَ بالوحشة
ما يفعل من رأى الرؤيا أو الحلم
دعاء قنوت الوتر
الذكر عقب السلام من الوتر
دعاء الهم والحزن
دعاء الكرب
دعاء لقاء العدو و ذي السلطان
دعاء من خاف ظلم السلطان
الدعاء على العدو
ما يقول من خاف قوما
دعاء من أصابه وسوسة في الإيمان
دعاء قضاء الدين
دعاء الوسوسة في الصلاة و القراءة
دعاء من استصعب عليه أمر
ما يقول ويفعل من أذنب ذنبا
دعاء طرد الشيطان و وساوسه
الدعاء حينما يقع ما لا يرضاه أو ُ غلب على أمره
ﺗﻬنئة المولود له وجوابه
ما يعوذ به الأولاد
الدعاء للمريض في عيادته
فضل عيادة المريض
دعاء المريض الذي يئس من حياته
تلقين المحتضر
دعاء من أصيب بمصيبة
الدعاء عند إغماض الميت
الدعاء للميت في الصلاة عليه
الدعاء للفرط في الصلاة عليه
دعاء التعزية
الدعاء عند إدخال الميت القبر
الدعاء بعد دفن الميت
دعاء زيارة القبور
دعاء الريح
دعاء الرعد
من أدعية الاستسقاء
الدعاء إذا نزل المطر
الذكر بعد نزول المطر
من أدعية الاستصحاء
دعاء رؤية الهلال
الدعاء عند إفطار الصائم
الدعاء قبل الطعام
الدعاء عند الفراغ من الطعام
دعاء الضيف لصاحب الطعام
التعريض بالدعاء لطلب الطعام أو الشراب
الدعاء إذا أفطر عند أهل بيت
دعاء الصائم إذا حضر الطعام ولم يفطر
ما يقول الصائم إذا سابه أحد
الدعاء عند رؤية باكورة الثمر
دعاء العطاس
ما يقال للكافر إذا عطس فحمد الله
الدعاء للمتزوج
دعاء المتزوج و شراء الدابة
الدعاء قبل إتيان الزوجة
دعاء الغضب
دعاء من رأى مبتلى
ما يقال في اﻟﻤﺠلس
كفارة اﻟﻤﺠلس
الدعاء لمن قال غفر الله لك
الدعاء لمن صنع إليك معروفا
ما يعصم الله به من الدجال
الدعاء لمن قال إني أحبك في الله
الدعاء لمن عرض عليك ماله
الدعاء لمن أقرض عند القضاء
دعاء الخوف من الشرك
الدعاء لمن قال بارك الله فيك
دعاء كراهية الطيرة
دعاء الركوب
دعاء السفر
دعاء دخول القرية أو البلدة
دعاء دخول السوق
الدعاء إذا تعس المركوب
دعاء المسافر للمقيم
دعاء المقيم للمسافر
التكبير و التسبيح في سير السفر
دعاء المسافر إذا أسحر
الدعاء إذا نزل مترلا في سفر أو غيره
ذكر الرجوع من السفر
ما يقول من أتاه أمر يسره أو يكرهه
فضل الصلاة على النبي صلى الله عليه و سلم
إفشاء السلام
كيف يرد السلام على الكافر إذا سلم
الدُّعاءُ عِنْدَ سَمَاعِ صِياحِ الدِّيكِ ونَهِيقِ الْحِمَارِ
دعاء نباح الكلاب بالليل
الدعاء لمن سببته
ما يقول المسلم إذا مدح المسلم
ما يقول المسلم إذا زكي
كيف يلبي المحرم في الحج أو العمرة ؟
التكبير إذا أتى الركن الأسود
الدعاء بين الركن اليماني والحجر الأسود
دعاء الوقوف على الصفا والمروة
الدعاء يوم عرفة
الذكر عند المشعر الحرام
التكبير عند رمي الجمار مع كل حصاة
دعاء التعجب والأمر السار
ما يفعل من أتاه أمر يسره
ما يقول من أحس وجعا في جسده
دعاء من خشي أن يصيب شيئا بعينه
ما يقال عند الفزع
ما يقول عند الذبح أو النحر
ما يقول لرد كيد مردة الشياطين
الاستغفار و التوبة
فضل التسبيح و التحميد، و التهليل، و التكبير
كيف كان النبي يسبح؟
من أنواع الخير والآداب الجامعة
`;

const itemsToCheck = wishlist.trim().split('\n').map(l => l.trim()).filter(Boolean);

// 2. Data Sources
const sourcePath = path.join(__dirname, '../temp_adhkar_source.json');
const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const sourceCategories = new Set(sourceData.map(c => c.category)); // Arabic source categories

// 3. Current Migrated Files
// We need to know which ARABIC categories have been migrated.
// We can check the `scripts/migrate.js` map to reverse engineer this, or strict checks.
const map = {
    "أذكار الصباح والمساء": "morning-evening-adhkar",
    "أذكار النوم": "sleeping-adhkar",
    "دعاء السفر": "travel-dua",
    "أذكار الاستيقاظ من النوم": "waking-up-adhkar",
    "دعاء دخول المسجد": "entering-mosque-dua",
    // "الأذكار بعد السلام من الصلاة": "after-prayer-adhkar", // Deleted but counts as 'handled' technically if we just check source availability
    "دعاء صلاة الاستخارة": "istikhara-dua",
    "دعاء الهم والحزن": "anxiety-and-sorrow-dua",
    "دعاء قضاء الدين": "debt-relief-dua"
};
const migratedArabic = new Set(Object.keys(map));

// 4. Analysis
let migrated = [];
let availableNotMigrated = [];
let missing = [];

itemsToCheck.forEach(item => {
    if (migratedArabic.has(item)) {
        migrated.push(item);
    } else if (sourceCategories.has(item)) {
        availableNotMigrated.push(item);
    } else {
        // Need to fuzzy match or check if strict check failed due to invisible chars
        // Attempt clean
        const cleanedItem = item.replace(/[^\w\s\u0600-\u06FF]/g, ""); // Remove stray formatting
        // Check again
        let found = false;
        for (let src of sourceCategories) {
            if (src.includes(item) || item.includes(src)) {
                availableNotMigrated.push(item + " (Partial Match: " + src + ")");
                found = true;
                break;
            }
        }
        if (!found) missing.push(item);
    }
});

console.log(`TOTAL REQUESTED: ${itemsToCheck.length}`);
console.log(`\nALREADY MIGRATED (${migrated.length}):`);
console.log(migrated.join('\n'));

console.log(`\nAVAILABLE IN SOURCE BUT NOT MIGRATED (${availableNotMigrated.length}):`);
console.log(availableNotMigrated.join('\n'));

console.log(`\nMISSING FROM SOURCE (${missing.length}):`);
console.log(missing.join('\n'));
