const serif = 'Baskervville';
const zhSerif = '"Kaiti SC", "STKaiti", "KaiTi", serif';

$("head").append(
  "<link href='https://fonts.googleapis.com/css2?family=" +
    serif.replace(/ /g, '+') +
    ":wght@400;700&display=swap' rel='stylesheet' type='text/css'>"
);

$('body').css('font-family', serif + ", serif");
$('body').css('font-size', '17px');
$('body').css('font-weight', '400');

$('.name, .hero-title, .header').css('font-family', serif + ", serif");
$('.name, .hero-title, .header').css('font-weight', '700');
$('.eyebrow, .metalabel, .sidebar-title, .papertitle, .subheader, .topic-title, .thisauthor, .metavalue, .metalink, .menulink, .itemmeta, .sectionnote, .tag, .confshort').css('font-family', serif + ", serif");
$('.eyebrow, .metalabel, .sidebar-title, .papertitle, .subheader, .topic-title, .thisauthor, .metavalue, .metalink, .menulink, .itemmeta, .sectionnote, .tag, .confshort').css('font-weight', '400');

$('[data-lang="zh"], [data-lang="zh"] *').css('font-family', zhSerif);
$('.lang-link[data-lang-target="zh"]').css('font-family', zhSerif);

const languageButtons = Array.from(document.querySelectorAll('[data-lang-target]'));
const languageNodes = Array.from(document.querySelectorAll('[data-lang]'));
const authorLists = Array.from(document.querySelectorAll('.author-list'));

const serializeAuthorNodes = (nodes) => {
  const wrapper = document.createElement('span');
  nodes.forEach((node) => wrapper.appendChild(node.cloneNode(true)));
  return wrapper.innerHTML.replace(/^\s+|\s+$/g, '');
};

const parseAuthorSegments = (element) => {
  const authors = [];
  let current = [];

  const pushCurrent = () => {
    while (current.length && current[0].nodeType === Node.TEXT_NODE && !current[0].textContent.trim()) {
      current.shift();
    }

    while (
      current.length &&
      current[current.length - 1].nodeType === Node.TEXT_NODE &&
      !current[current.length - 1].textContent.trim()
    ) {
      current.pop();
    }

    if (!current.length) {
      return;
    }

    authors.push(serializeAuthorNodes(current));
    current = [];
  };

  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = node.textContent.split(',');

      parts.forEach((part, index) => {
        if (part) {
          current.push(document.createTextNode(part));
        }

        if (index < parts.length - 1) {
          pushCurrent();
        }
      });

      return;
    }

    current.push(node.cloneNode(true));
  });

  pushCurrent();
  return authors;
};

const buildAuthorHTML = (authors, keepCount = authors.length) => {
  if (keepCount >= authors.length) {
    return authors.join(', ');
  }

  return authors.slice(0, keepCount).join(', ') + ', <span class="author-etal">et al.</span>';
};

const authorListOverflows = (element) => element.scrollWidth > element.clientWidth + 1;

const collapseAuthorList = (element, authors = JSON.parse(element.dataset.authorSegments || '[]')) => {
  element.dataset.expanded = 'false';
  element.setAttribute('aria-expanded', 'false');
  element.classList.remove('is-expanded');
  element.classList.remove('is-expandable');
  element.removeAttribute('tabindex');
  element.removeAttribute('role');
  element.innerHTML = buildAuthorHTML(authors);
};

const expandAuthorList = (element, authors = JSON.parse(element.dataset.authorSegments || '[]')) => {
  element.dataset.expanded = 'true';
  element.setAttribute('aria-expanded', 'true');
  element.classList.add('is-expanded');
  element.innerHTML = buildAuthorHTML(authors, authors.length);
};

const updateAuthorList = (element) => {
  if (!element.dataset.authorSegments) {
    const authors = parseAuthorSegments(element);
    element.dataset.authorSegments = JSON.stringify(authors);
    element.setAttribute('title', element.textContent.replace(/\s+/g, ' ').trim());
  }

  const authors = JSON.parse(element.dataset.authorSegments);
  collapseAuthorList(element, authors);
  element.classList.remove('is-truncated');

  if (element.clientWidth === 0 || !authorListOverflows(element) || authors.length < 3) {
    return;
  }

  for (let keepCount = authors.length - 1; keepCount >= 2; keepCount -= 1) {
    element.innerHTML = buildAuthorHTML(authors, keepCount);

    if (!authorListOverflows(element)) {
      element.classList.add('is-truncated');
      element.classList.add('is-expandable');
      element.setAttribute('tabindex', '0');
      element.setAttribute('role', 'button');
      return;
    }
  }

  element.innerHTML = buildAuthorHTML(authors, 1);
  element.classList.add('is-truncated');
  element.classList.add('is-expandable');
  element.setAttribute('tabindex', '0');
  element.setAttribute('role', 'button');
};

const refreshAuthorLists = () => {
  authorLists.forEach(updateAuthorList);
};

let authorListFrame = null;
const scheduleAuthorListRefresh = () => {
  if (authorListFrame !== null) {
    cancelAnimationFrame(authorListFrame);
  }

  authorListFrame = requestAnimationFrame(() => {
    refreshAuthorLists();
    authorListFrame = null;
  });
};

const collapseExpandedAuthorLists = ({ except = null } = {}) => {
  authorLists.forEach((element) => {
    if (element === except || element.dataset.expanded !== 'true') {
      return;
    }

    const authors = JSON.parse(element.dataset.authorSegments || '[]');
    updateAuthorList(element, authors);
  });
};

const toggleAuthorList = (element) => {
  if (!element.classList.contains('is-truncated')) {
    return;
  }

  const authors = JSON.parse(element.dataset.authorSegments || '[]');
  const isExpanded = element.dataset.expanded === 'true';

  collapseExpandedAuthorLists({ except: element });

  if (isExpanded) {
    updateAuthorList(element, authors);
    return;
  }

  expandAuthorList(element, authors);
};

const setLanguage = (lang) => {
  languageNodes.forEach((node) => {
    node.hidden = node.getAttribute('data-lang') !== lang;
  });

  languageButtons.forEach((button) => {
    const isActive = button.getAttribute('data-lang-target') === lang;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
  scheduleAuthorListRefresh();
};

languageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setLanguage(button.getAttribute('data-lang-target'));
  });
});

setLanguage('en');
scheduleAuthorListRefresh();

window.addEventListener('resize', scheduleAuthorListRefresh);
window.addEventListener('load', scheduleAuthorListRefresh);

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(scheduleAuthorListRefresh);
}

authorLists.forEach((element) => {
  element.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleAuthorList(element);
  });

  element.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    toggleAuthorList(element);
  });
});

const navLinks = Array.from(document.querySelectorAll('.topnav-links a'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const setActiveNav = (id) => {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === '#' + id;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

if (sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length) {
        setActiveNav(visible[0].target.id);
      }
    },
    {
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0.15, 0.35, 0.6]
    }
  );

  sections.forEach((section) => observer.observe(section));

  const initial = sections.find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top >= 0 && rect.top < window.innerHeight * 0.45;
  });

  setActiveNav((initial || sections[0]).id);
}

const collabItems = Array.from(document.querySelectorAll('.collab-item'));

const closeCollabItems = () => {
  collabItems.forEach((item) => {
    item.dataset.open = 'false';
    const trigger = item.querySelector('.collab-trigger');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
};

collabItems.forEach((item) => {
  const trigger = item.querySelector('.collab-trigger');

  if (!trigger) {
    return;
  }

  trigger.setAttribute('aria-expanded', 'false');

  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    const isOpen = item.dataset.open === 'true';

    closeCollabItems();

    if (!isOpen) {
      item.dataset.open = 'true';
      trigger.setAttribute('aria-expanded', 'true');
    }

    scheduleAuthorListRefresh();
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.author-list')) {
    collapseExpandedAuthorLists();
  }

  if (!event.target.closest('.collab-item')) {
    closeCollabItems();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    collapseExpandedAuthorLists();
  }

  if (event.key === 'Escape') {
    closeCollabItems();
  }
});
