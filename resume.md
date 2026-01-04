# Resume - Ryan Gerard Wilson

## Summary

10 years of professional experience, former 3x founder, and currently building 
a career as a cross-functional IC (individual contributor) in start ups, where 
I iterate over both, the business logic and the code/ technical implementation 
of simple statistical as well as AI/ML models. With my early career experience 
in intellectual property litigation.

- Website: ryangerardwilson.com
- LinkedIn: https://www.linkedin.com/in/ryangerardwilson/
- Residence: Gurugram, Haryana, India
- Email: ryan@wilsonfamilyoffice.in
- Phone: +91-9958467951

My tech stack is based on Arch Linux, vanilla vim (no plugins, just simple 
tweaks to a .vimrc), dozens of self-customized symbolically linked bash scripts 
(designed to eliminate GUI interfaces from my workflow) and XAI's SuperGrok 
(with the pre-configured instruction "roast my code as if you were Linus 
Trovalds"). While I have built production grade apps in various languages
(Python, PHP, JavaScript, Rust, Haskell, OCaml) and frameworks (Laravel, NodeJS, 
NextJS, ReactJS, Tailwind, Flask, FastAPI), my currernt area of focus is on 
rooting myself to the trifecta of Assembly, C Lang, and Python, for the 
following reasons:

a. Assembly (to strengthen intuition on how hardware registers work, and to
appreciate C lang)

b. C lang (all high level languages are implemented in C; this helps me 
appreciate all high level languages, keeping me language-agnostic)

c. Python (because engineering is less about writing code, and more about
solving real world problems).

## Entrepreneur-in-Residence, Wiom (2022 - Present)

At Wiom, I work in the *Decision Sciences* team. As part of this team, we take
a problem statement, make it less dumb, restrain our action-bias to write code
unless we are certain that the problem is articulated properly, ruthlessly
simplify the most viable solution.  Push to production. Track metrics. And,
take a call whether to persevere with future iterations or pivot. Key
Contributions include:

a. Genie (2025): Rebuilt Wiom's core matchmaking algorithm (simplifying both
the code, and the Product design). Genie determines if a new lead is
serviceable, and if so, decides which Partners should be notified of that lead,
and when. The employee who originally created the algo left at a time when
documentation practices we poor - thus, re-writing and deploying this algo to
production with zero downtime was massively painful, and rewarding. A few months 
post the initial deployment, integrated a prototype GNN (graph neural network) 
into Genie. Prototypes are easy, production is hard. While a GNN may be a simple 
set of python scripts of under 10000 lines of code, the data scientist who 
prototyped this typically work in jupyter notebooks with a procedural programming 
style, in a manner that does not always look readable and expressive. Had to 
strain my eyes for weeks to re-write that logic into pythonic objects with 
well-defined responsibilities interfacing with each other within the genie 
codebase. Also, business teams wanted simplicity and hated the idea of some 
voodoo-logic making decisions, so I had to deploy it in a manner that segregated 
'product oriented genie' from 'business oriented genie'. Also, gave product and 
business teams a 'control layer', that allowed them to change the product/
business logic of genie within minutes without needing a full re-deployment.

b. CRM Forge (2024): Built an internal 'Salesforce' - which allows tech teams
to deploy customized CRM-like workflows for business teams in less than 60
minutes. Reduced technical debt - less than 7000 lines of code were used to
deploy a total of 5 CRM systems.

c. Happy (2023): Built a system of apps to reduce reliance on human call centre
executives, via a telephony BOT, and a CRM which coordinates a minimal number
of employees to handle high-pain escalations.

Additional Roles: Apply legal expertise in technology, IP, and corporate law to
help out with IP strategy and fund-raise efforts.

## Portfolio of the Best Code I've Written in Public Repos (2025)

With over 117 Github repos, I would highlight the following:

a. rtutor, pytutor, ctutor, atutor: Built to solve this problem for myself:
given that AI vastly improves my ability to access 'low quality code', what
rituals must I practice to avoid AI slop in my projects in this era of 'vibe-
coding'.  These apps are systems to keep coding muscle memory sharp by
practicing writing small snippets of code as a daily ritual, in python, c lang,
and assembly, respectively. See: [pytutor](https://github.com/ryangerardwilson/
pytutor), [ctutor](https://github.com/ryangerardwilson/ctutor), and
[atutor](https://github.com/ryangerardwilson/atutor).  By mid-October 2025, I
realized that I could combine all my tutor apps into a single, rtutor app, with
a gtypist-like interface, and feature a progression of tutor courses organized
as courses -> parts -> lessons. This way, I can scale the detail of the lessons
as per the competency of the user. See: [rtutor](https://github.com/ryangerard
wilson/rtutor).

b. vimtutor-advanced: Built this to solve this problem for myself: what rituals
must I practice to use my computer as a samurai does his sword.  This expands
the classic vimtutor cli, covering advanced vim concepts set out in Steve
Oualline's 2001 VimBook. The tutor also expands the idea of using a vim-based
muscle memory to window tiling and browser based navigation, to maximize
productivity by building muscle memory with the right conventions. At one
point, the tutor also covered NeoVim, however, I removed NeoVim tutorials after
concluding that the origianl vim is simply the superior product. See:
[vimtutor- advanced](https://github.com/ryangerardwilson/vimtutor-advanced)

c. rgwml: Built at a time when I found Python's data model confusing and was
intrigued by Rust, I challenged myself to understand what happens 'under the
hood' in common data science/ machine learning operations in the Python/Pandas,
by re-writing whatever I found useful in Pandas - to Rust. This Rust library
got over 300,000 downloads. See: [RGWML](https://crates.io/search?q=rgwml).
Over time, as my programming intuition deepended, I stopped using the library
as a 'crutch', and pivoted to 'raw-dogging' data analysis in the Python REPL.

## IndieHacker (2021-22)

Once I gained confidence in my coding abilities, I felt invincible enough to
'move fast and break things', I quit law firms to IndieHack my way to my own
startup. Hustled SaaS and LegalTech business ideas. They did not work out, and
failed in quick succession within 6 months.

a. SLTYE: A personal finance app, that helps you 'Spend Less Than You Earn'.
Hence, the acronym S.L.T.Y.E.

b. LavendOrb: A dashboard app that helps break complex goals into short,
medium, and long term actionable steps using First Principles.

c. EquitysDarlings: A CRM for law firms.

## Intellectual Property & IP/Tech Lawyer (2016-20)

My academic background and early career in IP and tech law) strengthened my
language aptitude analytical and ethical framework. The technical precision
required by a lawyer and that of an engineer are inextricably intertwined -
which is why my foundations in law, in fact, accelerated my understanding of
modern artificial intelligence and machine learning technologies. Here, it is
worth mentioning that a 2020 study published in the reputed nature.com found
that 'language aptitude', not mathematics, is the best predictor of the ability
to master programming languages. See:
https://www.nature.com/articles/s41598-020-60661-8.
 
During my career as an attorney, I nurtured a deep interest in ideas of Elon
Musk, Naval Ravikant, etc., on how AI is going to change everything - and a
equally deep regret for Rainmaker's brutal ending (see below) - which is why I
decided to spend the years working in law, to also learn to code -  and keep my
dream of doing a tech start up in the future alive.

## Marketing Associate, Rainmaker (2015)

First job. Worked on email marketing campaigns using GUI tools. Realized I
could be 100x more efficient if I knew how to code. Start up burnt too much
cash too fast, and went operationally dead within 6 months. Got to observe
first hand tough decisions start up leadership need to make when funding dries
up (lay offs, paying employees half salaries, etc.).

## Academic Background

- 2007: Goethe-Zertifikat B1, Goethe-Institut e.V. 
- 2015: B.A. LL.B. (Hons.), Dr. Ram Manohar Lohia National Law University, 
        Lucknow 

## Certifications

- [XGBoost Deep Dive with Python & Pandas | Hands on Data Science](https://www
.udemy.com/certificate/UC-2dd68e82-8432-4d6c-b592-b60fc957c7e6/)
- [Google Apps Script Complete Course Beginner to Advanced](https://www.udemy.
com/certificate/UC-a0f4e0e6-fd4c-4b7e-8b41-a0a06dad65e5/)
- [Build an AutoGPT Code Writing AI Tool with Rust and GPT4](https://www.udemy
.com/certificate/UC-21d58a2d-3ee8-44a4-a0c5-63c912ad6aa7/)
- [PyScript - The Complete Guide](https://www.udemy.com/certificate/UC-c3165e0
6-2fa4-45af-87c7-3d06fe251b46/)
- [Learn Rust by building Real Applications](https://www.udemy.com/certificate
/UC-b446dc59-4fee-4a01-9cab-7e1406f2d48c/)
- [AWS Amazon S3 Mastery Bootcamp](https://www.udemy.com/certificate/UC-7a13b7
a8-b101-4690-b894-2a7c1133ba97/)
- [PHP Date and Time with Carbon by Edwin Diaz](https://www.udemy.com/certific
ate/UC-68d5682e-4d44-4f2b-88dd-ad733a308226/)
- [PHP OOP: Objected Oriented Programming for Beginners + Project](https://www
.udemy.com/certificate/UC-d044b5e9-81d5-4ec4-8980-37540f05e7b9/)
- [Bootstrap 3 Introduction: Create RESPONSIVE Websties Fast](https://www.udem
y.com/certificate/UC-05d6a4b2-c988-42a6-b207-3624e07ac5bd/)
- [Crash Course - Learn to Create a PHP MVC Framework](https://www.udemy.com/c
ertificate/UC-38defa1a-c6e5-41be-8628-264a38d50cee/)
- [Modern JavaScript From The Beginning 2.0](https://www.udemy.com/certificate
/UC-934bc855-b3cc-433e-955c-073200c76592/)
- [Laravel - Create a User Registration with Email Notificaton](https://www.ud
emy.com/certificate/UC-259b659a-1228-472d-9680-7e3c14235c85/)
- [Modern HTML & CSS From the Beginning 2.0](https://www.udemy.com/certificate
/UC-7db57ec6-a996-4996-803b-874e0f640d05/)
- [PHP with Laravel for beginners - Become a Master in Laravel](https://www.ud
emy.com/certificate/UC-41c9c4c3-5f70-4cf8-91e8-5ec0a3395864/)

