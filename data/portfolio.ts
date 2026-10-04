// Everything on the site reads from this file. Edit here, not in the components.

export const profile = {
  name: "Likith Lochan",
  short: "Likith",
  callsign: "LIKITH-L",
  role: "DevOps · Backend / Full-Stack · Applied AI",
  roles: ["DevOps Engineer", "Backend / Full-Stack Developer", "Applied AI Builder", "SRE in training"],
  headline: "I build systems that fix themselves.",
  intro:
    "Agents that patch production incidents, an IDE whose AI proves its code before you see it, and a booking app that scales out when everyone hits “Book Now” at once. Shipped first, then armored.",
  location: "Bengaluru, India",
  timezone: "Asia/Kolkata",
  education: "B.E. Computer Science · APS College of Engineering",
  focus: "AIOps · SRE · RAG systems",
  available: "Open to DevOps, SRE, backend and full-stack internships and roles",
  building: "Putting Orbit IDE, GhostOps and ResilientCommerce on the cloud",
  next: "Making GhostOps handle more kinds of incidents",
  email: "likithlu3@gmail.com",
  // Drop a PDF into /public and set this to "/your-file.pdf" to show the Resume links.
  resume: "",
};

export const socials = {
  github: "https://github.com/likith1231",
  linkedin: "https://www.linkedin.com/in/likith-lochan-2ab93b290",
  githubUser: "likith1231",
};

export type FlowNode = { label: string; sub?: string; tone?: "arc" | "red" | "gold" | "steel" };

export type Project = {
  slug: string;
  mark: string;
  episode: string;
  name: string;
  tagline: string;
  summary: string;
  stat: { value: string; label: string };
  stack: string[];
  repo: string;
  // Set `live` to the deployed URL once it's hosted; the card switches from "Deploying" to "Live".
  live: string | null;
  flowTitle: string;
  flow: FlowNode[];
  flowNote?: string;
  problem: string;
  how: string[];
  highlights: string[];
  lesson: { title: string; body: string };
};

export const projects: Project[] = [
  {
    slug: "ghostops",
    mark: "MARK 01",
    episode: "The Self-Repairing Suit",
    name: "GhostOps",
    tagline: "Production incidents, patched on their own.",
    summary:
      "An autonomous AIOps platform that acts like an on-call SRE: it detects a real incident, finds the root cause, writes a minimal patch, proves it in a sandbox, and only then opens a pull request for a human.",
    stat: { value: "2", label: "real incidents fixed end to end, each with a validated PR: a memory leak and a failing CI test." },
    stack: ["CrewAI", "Claude API", "FastAPI", "Kubernetes", "Prometheus", "OPA / Gatekeeper", "Vault", "Chaos Mesh", "ArgoCD"],
    repo: "https://github.com/likith1231/ghostops",
    live: null,
    flowTitle: "How an incident moves through GhostOps",
    flow: [
      { label: "Alertmanager", sub: "or a CI webhook", tone: "red" },
      { label: "FastAPI", sub: "starts the pipeline" },
      { label: "Diagnostic Reasoner", sub: "logs · metrics · source", tone: "arc" },
      { label: "Patch Generator", sub: "minimal diff", tone: "arc" },
      { label: "Validation Officer", sub: "Docker sandbox + OPA", tone: "gold" },
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
    mark: "MARK 02",
    episode: "Proof Before Paste",
    name: "Orbit IDE",
    tagline: "The cloud IDE whose AI proves its code works before you see it.",
    summary:
      "Write, run and ship code from any browser: real Linux terminals, live previews, git, real-time collaboration, and a Claude agent that tests its own changes and fixes them until they pass.",
    stat: { value: "16", label: "languages run in a real Linux container per project, with terminals, previews and git." },
    stack: ["React 19", "Node.js", "Claude API", "Docker", "PostgreSQL", "Yjs", "Socket.IO", "Caddy"],
    repo: "https://github.com/likith1231/Orbit-IDE",
    live: null,
    flowTitle: "The proof loop",
    flow: [
      { label: "You ask", sub: "in the agent panel" },
      { label: "Claude edits", sub: "multi-file diff", tone: "arc" },
      { label: "Sandbox copy", sub: "your files untouched" },
      { label: "Tests · run · compile", sub: "npm test, pytest…", tone: "gold" },
      { label: "Verified", sub: "you review the diff", tone: "arc" },
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
  },
  {
    slug: "resilient-commerce",
    mark: "MARK 03",
    episode: "Built for the Rush",
    name: "ResilientCommerce",
    tagline: "Traffic spikes, absorbed by autoscaling.",
    summary:
      "AetherMed is a clinic booking platform; ResilientCommerce is the DevOps and SRE layer around it, built and load-tested to survive a CoWIN-style rush when everyone hits “Book Now” the moment slots open.",
    stat: { value: "18.9s → 2.7s", label: "p95 latency under a 250-user rush, after tuning the database pool. Then the HPA started scaling." },
    stack: ["Next.js", "Prisma", "PostgreSQL", "Docker", "Kubernetes", "Terraform", "AWS EKS", "ArgoCD", "k6", "Sentry", "OpenTelemetry"],
    repo: "https://github.com/likith1231/Aethermed",
    live: null,
    flowTitle: "From git push to a scaled-out cluster",
    flow: [
      { label: "git push", sub: "to main" },
      { label: "GitHub Actions", sub: "build + test" },
      { label: "ArgoCD", sub: "sync · prune · self-heal", tone: "arc" },
      { label: "HPA", sub: "2 → 8 pods @ 60% CPU", tone: "gold" },
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
];

export const otherBuilds = [
  {
    name: "Sahayak",
    tagline: "Farm to market, minus the middlemen.",
    body: "Farmers list produce by chatting with a Gemini agent that calls real tools; live mandi prices, pgvector search, Razorpay checkout and live order tracking.",
    stack: ["Next.js", "FastAPI", "Gemini", "pgvector", "Razorpay"],
    repo: "https://github.com/likith1231/sahayak",
    live: null as string | null,
  },
  {
    name: "GreenCart",
    tagline: "Groceries with live order tracking.",
    body: "A MERN grocery store inspired by Blinkit and Zepto, with a seller dashboard, Cloudinary images, Stripe or cash on delivery, and automatic refunds.",
    stack: ["React", "Express", "MongoDB", "Stripe", "Tailwind"],
    repo: "https://github.com/likith1231/greencart",
    live: "https://greencart-frontend1.vercel.app",
  },
  {
    name: "Project Management",
    tagline: "Workspaces, tasks and progress in one app.",
    body: "Multi-workspace project tracking with Clerk organizations, task comments, analytics, a calendar view, and email reminders through Inngest.",
    stack: ["React 19", "Express 5", "Prisma", "Neon", "Clerk", "Inngest"],
    repo: "https://github.com/likith1231/Project-Management",
    live: "https://project-mgt-client.vercel.app",
  },
];

export const armory: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java", "SQL"] },
  { group: "Backend", items: ["FastAPI", "Node / Express", "Socket.IO", "Prisma", "PostgreSQL", "MongoDB"] },
  { group: "Frontend", items: ["React", "Next.js", "Tailwind", "Three.js"] },
  { group: "Applied AI", items: ["Claude", "Gemini", "CrewAI", "pgvector", "RAG"] },
  { group: "Infrastructure", items: ["Kubernetes", "Terraform", "AWS EKS", "ArgoCD", "Docker", "Vault"] },
  { group: "Observability", items: ["Prometheus", "Grafana", "OpenTelemetry", "Jaeger", "Sentry"] },
  { group: "Shipping", items: ["GitHub Actions", "k6", "OPA / Gatekeeper", "Chaos Mesh", "Vercel"] },
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
