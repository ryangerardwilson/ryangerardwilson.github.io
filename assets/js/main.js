console.log("Initializing showcase timeline.");

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const copyEndpoint = 'assets/data/copy.json';

let copyData = null;
let heroCopy = {};
let projects = [];
let projectsSectionCopy = {};
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
    projectsSectionCopy = copyData.projectsSection || {};
    applyProjectsSection(projectsSectionCopy);

    projects = sortProjectsByLaunchDate(Array.isArray(copyData.projects) ? copyData.projects : []);
    const grid = document.getElementById('project-grid');
    if (grid && grid.children.length === 0) {
        renderProjects();
    }

    renderResume(copyData.resume || {});
    renderTimeline(copyData.timeline || {});
    applyFooter(copyData.footer || {});
    applyFooter(copyData.footer || {});

    startHeroSequence();
}

function sortProjectsByLaunchDate(projectList) {
    return [...projectList].sort((left, right) => {
        const rightStamp = parseLaunchDate(right && right.launchDate);
        const leftStamp = parseLaunchDate(left && left.launchDate);
        if (rightStamp !== leftStamp) return rightStamp - leftStamp;
        return (left && left.name ? left.name : '').localeCompare(right && right.name ? right.name : '');
    });
}

function parseLaunchDate(value) {
    const stamp = Date.parse(value || '');
    return Number.isNaN(stamp) ? -Infinity : stamp;
}

function applyProjectsSection(sectionCopy) {
    const titleEl = document.getElementById('projects-title');
    if (titleEl) {
        titleEl.textContent = sectionCopy.title || '';
    }
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

function renderProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    grid.innerHTML = '';

    projects.forEach(project => {
        const card = document.createElement('article');
        card.className = 'terminal-card';
        card.dataset.accent = project.accent || '';
        card.classList.add('is-visible');

        const header = document.createElement('div');
        header.className = 'terminal-header';
        const projectName = project.name || 'project';
        const badge = project.badge || '';
        const title = document.createElement('h3');
        title.className = 'project-title';
        title.textContent = projectName;
        header.appendChild(title);

        if (badge) {
            const badgeEl = document.createElement('span');
            badgeEl.className = 'terminal-badge';
            badgeEl.textContent = badge;
            header.appendChild(badgeEl);
        }
        card.appendChild(header);

        const catchLine = document.createElement('div');
        catchLine.className = 'catch-line';
        catchLine.textContent = project.catchLine || '';
        card.appendChild(catchLine);

        const featureList = document.createElement('ul');
        featureList.className = 'feature-list';
        (project.features || []).slice(0, 2).forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featureList.appendChild(li);
        });
        card.appendChild(featureList);

        const ctaRow = document.createElement('div');
        ctaRow.className = 'cta-row';
        (project.ctas || []).forEach(cta => {
            const anchor = document.createElement('a');
            anchor.href = cta.url || '#';
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            anchor.className = 'cta-button';
            const ctaLabel = resolveProjectCtaLabel(cta, projectsSectionCopy);
            anchor.innerHTML = `<span class="chevron">&gt;</span><span>${ctaLabel}</span>`;
            ctaRow.appendChild(anchor);
        });
        card.appendChild(ctaRow);

        grid.appendChild(card);
    });
}

function resolveProjectCtaLabel(cta, sectionCopy) {
    if (cta && cta.label) return cta.label;
    if (isXPostUrl(cta && cta.url)) {
        return sectionCopy.xPostCtaLabel || 'view post on X';
    }
    return 'open link';
}

function isXPostUrl(url) {
    if (!url || typeof url !== 'string') return false;
    return /^https?:\/\/(?:www\.)?(?:x|twitter)\.com\//i.test(url);
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

    const entries = Array.isArray(timelineCopy.entries) ? timelineCopy.entries : [];
    entries.forEach(entryCopy => {
        const article = document.createElement('article');
        article.className = 'timeline-entry';
        article.setAttribute('data-timeline', '');

        const stamp = document.createElement('span');
        stamp.className = 'timeline-stamp';
        stamp.textContent = entryCopy.stamp || '';
        article.appendChild(stamp);

        const card = document.createElement('div');
        card.className = 'timeline-card';

        const header = document.createElement('header');
        header.textContent = entryCopy.headline || '';
        card.appendChild(header);

        const bullets = Array.isArray(entryCopy.bullets) ? entryCopy.bullets : [];
        if (bullets.length) {
            const list = document.createElement('ul');
            bullets.forEach(text => {
                const li = document.createElement('li');
                li.textContent = text;
                list.appendChild(li);
            });
            card.appendChild(list);
        }

        article.appendChild(card);
        container.appendChild(article);
    });
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
