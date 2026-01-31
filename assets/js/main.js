console.log("Booting showcase timeline. Projects will stage after the typewriter sequence.");

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const projects = [
    {
        id: 'vixl',
        name: 'vixl',
        badge: 'grid//dataframe',
        accent: 'vixl',
        bootLog: ['loading pandas bindings...', 'spawning curses grid...', 'ready // press : to command'],
        catchLine: 'Spreadsheets for people who trust fingers over formulas. Pandas power, Vim precision.',
        features: [
            'Modal DataFrame grid with Vim navigation over Pandas + NumPy.',
            'Explicit Python command bar keeps every transform audit-ready.',
            'PyInstaller binary ships with self-update flag for frictionless installs.'
        ],
        ctas: [
            { label: 'view source', url: 'https://github.com/ryangerardwilson/vixl' },
            { label: 'install script', url: 'https://raw.githubusercontent.com/ryangerardwilson/vixl/main/install.sh' }
        ],
        linkedTools: 'links with xyz for fast backlog CSV edits.'
    },
    {
        id: 'o',
        name: 'o',
        badge: 'matrix//filesystem',
        accent: 'o',
        bootLog: ['warming curses viewport...', 'streaming directory rain...', 'ready // enter toggles view'],
        catchLine: 'File trees as living streams. Triage your filesystem at 120 FPS without leaving home row.',
        features: [
            'Matrix-mode columns freeze on focus so you never lose context.',
            'Leader commands cover marks, yanks, renames, and bulk ops in one tap.',
            'Configurable handlers pipe into Vim, Vixl, or your terminal stack.'
        ],
        ctas: [
            { label: 'view source', url: 'https://github.com/ryangerardwilson/o' },
            { label: 'install script', url: 'https://raw.githubusercontent.com/ryangerardwilson/o/main/install.sh' }
        ],
        linkedTools: 'opens vixl and rt directly from directory view.'
    },
    {
        id: 'rt',
        name: 'rt',
        badge: 'taste//trainer',
        accent: 'rt',
        bootLog: ['loading curated markdown...', 'priming doc + typing modes...', 'ready // accuracy > 90% or restart'],
        catchLine: 'Taste is muscle memory. Train your typing to ship code that actually sings.',
        features: [
            'Doc mode and typing drills sourced from intentionally structured Markdown.',
            'Strict heading parser enforces real curricula, not AI slop.',
            'Uploads lessons to Grok Collections for search and rote review.'
        ],
        ctas: [
            { label: 'view source', url: 'https://github.com/ryangerardwilson/rt' },
            { label: 'install script', url: 'https://raw.githubusercontent.com/ryangerardwilson/rt/main/install.sh' }
        ],
        linkedTools: 'pairs with o for editing lessons in place.'
    },
    {
        id: 'xyz',
        name: 'xyz',
        badge: 'jtbd//backlog',
        accent: 'xyz',
        bootLog: ['hydrating agenda cache...', 'mounting outcome pipeline...', 'ready // log when x -> y so z'],
        catchLine: 'Outcome-first backlog OS. Log the job, not the busywork, and let compounding bets stack.',
        features: [
            'Agenda and month view with instant toggles and vim navigation.',
            'Deterministic CLI (-x/-y/-z) for scripted backlog updates.',
            'CSV-backed storage with $EDITOR integration for fast edits.'
        ],
        ctas: [
            { label: 'view source', url: 'https://github.com/ryangerardwilson/xyz' },
            { label: 'install script', url: 'https://raw.githubusercontent.com/ryangerardwilson/xyz/main/install.sh' }
        ],
        linkedTools: 'exports tasks to vixl for deeper analysis.'
    },
    {
        id: 'clipai',
        name: 'clipai',
        badge: 'clipboard//ai',
        accent: 'clipai',
        bootLog: ['monitoring wl clipboard...', 'awaiting ai{{ prompt }}...', 'ready // background worker armed'],
        catchLine: 'Clipboard-triggered AI macros. Copy ai{{...}}, get the answer before you leave home row.',
        features: [
            'Clipboard watcher swaps ai{{ prompt }} with OpenAI responses in real time.',
            'CLI mode pipes answers straight into your buffer for scripts and automations.',
            'Wayland-native service built on wl-clipboard with a systemd user unit for persistence.'
        ],
        ctas: [
            { label: 'view source', url: 'https://github.com/ryangerardwilson/clipai' },
            { label: 'install script', url: 'https://raw.githubusercontent.com/ryangerardwilson/clipai/main/install.sh' }
        ],
        linkedTools: 'feeds vixl, o, rt, and xyz without breaking flow.'
    }
];

const cardBootControllers = [];
let sectionsPrimed = false;

function typeWriter(element, text, baseSpeed = 100, callback) {
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

const h1 = document.getElementById('typewriter-h1');
const p1 = document.getElementById('typewriter-p1');
const p2 = document.getElementById('typewriter-p2');
const p3 = document.getElementById('typewriter-p3');
const links = document.getElementById('links');

const h1Text = 'Hello, world.';
const p1Text = 'I\'m Ryan - Catholic, husband, and Wiom\'s network architect building India\'s unlimited internet with AI systems.';
const p2Text = 'I ship terminal-native tools and automation primitives that keep builders in flow and make data transformations legible.';
const p3Text = 'Projects booting...';

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
        const philosophy = document.getElementById('terminal-philosophy');
        if (philosophy) {
            philosophy.classList.add('revealed');
        }
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

    const philosophy = document.getElementById('terminal-philosophy');
    if (philosophy) {
        const philosophyDelay = baseDelay + cards.length * 220 + 360;
        setTimeout(() => philosophy.classList.add('revealed'), philosophyDelay);
    }
}

function renderProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    grid.innerHTML = '';
    cardBootControllers.length = 0;

    projects.forEach(project => {
        const card = document.createElement('article');
        card.className = 'terminal-card';
        card.dataset.accent = project.accent;

        if (prefersReducedMotion) {
            card.classList.add('is-visible');
        } else {
            card.classList.add('pre-reveal');
        }

        const header = document.createElement('div');
        header.className = 'terminal-header';
        header.innerHTML = `<span>$ ssh ${project.name}@console</span><span class="terminal-badge">${project.badge}</span>`;
        card.appendChild(header);

        const bootLog = document.createElement('div');
        bootLog.className = 'boot-log';
        card.appendChild(bootLog);

        cardBootControllers.push({ element: bootLog, lines: project.bootLog });

        if (prefersReducedMotion) {
            bootLog.textContent = project.bootLog.join('\n');
        }

        const catchLine = document.createElement('div');
        catchLine.className = 'catch-line';
        catchLine.textContent = project.catchLine;
        card.appendChild(catchLine);

        const featureList = document.createElement('ul');
        featureList.className = 'feature-list';
        project.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = `- ${feature}`;
            featureList.appendChild(li);
        });
        card.appendChild(featureList);

        const ctaRow = document.createElement('div');
        ctaRow.className = 'cta-row';
        project.ctas.forEach(cta => {
            const anchor = document.createElement('a');
            anchor.href = cta.url;
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            anchor.className = 'cta-button';
            anchor.innerHTML = `<span class="chevron">&gt;</span><span>${cta.label}</span>`;
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
