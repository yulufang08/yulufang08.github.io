/**
 * Simple i18n: Chinese (zh) / English (en)
 * Persists in localStorage as "lang".
 */
(function () {
  const STORAGE_KEY = 'lang';

  const translations = {
    zh: {
      siteTitle: 'yulufang.com',
      navAbout: '关于我',
      navArticles: '文章',
      navVideos: '视频',
      navMisc: 'Miscellaneous',
      navAnonymous: '匿名建议',
      langLabel: 'EN',
      heroTitle: '你好，欢迎来到这里',
      heroSubtitle: '个人空间 · 文章 · 视频 · 杂项',
      aboutTitle: '关于我',
      aboutIntro: '这里可以写一段简短的自我介绍，你的经历、兴趣或正在做的事。支持中英文切换与深色/浅色主题。',
      aboutPlaceholder: '（替换为你的真实内容即可。）',
      articlesTitle: '文章',
      article1Title: '示例文章一',
      article1Desc: '简短描述。可链接到外部或站内文章。',
      article2Title: '示例文章二',
      article2Desc: '另一篇示例，方便你后续替换成自己的文章列表。',
      readMore: '阅读更多',
      videosTitle: '视频',
      video1Title: '示例视频',
      video1Desc: '可嵌入 B站 / YouTube 或放链接。',
      video2Title: '另一则视频',
      video2Desc: '替换为你的视频标题与链接。',
      miscTitle: 'Miscellaneous',
      miscIntro: '杂项：链接、工具、小项目或任何你想放的内容。',
      miscItem1: '链接一',
      miscItem2: '链接二',
      footerNote: '欢迎通过 匿名建议 向我反馈。',
      // Anonymous page
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
      navAbout: 'About Me',
      navArticles: 'Articles',
      navVideos: 'Videos',
      navMisc: 'Miscellaneous',
      navAnonymous: 'Anonymous Feedback',
      langLabel: '中',
      heroTitle: 'Hello, welcome here',
      heroSubtitle: 'Personal space · Articles · Videos · Misc',
      aboutTitle: 'About Me',
      aboutIntro: 'A short intro about you: background, interests, or what you\'re up to. Site supports Chinese/English and dark/light theme.',
      aboutPlaceholder: '(Replace with your own content.)',
      articlesTitle: 'Articles',
      article1Title: 'Sample Article One',
      article1Desc: 'Short description. Link to external or internal posts.',
      article2Title: 'Sample Article Two',
      article2Desc: 'Another sample for you to replace with your own list.',
      readMore: 'Read more',
      videosTitle: 'Videos',
      video1Title: 'Sample Video',
      video1Desc: 'Embed Bilibili / YouTube or add links.',
      video2Title: 'Another Video',
      video2Desc: 'Replace with your video title and link.',
      miscTitle: 'Miscellaneous',
      miscIntro: 'Misc: links, tools, side projects, or anything you like.',
      miscItem1: 'Link one',
      miscItem2: 'Link two',
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

  // Init
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
