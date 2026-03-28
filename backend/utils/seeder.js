require('dotenv').config();
const mongoose = require('mongoose');
const Series = require('../models/Series');
const User = require('../models/User');

const sampleSeries = [
  {
    title: "Crash Landing on You",
    titleKorean: "사랑의 불시착",
    description: "A South Korean heiress accidentally paraglides into North Korea and falls in love with a North Korean army officer who decides to help and protect her.",
    descriptionTranslations: {
      en: "A South Korean heiress accidentally paraglides into North Korea and falls in love with a North Korean army officer.",
      ta: "தென் கொரிய வாரிசு தவறுதலாக வட கொரியாவில் தரையிறங்கி, வட கொரிய இராணுவ அதிகாரியை காதலிக்கிறாள்.",
      ml: "ഒരു ദക്ഷിണ കൊറിയൻ അനന്തരവകാശി അബദ്ധത്തിൽ വടക്കൻ കൊറിയയിൽ ഇറങ്ങുകയും ഒരു ഉദ്യോഗസ്ഥനെ പ്രണയിക്കുകയും ചെയ്യുന്നു.",
      ko: "대한민국 재벌 상속녀가 패러글라이딩 사고로 북한에 불시착하면서 북한 장교와 사랑에 빠지게 되는 이야기."
    },
    titleTranslations: { en: "Crash Landing on You", ta: "உன்னிடம் தவறாக இறங்குதல்", ml: "ക്രാഷ് ലാൻഡിംഗ് ഓൺ യൂ", ko: "사랑의 불시착" },
    genres: ["Romance", "Drama", "Comedy"],
    year: 2019, rating: 9.2, totalRatings: 125000, episodes: 16, status: "completed", network: "tvN",
    cast: [
      { name: "Hyun Bin", character: "Ri Jeong-hyeok", photo: "" },
      { name: "Son Ye-jin", character: "Yoon Se-ri", photo: "" }
    ],
    director: "Lee Jung-hyo", writer: "Park Ji-eun",
    poster: "https://image.tmdb.org/t/p/w500/jIhea8ZSzNQCPdHhikhlfMqjhJb.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/m2rYfBkYiAiqp3WWJUMgWIPkK6Y.jpg",
    trailers: [
      { language: "en", url: "https://www.youtube.com/watch?v=6MXoTxCMCdA", youtubeId: "6MXoTxCMCdA", title: "Official Trailer" },
      { language: "ko", url: "https://www.youtube.com/watch?v=v6TnoVx6hFM", youtubeId: "v6TnoVx6hFM", title: "Korean Trailer" }
    ],
    tags: ["romance", "north korea", "military", "forbidden love"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: true, isFeatured: true, views: 950000, trailerViews: 1200000, favoriteCount: 88000, ageRating: "PG-13"
  },
  {
    title: "Goblin", titleKorean: "도깨비",
    description: "A goblin who has lived for 900 years needs a human bride to end his immortal life, but his task is not as simple as he thought.",
    descriptionTranslations: {
      en: "A goblin who has lived for 900 years needs a human bride to end his immortal life.",
      ta: "900 ஆண்டுகளாக வாழும் கோப்லின் தனது அமர வாழ்வை முடிக்க மனித மணமகள் தேடுகிறான்.",
      ml: "900 വർഷമായി ജീവിക്കുന്ന ഒരു ഗോബ്ലിൻ തന്റെ അമർ ജീവിതം അവസാനിപ്പിക്കാൻ ഒരു മനുഷ്യ വധുവിനെ ആവശ്യമുണ്ട്.",
      ko: "저승사자와 함께 사는 900년 된 도깨비와 그의 신부가 될 운명인 소녀의 이야기."
    },
    titleTranslations: { en: "Goblin", ta: "கோப்லின்", ml: "ഗോബ്ലിൻ", ko: "도깨비" },
    genres: ["Fantasy", "Romance", "Drama"],
    year: 2016, rating: 9.1, totalRatings: 143000, episodes: 16, status: "completed", network: "tvN",
    cast: [{ name: "Gong Yoo", character: "Kim Shin", photo: "" }, { name: "Kim Go-eun", character: "Ji Eun-tak", photo: "" }],
    director: "Lee Eung-bok", writer: "Kim Eun-sook",
    poster: "https://image.tmdb.org/t/p/w500/yKbvkLBOdm0HsY7vmfwh34DPKRd.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/hXQLQgCVpWzpKBZFDMRNR1pBHU8.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=h6ksHuHzwUI", youtubeId: "h6ksHuHzwUI", title: "Official Trailer" }],
    tags: ["fantasy", "immortal", "goblin", "grim reaper"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: true, isFeatured: true, views: 870000, trailerViews: 980000, favoriteCount: 76000, ageRating: "PG-13"
  },
  {
    title: "Itaewon Class", titleKorean: "이태원 클라쓰",
    description: "An ex-convict and his diverse group of employees work together to build a successful restaurant business and seek revenge on the family that ruined their lives.",
    descriptionTranslations: {
      en: "An ex-convict builds a restaurant empire and seeks revenge against the powerful family that destroyed his life.",
      ta: "முன்னாள் கைதி மற்றும் அவரது குழு ஒரு வெற்றிகரமான உணவக வணிகத்தை கட்டியெழுப்பி பழிவாங்குகிறார்கள்.",
      ml: "ഒരു മുൻ തടവുകാരൻ ഒരു റെസ്റ്റോറന്റ് സാമ്രാജ്യം കെട്ടിപ്പടുക്കുകയും തന്റെ ജീവിതം നശിപ്പിച്ച കുടുംബത്തോട് പ്രതികാരം ചോദിക്കുകയും ചെയ്യുന്നു.",
      ko: "전과자 출신의 청년이 다양한 직원들과 함께 요식업에 도전하며 자신의 삶을 망가뜨린 재벌에 복수하는 이야기."
    },
    titleTranslations: { en: "Itaewon Class", ta: "இத்தேவான் வகுப்பு", ml: "ഇത്തേവോൺ ക്ലാസ്", ko: "이태원 클라쓰" },
    genres: ["Drama", "Romance", "Action"],
    year: 2020, rating: 8.5, totalRatings: 98000, episodes: 16, status: "completed", network: "JTBC",
    cast: [{ name: "Park Seo-joon", character: "Park Saeroyi", photo: "" }, { name: "Kim Da-mi", character: "Jo Yi-seo", photo: "" }],
    director: "Kim Sung-yoon", writer: "Jo Kwang-jin",
    poster: "https://image.tmdb.org/t/p/w500/gjwhBGHRUl4UDlNOBOklk3oEjHj.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/n13O0AWuE40dz89JObbNy3fPL4b.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=LmIKmdAVQ0Q", youtubeId: "LmIKmdAVQ0Q", title: "Official Trailer" }],
    tags: ["revenge", "restaurant", "underdog", "business"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: true, isFeatured: false, views: 720000, trailerViews: 850000, favoriteCount: 62000, ageRating: "PG-13"
  },
  {
    title: "Vincenzo", titleKorean: "빈센조",
    description: "A Korean-Italian mafia consigliere returns to Korea and gets involved with a spirited lawyer to take down a powerful, corrupt conglomerate.",
    descriptionTranslations: {
      en: "A Korean-Italian mafia lawyer returns to Korea to take down a corrupt conglomerate using unorthodox methods.",
      ta: "கொரிய-இத்தாலிய மாஃபியா வழக்கறிஞர் ஒரு ஊழல் நிறுவனத்தை அழிக்க கொரியாவுக்கு திரும்புகிறார்.",
      ml: "ഒരു കൊറിയൻ-ഇറ്റാലിയൻ മാഫിയ അഭിഭാഷകൻ ഒരു അഴിമതി കോർപ്പറേഷനെ തകർക്കാൻ കൊറിയയിലേക്ക് മടങ്ങുന്നു.",
      ko: "이탈리아 마피아 조직의 변호사 출신 한국인이 귀국 후 악덕 대기업에 맞서는 이야기."
    },
    titleTranslations: { en: "Vincenzo", ta: "வின்சென்ஸோ", ml: "വിൻസെൻസോ", ko: "빈센조" },
    genres: ["Crime", "Drama", "Comedy"],
    year: 2021, rating: 9.0, totalRatings: 112000, episodes: 20, status: "completed", network: "tvN",
    cast: [{ name: "Song Joong-ki", character: "Vincenzo Cassano", photo: "" }, { name: "Jeon Yeo-been", character: "Hong Cha-young", photo: "" }],
    director: "Kim Hee-won", writer: "Park Jae-bum",
    poster: "https://image.tmdb.org/t/p/w500/sJyMXHFCKJMZMwP0Z5lGIvQkzXc.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/dWjBFTEWOBSJABBcvMtkyb9x1Sy.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=pPJhPWk21Oc", youtubeId: "pPJhPWk21Oc", title: "Official Trailer" }],
    tags: ["mafia", "lawyer", "revenge", "comedy"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: true, isFeatured: true, views: 810000, trailerViews: 920000, favoriteCount: 71000, ageRating: "R"
  },
  {
    title: "Squid Game", titleKorean: "오징어 게임",
    description: "Hundreds of cash-strapped contestants accept an invitation to compete in children's games for a tempting prize, but the stakes are deadly.",
    descriptionTranslations: {
      en: "456 desperate people compete in deadly children's games for a prize.",
      ta: "456 பணம் தேடும் பேர் குழந்தை விளையாட்டுகளில் உயிர்கொல்லும் போட்டியில் பங்கேற்கிறார்கள்.",
      ml: "456 ആളുകൾ ഒരു വലിയ സമ്മാനത്തിനായി മാരക കളികളിൽ മത്സരിക്കുന്നു.",
      ko: "456명의 사람들이 456억 원의 상금을 놓고 목숨을 건 게임에 참가하는 이야기."
    },
    titleTranslations: { en: "Squid Game", ta: "ஸ்க்யூட் கேம்", ml: "സ്ക്വിഡ് ഗെയിം", ko: "오징어 게임" },
    genres: ["Thriller", "Drama", "Action"],
    year: 2021, rating: 8.0, totalRatings: 234000, episodes: 9, status: "completed", network: "Netflix",
    cast: [{ name: "Lee Jung-jae", character: "Seong Gi-hun", photo: "" }, { name: "Park Hae-soo", character: "Cho Sang-woo", photo: "" }],
    director: "Hwang Dong-hyuk", writer: "Hwang Dong-hyuk",
    poster: "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/oaGvjB0DvdhXhOAuADfHb261ZHa.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=oqxAJKy0ii4", youtubeId: "oqxAJKy0ii4", title: "Official Trailer" }],
    tags: ["survival game", "money", "death", "inequality"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: true, isFeatured: true, views: 1200000, trailerViews: 1500000, favoriteCount: 95000, ageRating: "R"
  },
  {
    title: "Extraordinary Attorney Woo", titleKorean: "이상한 변호사 우영우",
    description: "A brilliant attorney with autism spectrum disorder navigates the competitive world of law while building meaningful relationships.",
    descriptionTranslations: {
      en: "A young autistic attorney with a photographic memory joins a top law firm and takes on challenging cases.",
      ta: "ஆட்டிசம் உள்ள ஒரு மேதாவியான வழக்கறிஞர் சட்ட உலகில் முன்னேற போராடுகிறார்.",
      ml: "ഒരു ഓട്ടിസം ബാധിത മിടുക്കൻ അഭിഭാഷക ഒരു മുൻനിര നിയമ സ്ഥാപനത്തിൽ ചേർന്ന് കേസുകൾ ഏറ്റെടുക്കുന്നു.",
      ko: "자폐 스펙트럼 장애를 가진 천재 변호사가 대형 로펌에서 활약하는 이야기."
    },
    titleTranslations: { en: "Extraordinary Attorney Woo", ta: "அசாதாரண வழக்கறிஞர் வூ", ml: "എക്‌സ്ട്രാഓർഡിനറി അറ്റോർണി വൂ", ko: "이상한 변호사 우영우" },
    genres: ["Drama", "Comedy", "Romance"],
    year: 2022, rating: 9.0, totalRatings: 87000, episodes: 16, status: "completed", network: "ENA",
    cast: [{ name: "Park Eun-bin", character: "Woo Young-woo", photo: "" }, { name: "Kang Tae-oh", character: "Lee Jun-ho", photo: "" }],
    director: "Yoo In-sik", writer: "Moon Ji-won",
    poster: "https://image.tmdb.org/t/p/w500/qnCVN9dqLJBEFTlgFliygDZSaAD.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/6tBQiQqMeFp6rBpMaXE0HVdcRiF.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=nDnvNBjYG7g", youtubeId: "nDnvNBjYG7g", title: "Official Trailer" }],
    tags: ["autism", "lawyer", "whale", "legal drama"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: true, isFeatured: true, views: 690000, trailerViews: 790000, favoriteCount: 61000, ageRating: "PG"
  },
  {
    title: "The Glory", titleKorean: "더 글로리",
    description: "A woman who was horrifically bullied in high school plans and executes meticulous revenge against her tormentors after they've grown up.",
    descriptionTranslations: {
      en: "A woman who suffered brutal school bullying meticulously plans revenge on her tormentors decades later.",
      ta: "பள்ளியில் கொடுமையான கொடுமைப்படுத்தலை அனுபவித்த பெண் பல ஆண்டுகள் கழித்து பழிவாங்க திட்டமிடுகிறாள்.",
      ml: "സ്കൂളിൽ ക്രൂര ഉപദ്രവം അനുഭവിച്ച ഒരു സ്ത്രീ ദശകങ്ങൾക്ക് ശേഷം ആസൂത്രിതമായ പ്രതികാരം ചെയ്യുന്നു.",
      ko: "끔찍한 학교폭력을 당한 여성이 수십 년에 걸쳐 치밀하게 복수를 계획하는 이야기."
    },
    titleTranslations: { en: "The Glory", ta: "தி க்ளோரி", ml: "ദ ഗ്ലോറി", ko: "더 글로리" },
    genres: ["Thriller", "Drama", "Crime"],
    year: 2022, rating: 8.8, totalRatings: 118000, episodes: 16, status: "completed", network: "Netflix",
    cast: [{ name: "Song Hye-kyo", character: "Moon Dong-eun", photo: "" }, { name: "Lee Do-hyun", character: "Joo Yeo-jeong", photo: "" }],
    director: "Ahn Gil-ho", writer: "Kim Eun-sook",
    poster: "https://image.tmdb.org/t/p/w500/rwKyZcFUTqfGa2iGfFKPxdJ6Kna.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/rOvM0FuLvHxLnqBdGJcjOtSWfGG.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=j5KM_UYuNGU", youtubeId: "j5KM_UYuNGU", title: "Official Trailer" }],
    tags: ["bullying", "revenge", "dark", "school violence"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: true, isFeatured: true, views: 880000, trailerViews: 980000, favoriteCount: 77000, ageRating: "R"
  },
  {
    title: "Kingdom", titleKorean: "킹덤",
    description: "A Joseon crown prince investigates a mysterious plague sweeping his kingdom that turns the living into the dead.",
    descriptionTranslations: {
      en: "A crown prince fights to save his kingdom from a mysterious plague that turns people into zombies.",
      ta: "ஒரு இளவரசர் மக்களை ஜோம்பிகளாக மாற்றும் மர்ம நோய்யிலிருந்து தனது ராஜ்ஜியத்தை காப்பாற்றுகிறான்.",
      ml: "ഒരു കിരീടാവകാശി ആളുകളെ സൊംബികളാക്കുന്ന ഒരു മഹാമാരിയിൽ നിന്ന് തന്റെ രാജ്യത്തെ രക്ഷിക്കാൻ ശ്രമിക്കുന്നു.",
      ko: "조선시대 세자가 정체를 알 수 없는 역병에 맞서 백성을 지키려는 이야기."
    },
    titleTranslations: { en: "Kingdom", ta: "கிங்டம்", ml: "കിങ്ഡം", ko: "킹덤" },
    genres: ["Historical", "Thriller", "Action", "Horror"],
    year: 2019, rating: 8.4, totalRatings: 92000, episodes: 12, status: "completed", network: "Netflix",
    cast: [{ name: "Ju Ji-hoon", character: "Crown Prince Lee Chang", photo: "" }, { name: "Bae Doona", character: "Seo-bi", photo: "" }],
    director: "Kim Seong-hun", writer: "Kim Eun-hee",
    poster: "https://image.tmdb.org/t/p/w500/TnOeov4w0sTtV2gqICqIxVi74V.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/siQZoXy3DVa7RFsJ8y0m9DQVUMQ.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=hzOx49Eabww", youtubeId: "hzOx49Eabww", title: "Official Trailer" }],
    tags: ["zombie", "joseon", "political", "plague"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: true, isFeatured: true, views: 780000, trailerViews: 880000, favoriteCount: 68000, ageRating: "R"
  },
  {
    title: "My Love from the Star", titleKorean: "별에서 온 그대",
    description: "An alien who landed in Korea 400 years ago prepares to return to his home planet but falls in love with a top actress instead.",
    descriptionTranslations: {
      en: "An alien who has lived in Korea for 400 years falls in love with a famous actress just before his departure.",
      ta: "400 ஆண்டுகளுக்கு முன்பு கொரியாவில் வந்தடைந்த ஒரு விண்வெளி வாசி ஒரு பிரபல நடிகையை காதலிக்கிறான்.",
      ml: "400 വർഷം മുൻപ് കൊറിയയിൽ വന്ന ഒരു അന്യഗ്രഹ ജീവി ഒരു പ്രശസ്ത നടിയെ പ്രണയിക്കുന്നു.",
      ko: "400년 전 조선에 불시착한 외계인이 귀환을 앞두고 최고의 여배우와 사랑에 빠지는 이야기."
    },
    titleTranslations: { en: "My Love from the Star", ta: "நட்சத்திரத்திலிருந்து என் காதல்", ml: "മൈ ലവ് ഫ്രം ദ സ്റ്റാർ", ko: "별에서 온 그대" },
    genres: ["Fantasy", "Romance", "Comedy"],
    year: 2013, rating: 8.7, totalRatings: 89000, episodes: 21, status: "completed", network: "SBS",
    cast: [{ name: "Kim Soo-hyun", character: "Do Min-joon", photo: "" }, { name: "Jun Ji-hyun", character: "Cheon Song-yi", photo: "" }],
    director: "Jang Tae-yoo", writer: "Park Ji-eun",
    poster: "https://image.tmdb.org/t/p/w500/9jRJxGCJXkJ4yEoP3nxFGMnuPAC.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/rXiMqBvg5N0MkPp6d7FEzfLs9r9.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=V9oKJpQPSuo", youtubeId: "V9oKJpQPSuo", title: "Official Trailer" }],
    tags: ["alien", "time travel", "actress", "fantasy romance"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: false, isFeatured: true, views: 680000, trailerViews: 780000, favoriteCount: 59000, ageRating: "PG"
  },
  {
    title: "Descendants of the Sun", titleKorean: "태양의 후예",
    description: "A special forces officer and a doctor fall in love in the middle of a conflict zone.",
    descriptionTranslations: {
      en: "A special forces captain and a doctor develop a romance while serving in a war-torn country.",
      ta: "ஒரு சிறப்புப் படை அதிகாரியும் மருத்துவரும் ஒரு மோதல் மண்டலத்தில் காதலிக்கின்றனர்.",
      ml: "ഒരു പ്രത്യേക സേനാ ഉദ്യോഗസ്ഥനും ഡോക്ടറും ഒരു യുദ്ധ-ഗ്രസ്ത രാജ്യത്ത് പ്രണയം ഉടലെടുക്കുന്നു.",
      ko: "특전사 장교와 외과 의사가 전쟁터 같은 분쟁지역에서 사랑을 키워가는 이야기."
    },
    titleTranslations: { en: "Descendants of the Sun", ta: "சூரியனின் வழித்தோன்றல்கள்", ml: "ഡിസൻഡൻ്റ്സ് ഓഫ് ദ സൺ", ko: "태양의 후예" },
    genres: ["Romance", "Action", "Drama"],
    year: 2016, rating: 8.6, totalRatings: 104000, episodes: 16, status: "completed", network: "KBS2",
    cast: [{ name: "Song Joong-ki", character: "Yoo Si-jin", photo: "" }, { name: "Song Hye-kyo", character: "Kang Mo-yeon", photo: "" }],
    director: "Lee Eung-bok", writer: "Kim Eun-sook",
    poster: "https://image.tmdb.org/t/p/w500/2VhFoAJXkh7M9o5K5i7pUkIBxiZ.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/wMOVWxc5iAMNi6OWQC5CWm4GSBO.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=LRzqxBiMBMY", youtubeId: "LRzqxBiMBMY", title: "Official Trailer" }],
    tags: ["military", "doctor", "war", "romance"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: false, isFeatured: true, views: 750000, trailerViews: 860000, favoriteCount: 65000, ageRating: "PG-13"
  },
  {
    title: "Reply 1988", titleKorean: "응답하라 1988",
    description: "Five families living in the same alley share their lives, love, and friendship in Seoul in 1988.",
    descriptionTranslations: {
      en: "Five families in a Seoul neighborhood share life, love, and memories in 1988.",
      ta: "1988 ஆம் ஆண்டு சியோலில் ஒரே தெருவில் வாழும் ஐந்து குடும்பங்களின் கதை.",
      ml: "1988-ൽ സിയോളിലെ ഒരേ തെരുവിൽ ജീവിക്കുന്ന അഞ്ച് കുടുംബങ്ങളുടെ ജീവിതം.",
      ko: "1988년 쌍문동에 사는 다섯 가족의 이웃 이야기."
    },
    titleTranslations: { en: "Reply 1988", ta: "பதில் 1988", ml: "റിപ്ലൈ 1988", ko: "응답하라 1988" },
    genres: ["Comedy", "Drama", "Romance", "Family"],
    year: 2015, rating: 9.3, totalRatings: 78000, episodes: 20, status: "completed", network: "tvN",
    cast: [{ name: "Hyeri", character: "Sung Deok-sun", photo: "" }, { name: "Park Bo-gum", character: "Choi Taek", photo: "" }],
    director: "Shin Won-ho", writer: "Lee Woo-jung",
    poster: "https://image.tmdb.org/t/p/w500/yWfmpSXBdBbKaqPOfGsPgx6x5yS.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/4kKRBvbHzfbLiZhLPfkgqMOxf7R.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=FIGi8mAHxgQ", youtubeId: "FIGi8mAHxgQ", title: "Official Trailer" }],
    tags: ["nostalgia", "family", "neighborhood", "1988"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: false, isFeatured: false, views: 620000, trailerViews: 710000, favoriteCount: 58000, ageRating: "PG"
  },
  {
    title: "Hotel Del Luna", titleKorean: "호텔 델루나",
    description: "A posh hotel is only visible to a select few. Its CEO is a beautiful but cold woman bound to the hotel by a debt.",
    descriptionTranslations: {
      en: "A luxurious hotel that serves the dead is managed by a spirited woman trapped there for a thousand years.",
      ta: "இறந்தவர்களுக்காக இயங்கும் ஒரு ஆடம்பர ஹோட்டல் ஆயிரம் ஆண்டுகளாக சிக்கிக்கொண்ட பெண்ணால் நடத்தப்படுகிறது.",
      ml: "ആയിരം വർഷമായി കുടുങ്ങിക്കിടക്കുന്ന ഒരു സ്ത്രീ നടത്തുന്ന മൃതർക്കായുള്ള ഒരു ആഡംബര ഹോട്ടൽ.",
      ko: "천 년간 호텔에 묶인 사장과 그곳의 새 지배인이 풀어나가는 이야기."
    },
    titleTranslations: { en: "Hotel Del Luna", ta: "ஹோட்டல் டெல் லுனா", ml: "ഹോട്ടൽ ഡെൽ ലൂണ", ko: "호텔 델루나" },
    genres: ["Fantasy", "Romance", "Mystery"],
    year: 2019, rating: 8.6, totalRatings: 82000, episodes: 16, status: "completed", network: "tvN",
    cast: [{ name: "IU", character: "Jang Man-wol", photo: "" }, { name: "Yeo Jin-goo", character: "Goo Chan-sung", photo: "" }],
    director: "Oh Choong-hwan", writer: "Hong Sisters",
    poster: "https://image.tmdb.org/t/p/w500/3xE6GBrCxoYr6Pq7q0A9FsZEk15.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/wEhHlJNLRlnkr77sFJqrPJUFMZF.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=V6NLHUv2lTQ", youtubeId: "V6NLHUv2lTQ", title: "Official Trailer" }],
    tags: ["hotel", "ghost", "supernatural", "afterlife"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: false, isFeatured: true, views: 610000, trailerViews: 700000, favoriteCount: 55000, ageRating: "PG-13"
  },
  {
    title: "Business Proposal", titleKorean: "사내맞선",
    description: "A woman goes on a blind date in place of her friend but finds that her date is her CEO.",
    descriptionTranslations: {
      en: "A woman substituting for her friend on a blind date discovers her date is her company's CEO.",
      ta: "நண்பருக்கு பதிலாக குருட்டு தேதிக்கு செல்லும் பெண், தன் நிறுவன சி.இ.ஓ.வை சந்திக்கிறாள்.",
      ml: "ഒരു സ്ത്രീ സ്നേഹിതയ്ക്ക് വേണ്ടി ഒരു ബ്ലൈൻഡ് ഡേറ്റിൽ പോകുകയും തന്റെ കമ്പനിയുടെ CEO ആണ് അതെന്ന് കണ്ടെത്തുകയും ചെയ്യുന്നു.",
      ko: "친구 대신 맞선에 나간 여자가 상대가 자신의 직장 상사 CEO라는 것을 알게 되는 로맨틱 코미디."
    },
    titleTranslations: { en: "Business Proposal", ta: "வணிக முன்மொழிவு", ml: "ബിസിനസ് പ്രൊപ്പോസൽ", ko: "사내맞선" },
    genres: ["Romance", "Comedy"],
    year: 2022, rating: 8.3, totalRatings: 83000, episodes: 12, status: "completed", network: "SBS",
    cast: [{ name: "Ahn Hyo-seop", character: "Kang Tae-moo", photo: "" }, { name: "Kim Se-jeong", character: "Shin Ha-ri", photo: "" }],
    director: "Park Sun-ho", writer: "Han Sul-hee",
    poster: "https://image.tmdb.org/t/p/w500/2PhReOXqVIv6Xb0L2oEVo5RVVJJ.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/H4MSaxhMMNRTTvTmV3mLmZSR5u.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=PmTNdXVzEng", youtubeId: "PmTNdXVzEng", title: "Official Trailer" }],
    tags: ["office romance", "blind date", "CEO"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: true, isFeatured: false, views: 670000, trailerViews: 760000, favoriteCount: 60000, ageRating: "PG"
  },
  {
    title: "Signal", titleKorean: "시그널",
    description: "A criminal profiler from the present communicates with a detective from the past through a mysterious walkie-talkie to solve cold cases.",
    descriptionTranslations: {
      en: "A present-day profiler and a detective from the past communicate via a mysterious radio to solve cold cases.",
      ta: "நிகழ்காலத்தில் ஒரு குற்றவியல் வல்லுனர் ஒரு மர்ம வாக்கி-டாக்கி மூலம் கடந்த காலத்தின் துப்பறிவாளரோடு தொடர்பு கொள்கிறார்.",
      ml: "ഒരു ക്രൈം പ്രൊഫൈലർ ഒരു ദുരൂഹ വാക്കി-ടാക്കി വഴി ഭൂതകാലത്തിലെ ഒരു ഡിറ്റക്ടീവുമായി ആശയവിനിമയം ചെയ്ത് കേസുകൾ പരിഹരിക്കുന്നു.",
      ko: "과거와 현재의 형사들이 무전기를 통해 미제 사건을 해결해 나가는 범죄 수사 드라마."
    },
    titleTranslations: { en: "Signal", ta: "சிக்னல்", ml: "സിഗ്നൽ", ko: "시그널" },
    genres: ["Crime", "Thriller", "Mystery", "Drama"],
    year: 2016, rating: 9.0, totalRatings: 69000, episodes: 16, status: "completed", network: "tvN",
    cast: [{ name: "Lee Je-hoon", character: "Park Hae-young", photo: "" }, { name: "Cho Jin-woong", character: "Lee Jae-han", photo: "" }],
    director: "Kim Won-seok", writer: "Kim Eun-hee",
    poster: "https://image.tmdb.org/t/p/w500/hRsTbzIHjNTK0SicQ8rFiNKNHqz.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/7gAFTiS8KpHALBLzF0sxeeMDrNK.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=z1BH30hqVD8", youtubeId: "z1BH30hqVD8", title: "Official Trailer" }],
    tags: ["time travel", "detective", "cold case"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: false, isFeatured: false, views: 560000, trailerViews: 650000, favoriteCount: 51000, ageRating: "PG-13"
  },
  {
    title: "Hometown Cha-Cha-Cha", titleKorean: "갯마을 차차차",
    description: "A dentist from Seoul moves to a seaside village and falls for a self-proclaimed jack-of-all-trades.",
    descriptionTranslations: {
      en: "A Seoul dentist moves to a seaside village and falls for a charming man who can do everything.",
      ta: "சியோல் பல்மருத்துவர் கடலோர கிராமத்திற்கு இடம்பெயர்ந்து அனைத்தும் செய்யும் மகிழ்ச்சியான ஒருவரை காதலிக்கிறார்.",
      ml: "ഒരു സിയോൾ ഡെന്റിസ്റ്റ് ഒരു കടലോര ഗ്രാമത്തിലേക്ക് മാറുകയും ഒരു ചാർമിംഗ് ആളെ പ്രണയിക്കുകയും ചെയ്യുന്നു.",
      ko: "서울 치과의사와 시골 만능 백수가 갯마을에서 만나 사랑을 키우는 힐링 로맨스."
    },
    titleTranslations: { en: "Hometown Cha-Cha-Cha", ta: "ஹோம்டவுன் சா-சா-சா", ml: "ഹോംടൗൺ ചാ-ചാ-ചാ", ko: "갯마을 차차차" },
    genres: ["Romance", "Comedy", "Drama"],
    year: 2021, rating: 8.9, totalRatings: 81000, episodes: 16, status: "completed", network: "tvN",
    cast: [{ name: "Shin Min-a", character: "Yoon Hye-jin", photo: "" }, { name: "Kim Seon-ho", character: "Hong Du-sik", photo: "" }],
    director: "Yu Je-won", writer: "Shin Ha-eun",
    poster: "https://image.tmdb.org/t/p/w500/7EM9fh1iu6C1Ll3gGqkJhQPzxqR.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/z9U37SrwsBb2PXoJyEyYhpvlR0s.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=XSz3bGM_GOI", youtubeId: "XSz3bGM_GOI", title: "Official Trailer" }],
    tags: ["village", "seaside", "dentist", "healing romance"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: false, isFeatured: true, views: 600000, trailerViews: 690000, favoriteCount: 54000, ageRating: "PG"
  },
  {
    title: "All of Us Are Dead", titleKorean: "지금 우리 학교는",
    description: "A high school becomes ground zero for a zombie virus outbreak. Students must fight for their lives.",
    descriptionTranslations: {
      en: "A high school becomes the epicenter of a zombie outbreak, trapping students in a fight for survival.",
      ta: "ஒரு உயர்நிலைப் பள்ளி ஜோம்பி வைரஸ் வெடிப்புக்கான ஆரம்ப புள்ளியாக மாறுகிறது.",
      ml: "ഒരു ഹൈ സ്കൂൾ ഒരു ജൊംബി ആക്രമണത്തിന്റെ ഉദ്ഭവ സ്ഥലമാകുകയും വിദ്യാർത്ഥികൾ അതിജീവനത്തിനായി പോരാടുകയും ചെയ്യുന്നു.",
      ko: "학교 내에서 좀비 바이러스가 발생해 갇힌 학생들이 살아남기 위한 사투를 벌이는 이야기."
    },
    titleTranslations: { en: "All of Us Are Dead", ta: "நாம் அனைவரும் இறந்தவர்கள்", ml: "ആൾ ഓഫ് അസ് ആർ ഡെഡ്", ko: "지금 우리 학교는" },
    genres: ["Horror", "Action", "Drama", "Thriller"],
    year: 2022, rating: 7.6, totalRatings: 89000, episodes: 12, status: "completed", network: "Netflix",
    cast: [{ name: "Park Ji-hu", character: "Nam On-jo", photo: "" }, { name: "Yoon Chan-young", character: "Lee Cheong-san", photo: "" }],
    director: "Lee Jae-kyoo", writer: "Chun Sung-il",
    poster: "https://image.tmdb.org/t/p/w500/i4FObXe1VqPMkSWmGSXsEUvpQ4t.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/1RA7y7JgClqDgJfNVDhKjAb0o7P.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=IN5TD4VGnuY", youtubeId: "IN5TD4VGnuY", title: "Official Trailer" }],
    tags: ["zombie", "school", "survival", "teen"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: true, isFeatured: false, views: 710000, trailerViews: 820000, favoriteCount: 63000, ageRating: "R"
  },
  {
    title: "Mr. Queen", titleKorean: "철인왕후",
    description: "A modern chef's soul is transported into the body of a Joseon queen, creating chaos and comedy in the royal palace.",
    descriptionTranslations: {
      en: "A modern-day man wakes up in the body of a Joseon Dynasty queen and must navigate royal politics.",
      ta: "ஒரு நவீன ஆண் ஜோசியோன் ராணியின் உடலில் விழித்தெழுந்து அரச அரசியலை கையாள வேண்டும்.",
      ml: "ഒരു ആധുനിക പുരുഷൻ ജോസിയോൺ രാജ്ഞിയുടെ ശരീരത்തിൽ ഉണർന്ന് രാജകീയ രാഷ്ട്രീയം കൈകാര്യം ചെയ്യണം.",
      ko: "현대 남성의 영혼이 조선시대 왕비의 몸에 빙의되면서 벌어지는 좌충우돌 이야기."
    },
    titleTranslations: { en: "Mr. Queen", ta: "மிஸ்டர் குயின்", ml: "മി. ക്വീൻ", ko: "철인왕후" },
    genres: ["Comedy", "Historical", "Fantasy", "Romance"],
    year: 2020, rating: 8.8, totalRatings: 76000, episodes: 20, status: "completed", network: "tvN",
    cast: [{ name: "Shin Hye-sun", character: "Kim So-yong", photo: "" }, { name: "Kim Jung-hyun", character: "King Cheoljong", photo: "" }],
    director: "Yoon Sung-sik", writer: "Choi A-il",
    poster: "https://image.tmdb.org/t/p/w500/4s3m2kdgA0GYRN7XNGcCfj3PBmr.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/dIWwZW7dJmKqZObp1Y6LkMVJVSD.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=hRTDGABDaEk", youtubeId: "hRTDGABDaEk", title: "Official Trailer" }],
    tags: ["bodyswap", "joseon", "comedy", "historical"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: false, isFeatured: false, views: 580000, trailerViews: 670000, favoriteCount: 52000, ageRating: "PG"
  },
  {
    title: "Flower of Evil", titleKorean: "악의 꽃",
    description: "A man who hid his identity and dark past lives a happy life with his wife, a homicide detective, who begins to investigate his secret.",
    descriptionTranslations: {
      en: "A man hiding his dark past lives happily with his wife who is unknowingly investigating him.",
      ta: "தனது இருண்ட கடந்த காலத்தை மறைத்துக்கொண்டு வாழும் மனிதன், தன்னை விசாரிக்கும் மனைவியை காதலிக்கிறான்.",
      ml: "ഇരുണ്ട ഭൂതകാലം മറച്ചുവച്ച ഒരു മനുഷ്യൻ അറിയാതെ അയാളെ അന്വേഷിക്കുന്ന ഭാര്യ ഒരു ഡിറ്റക്ടീവ് ആണ്.",
      ko: "자신의 정체와 과거를 숨기고 살아가는 남자와 그의 아내이자 형사가 얽히는 심리 스릴러."
    },
    titleTranslations: { en: "Flower of Evil", ta: "தீமையின் பூ", ml: "ഫ്ലവർ ഓഫ് ഈവിൽ", ko: "악의 꽃" },
    genres: ["Thriller", "Romance", "Mystery", "Crime"],
    year: 2020, rating: 8.9, totalRatings: 79000, episodes: 16, status: "completed", network: "tvN",
    cast: [{ name: "Lee Joon-gi", character: "Baek Hee-sung", photo: "" }, { name: "Moon Chae-won", character: "Cha Ji-won", photo: "" }],
    director: "Kim Cheol-kyu", writer: "Yoo Jung-hee",
    poster: "https://image.tmdb.org/t/p/w500/wd2GGdRJkXivGe5FH8BIE9ij4Rj.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/oqP1lSLbhNxFQVOoYaKMIKB5MrK.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=Nn_4S6ANHtE", youtubeId: "Nn_4S6ANHtE", title: "Official Trailer" }],
    tags: ["psychological", "thriller", "marriage", "dark past"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: false, isFeatured: true, views: 640000, trailerViews: 740000, favoriteCount: 57000, ageRating: "R"
  },
  {
    title: "My Mister", titleKorean: "나의 아저씨",
    description: "Three brothers struggling with personal adversities encounter a young woman dealing with a difficult life, and they all find solace in each other.",
    descriptionTranslations: {
      en: "Three middle-aged brothers connect with a young woman facing hardships, healing each other through understanding.",
      ta: "மூன்று நடுத்தர வயது சகோதரர்கள் கடினமான வாழ்க்கையை கொண்ட ஒரு இளம் பெண்ணுடன் இணைகிறார்கள்.",
      ml: "ജീവിതകഷ്ടതകൾ നേരിടുന്ന മൂന്ന് സഹോദരന്മാർ ഒരു യുവതിയോടൊപ്പം ഒരു ആശ്വാസം കണ്ടെത്തുന്നു.",
      ko: "세 형제가 힘든 인생을 살아가는 한 청년 여성과 만나 서로를 치유하는 이야기."
    },
    titleTranslations: { en: "My Mister", ta: "என் அண்ணன்", ml: "മൈ മിസ്റ്റർ", ko: "나의 아저씨" },
    genres: ["Drama"],
    year: 2018, rating: 9.2, totalRatings: 72000, episodes: 16, status: "completed", network: "tvN",
    cast: [{ name: "Lee Sun-kyun", character: "Park Dong-hoon", photo: "" }, { name: "IU", character: "Lee Ji-an", photo: "" }],
    director: "Kim Won-seok", writer: "Park Hae-young",
    poster: "https://image.tmdb.org/t/p/w500/oTnkMqf4nTfv3gUKCCKqVJFMJjb.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/a2JHgfPzAq2EaKmY5C0lBqsRKf1.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=_dIxuGR5bMo", youtubeId: "_dIxuGR5bMo", title: "Official Trailer" }],
    tags: ["healing", "slice of life", "loneliness", "family"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: false, isFeatured: false, views: 540000, trailerViews: 630000, favoriteCount: 50000, ageRating: "PG-13"
  },
  // ── 10 NEW SERIES ──────────────────────────────────────────────
  {
    title: "Boys Over Flowers", titleKorean: "꽃보다 남자",
    description: "A poor girl enters an elite school and gets caught in a love triangle with the school's most powerful and wealthy students.",
    descriptionTranslations: {
      en: "A poor girl enters an elite school and falls into a love triangle with the richest boys.",
      ta: "ஒரு ஏழை பெண் உயரடுக்கு பள்ளியில் சேர்ந்து செல்வந்த மாணவர்களிடம் காதலில் சிக்குகிறாள்.",
      ml: "ഒരു ദരിദ്ര പെൺകുട്ടി ഒരു വരേണ്യ സ്കൂളിൽ ചേർന്ന് ഏറ്റവും ധനിക വിദ്യാർഥികളുമായി പ്രണയ ത്രികോണത്തിൽ അകപ്പെടുന്നു.",
      ko: "가난한 소녀가 명문 학교에 입학해 재벌가 남학생들과 얽히는 로맨스."
    },
    titleTranslations: { en: "Boys Over Flowers", ta: "பூக்களுக்கு மேல் சிறுவர்கள்", ml: "ബോയ്സ് ഓവർ ഫ്ലവേഴ്സ്", ko: "꽃보다 남자" },
    genres: ["Romance", "Drama", "School"],
    year: 2009, rating: 8.2, totalRatings: 95000, episodes: 25, status: "completed", network: "KBS2",
    cast: [{ name: "Lee Min-ho", character: "Gu Jun-pyo", photo: "" }, { name: "Ku Hye-sun", character: "Geum Jan-di", photo: "" }],
    director: "Jeon Ki-sang", writer: "Yoon Ji-ryun",
    poster: "https://image.tmdb.org/t/p/w500/qTjRFmOqEMBxH7W6ZoqxJBPxMFb.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xEHIgZkZAaMrGqmkgX8jwi9BZKS.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=bRbi6LvBwGw", youtubeId: "bRbi6LvBwGw", title: "Official Trailer" }],
    tags: ["school", "rich boy poor girl", "love triangle", "classic"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: false, isFeatured: true, views: 820000, trailerViews: 950000, favoriteCount: 74000, ageRating: "PG"
  },
  {
    title: "Crash Course in Romance", titleKorean: "일타 스캔들",
    description: "A top math instructor at a private tutoring center falls in love with a single mother who runs a side dish store.",
    descriptionTranslations: {
      en: "A famous math tutor falls in love with a passionate single mother in the cutthroat world of private education.",
      ta: "ஒரு பிரபல கணித ஆசிரியர் தனியார் கல்வி உலகில் ஒரு தனி தாயை காதலிக்கிறார்.",
      ml: "ഒരു പ്രശസ്ത ഗണിത അദ്ധ്യാപകൻ സ്വകാര്യ വിദ്യാഭ്യാസ ലോകത്ത് ഒരു അമ്മയെ പ്രണയിക്കുന്നു.",
      ko: "일타강사와 반찬가게 사장의 달달한 로맨스를 그린 드라마."
    },
    titleTranslations: { en: "Crash Course in Romance", ta: "காதல் பாடத்திட்டம்", ml: "ക്രാഷ് കോഴ്സ് ഇൻ റൊമാൻസ്", ko: "일타 스캔들" },
    genres: ["Romance", "Comedy", "Drama"],
    year: 2023, rating: 8.6, totalRatings: 72000, episodes: 16, status: "completed", network: "tvN",
    cast: [{ name: "Choi Woo-shik", character: "Choi Chi-yeol", photo: "" }, { name: "Jeon Do-yeon", character: "Nam Haeng-sun", photo: "" }],
    director: "Yoo Je-won", writer: "Yang Hee-seung",
    poster: "https://image.tmdb.org/t/p/w500/vXrDGMeVPRCTB4sxnFJcJGJpYI2.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/4HodP7LoFbE5gCZAFwkSDEiGHcz.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=2XBmgdZGFcY", youtubeId: "2XBmgdZGFcY", title: "Official Trailer" }],
    tags: ["tutor", "single mom", "education", "romance"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: true, isFeatured: true, views: 610000, trailerViews: 720000, favoriteCount: 56000, ageRating: "PG"
  },
  {
    title: "Moving", titleKorean: "무빙",
    description: "Children with superpowers try to hide their abilities while their parents, former secret agents, are drawn back into a dangerous world.",
    descriptionTranslations: {
      en: "Superpowered teenagers and their secret agent parents face threats from a shadowy organization.",
      ta: "அதிசக்தி கொண்ட இளைஞர்களும் அவர்களின் ரகசிய முகவர் பெற்றோர்களும் ஆபத்தான உலகில் சிக்குகிறார்கள்.",
      ml: "അതിശക்തിയുള്ള കൗമാരക്കാരും അവരുടെ രഹസ്യ ഏജന്റ് മാതാപിതാക്കളും ഒരു അപകടകരമായ ലോകത്ത് പെട്ടുപോകുന്നു.",
      ko: "초능력을 가진 아이들과 전직 비밀요원 부모들의 이야기를 담은 액션 드라마."
    },
    titleTranslations: { en: "Moving", ta: "மூவிங்", ml: "മൂവിംഗ്", ko: "무빙" },
    genres: ["Action", "Fantasy", "Drama", "Thriller"],
    year: 2023, rating: 8.8, totalRatings: 89000, episodes: 20, status: "completed", network: "Disney+",
    cast: [{ name: "Ryu Seung-ryong", character: "Bong-seok's father", photo: "" }, { name: "Han Hyo-joo", character: "Lee Mi-hyun", photo: "" }],
    director: "Park In-je", writer: "Kang Full",
    poster: "https://image.tmdb.org/t/p/w500/9yBnHiSIOQRGTRRIbN5jaHRXNlA.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/a4AHxoTDtfFRgJIqEjhJjcpMvHs.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=DFPREm7MGKE", youtubeId: "DFPREm7MGKE", title: "Official Trailer" }],
    tags: ["superpower", "action", "family", "secret agent"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: true, isFeatured: true, views: 780000, trailerViews: 890000, favoriteCount: 69000, ageRating: "PG-13"
  },
  {
    title: "Queen of Tears", titleKorean: "눈물의 여왕",
    description: "A troubled marriage between a department store heiress and a man from a small town gets a second chance at love.",
    descriptionTranslations: {
      en: "A struggling married couple rediscovers their love after the wife is diagnosed with a terminal illness.",
      ta: "ஒரு சிக்கலான திருமணமான தம்பதியர் மனைவிக்கு கடுமையான நோய் கண்டறியப்பட்ட பின் மீண்டும் காதலை கண்டுபிடிக்கிறார்கள்.",
      ml: "ഒരു ദമ്പതിമാർ ഭാര്യക്ക് ഗുരുതരമായ രോഗം കണ്ടെത്തിയ ശേഷം പ്രണയം വീണ്ടെടുക്കുന്നു.",
      ko: "위기의 부부가 시한부 선고 후 다시 사랑을 회복하는 눈물의 로맨스."
    },
    titleTranslations: { en: "Queen of Tears", ta: "கண்ணீரின் ராணி", ml: "ക്വീൻ ഓഫ് ടിയേഴ്സ്", ko: "눈물의 여왕" },
    genres: ["Romance", "Drama", "Comedy"],
    year: 2024, rating: 9.0, totalRatings: 134000, episodes: 16, status: "completed", network: "tvN",
    cast: [{ name: "Kim Soo-hyun", character: "Baek Hyun-woo", photo: "" }, { name: "Kim Ji-won", character: "Hong Hae-in", photo: "" }],
    director: "Jang Young-woo", writer: "Park Ji-eun",
    poster: "https://image.tmdb.org/t/p/w500/wWnFJDHfJBZxJvxSSSMDGmjGIBE.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/Ao6G4bFxBBSfQSvUMxHT8E5XKRB.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=LOlKCsGGb_s", youtubeId: "LOlKCsGGb_s", title: "Official Trailer" }],
    tags: ["marriage", "terminal illness", "chaebol", "second chance"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: true, isFeatured: true, views: 950000, trailerViews: 1100000, favoriteCount: 88000, ageRating: "PG-13"
  },
  {
    title: "Doctor Slump", titleKorean: "닥터 슬럼프",
    description: "Two top students who were rivals in school meet again as adults both experiencing burnout and slumps in their careers.",
    descriptionTranslations: {
      en: "Former rivals who were top students reunite as adults both struggling with burnout and find comfort in each other.",
      ta: "பள்ளியில் போட்டியாளர்களாக இருந்த இருவர் பெரியவர்களாகி மீண்டும் சந்திக்கும்போது இருவரும் சோர்வில் இருக்கிறார்கள்.",
      ml: "സ്കൂളിൽ എതിരാളികളായിരുന്ന രണ്ടുപേർ മുതിർന്നവരായി വീണ്ടും കണ്ടുമുട്ടുമ്പോൾ ഇരുവരും തളർച്ചയിൽ ആണ്.",
      ko: "한때 라이벌이었던 두 천재가 어른이 되어 슬럼프 속에서 재회하는 로맨스."
    },
    titleTranslations: { en: "Doctor Slump", ta: "டாக்டர் ஸ்லம்ப்", ml: "ഡോക്ടർ സ്ലമ്പ്", ko: "닥터 슬럼프" },
    genres: ["Romance", "Comedy", "Drama", "Medical"],
    year: 2024, rating: 8.4, totalRatings: 61000, episodes: 16, status: "completed", network: "JTBC",
    cast: [{ name: "Park Hyung-sik", character: "Nam Ha-neul", photo: "" }, { name: "Park Shin-hye", character: "Yeo Jung-woo", photo: "" }],
    director: "Oh Hyun-jong", writer: "Baek Eun-jin",
    poster: "https://image.tmdb.org/t/p/w500/A2HNhqYdCqKMBhBvxJd5IqDqUCb.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/zFqnFQMIvoogivCzHMWpBi4JWGU.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=K0jeRRQHFo4", youtubeId: "K0jeRRQHFo4", title: "Official Trailer" }],
    tags: ["burnout", "rivals", "healing", "medical"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: true, isFeatured: false, views: 520000, trailerViews: 610000, favoriteCount: 48000, ageRating: "PG"
  },
  {
    title: "My Demon", titleKorean: "마이 데몬",
    description: "A demon who has lived for 200 years loses his powers and enters a contract marriage with a chaebol heiress.",
    descriptionTranslations: {
      en: "A 200-year-old demon loses his powers and enters a contract marriage with a wealthy heiress.",
      ta: "200 ஆண்டுகளாக வாழும் பிசாசு தனது சக்திகளை இழந்து ஒரு பணக்கார வாரிசுடன் ஒப்பந்த திருமணம் செய்கிறான்.",
      ml: "200 വർഷം ജീവിച്ച ഒരു അസുരൻ തന്റെ ശക്തി നഷ്ടപ്പെട്ട് ഒരു ധനിക അനന്തരവകാശിയുമായി കരാർ വിവാഹം ചെയ്യുന്നു.",
      ko: "200년 된 악마가 능력을 잃고 재벌 상속녀와 계약 결혼을 하게 되는 판타지 로맨스."
    },
    titleTranslations: { en: "My Demon", ta: "என் பிசாசு", ml: "മൈ ഡീമൺ", ko: "마이 데몬" },
    genres: ["Fantasy", "Romance", "Comedy"],
    year: 2023, rating: 7.8, totalRatings: 67000, episodes: 16, status: "completed", network: "SBS",
    cast: [{ name: "Song Kang", character: "Do Do-hee", photo: "" }, { name: "Kim Yoo-jung", character: "Jeong Gu-won", photo: "" }],
    director: "Kim Jang-han", writer: "Han Woo-ri",
    poster: "https://image.tmdb.org/t/p/w500/4XL8oEBmWqzZhkJkiJQEqXpDpMD.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/c3GqOjF8zMMuEYaUNbHBPNivpsF.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=xVNbUcBNKcQ", youtubeId: "xVNbUcBNKcQ", title: "Official Trailer" }],
    tags: ["demon", "contract marriage", "fantasy", "chaebol"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: false, isFeatured: true, views: 580000, trailerViews: 670000, favoriteCount: 52000, ageRating: "PG-13"
  },
  {
    title: "Sweet Home", titleKorean: "스위트홈",
    description: "A reclusive teenager moves into a new apartment and suddenly finds himself in the middle of a monster apocalypse.",
    descriptionTranslations: {
      en: "A lonely teenager and his neighbors fight for survival when humans start turning into monsters.",
      ta: "ஒரு தனிமையான இளைஞன் மனிதர்கள் அசுரர்களாக மாறும்போது தன் அண்டை வீட்டாரோடு உயிர் காக்க போராடுகிறான்.",
      ml: "മനുഷ്യർ രാക്ഷസന്മാരാകുമ്പോൾ ഒരു ഏകാന്ത യുവാവ് അയൽക്കാരോടൊപ്പം അതിജീവനത്തിനായി പോരാടുന്നു.",
      ko: "인간이 괴물로 변하는 세상에서 고립된 아파트 주민들의 생존기."
    },
    titleTranslations: { en: "Sweet Home", ta: "ஸ்வீட் ஹோம்", ml: "സ്വീറ്റ് ഹോം", ko: "스위트홈" },
    genres: ["Horror", "Action", "Drama", "Fantasy"],
    year: 2020, rating: 7.5, totalRatings: 78000, episodes: 10, status: "completed", network: "Netflix",
    cast: [{ name: "Song Kang", character: "Cha Hyun-su", photo: "" }, { name: "Lee Jin-uk", character: "Pyeon Sang-wook", photo: "" }],
    director: "Lee Eung-bok", writer: "Hong So-ri",
    poster: "https://image.tmdb.org/t/p/w500/xTvMBLNHMaSYEAFGGDmHKlCGsYl.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xEHIgZkZAaMrGqmkgX8jwi9BZKS.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=Lr2dMBGqrpI", youtubeId: "Lr2dMBGqrpI", title: "Official Trailer" }],
    tags: ["monster", "apartment", "survival", "horror"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: false, isFeatured: false, views: 670000, trailerViews: 760000, favoriteCount: 58000, ageRating: "R"
  },
  {
    title: "Mask Girl", titleKorean: "마스크걸",
    description: "An office worker who is insecure about her looks becomes an internet broadcast personality who hides her face behind a mask.",
    descriptionTranslations: {
      en: "An insecure office worker leads a double life as a masked internet celebrity, with dangerous consequences.",
      ta: "தன் தோற்றத்தில் நம்பிக்கையற்ற ஒரு அலுவலக பணியாளர் முகமூடி அணிந்து இணைய பிரபலமாகிறார்.",
      ml: "തന്റെ രൂപത്തിൽ ആത്മവിശ്വാസമില്ലാത്ത ഒരു ഓഫീസ് ജീവനക்കാരി മുഖംമൂടി ധരിച്ച് ഇന്റർനെറ്റ് സെലിബ്രിറ്റിയാകുന്നു.",
      ko: "외모 컴플렉스를 가진 직장인이 마스크를 쓰고 인터넷 방송을 하다 벌어지는 사건들."
    },
    titleTranslations: { en: "Mask Girl", ta: "முகமூடி பெண்", ml: "മാസ്ക് ഗേൾ", ko: "마스크걸" },
    genres: ["Thriller", "Drama", "Mystery", "Crime"],
    year: 2023, rating: 7.9, totalRatings: 58000, episodes: 7, status: "completed", network: "Netflix",
    cast: [{ name: "Go Hyun-jung", character: "Kim Mo-mi", photo: "" }, { name: "Ahn Jae-hong", character: "Joo Oh-nam", photo: "" }],
    director: "Kim Yong-hoon", writer: "Mae Mi",
    poster: "https://image.tmdb.org/t/p/w500/lZITMOSNSJSbFrBqnNmMIhQdRJf.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/2SgHTpFQvvXMFMPJlbEPAqNgBmq.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=lgAi6Wp7MrA", youtubeId: "lgAi6Wp7MrA", title: "Official Trailer" }],
    tags: ["mask", "internet", "dark", "identity"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: false, isFeatured: false, views: 490000, trailerViews: 570000, favoriteCount: 43000, ageRating: "R"
  },
  {
    title: "Welcome to Samdalri", titleKorean: "웰컴투 삼달리",
    description: "A famous photographer returns to her hometown after her career collapses and reconnects with her childhood friend.",
    descriptionTranslations: {
      en: "A fallen celebrity photographer returns to her Jeju hometown and rediscovers love with her childhood friend.",
      ta: "ஒரு புகழ்பெற்ற புகைப்படக் கலைஞர் தனது சொந்த ஊருக்கு திரும்பி தனது கடந்த காலத்தை மீண்டும் கண்டுபிடிக்கிறார்.",
      ml: "ഒരു പ്രശസ്ത ഫോട്ടോഗ്രാഫർ തന്റെ ജന്മഗ്രാമത്തിലേക്ക് തിരിച്ചെത്തി ബാല്യകാല സ്നേഹം വീണ്ടെടുക്കുന്നു.",
      ko: "잘나가던 사진작가가 고향 제주도로 돌아와 첫사랑과 재회하는 힐링 로맨스."
    },
    titleTranslations: { en: "Welcome to Samdalri", ta: "சாம்தல்ரிக்கு வரவேற்பு", ml: "വെൽകം ടു സാംദൽറി", ko: "웰컴투 삼달리" },
    genres: ["Romance", "Drama", "Comedy"],
    year: 2023, rating: 8.3, totalRatings: 54000, episodes: 16, status: "completed", network: "JTBC",
    cast: [{ name: "Ji Chang-wook", character: "Cho Yong-pil", photo: "" }, { name: "Shin Hye-sun", character: "Jo Sam-dal", photo: "" }],
    director: "Cha Young-hoon", writer: "Kwon Hye-joo",
    poster: "https://image.tmdb.org/t/p/w500/bHXKQMSXQ8CpiEjCKJQBQgHIwVB.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/5CxNFwmDVKZDKxpSsGXmhVFaFzA.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=TPMC6pCFnGM", youtubeId: "TPMC6pCFnGM", title: "Official Trailer" }],
    tags: ["jeju", "hometown", "first love", "healing"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: false, isFeatured: false, views: 430000, trailerViews: 510000, favoriteCount: 39000, ageRating: "PG"
  },
  {
    title: "My Love Mix-Up!", titleKorean: "내 남자친구 이야기",
    description: "A high school girl discovers her crush likes someone else, but the boy she accidentally involves starts developing feelings for her.",
    descriptionTranslations: {
      en: "A romantic mix-up between high school students leads to unexpected love and heartwarming friendships.",
      ta: "உயர்நிலைப் பள்ளி மாணவர்களிடையே காதல் குழப்பம் எதிர்பாராத காதல் மற்றும் நட்பிற்கு வழிவகுக்கிறது.",
      ml: "ഹൈ സ്കൂൾ വിദ്യാർഥികൾക്കിടയിലെ ഒരു റൊമാന്റിക് കുഴപ്പം അപ്രതീക്ഷിത പ്രണയത്തിലേക്ക് നയിക്കുന്നു.",
      ko: "고등학생들 사이의 엇갈린 짝사랑이 만들어내는 설레는 로맨스."
    },
    titleTranslations: { en: "My Love Mix-Up!", ta: "என் காதல் குழப்பம்", ml: "മൈ ലവ് മിക്സ്-അപ്!", ko: "내 남자친구 이야기" },
    genres: ["Romance", "Comedy", "School", "Drama"],
    year: 2021, rating: 7.6, totalRatings: 42000, episodes: 8, status: "completed", network: "MBC",
    cast: [{ name: "Lee Shin-young", character: "Ida Aoki", photo: "" }, { name: "Noh Sang-hyun", character: "Aida Kosuke", photo: "" }],
    director: "Kim Jung-hyun", writer: "Wataru Hinekure",
    poster: "https://image.tmdb.org/t/p/w500/b2qBCGEfh8bXWKqUqGNgVfDtPxg.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/hXQLQgCVpWzpKBZFDMRNR1pBHU8.jpg",
    trailers: [{ language: "en", url: "https://www.youtube.com/watch?v=3t6zCZRSNRU", youtubeId: "3t6zCZRSNRU", title: "Official Trailer" }],
    tags: ["school", "misunderstanding", "youth", "first love"],
    seriesLanguage: "Korean", country: "South Korea",
    isTrending: false, isFeatured: false, views: 320000, trailerViews: 390000, favoriteCount: 28000, ageRating: "PG"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Series.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const series = await Series.insertMany(sampleSeries);
    console.log(`✅ Inserted ${series.length} series`);

    const admin = await User.create({
      name: 'Ameer Malik',
      email: 'ameermalikbahad07@gmail.com',
      password: 'Admin@123',
      role: 'admin'
    });
    console.log(`✅ Admin created: ${admin.email}`);

    const user = await User.create({
      name: 'Demo User',
      email: 'demo@kdrama.com',
      password: 'Demo@123',
      role: 'user',
      favorites: [series[0]._id, series[1]._id, series[3]._id]
    });
    console.log(`✅ Demo user created: ${user.email}`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('Admin: ameermalikbahad07@gmail.com / Admin@123');
    console.log('Demo:  demo@kdrama.com / Demo@123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedDatabase();