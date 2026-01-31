console.log("Booting showcase timeline. Projects will stage after the typewriter sequence.");

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const copyEndpoint = 'assets/data/copy.json';

let copyData = null;
let heroCopy = {};
let projects = [];
const cardBootControllers = [];
let sectionsPrimed = false;
let timelineObserver;
let timelineContainer;
let timelineTrack;
let timelineProgressBar;
let globalScrollBound = false;
let timelineWrapperEl;

const h1 = document.getElementById('typewriter-h1');
const p1 = document.getElementById('typewriter-p1');
const p2 = document.getElementById('typewriter-p2');
const p3 = document.getElementById('typewriter-p3');
const links = document.getElementById('links');

loadCopy();

function loadCopy() {
    fetch(copyEndpoint)
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

    applyHeroLinks(copyData.links || {});
    applyProjectsSection(copyData.projectsSection || {});

    projects = Array.isArray(copyData.projects) ? copyData.projects : [];
    renderProjects();

    renderResume(copyData.resume || {});
    renderPhilosophy(copyData.philosophy || {});
    renderTimeline(copyData.timeline || {});
    cacheTimelineElements();
    bindTimelineScrollHelpers();

    if (!globalScrollBound) {
        document.addEventListener('keydown', handleGlobalScrollKeys, { passive: false });
        globalScrollBound = true;
    }

    startHeroSequence();
}

function applyHeroLinks(linksCopy) {
    const timelineLink = document.getElementById('link-timeline');
    if (timelineLink && linksCopy.timeline) {
        timelineLink.textContent = linksCopy.timeline.label || '';
        timelineLink.href = linksCopy.timeline.href || '#';
    }

    const resumeLink = document.getElementById('link-resume');
    if (resumeLink && linksCopy.resume) {
        resumeLink.textContent = linksCopy.resume.label || '';
        resumeLink.href = linksCopy.resume.href || '#';
    }
}

function applyProjectsSection(sectionCopy) {
    const titleEl = document.getElementById('projects-title');
    if (titleEl) {
        titleEl.textContent = sectionCopy.title || '';
    }

    const overlayEl = document.getElementById('projects-overlay-text');
    if (overlayEl) {
        overlayEl.textContent = sectionCopy.overlay || '';
    }
}

function startHeroSequence() {
    const h1Text = heroCopy.h1 || '';
    const p1Text = heroCopy.p1 || '';
    const p2Text = heroCopy.p2 || '';
    const p3Text = heroCopy.p3 || '';

    if (!h1Text || !p1Text || !p2Text || !p3Text) {
        console.warn('Hero copy incomplete; skipping typewriter.');
        return;
    }

    typeWriter(h1, h1Text, 45, () => {
        typeWriter(p1, p1Text, 18, () => {
            typeWriter(p2, p2Text, 18, () => {
                typeWriter(p3, p3Text, 18, () => {
                    links.classList.remove('hidden');
                    links.classList.add('revealed');
                    startShowcaseSequence();
                });
            });
        });
    });
}

function typeWriter(element, text, baseSpeed = 100, callback) {
    if (!element) return;

    element.classList.remove('hidden');
    element.textContent = '';

    if (prefersReducedMotion) {
        element.textContent = text;
        if (callback) callback();
        return;
    }

    let i = 0;

    function type() {
        if (i < text.length) {
            const currentChar = text.charAt(i);
            element.textContent = text.substring(0, i + 1);
            i += 1;

            let delay = baseSpeed;
            if (currentChar === '.') {
                delay = 500;
            } else if (currentChar === ',') {
                delay = 200;
            } else if (currentChar === '-') {
                delay = 300;
            }

            setTimeout(type, delay);
        } else if (callback) {
            callback();
        }
    }

    type();
}

function removeProjectsBootMessage() {
    if (!p3) return;
    p3.classList.add('hidden');
    p3.textContent = '';
}

function startShowcaseSequence() {
    if (sectionsPrimed) return;
    sectionsPrimed = true;

    renderProjects();

    const revealables = document.querySelectorAll('[data-reveal]');
    revealables.forEach(section => section.classList.remove('hidden'));

    const projectSection = document.getElementById('projects-console');
    if (projectSection) {
        projectSection.classList.add('revealed');
    }

    if (prefersReducedMotion) {
        cardBootControllers.forEach(controller => {
            controller.element.textContent = controller.lines.join('\n');
        });
        const overlay = document.getElementById('showcase-overlay');
        if (overlay) {
            overlay.remove();
        }
        removeProjectsBootMessage();
        const resumeSection = document.getElementById('resume-snapshot');
        if (resumeSection) {
            resumeSection.classList.add('revealed');
        }
        const philosophy = document.getElementById('terminal-philosophy');
        if (philosophy) {
            philosophy.classList.add('revealed');
        }
        const timelineSection = document.getElementById('story-timeline');
        if (timelineSection) {
            timelineSection.classList.add('revealed');
        }
        revealTimelineImmediately();
        return;
    }

    const overlay = document.getElementById('showcase-overlay');
    if (overlay) {
        overlay.classList.add('active');
    }

    const cards = Array.from(document.querySelectorAll('.terminal-card'));
    const baseDelay = 700;

    cards.forEach((card, index) => {
        const delay = baseDelay + index * 220;
        setTimeout(() => {
            card.classList.remove('pre-reveal');
            card.classList.add('is-visible');
            card.classList.add('glow-on');
            setTimeout(() => card.classList.remove('glow-on'), 600);

            const controller = cardBootControllers[index];
            if (controller) {
                animateBootLog(controller.element, controller.lines);
            }

            if (index === cards.length - 1 && overlay) {
                removeProjectsBootMessage();
                overlay.classList.add('fade-out');
                setTimeout(() => {
                    if (overlay && overlay.parentElement) {
                        overlay.remove();
                    }
                }, 800);
            } else if (index === cards.length - 1) {
                removeProjectsBootMessage();
            }
        }, delay);
    });

    const resumeSection = document.getElementById('resume-snapshot');
    if (resumeSection) {
        const resumeDelay = baseDelay + cards.length * 220 + 260;
        setTimeout(() => resumeSection.classList.add('revealed'), resumeDelay);
    }

    const philosophy = document.getElementById('terminal-philosophy');
    if (philosophy) {
        const philosophyDelay = baseDelay + cards.length * 220 + 520;
        setTimeout(() => philosophy.classList.add('revealed'), philosophyDelay);
    }

    const timelineDelay = baseDelay + cards.length * 220 + 760;
    setTimeout(() => {
        const timelineSection = document.getElementById('story-timeline');
        if (timelineSection) {
            timelineSection.classList.add('revealed');
        }
        initTimelineObserver();
        updateTimelineProgress();
        updateTimelineVisibility();
    }, timelineDelay);
}

function renderProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    grid.innerHTML = '';
    cardBootControllers.length = 0;

    projects.forEach((project, index) => {
        const card = document.createElement('article');
        card.className = 'terminal-card';
        card.dataset.accent = project.accent || '';

        if (prefersReducedMotion) {
            card.classList.add('is-visible');
        } else {
            card.classList.add('pre-reveal');
        }

        const header = document.createElement('div');
        header.className = 'terminal-header';
        const projectName = project.name || 'project';
        const badge = project.badge || '';
        header.innerHTML = `<span>$ ssh ${projectName}@console</span><span class="terminal-badge">${badge}</span>`;
        card.appendChild(header);

        const bootLog = document.createElement('div');
        bootLog.className = 'boot-log';
        card.appendChild(bootLog);

        cardBootControllers.push({ element: bootLog, lines: project.bootLog || [] });

        if (prefersReducedMotion) {
            bootLog.textContent = (project.bootLog || []).join('\n');
        }

        const catchLine = document.createElement('div');
        catchLine.className = 'catch-line';
        catchLine.textContent = project.catchLine || '';
        card.appendChild(catchLine);

        const featureList = document.createElement('ul');
        featureList.className = 'feature-list';
        (project.features || []).forEach(feature => {
            const li = document.createElement('li');
            li.textContent = `- ${feature}`;
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
            anchor.innerHTML = `<span class="chevron">&gt;</span><span>${cta.label || ''}</span>`;
            ctaRow.appendChild(anchor);
        });
        card.appendChild(ctaRow);

        if (project.linkedTools) {
            const linked = document.createElement('div');
            linked.className = 'linked-tools';
            linked.textContent = project.linkedTools;
            card.appendChild(linked);
        }

        grid.appendChild(card);

        if (!prefersReducedMotion) {
            setTimeout(() => animateBootLog(bootLog, project.bootLog || []), index * 200);
        }
    });
}

function animateBootLog(element, lines, lineDelay = 550) {
    if (!element || !Array.isArray(lines) || lines.length === 0) return;

    element.textContent = '';
    let current = 0;

    function step() {
        if (current >= lines.length) return;
        element.textContent += (current === 0 ? '' : '\n') + lines[current];
        current += 1;
        setTimeout(step, lineDelay);
    }

    step();
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

    const noteEl = document.getElementById('resume-note');
    if (noteEl) {
        noteEl.textContent = pane.note || '';
    }
}

function renderPhilosophy(philosophyCopy) {
    const titleEl = document.getElementById('philosophy-title');
    if (titleEl) {
        titleEl.textContent = philosophyCopy.title || '';
    }

    const ledeEl = document.getElementById('philosophy-lede');
    if (ledeEl) {
        ledeEl.textContent = philosophyCopy.lede || '';
    }

    const grid = document.getElementById('philosophy-grid');
    if (grid) {
        grid.innerHTML = '';
        (philosophyCopy.cards || []).forEach(cardCopy => {
            const card = document.createElement('article');
            card.className = 'philosophy-card';

            const header = document.createElement('header');
            header.textContent = cardCopy.label || '';
            card.appendChild(header);

            const body = document.createElement('p');
            body.textContent = cardCopy.body || '';
            card.appendChild(body);

            grid.appendChild(card);
        });
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
        article.setAttribute('tabindex', '0');

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

function cacheTimelineElements() {
    timelineContainer = document.getElementById('timeline-container');
    if (!timelineContainer) return;

    let wrapper = timelineContainer.closest('.timeline-wrapper');
    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'timeline-wrapper';

        const topEdge = document.createElement('div');
        topEdge.className = 'timeline-edge top';
        wrapper.appendChild(topEdge);

        const bottomEdge = document.createElement('div');
        bottomEdge.className = 'timeline-edge bottom';
        wrapper.appendChild(bottomEdge);

        timelineContainer.parentNode.insertBefore(wrapper, timelineContainer);
        wrapper.appendChild(timelineContainer);

        const progress = document.createElement('div');
        progress.className = 'timeline-progress';
        const progressBar = document.createElement('div');
        progressBar.className = 'timeline-progress-bar';
        progress.appendChild(progressBar);
        wrapper.appendChild(progress);

        timelineProgressBar = progressBar;
    } else {
        timelineProgressBar = wrapper.querySelector('.timeline-progress-bar');
    }

    timelineWrapperEl = wrapper;
    timelineTrack = timelineContainer;
}

function bindTimelineScrollHelpers() {
    if (!timelineContainer) return;

    const wrapper = timelineWrapperEl || timelineContainer.closest('.timeline-wrapper');
    if (!wrapper) return;

    const entries = timelineContainer.querySelectorAll('.timeline-entry');
    if (!entries.length) return;

    if (prefersReducedMotion) {
        wrapper.classList.add('reduce-motion');
    } else {
        wrapper.classList.remove('reduce-motion');
    }

    timelineTrack = timelineContainer;
    timelineTrack.addEventListener('scroll', onTimelineScroll, { passive: true });
    timelineTrack.addEventListener('keydown', handleTimelineKeydown);

    updateTimelineProgress();
    updateTimelineVisibility();
}

function onTimelineScroll() {
    updateTimelineProgress();
    updateTimelineVisibility();
}

function handleTimelineKeydown(event) {
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        focusNextTimelineEntry(1);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        focusNextTimelineEntry(-1);
    }
}

function focusNextTimelineEntry(direction) {
    if (!timelineTrack) return;
    const entries = Array.from(timelineTrack.querySelectorAll('.timeline-entry'));
    if (!entries.length) return;

    const focused = document.activeElement;
    let index = entries.indexOf(focused.closest('.timeline-entry'));

    if (index === -1) {
        index = direction > 0 ? 0 : entries.length - 1;
    } else {
        index = (index + direction + entries.length) % entries.length;
    }

    const target = entries[index];
    if (!prefersReducedMotion) {
        target.scrollIntoView({ block: 'center', behavior: 'smooth' });
        target.focus({ preventScroll: true });
    } else {
        target.scrollIntoView({ block: 'center' });
        target.focus();
    }
}

function updateTimelineProgress() {
    if (!timelineTrack || !timelineProgressBar) return;

    const maxScroll = timelineTrack.scrollHeight - timelineTrack.clientHeight;
    const progress = maxScroll > 0 ? timelineTrack.scrollTop / maxScroll : 0;
    timelineProgressBar.style.height = `${Math.min(Math.max(progress, 0), 1) * 100}%`;
}

function updateTimelineVisibility() {
    if (!timelineTrack) return;
    if (prefersReducedMotion) {
        timelineTrack.querySelectorAll('.timeline-entry').forEach(entry => entry.classList.add('is-visible'));
        return;
    }
    const entries = Array.from(timelineTrack.querySelectorAll('.timeline-entry'));
    const viewportTop = timelineTrack.scrollTop;
    const viewportBottom = viewportTop + timelineTrack.clientHeight;

    entries.forEach(entry => {
        const entryTop = entry.offsetTop;
        const entryBottom = entryTop + entry.offsetHeight;
        const visible = entryBottom > viewportTop + 60 && entryTop < viewportBottom - 60;
        if (visible) {
            entry.classList.add('is-visible');
        } else {
            entry.classList.remove('is-visible');
        }
    });
}

function handleGlobalScrollKeys(event) {
    if (event.defaultPrevented) return;
    if (event.repeat) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const target = event.target;
    if (target && target.tagName) {
        const tag = target.tagName.toLowerCase();
        if (['input', 'textarea', 'select', 'button'].includes(tag) || target.isContentEditable) {
            return;
        }
    }

    const offset = Math.round(window.innerHeight * 0.35);
    if (event.key === 'j') {
        if (scrollTimeline('down')) {
            event.preventDefault();
            return;
        }
        event.preventDefault();
        scrollWindow(offset);
    } else if (event.key === 'k') {
        if (scrollTimeline('up')) {
            event.preventDefault();
            return;
        }
        event.preventDefault();
        scrollWindow(-offset);
    }
}

function scrollWindow(distance) {
    if (prefersReducedMotion) {
        window.scrollBy(0, distance);
    } else {
        window.scrollBy({ top: distance, behavior: 'smooth' });
    }
}

function scrollTimeline(direction) {
    if (!timelineTrack || !timelineWrapperEl) return false;

    const rect = timelineWrapperEl.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const maxScroll = timelineTrack.scrollHeight - timelineTrack.clientHeight;

    if (direction === 'down') {
        if (rect.top <= viewportHeight * 0.85 && rect.bottom >= 80) {
            if (timelineTrack.scrollTop < maxScroll - 2) {
                const delta = Math.round(timelineTrack.clientHeight * 0.6);
                scrollTimelineBy(delta);
                return true;
            }
        }
    } else if (direction === 'up') {
        if (rect.bottom >= viewportHeight * 0.15 && rect.top <= viewportHeight) {
            if (timelineTrack.scrollTop > 2) {
                const delta = Math.round(timelineTrack.clientHeight * 0.6);
                scrollTimelineBy(-delta);
                return true;
            }
        }
    }
    return false;
}

function scrollTimelineBy(distance) {
    if (!timelineTrack) return;

    const behavior = prefersReducedMotion ? 'auto' : 'smooth';
    timelineTrack.scrollBy({ top: distance, behavior });

    if (prefersReducedMotion) {
        updateTimelineProgress();
        updateTimelineVisibility();
    } else {
        requestAnimationFrame(() => {
            updateTimelineProgress();
            updateTimelineVisibility();
        });
    }
}
