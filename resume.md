# Resume - Ryan Gerard Wilson

## Summary

10 years of professional experience, former 3x founder, and currently building 
a career as a cross-functional IC (individual contributor) in start ups, where 
I iterate over both, the business logic and the code/ technical implementation 
of simple statistical as well as AI/ML models, with early career experience in 
intellectual property litigation, and a hobbyist of building the 'ideal' dev 
'power-user' operating system.

- Website   : ryangerardwilson.com
- X/Twitter : https://x.com/ryan_improvises
- LinkedIn  : https://www.linkedin.com/in/ryangerardwilson/
- Residence : Gurugram, Haryana, India
- Email:    : ryan@wilsonfamilyoffice.in
- Phone:    : +91-9958467951

## Core Tech Stack

Arch Linux with a personally-built terminal-based operating system. See: 
[vios](https://github.com/ryangerardwilson/vios). Customized bash scripts for 
CLI efficiency, Vim, and a focus on Assembly (for hardware intuition), C (for 
language-agnostic foundations), and Python (for practical, data-driven 
engineering). Proficient in production apps using Python, Rust, PHP, 
JavaScript, Laravel, Node.js, Next.js, React, Tailwind, Flask, and FastAPI. 

## Entrepreneur-in-Residence, Wiom (October 2022 - Present)

At Wiom, I work in the *Decision Sciences* team (a 2 person offshoot of the
Product Team). As part of this team, we take a problem statement, make it less 
dumb, restrain our action-bias to write code unless we are certain that the 
problem is articulated properly, ruthlessly simplify the most viable solution.  
Push to production. Track metrics. And, take a call whether to persevere with 
future iterations or pivot. Key Contributions include:

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

## IndieHacker (June 2021 - September 22)

Once I gained confidence in my coding abilities, I felt invincible enough to
'move fast and break things', I quit law firms to IndieHack my way to my own
startup. Hustled SaaS and LegalTech business ideas. They did not work out, and
failed in quick succession within 6 months.

a. SLTYE: A personal finance app, that helps you 'Spend Less Than You Earn'.
Hence, the acronym S.L.T.Y.E.

b. LavendOrb: A dashboard app that helps break complex goals into short,
medium, and long term actionable steps using First Principles.

c. EquitysDarlings: A CRM for law firms.

## Intellectual Property & IP/Tech Lawyer (December 2015 - April 2022)

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
decided to spend the years working in law, to also learn to code - and keep my
dream of doing a tech start up in the future alive.

## Marketing Associate, Rainmaker (April 2015 - November 2015)

First job. Worked on email marketing campaigns using GUI tools, organized a
marketing quiz for law school kids, learned basic HTML to help me make pretty
emails. Realized I could be 100x more efficient if I dedicated my self fully to 
the art and science of programming. Start up burnt too much cash too fast, and 
went operationally dead within 6 months. Got to observe first hand tough 
decisions start up leadership need to make when funding dries up (lay offs, 
paying employees half salaries, etc.).

## Academic Background

- 2007: Goethe-Zertifikat B1, Goethe-Institut e.V. 
- 2015: B.A. LL.B. (Hons.), Dr. Ram Manohar Lohia National Law University, 
        Lucknow 

## Open Source 

With over 117 Github repos, I would highlight the following:

a. rtutor: Inspired by the classic gtypist tool (which I used to learn touch 
typing) and the classic unix 'man pages', built to access and organize my 
learnings, refine programming taste, improve my ability to identify AI slop in 
AI-generated code snippets, and practice touch typing across assembly, python, 
C lang, and SQL. See: [rtutor](https://github.com/ryangerardwilson/rtutor).

b. vios: Inspired from the classic 'emacs-os' computing experience, a
terminal-based interface that makes it easy (and snappy) to navigate through
the file system, create, delete, rename, cut, paste - files and directories,
besides opening files in vim, and pdfs in zathura. Serves as my IDE, when I
need to work on projects that involve a complex tree of dirs and sub-dirs. See:
[vios](https://github.com/ryangerardwilson/vios).

c. rgwml: Built at a time when I found Python's data model confusing and was
intrigued by Rust, I challenged myself to understand what happens 'under the
hood' in common data science/ machine learning operations in the Python/Pandas,
by re-writing whatever I found useful in Pandas - to Rust. This Rust library
got over 300,000 downloads. See: [RGWML](https://crates.io/search?q=rgwml).
Over time, as my programming intuition deepended, I stopped using the library
as a 'crutch', and pivoted to 'raw-dogging' data analysis in the Python REPL.
rtutor (point a. above) can be considered rgwml's 'spiritual-successor'.

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

