import { Adhkar } from './types';

export const allAdhkar: Adhkar[] = [
    {
        id: "ayatul-kursi",
        slug: "ayatul-kursi",
        title: "Ayatul Kursi",
        arabic: "اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ وَلاَ يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        transliteration: "Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum, la ta'khudhuhu sinatun wala nawm, lahu ma fis-samawati wa ma fil-ard, man dhalladhi yashfa'u 'indahu illa bi-idhnihi, ya'lamu ma bayna aydihim wa ma khalfahum, wala yuhituna bishai'in min 'ilmihi illa bima sha'a, wasi'a kursiyyuhus-samawati wal-ard, wala ya'uduhu hifzuhuma, wa Huwal-'Aliyyul-'Azim.",
        translation: "Allah! There is no god but He - the Living, The Self-subsisting, Eternal. No slumber can seize Him nor Sleep. His are all things in the heavens and on earth. Who is there can intercede in His presence except as he permitteth? He knoweth what (appeareth to His creatures As) Before or After or Behind them. Nor shall they compass Aught of his knowledge Except as He willeth. His throne doth extend over the heavens and on earth, and He feeleth no fatigue in guarding and preserving them, For He is the Most High, The Supreme (in glory).",
        source: {
            collection: "Quran",
            reference: "2:255"
        },
        virtue: "Whoever recites this when he wakes up will be protected from jinns until he goes to sleep, and whoever recites it when he goes to sleep will be protected from them until he wakes up.",
        count: 1
    },
    {
        id: "surah-ikhlas",
        slug: "surah-ikhlas",
        title: "Surah Al-Ikhlas",
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        transliteration: "Qul Huwallahu Ahad, Allahus-Samad, Lam yalid wa lam yulad, Wa lam yakun lahu kufuwan ahad.",
        translation: "Say: He is Allah, the One and Only; Allah, the Eternal, Absolute; He begetteth not, nor is He begotten; And there is none like unto Him.",
        source: {
            collection: "Quran",
            reference: "Surah 112"
        },
        virtue: "Reciting Surah Al-Ikhlas, Al-Falaq, and An-Nas three times in the morning and evening will suffice you for everything.",
        count: 3
    },
    {
        id: "surah-falaq",
        slug: "surah-falaq",
        title: "Surah Al-Falaq",
        arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِن شَرِّ مَا خَلَقَ، وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        transliteration: "Qul a'udhu bi-rabbil-falaq, min sharri ma khalaq, wa min sharri ghasiqin idha waqab, wa min sharrin-naffathati fil-'uqad, wa min sharri hasidin idha hasad.",
        translation: "Say: I seek refuge with the Lord of the Dawn, From the mischief of created things; From the mischief of Darkness as it overspreads; From the mischief of those who practise Secret Arts; And from the mischief of the envious one as he practises envy.",
        source: {
            collection: "Quran",
            reference: "Surah 113"
        },
        virtue: "Reciting Surah Al-Ikhlas, Al-Falaq, and An-Nas three times in the morning and evening will suffice you for everything.",
        count: 3
    }
];

export const collectionsData: Record<string, { title: string; description: string }> = {
    "quran": {
        title: "The Holy Quran",
        description: "The central religious text of Islam, believed by Muslims to be a revelation from Allah."
    },
    "hisnul-muslim": {
        title: "Hisnul Muslim",
        description: "Fortress of the Muslim, a collection of authentic Dua and Adhkar from the Quran and Sunnah."
    },
    "bukhari": {
        title: "Sahih al-Bukhari",
        description: "One of the Kutub al-Sittah (six major hadith collections) of Sunni Islam. These Hadith traditions are collected by Imam Bukhari."
    }
    // Add more mock data for testing if needed
};

// Map adhkar IDs to categories
export const categoryMap: Record<string, string[]> = {
    "protection": ["ayatul-kursi", "surah-falaq", "surah-ikhlas"],
    "morning": ["ayatul-kursi", "surah-ikhlas", "surah-falaq"],
    "evening": ["ayatul-kursi", "surah-ikhlas", "surah-falaq"] // Reusing for now
};
