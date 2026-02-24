/**
 * Simple i18n: English only
 */
(function () {
  const translations = {
    siteTitle: 'Yulu\'s homepage',
    navHome: 'Home',
    navPublications: 'Publications',
    navMisc: 'Miscellaneous',
    heroName: 'Yulu Fang',
    heroAffiliation: 'Shanghai Jiao Tong University',
    heroPhotoCaption: 'Replace with your photo caption',
    aboutIntro: 'Short intro: background, interests, or what you\'re up to. Multiple paragraphs OK.',
    socialEmail: 'yulufang[at]sjtu[dot]edu[dot]cn',
    socialScholar: 'Google Scholar',
    aboutTitle: 'About Me',
    secEducation: 'Education',
    secExperience: 'Experience',
    secHonors: 'Honors & Awards',
    secPublications: 'Publications',
    secNews: 'Recent News',
    news1: 'News item description.',
    newsDate1: 'Month Year',
    secService: 'Service',
    secVisitors: 'Visitor Map',
    eduOrg1: 'Institution Name',
    eduDetail1: 'Degree, Major',
    eduDate1: 'Sep. 20XX – Jun. 20XX',
    expOrg1: 'Organization',
    expDetail1: 'Role / Title',
    expDate1: 'Month Year – Month Year',
    honor1: 'Award name',
    honorDate1: 'Year',
    serviceOrg1: 'Conference / Journal Name',
    serviceDetail1: 'Reviewer',
    serviceDate1: 'Year',
    serviceOrg2: 'Organization Name',
    serviceDetail2: 'Volunteer Role',
    serviceDate2: 'Month Year – Month Year',
    miscTitle: 'Miscellaneous',
    miscIntro: 'Misc: links, tools, side projects, or anything you like.',
    miscItem1: 'Link one',
    miscItem2: 'Link two',
    lastUpdated: 'Last updated: Jan. 2026',
    footerNote: 'Feel free to send feedback via Anonymous Feedback.',
    copyright: '© 2026 Yulu Fang. Powered by GitHub Pages.',
    anonymousTitle: 'Anonymous Feedback',
    anonymousIntro: 'Anyone can anonymously send suggestions, ideas, or feedback. Open this page in a private/incognito window if you prefer.',
    anonymousLabel: 'Your message',
    anonymousPlaceholder: 'Type your suggestion…',
    anonymousHint: 'Fully anonymous; no identity is collected.',
    anonymousSubmit: 'Submit',
    anonymousSuccess: 'Thank you for your feedback!',
    anonymousBack: 'Back to home',
  };

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (translations[key] != null) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if (el.placeholder !== undefined) el.placeholder = translations[key];
        } else {
          el.textContent = translations[key];
        }
      }
    });
    const titleEl = document.querySelector('title');
    const titleKey = titleEl?.getAttribute('data-i18n');
    if (titleKey && translations[titleKey]) document.title = translations[titleKey];
  }

  applyTranslations();

  // Remove loading state to show content
  document.body.classList.remove('js-loading');
  document.body.classList.add('js-loaded');

  window.i18n = {
    t: function (key) {
      return translations[key] != null ? translations[key] : key;
    },
  };
})();
