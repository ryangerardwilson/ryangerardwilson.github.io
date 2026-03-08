console.log("Initializing showcase timeline.");

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const copyEndpoint = 'assets/data/copy.json';

let copyData = null;
let heroCopy = {};
let sectionsPrimed = false;
let timelineObserver;

const h1 = document.getElementById('typewriter-h1');
const p1 = document.getElementById('typewriter-p1');
const p2 = document.getElementById('typewriter-p2');
const p3 = document.getElementById('typewriter-p3');
const links = document.getElementById('links');
const footer = document.getElementById('site-footer');

loadCopy();

function loadCopy() {
    fetch(copyEndpoint, { cache: 'no-store' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load copy.json: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            copyData = data;
            initializeCopy();
        })
        .catch(error => {
            console.error('Copy bootstrap failed:', error);
        });
}

function initializeCopy() {
    if (!copyData) return;

    heroCopy = copyData.hero || {};
    renderResume(copyData.resume || {});
    renderTimeline(copyData.timeline || {});
    applyFooter(copyData.footer || {});

    startHeroSequence();
}

function sortTimelineItems(itemList) {
    return [...itemList].sort((left, right) => {
        const rightStamp = parseTimelineDate(right && right.date);
        const leftStamp = parseTimelineDate(left && left.date);
        if (rightStamp !== leftStamp) return rightStamp - leftStamp;
        const leftType = left && left.type ? left.type : '';
        const rightType = right && right.type ? right.type : '';
        if (leftType !== rightType) return leftType.localeCompare(rightType);
        return (left && left.id ? left.id : '').localeCompare(right && right.id ? right.id : '');
    });
}

function parseTimelineDate(value) {
    const stamp = Date.parse(value || '');
    return Number.isNaN(stamp) ? -Infinity : stamp;
}

function startHeroSequence() {
    const h1Text = heroCopy.h1 || '';
    const p1Text = heroCopy.p1 || '';
    const p2Text = heroCopy.p2 || '';
    const p3Text = heroCopy.p3 || '';

    if (!h1Text || !p1Text || !p2Text) {
        console.warn('Hero copy incomplete; skipping typewriter.');
        return;
    }

    h1.classList.remove('hidden');
    p1.classList.remove('hidden');
    p2.classList.remove('hidden');
    h1.textContent = h1Text;
    p1.textContent = p1Text;
    p2.textContent = p2Text;

    if (p3Text) {
        p3.classList.remove('hidden');
        p3.textContent = p3Text;
    } else {
        p3.classList.add('hidden');
        p3.textContent = '';
    }

    if (links) {
        links.classList.remove('hidden');
        links.classList.add('revealed');
    }
    revealFooter();
    startShowcaseSequence();
}

function startShowcaseSequence() {
    if (sectionsPrimed) return;
    sectionsPrimed = true;

    const revealables = document.querySelectorAll('[data-reveal]');
    revealables.forEach(section => section.classList.remove('hidden'));

    const resumeSection = document.getElementById('resume-snapshot');
    if (resumeSection) {
        resumeSection.classList.add('revealed');
    }

    const philosophy = document.getElementById('terminal-philosophy');
    if (philosophy) {
        philosophy.classList.add('revealed');
    }

    const overlay = document.getElementById('showcase-overlay');
    if (overlay && overlay.parentElement) {
        overlay.remove();
    }

    const timelineSection = document.getElementById('story-timeline');
    if (timelineSection) {
        timelineSection.classList.add('revealed');
    }

    if (prefersReducedMotion) {
        revealTimelineImmediately();
    } else {
        initTimelineObserver();
    }
}

function createGithubLink(url, projectName) {
    const githubPath = 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z';
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.className = 'project-github-link';
    anchor.setAttribute('aria-label', `Open ${projectName} on GitHub`);
    anchor.innerHTML = [
        '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">',
        `<path fill="currentColor" d="${githubPath}"></path>`,
        '</svg>'
    ].join('');
    return anchor;
}

function formatProjectLaunchDate(value) {
    const stamp = Date.parse(value || '');
    if (Number.isNaN(stamp)) return '';
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }).format(new Date(stamp));
}

function initTimelineObserver() {
    const entries = document.querySelectorAll('[data-timeline]');
    if (!entries.length) return;

    if (prefersReducedMotion) {
        revealTimelineImmediately();
        return;
    }

    if (timelineObserver) {
        entries.forEach(entry => timelineObserver.observe(entry));
        return;
    }

    timelineObserver = new IntersectionObserver((items, observer) => {
        items.forEach(item => {
            if (item.isIntersecting) {
                item.target.classList.add('is-visible');
                observer.unobserve(item.target);
            }
        });
    }, {
        threshold: 0.28,
        rootMargin: '0px 0px -10% 0px'
    });

    entries.forEach(entry => timelineObserver.observe(entry));
}

function revealTimelineImmediately() {
    const entries = document.querySelectorAll('[data-timeline]');
    entries.forEach(entry => entry.classList.add('is-visible'));
    if (timelineObserver) {
        entries.forEach(entry => timelineObserver.unobserve(entry));
    }
}

function renderResume(resumeCopy) {
    const titleEl = document.getElementById('resume-title');
    if (titleEl) {
        titleEl.textContent = resumeCopy.title || '';
    }

    const subtitleEl = document.getElementById('resume-subtitle');
    if (subtitleEl) {
        subtitleEl.textContent = resumeCopy.subtitle || '';
    }

    const metaContainer = document.getElementById('resume-meta');
    if (metaContainer) {
        metaContainer.innerHTML = '';
        (resumeCopy.meta || []).forEach(item => {
            const card = document.createElement('article');
            card.className = 'resume-card';

            const header = document.createElement('header');
            header.textContent = item.label || '';
            card.appendChild(header);

            const body = document.createElement('p');
            body.textContent = item.body || '';
            card.appendChild(body);

            metaContainer.appendChild(card);
        });
    }

    const pane = resumeCopy.pane || {};

    const nameEl = document.getElementById('resume-name');
    if (nameEl) {
        nameEl.textContent = pane.name || '';
    }

    const avatarEl = document.getElementById('resume-avatar');
    if (avatarEl) {
        const avatarSrc = resumeCopy.avatarUrl || pane.avatarUrl || 'https://unavatar.io/x/ryan_improvises?refresh=1';
        avatarEl.src = avatarSrc;
        avatarEl.alt = pane.name ? `${pane.name} avatar` : "Profile avatar";
    }

    const summaryEl = document.getElementById('resume-summary');
    if (summaryEl) {
        summaryEl.textContent = pane.summary || '';
    }

    const cta = document.getElementById('resume-cta');
    const ctaLabel = document.getElementById('resume-cta-label');
    if (cta) {
        cta.href = pane.ctaHref || '#';
    }
    if (ctaLabel) {
        ctaLabel.textContent = pane.ctaLabel || '';
    }

    const notesLink = document.getElementById('resume-notes');
    const notesLabel = document.getElementById('resume-notes-label');
    if (notesLink) {
        notesLink.href = pane.notesHref || '#';
    }
    if (notesLabel) {
        notesLabel.textContent = pane.notesLabel || '';
    }

    const noteEl = document.getElementById('resume-note');
    if (noteEl) {
        noteEl.textContent = pane.note || '';
    }
}

function renderTimeline(timelineCopy) {
    const titleEl = document.getElementById('timeline-title');
    if (titleEl) {
        titleEl.textContent = timelineCopy.title || '';
    }

    const subtitleEl = document.getElementById('timeline-subtitle');
    if (subtitleEl) {
        subtitleEl.textContent = timelineCopy.subtitle || '';
    }

    const container = document.getElementById('timeline-container');
    if (!container) return;

    container.querySelectorAll('.timeline-entry').forEach(entry => entry.remove());

    const items = sortTimelineItems([
        ...(Array.isArray(timelineCopy.projects) ? timelineCopy.projects : []),
        ...(Array.isArray(timelineCopy.lifeEvents) ? timelineCopy.lifeEvents : [])
    ]);
    items.forEach(item => container.appendChild(renderTimelineItem(item)));
}

function renderTimelineItem(item) {
    const article = document.createElement('article');
    article.className = 'timeline-entry';
    article.setAttribute('data-timeline', '');
    article.dataset.kind = item.type || 'lifeEvent';

    const stamp = document.createElement('span');
    stamp.className = 'timeline-stamp';
    stamp.textContent = resolveTimelineLabel(item);
    article.appendChild(stamp);

    const card = document.createElement('div');
    card.className = 'timeline-card';

    if (item.type === 'project') {
        card.classList.add('timeline-card--project');
        if (item.accent) {
            card.dataset.accent = item.accent;
        }
        renderProjectTimelineCard(card, item);
    } else {
        card.classList.add('timeline-card--life');
        renderLifeEventTimelineCard(card, item);
    }

    article.appendChild(card);
    return article;
}

function resolveTimelineLabel(item) {
    if (item && item.label) return item.label;
    return formatProjectLaunchDate(item && item.date);
}

function renderProjectTimelineCard(card, item) {
    const header = document.createElement('div');
    header.className = 'terminal-header';

    const title = document.createElement('header');
    title.textContent = `PRODUCT LAUNCH: ${item.title || 'project'}`;
    header.appendChild(title);

    if (item.githubUrl) {
        header.appendChild(createGithubLink(item.githubUrl, item.title || 'project'));
    }
    card.appendChild(header);

    if (item.summary) {
        const summary = document.createElement('div');
        summary.className = 'timeline-project-summary';
        summary.textContent = item.summary;
        card.appendChild(summary);
    }

    const bullets = Array.isArray(item.bullets) ? item.bullets : [];
    if (bullets.length) {
        card.appendChild(renderTimelineList(bullets, 'feature-list'));
    }
}

function renderLifeEventTimelineCard(card, item) {
    const header = document.createElement('header');
    header.textContent = item.title || '';
    card.appendChild(header);

    const bullets = Array.isArray(item.bullets) ? item.bullets : [];
    if (bullets.length) {
        card.appendChild(renderTimelineList(bullets));
    }
}

function renderTimelineList(items, className = '') {
    const list = document.createElement('ul');
    if (className) {
        list.className = className;
    }
    items.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        list.appendChild(li);
    });
    return list;
}

function applyFooter(footerCopy) {
    const resumeLink = document.querySelector('.footer-cta');
    if (resumeLink) {
        resumeLink.href = footerCopy && footerCopy.resumeHref ? footerCopy.resumeHref : 'resume.pdf';
    }

    const notesLink = document.querySelector('.footer-notes');
    if (notesLink) {
        notesLink.href = footerCopy && footerCopy.notesHref ? footerCopy.notesHref : 'https://notes.ryangerardwilson.com/';
        if (footerCopy && footerCopy.notesLabel) {
            notesLink.textContent = footerCopy.notesLabel;
        }
    }
}

function revealFooter() {
    if (!footer || footer.classList.contains('revealed')) return;
    footer.classList.remove('hidden');
    footer.classList.add('revealed');
}
