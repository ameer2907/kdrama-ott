import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Nav
      home: 'Home', search: 'Search', favorites: 'Favorites',
      profile: 'Profile', admin: 'Admin', login: 'Login', logout: 'Logout',
      register: 'Register', dashboard: 'Dashboard',
      // Hero
      watchTrailer: 'Watch Trailer', addFavorite: 'Add to Favorites',
      removeFavorite: 'Remove from Favorites', moreInfo: 'More Info',
      // Series
      trending: 'Trending Now', featured: 'Featured', newReleases: 'New Releases',
      topRated: 'Top Rated', romance: 'Romance', action: 'Action',
      fantasy: 'Fantasy', thriller: 'Thriller', historical: 'Historical',
      comedy: 'Comedy', crime: 'Crime', mystery: 'Mystery',
      // Details
      episodes: 'Episodes', network: 'Network', director: 'Director',
      cast: 'Cast', year: 'Year', rating: 'Rating', status: 'Status',
      ongoing: 'Ongoing', completed: 'Completed', upcoming: 'Upcoming',
      recommendations: 'You May Also Like',
      // Player
      playTrailer: 'Play Trailer', downloadTrailer: 'Download Trailer',
      selectLanguage: 'Select Language', close: 'Close',
      // Auth
      emailAddress: 'Email Address', password: 'Password', name: 'Full Name',
      loginTitle: 'Sign In', registerTitle: 'Create Account',
      alreadyHaveAccount: 'Already have an account?', noAccount: "Don't have an account?",
      // Favorites
      myFavorites: 'My Favorites', noFavorites: 'No favorites yet',
      addFavoritesMsg: 'Start adding your favorite Korean dramas!',
      // History
      watchHistory: 'Watch History', continueWatching: 'Continue Watching',
      clearHistory: 'Clear History',
      // Search
      searchPlaceholder: 'Search Korean dramas...', filters: 'Filters',
      genre: 'Genre', sortBy: 'Sort By', noResults: 'No results found',
      tryDifferent: 'Try different keywords or filters',
      // Admin
      totalUsers: 'Total Users', totalSeries: 'Total Series',
      totalViews: 'Total Views', trailerViews: 'Trailer Views',
      addSeries: 'Add Series', editSeries: 'Edit Series', deleteSeries: 'Delete Series',
      manageUsers: 'Manage Users', analytics: 'Analytics', recentUsers: 'Recent Users',
      topSeries: 'Top Series', importFromTMDB: 'Import from TMDB',
      // Profile
      editProfile: 'Edit Profile', changePassword: 'Change Password',
      preferredLanguage: 'Preferred Language', saveChanges: 'Save Changes',
      // General
      loading: 'Loading...', error: 'Something went wrong', retry: 'Retry',
      back: 'Back', viewAll: 'View All', share: 'Share',
      koreanTitle: 'Korean Title', englishTitle: 'English Title',
      comingSoon: 'Coming Soon', newBadge: 'NEW', trendingBadge: 'TRENDING',
      languageSelect: 'Language', korean: 'Korean', english: 'English',
      tamil: 'Tamil', malayalam: 'Malayalam'
    }
  },
  ta: {
    translation: {
      home: 'முகப்பு', search: 'தேடு', favorites: 'விருப்பங்கள்',
      profile: 'சுயவிவரம்', admin: 'நிர்வாகம்', login: 'உள்நுழை',
      logout: 'வெளியேறு', register: 'பதிவு செய்', dashboard: 'டாஷ்போர்டு',
      watchTrailer: 'ட்ரெய்லர் பார்', addFavorite: 'விருப்பங்களில் சேர்',
      removeFavorite: 'விருப்பங்களிலிருந்து அகற்று', moreInfo: 'மேலும் தகவல்',
      trending: 'இப்போது டிரெண்டிங்', featured: 'சிறப்பு', newReleases: 'புதிய வெளியீடுகள்',
      topRated: 'உயர் மதிப்பீடு', romance: 'காதல்', action: 'அதிரடி',
      fantasy: 'கற்பனை', thriller: 'திரில்லர்', historical: 'வரலாற்று',
      comedy: 'நகைச்சுவை', crime: 'குற்றம்', mystery: 'மர்மம்',
      episodes: 'எபிசோட்கள்', network: 'நெட்வொர்க்', director: 'இயக்குனர்',
      cast: 'நடிகர்கள்', year: 'ஆண்டு', rating: 'மதிப்பீடு', status: 'நிலை',
      ongoing: 'தொடர்ச்சியில்', completed: 'முடிந்தது', upcoming: 'வரவிருக்கும்',
      recommendations: 'உங்களுக்கு பிடிக்கலாம்',
      playTrailer: 'ட்ரெய்லர் இயக்கு', downloadTrailer: 'ட்ரெய்லர் பதிவிறக்கு',
      selectLanguage: 'மொழி தேர்ந்தெடு', close: 'மூடு',
      emailAddress: 'மின்னஞ்சல்', password: 'கடவுச்சொல்', name: 'முழு பெயர்',
      loginTitle: 'உள்நுழைக', registerTitle: 'கணக்கு உருவாக்கு',
      alreadyHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?', noAccount: 'கணக்கு இல்லையா?',
      myFavorites: 'என் விருப்பங்கள்', noFavorites: 'விருப்பங்கள் இல்லை',
      addFavoritesMsg: 'உங்கள் விருப்பமான கொரிய நாடகங்களை சேர்க்கத் தொடங்குங்கள்!',
      watchHistory: 'பார்வை வரலாறு', continueWatching: 'தொடர்ந்து பார்',
      searchPlaceholder: 'கொரிய நாடகங்களை தேடுங்கள்...', filters: 'வடிகட்டிகள்',
      noResults: 'முடிவுகள் இல்லை', loading: 'ஏற்றுகிறது...',
      error: 'பிழை ஏற்பட்டது', back: 'பின்னே', viewAll: 'அனைத்தையும் பார்',
      languageSelect: 'மொழி', korean: 'கொரியன்', english: 'ஆங்கிலம்',
      tamil: 'தமிழ்', malayalam: 'மலையாளம்'
    }
  },
  ml: {
    translation: {
      home: 'ഹോം', search: 'തിരയുക', favorites: 'പ്രിയപ്പെട്ടവ',
      profile: 'പ്രൊഫൈൽ', admin: 'അഡ്മിൻ', login: 'ലോഗിൻ',
      logout: 'ലോഗൗട്ട്', register: 'രജിസ്റ്റർ', dashboard: 'ഡാഷ്‌ബോർഡ്',
      watchTrailer: 'ട്രെയ്‌ലർ കാണുക', addFavorite: 'പ്രിയപ്പെട്ടവയിൽ ചേർക്കുക',
      removeFavorite: 'പ്രിയപ്പെട്ടവയിൽ നിന്ന് നീക്കുക', moreInfo: 'കൂടുതൽ വിവരം',
      trending: 'ട്രൻഡിംഗ്', featured: 'ഫീച്ചർഡ്', newReleases: 'പുതിയ റിലീസ്',
      topRated: 'ഉയർന്ന റേറ്റിംഗ്', romance: 'റൊമാൻസ്', action: 'ആക്ഷൻ',
      fantasy: 'ഫാൻ്റസി', thriller: 'ത്രില്ലർ', historical: 'ചരിത്ര',
      comedy: 'കോമഡി', crime: 'ക്രൈം', mystery: 'മിസ്ററി',
      episodes: 'എപ്പിസോഡുകൾ', network: 'നെറ്റ്‌വർക്ക്', director: 'ഡയറക്ടർ',
      cast: 'അഭിനേതാക്കൾ', year: 'വർഷം', rating: 'റേറ്റിംഗ്', status: 'നില',
      ongoing: 'തുടരുന്നു', completed: 'പൂർത്തിയായി', upcoming: 'വരാനിരിക്കുന്നു',
      recommendations: 'നിങ്ങൾക്ക് ഇഷ്ടപ്പെടാം',
      playTrailer: 'ട്രെയ്‌ലർ പ്ലേ ചെയ്യുക', downloadTrailer: 'ട്രെയ്‌ലർ ഡൗൺലോഡ് ചെയ്യുക',
      selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക', close: 'അടയ്ക്കുക',
      emailAddress: 'ഇമെയിൽ', password: 'പാസ്‌വേഡ്', name: 'മുഴുവൻ പേര്',
      loginTitle: 'സൈൻ ഇൻ', registerTitle: 'അക്കൗണ്ട് ഉണ്ടാക്കുക',
      alreadyHaveAccount: 'ഇതിനകം അക്കൗണ്ടുണ്ടോ?', noAccount: 'അക്കൗണ്ടില്ലേ?',
      myFavorites: 'എന്റെ പ്രിയപ്പെട്ടവ', noFavorites: 'പ്രിയപ്പെട്ടവ ഇല്ല',
      searchPlaceholder: 'കൊറിയൻ ഡ്രാമകൾ തിരയുക...', loading: 'ലോഡ് ചെയ്യുന്നു...',
      error: 'പ്രശ്‌നമുണ്ട്', back: 'തിരിച്ചു', viewAll: 'എല്ലാം കാണുക',
      languageSelect: 'ഭാഷ', korean: 'കൊറിയൻ', english: 'ഇംഗ്ലീഷ്',
      tamil: 'തമിഴ്', malayalam: 'മലയാളം'
    }
  },
  ko: {
    translation: {
      home: '홈', search: '검색', favorites: '즐겨찾기',
      profile: '프로필', admin: '관리자', login: '로그인',
      logout: '로그아웃', register: '회원가입', dashboard: '대시보드',
      watchTrailer: '예고편 보기', addFavorite: '즐겨찾기 추가',
      removeFavorite: '즐겨찾기 삭제', moreInfo: '자세히 보기',
      trending: '지금 인기', featured: '추천', newReleases: '최신작',
      topRated: '높은 평점', romance: '로맨스', action: '액션',
      fantasy: '판타지', thriller: '스릴러', historical: '사극',
      comedy: '코미디', crime: '범죄', mystery: '미스터리',
      episodes: '회', network: '방송국', director: '감독',
      cast: '출연진', year: '연도', rating: '평점', status: '상태',
      ongoing: '방영중', completed: '완결', upcoming: '예정',
      recommendations: '이런 작품은 어떠세요',
      playTrailer: '예고편 재생', downloadTrailer: '예고편 다운로드',
      selectLanguage: '언어 선택', close: '닫기',
      emailAddress: '이메일', password: '비밀번호', name: '이름',
      loginTitle: '로그인', registerTitle: '회원가입',
      searchPlaceholder: '한국 드라마 검색...', loading: '로딩중...',
      error: '오류가 발생했습니다', back: '뒤로', viewAll: '전체보기',
      languageSelect: '언어', korean: '한국어', english: '영어',
      tamil: '타밀어', malayalam: '말라얄람어'
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
