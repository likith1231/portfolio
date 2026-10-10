// Everything on the site reads from this file. Edit here, not in the components.

export const profile = {
  name: "Likith Lochan",
  short: "Likith",
  callsign: "LIKITH-L",
  role: "DevOps · Full Stack · AI/ML Engineer",
  roles: ["DevOps Engineer", "Full Stack Developer", "AI/ML Engineer"],
  headline: "I build systems that fix themselves.",
  intro:
    "Agents that patch production incidents, an IDE whose AI proves its code before you see it, and a booking app that scales out when everyone hits “Book Now” at once. Shipped first, then armored.",
  location: "Bengaluru, India",
  timezone: "Asia/Kolkata",
  education: "B.E. Computer Science · APS College of Engineering",
  focus: "DevOps · Full Stack · AI/ML",
  available: "Open to DevOps, Full Stack and AI/ML engineering roles and internships",
  building: "Putting Orbit IDE, GhostOps and ResilientCommerce on the cloud",
  next: "Making GhostOps handle more kinds of incidents",
  email: "likithlu3@gmail.com",
  // Drop a PDF into /public and set this to "/your-file.pdf" to show the Resume links.
  resume: "/Likith_Lochan_Resume.pdf",
};

export const socials = {
  github: "https://github.com/likith1231",
  linkedin: "https://www.linkedin.com/in/likith-lochan-2ab93b290",
  githubUser: "likith1231",
};

export type FlowNode = { label: string; sub?: string; tone?: "red" | "gold" | "steel" };


export type Suit = {
  slug: string;
  mark: number; // Strength rank, 6 = strongest. Decides the order in the Hall of Armor.
  suit: string; // The armor this project wears, e.g. "Mark 85"
  short: string; // Short label for buttons
  model: string; // 3D model in /public/models
  name: string;
  tagline: string;
  summary: string;
  stat: { value: string; label: string };
  power: number; // 0–100, shown as the suit's power rating
  stack: string[];
  repo: string;
  // Set `live` to the deployed URL once it's hosted; the suit switches from "Deploying" to "Live".
  live: string | null;
  flagship: boolean;
  flowTitle: string;
  flow: FlowNode[];
  flowNote?: string;
  problem: string;
  how: string[];
  highlights: string[];
  lesson: { title: string; body: string };
  gallery?: { src: string; alt: string }[];
};


export const suits: Suit[] = [
  {
    slug: "ghostops",
    mark: 6,
    suit: "Mark 85",
    short: "Mk 85",
    model: "/models/mark85.glb",
    name: "GhostOps",
    tagline: "Production incidents, patched on their own.",
    summary:
      "An autonomous AIOps platform that acts like an on-call SRE: it detects a real incident, finds the root cause, writes a minimal patch, proves it in a sandbox, and only then opens a pull request for a human.",
    stat: { value: "2", label: "real incidents fixed end to end, each with a validated PR: a memory leak and a failing CI test." },
    power: 98,
    stack: ["CrewAI", "Claude API", "FastAPI", "Kubernetes", "Prometheus", "OPA / Gatekeeper", "Vault", "Chaos Mesh", "ArgoCD"],
    repo: "https://github.com/likith1231/ghostops",
    live: null,
    flagship: true,
    flowTitle: "How an incident moves through GhostOps",
    flow: [
      { label: "Alertmanager", sub: "or a CI webhook", tone: "red" },
      { label: "FastAPI", sub: "starts the pipeline" },
      { label: "Diagnostic Reasoner", sub: "logs · metrics · source", tone: "gold" },
      { label: "Patch Generator", sub: "minimal diff", tone: "gold" },
      { label: "Validation Officer", sub: "Docker sandbox + OPA", tone: "red" },
      { label: "GitHub PR", sub: "for human review" },
    ],
    flowNote: "A failed validation aborts and logs the incident. Nothing reaches GitHub unproven.",
    problem:
      "Alerts wake a human, who then spends the first hour reading logs to find a bug a machine could have spotted. Most of that hour is pattern matching, not judgment.",
    how: [
      "Prometheus and Alertmanager watch a Kubernetes cluster; when something breaks they fire a webhook to a FastAPI backend.",
      "Three CrewAI agents, powered by Claude, run in sequence: a Diagnostic Reasoner reads logs, metrics, source and past incidents; a Patch Generator writes the smallest fix it can; a Validation Officer applies it.",
      "The patch is tested in an ephemeral Docker sandbox with pytest, and checked against OPA / Gatekeeper policies.",
      "Only if both pass does GhostOps open a real GitHub PR, with the explanation and evidence attached. Secrets live in Vault.",
    ],
    highlights: [
      "Memory leak: found an unbounded cache in app.py and capped it (PR #3)",
      "CI failure: traced a `+` that should have been `*` in math_utils.py (PR #4)",
      "Chaos Mesh used to cause real failures instead of faking alerts",
      "OpenTelemetry + Jaeger tracing across the whole pipeline",
    ],
    lesson: {
      title: "Verify before trusting",
      body: "A model may propose the fix; only a passing test and a policy check let it through. The sandbox is the product, the LLM is one part of it.",
    },
  },
  {
    slug: "orbit-ide",
    mark: 5,
    suit: "Mark 50",
    short: "Mk 50",
    model: "/models/mark50.glb",
    name: "Orbit IDE",
    tagline: "The cloud IDE whose AI proves its code works before you see it.",
    summary:
      "Write, run and ship code from any browser: real Linux terminals, live previews, git, real-time collaboration, and a Claude agent that tests its own changes and fixes them until they pass.",
    stat: { value: "16", label: "languages run in a real Linux container per project, with terminals, previews and git." },
    power: 95,
    stack: ["React 19", "Node.js", "Claude API", "Docker", "PostgreSQL", "Yjs", "Socket.IO", "Caddy"],
    repo: "https://github.com/likith1231/Orbit-IDE",
    live: null,
    flagship: true,
    flowTitle: "The proof loop",
    flow: [
      { label: "You ask", sub: "in the agent panel" },
      { label: "Claude edits", sub: "multi-file diff", tone: "gold" },
      { label: "Sandbox copy", sub: "your files untouched" },
      { label: "Tests · run · compile", sub: "npm test, pytest…", tone: "red" },
      { label: "Verified", sub: "you review the diff", tone: "gold" },
    ],
    flowNote: "On failure the real error goes back to Claude, which repairs its own code, up to 3 attempts. Otherwise: an honest “Not verified” badge with the log.",
    problem:
      "AI assistants hand you code that only looks right. You paste it, run it, and find out it's broken. The loop between “suggested” and “works” is left to you.",
    how: [
      "Every project gets its own Linux container with files at /workspace, multiple terminals, and live previews of dev servers.",
      "The Claude agent sees every file and proposes multi-file edits as diffs you accept or reject.",
      "Before you see a change, it's applied to a scratch copy in the sandbox and checked with your tests, by running the program, or at least by compiling it.",
      "If it fails, the real error goes back to Claude, which fixes its own work. You get a Verified badge or the full log.",
    ],
    highlights: [
      "Real-time collaboration with Yjs",
      "Chaos testing: memory limits, CPU throttling, network cuts → resilience score",
      "One-click deploy with a shareable URL",
      "Command palette, source control, GitHub clone, 3 themes",
    ],
    lesson: {
      title: "Honest badges beat confident text",
      body: "Users trust “Not verified, here's the log” more than a model that sounds sure of itself. Claude also writes better code when it knows it will be tested.",
    },
    gallery: [
      { src: "/suits/orbit-hero.webp", alt: "Orbit IDE: editor, explorer, Claude agent and terminal" },
      { src: "/suits/orbit-proof-live.webp", alt: "A proof running live in the agent panel" },
      { src: "/suits/orbit-run-tests.webp", alt: "Running tests from Run & Debug" },
      { src: "/suits/orbit-preview.webp", alt: "Live preview of a dev server" },
    ],
  },
  {
    slug: "resilient-commerce",
    mark: 4,
    suit: "Mark 44 Hulkbuster",
    short: "Hulkbuster",
    model: "/models/hulkbuster.glb",
    name: "ResilientCommerce",
    tagline: "Heavy armor for a booking rush.",
    summary:
      "AetherMed is a clinic booking platform; ResilientCommerce is the heavy DevOps and SRE armor around it, built and load-tested to survive a CoWIN-style rush when everyone hits “Book Now” the moment slots open.",
    stat: { value: "18.9s → 2.7s", label: "p95 latency under a 250-user rush, after tuning the database pool. Then the autoscaler kicked in." },
    power: 92,
    stack: ["Next.js", "Prisma", "PostgreSQL", "Docker", "Kubernetes", "Terraform", "AWS EKS", "ArgoCD", "k6", "Sentry", "OpenTelemetry"],
    repo: "https://github.com/likith1231/Aethermed",
    live: null,
    flagship: true,
    flowTitle: "From git push to a scaled-out cluster",
    flow: [
      { label: "git push", sub: "to main" },
      { label: "GitHub Actions", sub: "build + test" },
      { label: "ArgoCD", sub: "sync · prune · self-heal", tone: "gold" },
      { label: "HPA", sub: "2 → 8 pods @ 60% CPU", tone: "red" },
      { label: "Prometheus · Sentry", sub: "metrics · traces · errors" },
    ],
    flowNote: "Terraform manages the AWS EKS infrastructure; a k6 script simulates the slot-opening rush on /api/slots.",
    problem:
      "Booking apps fall over at exactly the moment people need them: when slots open and everyone arrives at once. The goal wasn't another booking app; it was to show this one scales out, stays up, and can be observed.",
    how: [
      "AetherMed: Next.js App Router, Prisma and Postgres, with patient, doctor and admin portals and an AI booking assistant that speaks English, ಕನ್ನಡ and हिन्दी.",
      "Containerised and deployed to Kubernetes, with a Horizontal Pod Autoscaler: 2 to 8 replicas at 60% CPU, fast scale-up, slow scale-down.",
      "ArgoCD watches the repo with auto-sync, prune and self-heal, so manual drift in the cluster gets reverted.",
      "Prometheus, Grafana, Sentry, Jaeger and OpenTelemetry trace every request; Terraform defines the AWS EKS setup.",
    ],
    highlights: [
      "First load test hit a prerendered page: 0% CPU, HPA never moved",
      "Pointed k6 at the DB-backed /api/slots route to create real load",
      "Prisma's default pool queued requests: p95 18.89s at 0% CPU",
      "connection_limit=20 → p95 2.73s, CPU climbed, HPA scaled 2 → 3",
    ],
    lesson: {
      title: "Load-test the thing that's actually slow",
      body: "Autoscaling on CPU does nothing if the bottleneck is a connection pool. The first fix was a config line, not more pods.",
    },
  },
  {
    slug: "sahayak",
    mark: 3,
    suit: "War Machine",
    short: "War Machine",
    model: "/models/warmachine.glb",
    name: "Sahayak",
    tagline: "Farm to market, minus the middlemen.",
    summary:
      "A farmer-to-consumer marketplace for Karnataka. Farmers list produce by chatting with a Gemini agent, buyers get home delivery with live tracking, and NGOs coordinate food during emergencies.",
    stat: { value: "4", label: "kinds of users served from one app: farmers, buyers, NGOs and admins." },
    power: 84,
    stack: ["Next.js", "FastAPI", "Gemini", "pgvector", "PostgreSQL", "Razorpay", "Three.js"],
    repo: "https://github.com/likith1231/sahayak",
    live: "https://sahayak-two-tau.vercel.app",
    flagship: false,
    flowTitle: "A listing, from voice to buyer",
    flow: [
      { label: "Farmer speaks", sub: "voice or chat" },
      { label: "Gemini agent", sub: "calls real tools", tone: "gold" },
      { label: "Mandi prices", sub: "Agmarknet, daily" },
      { label: "pgvector search", sub: "buyers find it", tone: "red" },
      { label: "Razorpay", sub: "card, UPI or COD" },
    ],
    problem:
      "Farmers sell through layers of middlemen, which lowers what they earn and raises what buyers pay.",
    how: [
      "Farmers create listings by voice; a Gemini agent fills in the details and checks live mandi prices synced from Agmarknet.",
      "Buyers search with pgvector-backed RAG and pay with Razorpay (card / UPI) or cash on delivery.",
      "Orders get delivery slots, live tracking and a 4-digit handover code.",
      "NGOs and community kitchens raise emergency food requests, grouped by area, with crisis windows triggered by weather alerts.",
    ],
    highlights: [
      "AI chat assistant with RAG over listings and prices",
      "Voice listings filled in by AI",
      "Emergency food network for NGOs",
      "FastAPI backend with an ML price-prediction microservice",
    ],
    lesson: {
      title: "Build for the user who isn't online all day",
      body: "Voice beats forms when your user is in a field. The AI earns its place by removing typing, not by adding chat.",
    },
  },
  {
    slug: "project-management",
    mark: 2,
    suit: "Mark 7",
    short: "Mk 7",
    model: "/models/mark7.glb",
    name: "Project Management",
    tagline: "Workspaces, tasks and progress in one app.",
    summary:
      "Multi-workspace project tracking with Clerk organizations and roles, task comments, analytics, a calendar view, and email reminders through Inngest background jobs.",
    stat: { value: "2", label: "roles per workspace, ADMIN and MEMBER, with every protected API request JWT-verified." },
    power: 74,
    stack: ["React 19", "Redux Toolkit", "Express 5", "Prisma", "Neon Postgres", "Clerk", "Inngest"],
    repo: "https://github.com/likith1231/Project-Management",
    live: "https://project-mgt-client.vercel.app",
    flagship: false,
    flowTitle: "A task assignment, end to end",
    flow: [
      { label: "Assign task", sub: "React + Redux" },
      { label: "Express API", sub: "Clerk JWT check", tone: "gold" },
      { label: "Prisma", sub: "Neon Postgres" },
      { label: "Inngest event", sub: "background job", tone: "red" },
      { label: "Email", sub: "assigned + due-date reminder" },
    ],
    problem: "Small teams juggle tasks across chats and spreadsheets, and nobody remembers what's due.",
    how: [
      "Each workspace is a Clerk Organization with its own projects, members and roles.",
      "Projects carry status, priority, dates, progress and a team lead; tasks have a type, status, priority, assignee and due date.",
      "Inngest runs event-driven jobs: an email when a task is assigned and a reminder on the due date if it isn't done.",
      "Recharts analytics break tasks down by status, type and priority, with a calendar view by due date.",
    ],
    highlights: ["Multiple workspaces with roles", "Task comment threads", "Analytics and calendar views", "Dark mode"],
    lesson: { title: "Push the boring work to the background", body: "Reminders belong in an event queue, not in a cron job someone forgets to run." },
  },
  {
    slug: "greencart",
    mark: 1,
    suit: "Mark 1",
    short: "Mk 1",
    model: "/models/mark1.glb",
    name: "GreenCart",
    tagline: "Groceries with live order tracking.",
    summary:
      "A MERN grocery store inspired by Blinkit and Zepto, with a seller dashboard, Cloudinary images, Stripe or cash on delivery, live order tracking and automatic refunds.",
    stat: { value: "0", label: "double charges: payments are confirmed with Stripe on return, with the webhook as a backup." },
    power: 66,
    stack: ["React 19", "Vite", "Express 5", "MongoDB", "Stripe", "Cloudinary", "Tailwind"],
    repo: "https://github.com/likith1231/greencart",
    live: "https://greencart-frontend1.vercel.app",
    flagship: false,
    flowTitle: "An order's lifecycle",
    flow: [
      { label: "Checkout", sub: "Stripe or COD" },
      { label: "Server pricing", sub: "never trusts the browser", tone: "gold" },
      { label: "Seller dispatch", sub: "confirm → pack" },
      { label: "Out for delivery", sub: "partner + countdown", tone: "red" },
      { label: "Delivered", sub: "or refunded" },
    ],
    problem: "Grocery apps promise speed but leave you guessing where the order is.",
    how: [
      "Customers shop by category, keep a synced cart, manage addresses and pay by card or cash.",
      "Prices and tax are calculated on the server; payments are double-checked with Stripe and a webhook so an order is never charged twice.",
      "The seller moves each order through Confirm → Pack → Out for delivery → Delivered, or lets demo mode do it.",
      "Customers get an arrival countdown, a step-by-step timeline and pop-up notifications on any page.",
    ],
    highlights: ["Live order tracking with countdown", "Cancel & automatic refund", "Reorder and printable invoices", "Seller dashboard with new-order alerts"],
    lesson: { title: "Never trust the client with money", body: "Every price, tax and payment status is decided on the server. The first suit taught the basics." },
    gallery: [
      { src: "/suits/greencart-home.webp", alt: "GreenCart home page" },
      { src: "/suits/greencart-order-tracking.webp", alt: "Live order tracking" },
      { src: "/suits/greencart-seller-orders.webp", alt: "Seller orders dashboard" },
    ],
  },
];

export const flagships = suits.filter((s) => s.flagship);

// The War Machine arsenal: skills as weapon systems.
export const arsenal: { group: string; system: string; items: string[] }[] = [
  { group: "Languages", system: "Core firmware", items: ["Python", "TypeScript", "JavaScript", "Java", "SQL"] },
  { group: "Backend", system: "Power systems", items: ["FastAPI", "Node / Express", "Socket.IO", "Prisma", "PostgreSQL", "MongoDB"] },
  { group: "Frontend", system: "Heads-up display", items: ["React", "Next.js", "Tailwind", "Three.js"] },
  { group: "AI / ML", system: "J.A.R.V.I.S. layer", items: ["Claude", "Gemini", "CrewAI", "pgvector", "RAG"] },
  { group: "Infrastructure", system: "Heavy armor", items: ["Kubernetes", "Terraform", "AWS EKS", "ArgoCD", "Docker", "Vault"] },
  { group: "Observability", system: "Sensors", items: ["Prometheus", "Grafana", "OpenTelemetry", "Jaeger", "Sentry"] },
  { group: "Shipping", system: "Flight systems", items: ["GitHub Actions", "k6", "OPA / Gatekeeper", "Chaos Mesh", "Vercel"] },
];

export const diagnostics: { stat: string; grade: "S" | "A" | "B"; why: string }[] = [
  { stat: "Reliability", grade: "A", why: "Autoscaling, self-healing deploys, and a sandbox before every patch" },
  { stat: "Automation", grade: "S", why: "Agents and CI own the routine; the judgment stays with him" },
  { stat: "Range", grade: "A", why: "From Terraform on EKS to the React screen" },
  { stat: "Observability", grade: "A", why: "Prometheus, Grafana, OpenTelemetry, Jaeger, Sentry" },
  { stat: "Output", grade: "A", why: "Six full-stack projects, all in public on GitHub" },
];

export const principles = [
  { n: "I", title: "Ship it, then armor it", body: "Deploy first; observability and guardrails follow within the hour." },
  { n: "II", title: "Automate the boring", body: "CI/CD and agents own the routine. The judgment stays with me." },
  { n: "III", title: "Verify before trusting", body: "A model may propose the fix; only a passing test or a human approves it." },
];

export const missions: { label: string; state: "done" | "running" | "queued" }[] = [
  { label: "Get an AI agent to fix a real production incident, end to end", state: "done" },
  { label: "Survive a simulated booking rush on Kubernetes", state: "done" },
  { label: "Deploy Orbit IDE to the cloud", state: "running" },
  { label: "Deploy GhostOps to the cloud", state: "queued" },
  { label: "Deploy ResilientCommerce on AWS EKS", state: "queued" },
];

// Famous lines from the Iron Man films, used as interstitials around the site.
export const quotes = {
  intro: { text: "Sometimes you gotta run before you can walk.", by: "Tony Stark", film: "Iron Man (2008)" },
  hero: { text: "I am Iron Man.", by: "Tony Stark", film: "Iron Man (2008)" },
  armor: { text: "Heroes are made by the path they choose, not the powers they are graced with.", by: "Tony Stark", film: "Iron Man (2008)" },
  suit: { text: "If you're nothing without the suit, then you shouldn't have it.", by: "Tony Stark", film: "Spider-Man: Homecoming (2017)" },
  lab: { text: "Part of the journey is the end.", by: "Tony Stark", film: "Avengers: Endgame (2019)" },
  heart: { text: "Proof that Tony Stark has a heart.", by: "Pepper Potts", film: "Iron Man (2008)" },
  footer: { text: "I love you 3000.", by: "Morgan Stark", film: "Avengers: Endgame (2019)" },
  notfound: { text: "I think I need to sleep now.", by: "J.A.R.V.I.S.", film: "Iron Man 3 (2013)" },
};

// What J.A.R.V.I.S. says while the suit boots.
export const bootLines = [
  "J.A.R.V.I.S. online. Good evening, sir.",
  "Rerouting power from the Malibu workshop…",
  "Telling DUM-E to put the fire extinguisher down…",
  "Calibrating repulsors…",
  "Polishing the Mark 85 faceplate…",
  "Asking Happy to bring the car around…",
  "Power at 400%… and climbing.",
];

// 3D models used on the site, all CC BY 4.0. They were repainted to match the site,
// rescaled, simplified and compressed. Mark 85 and the Hulkbuster are built from the models below.
export const modelCredits = [
  { title: "Iron Man", author: "Vfx Boy", url: "https://sketchfab.com/3d-models/iron-man-1a21e1b8f2844956a30d28838d5f816a", usedFor: "Mark 85" },
  { title: "Iron Man (Infinity) (Textured) (Rigged)", author: "CAPTAAINR", url: "https://sketchfab.com/3d-models/iron-man-infinity-textured-rigged-7434cf03a4b34b4ca232a141fadad976", usedFor: "Mark 50" },
  { title: "War Machine (Textured) (Rigged)", author: "CAPTAAINR", url: "https://sketchfab.com/3d-models/war-machinetexturedrigged-ed775c63303c4d358394d40dc9d0be19", usedFor: "War Machine, Hulkbuster" },
  { title: "Iron Man MK7", author: "CHANG747", url: "https://sketchfab.com/3d-models/iron-man-mk7-ad4776eea8184283a3e49cf5487df754", usedFor: "Mark 7" },
  { title: "Iron Man (Mark-I) (Textured) (Rigged)", author: "CAPTAAINR", url: "https://sketchfab.com/3d-models/iron-man-mark-i-textured-rigged-5664593af9d94c2e97c1365788b88202", usedFor: "Mark 1" },
  { title: "Arc Reactor", author: "Ludus101", url: "https://sketchfab.com/3d-models/arc-reactor-7daf892988e54cdcb8bfd7dff3ed5d23", usedFor: "Arc reactor" },
];

// Certifications, strongest for a DevOps / Full Stack / AI-ML career first.
// `url` is the issuer's own verification page, so anyone can check it at the source.
export type Cert = {
  name: string;
  issuer: string;
  issued?: string;
  expires?: string;
  credentialId?: string;
  url: string;
  verifiedVia: string; // who hosts the verification page
  tier: "Professional" | "Industry" | "Course";
  why: string; // why it matters for the roles he's after
};

export const certifications: Cert[] = [
  {
    name: "AWS Certified AI Practitioner",
    issuer: "Amazon Web Services",
    issued: "Sep 2026",
    expires: "Sep 2029",
    credentialId: "15423736-cd54-47de-8db1-9734be88cee1",
    url: "https://www.credly.com/badges/15423736-cd54-47de-8db1-9734be88cee1",
    verifiedVia: "Credly",
    tier: "Professional",
    why: "Proctored AWS exam on AI/ML and generative AI services",
  },
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    issued: "Oct 2026",
    expires: "Oct 2029",
    credentialId: "6e478082-fc9c-4f8a-83bf-5ed3f07633ae",
    url: "https://www.credly.com/badges/6e478082-fc9c-4f8a-83bf-5ed3f07633ae",
    verifiedVia: "Credly",
    tier: "Professional",
    why: "Proctored AWS exam on cloud, security, pricing and core services",
  },
  {
    name: "Oracle Agentic AI Certified Foundations Associate",
    issuer: "Oracle",
    issued: "Jul 2026",
    url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=1E2117DD9FC2FB3A7EE64696BA6313651EC01E7594244C181FFF695C4210163F",
    verifiedVia: "Oracle CertView",
    tier: "Professional",
    why: "Oracle certification exam on agentic AI and AI agents",
  },
  {
    name: "Introduction to Generative AI",
    issuer: "IBM",
    issued: "Mar 2024",
    url: "https://tinyurl.com/39jnjbm",
    verifiedVia: "IBM certificate link",
    tier: "Industry",
    why: "Generative AI fundamentals from IBM",
  },
  {
    name: "Introduction to Computer Networking Basics",
    issuer: "Simplilearn",
    issued: "Oct 2025",
    url: "https://tinyurl.com/bdex8see",
    verifiedVia: "Simplilearn certificate link",
    tier: "Course",
    why: "Networking basics behind cloud and DevOps work",
  },
  {
    name: "UML: Unified Modeling Language Training",
    issuer: "Infosys Springboard",
    url: "https://www.linkedin.com/in/likith-lochan-2ab93b290/details/certifications/",
    verifiedVia: "LinkedIn",
    tier: "Course",
    why: "Software design and modelling",
  },
];

// Headline numbers under the hero. Every one is backed by the résumé, the repos or the certificates.
export const stats = [
  { value: "7.74", label: "CGPA · B.E. CSE" },
  { value: "6", label: "suits built" },
  { value: "3", label: "certified exams" },
  { value: "2", label: "PRs opened by my AI" },
];

export const education = {
  school: "APS College of Engineering, Bengaluru",
  degree: "B.E. Computer Science and Engineering",
  years: "2023 – 2027",
  cgpa: "7.74 / 10",
};

// The Flight Log: the journey so far, from the résumé.
export const flightLog: { when: string; title: string; where: string; body: string }[] = [
  { when: "2021 – 2023", title: "Pre-university", where: "Jnanodaya PU College · PCMB", body: "Physics, chemistry, maths and biology. Finished with 84.9%." },
  { when: "2023", title: "Suited up for CSE", where: "APS College of Engineering, Bengaluru", body: "Started a B.E. in Computer Science and Engineering. CGPA so far: 7.74 / 10." },
  { when: "2024", title: "Leadership training", where: "RYLA 2024 · Rotaract Club of APSCE", body: "Rotary Youth Leadership Award, and community service with the Rotaract Club." },
  { when: "2024", title: "Namma JobAthon '24", where: "Certificate of Appreciation", body: "Recognised for contributing to the Namma JobAthon hiring event." },
  { when: "Hackathon", title: "NASA Space Challenge", where: "Dayananda Sagar", body: "Took part in the NASA Space Challenge hackathon." },
  { when: "Leadership", title: "Coordinator Lead", where: "MEGHAHERTZ Fest", body: "Led coordination for the college fest." },
  { when: "2026", title: "Machine Learning Intern", where: "CodSoft (virtual)", body: "Built 3 predictive models in Python: credit-card fraud detection, SMS spam detection (NLP) and customer churn prediction." },
  { when: "2026", title: "The Mark 85 year", where: "GhostOps · Orbit IDE · ResilientCommerce", body: "Shipped an autonomous AIOps platform, a self-verifying cloud IDE and a load-tested Kubernetes stack. Earned AWS AI Practitioner, AWS Cloud Practitioner and Oracle Agentic AI." },
  { when: "2027", title: "Graduation (expected)", where: "Looking for roles now", body: "Ready to bring all of this to an engineering team as a DevOps, Full Stack or AI/ML engineer." },
];

// ─── The Doom universe ───────────────────────────────────────────────────────
// The site has two universes that never coexist: Tony Stark's and Doctor Doom's.
// Doom mode re-skins everything and reframes the copy in Doom's voice (third person).
// The facts never change: same projects, same numbers, same three roles. Only the framing does.
export type Universe = "stark" | "doom";

export const doom = {
  headline: "Doom builds systems that need no one.",
  accentWords: 2, // "no one." is set in the accent face
  intro:
    "Agents that mend production by themselves, an IDE whose AI must prove its code before it is shown, and a booking fortress that raises new walls when the crowd storms the gates. Built first, then armored in iron.",
  quoteCard: { text: "Doom does not ask whether the system will hold. Doom decrees it.", by: "Victor von Doom · sovereign of Latveria" },
  heroCta: "Enter the Throne Room →",
  // Doom has one armor, so his side has no suits: the projects are listed as his works, in his voice.
  works: {
    ghostops: "Doom's machines repair themselves. Failure is not tolerated.",
    "orbit-ide": "Code that proves itself worthy before Doom looks at it.",
    "resilient-commerce": "A fortress that does not fall, no matter how many come.",
    sahayak: "Doom feeds his people.",
    "project-management": "Every subject, every task, accounted for.",
    greencart: "Even Doom's first work delivered.",
  } as Record<string, string>,
  // Section headings by their code in <SectionHead>.
  sections: {
    "01": { kicker: "the throne room", title: "One mask. Six works." },
    "02": { kicker: "doom's designs · the war plans", title: "Doom's Designs" },
    "03": { kicker: "threats to the realm · incident drill", title: "Defy Doom" },
    "04": { kicker: "the siege · rush lab", title: "Storm the gates" },
    "05": { kicker: "the trials · mini game", title: "Purge the vermin" },
    "06": { kicker: "the latverian network · live", title: "The realm answers" },
    "07": { kicker: "the sovereign", title: "Behind the iron" },
    "08": { kicker: "the chronicle of doom", title: "Every conquest, recorded" },
    "09": { kicker: "royal decrees · verified at the source", title: "Decrees of Latveria" },
    "10": { kicker: "petition the throne", title: "Doom will hear you" },
  } as Record<string, { kicker: string; title: string }>,
  nav: { armor: "Throne", schematics: "Designs", drill: "Threats", lab: "Siege", training: "Trials", status: "Network", about: "Sovereign", log: "Chronicle", certs: "Decrees", contact: "Petition" } as Record<string, string>,
  // Original lines in Doom's voice for the interstitials.
  quotes: {
    armor: { text: "Doom builds one army. Each soldier is a machine that does not tire.", by: "Victor von Doom", film: "Latveria" },
    suit: { text: "Iron is not worn for protection. It is worn so that nothing may be asked of me.", by: "Victor von Doom", film: "Latveria" },
    lab: { text: "Others hope their systems hold. Doom tests his until they cannot fail.", by: "Victor von Doom", film: "Latveria" },
    footer: { text: "Doom is eternal.", by: "Victor von Doom", film: "Latveria" },
  },
  ai: "The Codex",
  bootLines: [
    "The Codex wakes. Latveria awaits its master.",
    "Drawing power from Castle Doom…",
    "Binding the runes to the iron…",
    "Raising the walls of Castle Doom…",
    "The Latverian network bows to its master.",
    "Forging the mask…",
    "Doom has arrived.",
  ],
  idle: [
    "The Latverian network bows to its master.",
    "Castle patrol: the eastern border is quiet.",
    "Runes recharged. Sorcery reserves at full strength.",
    "A visitor approaches the throne. Doom permits it.",
    "Every system in the realm reports. None dare fail.",
    "The Codex has checked GitHub for new decrees from the sovereign.",
    "Castle Doom's defences re-armed. Nobody asked. Doom ordered it.",
  ],
  snapEnd: "Doom is eternal.",
  schematicsIntro: "The three greatest works, laid open. Each diagram is the real pipeline inside the project.",
  // The pilot's ID badge becomes a royal seal of Castle Doom.
  badge: {
    issuer: "Castle Doom · Royal seal",
    rows: [
      ["Flagship work", "GhostOps"],
      ["Power source", "Science and sorcery"],
      ["Nemesis", "A pager alert at 3 a.m."],
      ["Servants", "None needed. The systems obey."],
    ] as [string, string][],
    stamp: "By royal decree",
  },
  narration: {
    armor: "A visitor enters the throne room. Doom presents six works.",
    schematics: "Unrolling the war plans of three great works.",
    drill: "Threats to the realm may be summoned. Doom permits it.",
    lab: "The siege engine is ready: 2–8 pods @ 60% CPU.",
    training: "The trials begin. Vermin approach the walls.",
    status: "Every outpost of the Latverian network reports in.",
    about: "The sovereign's record is unsealed.",
    log: "Reading the chronicle, from the first work onward.",
    certs: "Royal decrees on file. Each one verifiable at the source.",
    contact: "The throne will hear a petition.",
  } as Record<string, string>,
};
