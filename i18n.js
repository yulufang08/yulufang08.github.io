/**
 * Simple i18n: Chinese (zh) / English (en)
 * Persists in localStorage as "lang".
 */
(function () {
  const STORAGE_KEY = 'lang';

  const translations = {
    zh: {
      siteTitle: 'yulufang.com',
      navHome: 'Home',
      navAbout: '关于我',
      navPublications: 'Publications',
      navMisc: 'Miscellaneous',
      navAnonymous: '匿名建议',
      langLabel: 'EN',
      heroName: '你的姓名',
      heroAffiliation: '职位 @ 单位',
      heroPhotoCaption: '替换为你的照片说明',
      aboutIntro: '简短自我介绍：经历、兴趣或正在做的事。可多段。',
      socialEmail: 'your@email.com',
      socialScholar: 'Google Scholar',
      aboutTitle: 'About Me',
      secEducation: 'Education',
      secExperience: 'Experience',
      secHonors: 'Honors & Awards',
      secPublications: 'Publications',
      secNews: 'News',
      eduOrg1: '学校/机构名称',
      eduDetail1: '学位，专业',
      eduDate1: '20XX年9月 – 20XX年6月',
      expOrg1: '单位名称',
      expDetail1: '职位/角色',
      expDate1: '20XX年X月 – 20XX年X月',
      honor1: '奖项名称',
      honorDate1: '年份',
      pub1: '论文标题。《期刊/会议》, 年份。',
      newsDate1: '20XX年X月。',
      news1: '新闻内容。',
      miscTitle: 'Miscellaneous',
      miscIntro: '杂项：链接、工具、小项目或任何你想放的内容。',
      miscItem1: '链接一',
      miscItem2: '链接二',
      lastUpdated: 'Last updated: 20XX年X月',
      footerNote: '欢迎通过 匿名建议 向我反馈。',
      anonymousTitle: '匿名建议',
      anonymousIntro: '欢迎任何人匿名向我提出任何建议、想法或反馈。此页面可在无痕/匿名窗口中打开。',
      anonymousLabel: '你的建议（可选留空）',
      anonymousPlaceholder: '输入你的建议…',
      anonymousHint: '完全匿名，不收集身份信息。',
      anonymousSubmit: '提交',
      anonymousSuccess: '感谢你的反馈！',
      anonymousBack: '返回首页',
    },
    en: {
      siteTitle: 'yulufang.com',
      navHome: 'Home',
      navAbout: 'About Me',
      navPublications: 'Publications',
      navMisc: 'Miscellaneous',
      navAnonymous: 'Anonymous Feedback',
      langLabel: '中',
      heroName: 'Your Name',
      heroAffiliation: 'Title @ Institution',
      heroPhotoCaption: 'Replace with your photo caption',
      aboutIntro: 'Short intro: background, interests, or what you\'re up to. Multiple paragraphs OK.',
      socialEmail: 'your@email.com',
      socialScholar: 'Google Scholar',
      aboutTitle: 'About Me',
      secEducation: 'Education',
      secExperience: 'Experience',
      secHonors: 'Honors & Awards',
      secPublications: 'Publications',
      secNews: 'News',
      eduOrg1: 'Institution Name',
      eduDetail1: 'Degree, Major',
      eduDate1: 'Sep. 20XX – Jun. 20XX',
      expOrg1: 'Organization',
      expDetail1: 'Role / Title',
      expDate1: 'Month Year – Month Year',
      honor1: 'Award name',
      honorDate1: 'Year',
      pub1: 'Paper title. Venue, Year.',
      newsDate1: 'Month Year.',
      news1: 'News item.',
      miscTitle: 'Miscellaneous',
      miscIntro: 'Misc: links, tools, side projects, or anything you like.',
      miscItem1: 'Link one',
      miscItem2: 'Link two',
      lastUpdated: 'Last updated: Month Year',
      footerNote: 'Feel free to send feedback via Anonymous Feedback.',
      anonymousTitle: 'Anonymous Feedback',
      anonymousIntro: 'Anyone can anonymously send suggestions, ideas, or feedback. Open this page in a private/incognito window if you prefer.',
      anonymousLabel: 'Your message (optional)',
      anonymousPlaceholder: 'Type your suggestion…',
      anonymousHint: 'Fully anonymous; no identity is collected.',
      anonymousSubmit: 'Submit',
      anonymousSuccess: 'Thank you for your feedback!',
      anonymousBack: 'Back to home',
    },
  };

  function getLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'zh' || stored === 'en') return stored;
    const nav = navigator.language || navigator.userLanguage || '';
    return nav.startsWith('zh') ? 'zh' : 'en';
  }

  function setLang(lang) {
    if (lang !== 'zh' && lang !== 'en') return;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    applyTranslations(lang);
    if (typeof window.onLangChange === 'function') window.onLangChange(lang);
  }

  function applyTranslations(lang) {
    const t = translations[lang] || translations.zh;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (t[key] != null) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if (el.placeholder !== undefined) el.placeholder = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });
    const titleKey = document.querySelector('title')?.getAttribute('data-i18n');
    if (titleKey && t[titleKey]) document.title = t[titleKey];
  }

  function toggleLang() {
    const next = getLang() === 'zh' ? 'en' : 'zh';
    setLang(next);
  }

  setLang(getLang());

  window.i18n = {
    getLang: getLang,
    setLang: setLang,
    toggleLang: toggleLang,
    t: function (key) {
      const t = translations[getLang()] || translations.zh;
      return t[key] != null ? t[key] : key;
    },
  };
})();
