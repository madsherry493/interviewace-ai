import { useEffect, useId, useMemo, useRef, useState } from "react";
import "./App.css";

/* =====================================================================
   Inline icons (no packages, no image files)
   ===================================================================== */
const ICONS = {
  sparkles: ["M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z", "M19 16v4M17 18h4"],
  arrow: ["M5 12h14", "M13 6l6 6-6 6"],
  check: ["M20 6L9 17l-5-5"],
  chevron: ["M6 9l6 6 6-6"],
  clock: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M12 7v5l3 2"],
  menu: ["M4 6h16", "M4 12h16", "M4 18h16"],
  close: ["M18 6L6 18", "M6 6l12 12"],
  target: [
    "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    "M12 12h.01",
  ],
  message: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", "M8 9h8", "M8 13h5"],
  mic: ["M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z", "M19 10v2a7 7 0 0 1-14 0v-2", "M12 19v3"],
  book: ["M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z", "M6.5 17H20v4H6.5A2.5 2.5 0 0 1 4 19.5"],
  code: ["M16 18l6-6-6-6", "M8 6l-6 6 6 6"],
  headphones: [
    "M3 14v-2a9 9 0 0 1 18 0v2",
    "M21 19a2 2 0 0 1-2 2h-1v-7h3z",
    "M3 19a2 2 0 0 0 2 2h1v-7H3z",
  ],
  megaphone: ["M3 11v2l13 5V6z", "M16 8a4 4 0 0 1 0 8", "M7 14v4a2 2 0 0 0 2 2"],
  chart: ["M3 3v18h18", "M8 17v-5", "M13 17V8", "M18 17v-8"],
  clipboard: ["M9 3h6v4H9z", "M7 5H5v16h14V5h-2", "M9 12h6", "M9 16h4"],
  refresh: ["M21 12a9 9 0 1 1-3-6.7", "M21 4v5h-5"],
  eye: ["M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  alert: [
    "M12 9v4",
    "M12 17h.01",
    "M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  ],
};

function Icon({ name, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/* =====================================================================
   Content
   Keywords use "label|alternative|alternative" so the review can match
   a few common wordings of the same idea.
   ===================================================================== */
const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "questions", label: "Interview Questions" },
  { id: "practice", label: "Practice" },
  { id: "guides", label: "Career Guides" },
];

const FEATURES = [
  {
    icon: "target",
    title: "Job-Specific Questions",
    text: "Browse questions grouped by role, so you prepare for the interview you actually have.",
    href: "#questions",
    cta: "Browse questions",
  },
  {
    icon: "message",
    title: "Answer Examples",
    text: "Open any question to see a sample answer, then rewrite it in your own words and experience.",
    href: "#questions",
    cta: "See sample answers",
  },
  {
    icon: "mic",
    title: "Mock Interview Practice",
    text: "Write your answer, then get a simple rule-based checklist review. No account needed.",
    href: "#practice",
    cta: "Start practicing",
  },
  {
    icon: "book",
    title: "Career Guides",
    text: "Short, practical guides for before, during, and after the interview.",
    href: "#guides",
    cta: "Read the guides",
  },
];

const CATEGORIES = [
  {
    id: "software",
    name: "Software Engineer",
    icon: "code",
    blurb: "Technical depth, collaboration, and how you solve problems.",
    questions: [
      {
        q: "Describe a difficult bug you fixed. How did you find the cause?",
        tip: "Walk through your steps in order: reproduce, isolate, fix, prevent. Name the tools you used.",
        keywords: ["reproduce|reproduc", "logs|logging", "root cause|cause", "test|testing", "fix|fixed"],
        answer:
          "Last spring our checkout page failed for about 2% of users, and nobody could reproduce it. I replayed production requests in a test environment and noticed the errors only happened when two requests updated the same cart at once. The root cause was a race condition, so I added a database lock and wrote a regression test. Errors dropped to zero, and I documented the steps in our team's debugging guide.",
      },
      {
        q: "How do you decide between a quick solution and a clean one?",
        tip: "Show that you weigh deadlines, risk, and long-term maintenance. Give one real example of each choice.",
        keywords: ["deadline|deadlines", "risk", "maintain|maintenance", "technical debt|debt", "trade-off|tradeoff|trade off"],
        answer:
          "I start by asking how risky the change is and how long the code will live. For a one-off script before a deadline, I choose the quick option and note it. For code the team will maintain for years, I take extra time to keep it clean. Last quarter I shipped a fast fix for a demo, logged the technical debt in our backlog, and refactored it two weeks later, so we met the deadline without leaving a mess.",
      },
      {
        q: "Tell me about a time you disagreed with a teammate on a technical decision.",
        tip: "Focus on how you listened, shared evidence, and reached a decision, not on who was right.",
        keywords: ["listen|listened", "data|evidence", "compromise|agreed", "decision|decided", "team"],
        answer:
          "On a recent project, a teammate wanted to build our own queue while I preferred a managed service. I listened to his concerns about cost and control, then suggested we compare both using a small prototype and real numbers. The data showed the managed service saved about two weeks of work. He agreed, and we kept his monitoring idea as a compromise. We made the decision together, and our working relationship stayed strong.",
      },
      {
        q: "How do you make sure your code is reliable before releasing it?",
        tip: "Mention tests, code review, and what you watch after release. Include a real example if you can.",
        keywords: ["tests|testing", "code review|review", "edge cases|edge case", "monitor|monitoring", "deploy|release"],
        answer:
          "Before I release code, I write unit tests for the main paths and edge cases, then ask a teammate for a code review. I run the full test suite in a staging environment, and I deploy behind a feature flag when the change is risky. After release I monitor error rates and logs for the first day. This process helped me ship my last three features with no urgent rollbacks.",
      },
      {
        q: "Tell me about a time you had to learn a new technology quickly.",
        tip: "Describe your learning method, how you applied it, and what you delivered.",
        keywords: ["documentation|docs", "prototype|small project", "practice|practiced", "feedback|mentor", "learn|learned"],
        answer:
          "When my team moved to a new framework, I had two weeks to become productive. I read the official documentation, built a small prototype of one real feature, and practiced by rewriting an old component. I asked a senior teammate for feedback on my pull requests each day. By the end of the second week, I shipped my first production feature and then wrote a short guide for the next person who joined.",
      },
    ],
  },
  {
    id: "service",
    name: "Customer Service",
    icon: "headphones",
    blurb: "Empathy, patience, and clear communication under pressure.",
    questions: [
      {
        q: "How do you handle a customer who is angry and upset?",
        tip: "Acknowledge the feeling, clarify the problem, offer a next step, and confirm the customer is satisfied.",
        keywords: ["listen|listened", "apology|apolog|sorry", "empathy|understand|understood", "solution|resolve|resolved", "follow up|follow-up|followed up"],
        answer:
          "I stay calm and let the customer finish speaking without interrupting. Then I apologize for the experience, repeat the problem back to confirm I understand, and explain what I can do to fix it. Recently a customer was charged twice. I processed the refund right away, showed him the confirmation, and followed up two days later to make sure it arrived. He thanked me and kept his account.",
      },
      {
        q: "Tell me about a time you went above and beyond for a customer.",
        tip: "Pick a specific case with a measurable result, such as a saved account or a positive review.",
        keywords: ["customer", "extra|beyond|additional", "result|outcome", "feedback|review", "follow up|follow-up|followed up"],
        answer:
          "A customer once called because a gift would not arrive before a birthday. Beyond checking the order, I contacted the warehouse, found a faster shipping option, and covered the extra cost with my manager's approval. The package arrived a day early. The customer left a five-star review mentioning my name, and I followed up the next week to make sure the recipient was happy.",
      },
      {
        q: "What would you do if you did not know the answer to a customer's question?",
        tip: "Be honest, explain how you find answers, and describe how you follow up.",
        keywords: ["honest|honesty|transparent", "research|look up|find out", "escalate|escalated|colleague|supervisor", "follow up|follow-up|followed up", "knowledge base|documentation|team"],
        answer:
          "I'm honest that I don't know yet, and I tell the customer I'll find out. I check our knowledge base first, then ask a teammate or supervisor if needed. I give the customer a clear time for my follow-up, such as within one hour, and I keep that promise. Afterward I add the answer to our shared notes so the team can help the next customer faster.",
      },
      {
        q: "How do you stay organized and calm when you have many customers waiting?",
        tip: "Describe how you prioritize, keep quality high, and manage stress with a real example.",
        keywords: ["prioritize|priority|prioritise", "calm", "organized|organised|queue", "time", "quality"],
        answer:
          "When the queue is full, I prioritize by urgency, handling account lockouts and billing errors before general questions. I stay calm, keep my notes organized, and use saved replies for common issues without losing a personal tone. During our busiest week last year I handled about 60 tickets a day while keeping my satisfaction score above 95%, because I focused on quality for each customer.",
      },
      {
        q: "How would you respond if company policy prevents you from giving a customer what they want?",
        tip: "Show empathy, explain the policy clearly, offer alternatives, and know when to escalate.",
        keywords: ["policy", "explain|explained", "alternative|option|options", "empathy|understand|understood", "escalate|supervisor|manager"],
        answer:
          "I begin by showing I understand why the customer is frustrated. Then I explain the policy in plain language and why it exists. Next I look for an alternative within the rules, such as store credit or an exchange. If the situation still needs an exception, I escalate it to a supervisor with the full details so the customer doesn't have to repeat themselves. Most customers appreciate honesty and a clear next step.",
      },
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: "megaphone",
    blurb: "Creativity backed by results, audience insight, and testing.",
    questions: [
      {
        q: "Describe a campaign you are proud of. What was your role?",
        tip: "State the goal, your part, and the result, with numbers if you have them.",
        keywords: ["goal|objective", "audience", "budget", "metric|metrics|kpi", "result|results"],
        answer:
          "My proudest campaign was a spring email series for an online retailer. The goal was to bring back lapsed customers within three months, with a small budget. I segmented our audience by past purchases, wrote three versions of the message, and tested subject lines. The campaign reactivated 9% of the list and produced about 4x return on spend. I tracked open rate, click rate, and revenue each week.",
      },
      {
        q: "How do you decide which marketing channels to focus on?",
        tip: "Explain how you use audience data, budget, and past results to prioritize and test.",
        keywords: ["audience", "data|analytics", "budget", "test|testing|experiment", "channel|channels"],
        answer:
          "I start with the audience: where they spend time and how they prefer to hear from brands. Then I look at past analytics and our budget to choose two or three channels instead of spreading thin. I run small experiments on each, for example a two-week test of paid social versus email. The channels with the best cost per conversion get more budget, and I review the data monthly.",
      },
      {
        q: "How do you measure whether a campaign worked?",
        tip: "Tie each metric to the goal: reach for awareness, conversion rate for sales, retention for loyalty.",
        keywords: ["metric|metrics|kpi", "conversion|conversions", "goal|objective", "analytics|dashboard", "roi|return on"],
        answer:
          "I connect metrics to the goal. For awareness I track reach and impressions, for sales I track conversion rate and cost per acquisition, and for loyalty I track repeat purchases. I set the targets before launch, use analytics dashboards to follow progress weekly, and calculate return on investment at the end. That way we can say clearly whether a campaign met its goal and why.",
      },
      {
        q: "Tell me about a campaign that did not perform as expected. What did you do?",
        tip: "Be honest about the problem, show how you used data to adjust, and share what you learned.",
        keywords: ["data|analytics", "learn|learned", "adjust|changed|pivot", "test|testing", "result|results"],
        answer:
          "One paid social campaign I ran had half the click rate we expected. I looked at the data and found that our images performed well with one audience but not another. I paused the weakest ads, tested new headlines, and adjusted the targeting. Within two weeks the click rate improved by 40%. I learned to run a small test first, and I now share results with the team either way.",
      },
      {
        q: "How do you stay up to date with marketing trends and tools?",
        tip: "Name real habits and describe a time you applied something new.",
        keywords: ["trend|trends", "newsletter|blog|podcast", "experiment|tested|test", "community|network", "audience"],
        answer:
          "I follow a few marketing newsletters and podcasts and spend about 30 minutes every Friday reading what's new. I'm also part of an online marketing community where people share real results. When I see a promising trend, I run a small experiment before recommending it. For instance, I tested short video on a small budget last year and learned it worked well for our audience, so we scaled it.",
      },
    ],
  },
  {
    id: "data",
    name: "Data Analyst",
    icon: "chart",
    blurb: "Accuracy, curiosity, and turning numbers into decisions.",
    questions: [
      {
        q: "Walk me through an analysis that changed a decision.",
        tip: "Cover the question, the data, your method, and what the team did differently afterward.",
        keywords: ["question|business question", "data|dataset", "insight|finding|found", "recommend|recommendation|recommended", "impact|result|decision"],
        answer:
          "Our sales manager asked why renewals were falling. I pulled twelve months of customer data and found that accounts without a training session in the first month renewed 25% less often. I built a simple chart for the insight and recommended adding onboarding calls. The team piloted it for a quarter, and the renewal rate rose by 8 points, so the impact led to a permanent change in the process.",
      },
      {
        q: "How do you handle messy or missing data?",
        tip: "Describe the checks you run, how you decide what to fill or remove, and how you document it.",
        keywords: ["clean|cleaned|cleaning", "missing", "validate|validated|validation|check", "document|documented", "duplicate|duplicates"],
        answer:
          "First I look for problems: missing values, duplicates, and strange outliers. Then I decide how to handle each. I might remove duplicates, fill gaps only when there's a sound reason, and flag anything uncertain. I validate the cleaned data against the original totals and document every step in a short log. Once, this process caught a duplicated import that would have overstated revenue by 6%.",
      },
      {
        q: "How would you explain a complex result to a non-technical manager?",
        tip: "Lead with the conclusion, use one simple chart, and avoid jargon.",
        keywords: ["simple|plain", "visual|chart|graph", "conclusion|takeaway|key point", "audience|stakeholder|manager", "jargon"],
        answer:
          "I start with the conclusion in one plain sentence, because managers want the takeaway first. Then I show one simple chart that supports it and avoid jargon like standard deviation unless asked. I tailor the explanation to the audience, using their own business terms. After presenting, I ask what questions they have and offer a one-page summary they can share.",
      },
      {
        q: "Which tools do you use for analysis, and why?",
        tip: "Name the tools you really know and match each one to a task.",
        keywords: ["sql", "excel|spreadsheet", "python|pandas", "dashboard|tableau|power bi", "visual|chart"],
        answer:
          "I use SQL to pull and join data from databases, because it's fast and repeatable. For quick checks and small datasets, I use Excel. For deeper analysis, such as cleaning large files or running statistics, I use Python with pandas. I share results through dashboards so stakeholders can explore them without waiting for me. I pick the tool that is simplest for the task.",
      },
      {
        q: "How do you check that your analysis is accurate?",
        tip: "Describe concrete checks, such as comparing to trusted totals, peer review, and written assumptions.",
        keywords: ["validate|validated|validation", "cross-check|cross check|compare|compared", "sample|spot check", "review|peer review|colleague", "assumption|assumptions"],
        answer:
          "I validate results in several steps. I cross-check totals against a trusted source, such as the finance report. I spot check a sample of rows by hand, and I write down my assumptions so others can challenge them. Before sharing, I ask a colleague to review my queries. This habit helped me catch a filter mistake last year before it reached leadership.",
      },
    ],
  },
  {
    id: "pm",
    name: "Project Manager",
    icon: "clipboard",
    blurb: "Planning, prioritizing, and keeping people aligned.",
    questions: [
      {
        q: "Tell me about a project that was falling behind. What did you do?",
        tip: "Show how you found the cause, reset expectations early, and adjusted scope or resources.",
        keywords: ["cause|root cause", "scope", "stakeholder|stakeholders", "plan|schedule|timeline", "communicate|communicated|update"],
        answer:
          "On a website redesign, we were three weeks behind. I first identified the root cause: the design approvals were taking too long. I met with stakeholders, agreed to reduce the scope by moving two low-priority pages to phase two, and set a clear approval schedule. I communicated the new plan in a short update to everyone. We launched only four days late and delivered all the key features.",
      },
      {
        q: "How do you prioritize when everything seems urgent?",
        tip: "Describe a clear method, such as impact versus effort, and how you involve stakeholders.",
        keywords: ["priority|prioritize|prioritise", "impact", "deadline|deadlines", "stakeholder|stakeholders", "trade-off|tradeoff|trade off"],
        answer:
          "I use impact and deadline as my main filters. I list every request, estimate the effort, and ask which ones affect the most customers or carry a hard date. I then share the ranked priority list with stakeholders and explain the trade-offs, so they can agree on what waits. When two leaders wanted different priorities, this approach helped us decide in a single meeting.",
      },
      {
        q: "How do you keep stakeholders informed about a project?",
        tip: "Mention how often you update, in what format, and how you share bad news early.",
        keywords: ["update|updates", "report|status", "meeting|stand-up|standup", "risk|risks", "transparent|transparency|early"],
        answer:
          "I give regular updates in a format people can scan: a short weekly status report with progress, next steps, and risks. I hold a brief stand-up with the team and a monthly review meeting with leadership. If something goes wrong, I share it early with a proposed solution. Being transparent has built trust, and my stakeholders rarely ask for ad-hoc status checks.",
      },
      {
        q: "Tell me about a time you resolved a conflict within your team.",
        tip: "Focus on listening, shared goals, and the agreement you reached, not on blame.",
        keywords: ["listen|listened", "goal|goals", "understand|understood|perspective", "agree|agreed|resolution|resolved", "team"],
        answer:
          "When two team members disagreed about task ownership, I met with each of them separately and listened to their views. Then I brought them together to focus on the project goals instead of positions. We clarified roles, agreed on a shared checklist, and set a check-in date. The resolution took one meeting, and the team finished the project on schedule.",
      },
      {
        q: "How do you identify and manage risks on a project?",
        tip: "Explain how you list risks, plan responses, and keep tracking them.",
        keywords: ["risk|risks", "mitigate|mitigation", "contingency|backup", "monitor|monitored|track", "plan|planned"],
        answer:
          "At the start of each project, I list possible risks and rate them by likelihood and impact. For the top risks, I plan mitigation steps and a contingency, like a backup vendor. I monitor them in weekly meetings and update the log. On my last project, a supplier delay was caught early, and our backup plan kept us on track.",
      },
    ],
  },
];

const HERO_QUESTIONS = [
  { q: "Tell me about yourself", tag: "Behavioral" },
  { q: "Why do you want this role?", tag: "Motivation" },
  { q: "Describe a time you handled conflict", tag: "Behavioral" },
];

const GUIDES = [
  {
    title: "Before the interview",
    points: [
      "Re-read the job description and highlight the top three skills it asks for.",
      "Prepare two or three stories from your experience that match those skills.",
      "Research the company's product, customers, and recent news.",
      "Prepare two questions to ask the interviewer.",
    ],
  },
  {
    title: "During the interview",
    points: [
      "Answer the question directly first, then add detail.",
      "Use the STAR method for stories: Situation, Task, Action, Result.",
      "It is fine to pause for a moment before answering.",
      "Ask for clarification if a question is unclear.",
    ],
  },
  {
    title: "After the interview",
    points: [
      "Send a short thank-you message within 24 hours.",
      "Mention one specific topic from the conversation.",
      "Write down the questions you were asked while they are fresh.",
      "Note what to improve before the next interview.",
    ],
  },
];

/* =====================================================================
   Helpers
   ===================================================================== */
const FILLERS = ["basically", "literally", "you know", "kind of", "sort of", "stuff", "um", "uh"];

function countWords(text) {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

function formatSpoken(words) {
  const seconds = Math.round((words / 130) * 60);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

/*
  Rule-based review. It only counts words and looks for patterns and keywords.
  It does not understand meaning, so the UI says so clearly.
*/
function reviewAnswer(text, question) {
  const trimmed = text.trim();
  const words = countWords(trimmed);

  if (words === 0) return { status: "empty", words, text };
  if (words < 15) return { status: "short", words, text };

  const lower = trimmed.toLowerCase();
  const firstPerson = (trimmed.match(/\b(i|my|me|mine|myself)\b/gi) || []).length;
  const fillerCount = FILLERS.reduce(
    (n, f) => n + (lower.match(new RegExp(`\\b${f}\\b`, "g")) || []).length,
    0
  );

  const keywordResults = question.keywords.map((k) => {
    const options = k.split("|");
    return { label: options[0], found: options.some((o) => lower.includes(o)) };
  });
  const found = keywordResults.filter((k) => k.found);
  const missing = keywordResults.filter((k) => !k.found);
  const needed = Math.ceil(question.keywords.length / 2);

  const lengthOk = words >= 50 && words <= 220;
  const hasSpecific = /\d|percent|double|triple|half/i.test(trimmed);
  const hasResult =
    /\b(result|resulted|improv\w*|increas\w*|reduc\w*|decreas\w*|sav(?:ed|ing|es)|learn\w*|deliver\w*|achiev\w*|outcome|success\w*|lifted|grew|faster|fixed|resolved|launched)\b/i.test(
      trimmed
    );

  const checks = [
    {
      label: "Length is in a good range (50 to 220 words)",
      pass: lengthOk,
      tip:
        words < 50
          ? "Your answer is on the short side. Add one specific example or detail."
          : "Your answer is long. Trim it to the points that matter most, about 30 to 90 seconds spoken.",
    },
    {
      label: "Speaks about your own role",
      pass: firstPerson >= 3,
      tip: "Use “I” to show what you personally did, not only what the team did.",
    },
    {
      label: "Includes a specific detail or number",
      pass: hasSpecific,
      tip: "Add a number, timeframe, or concrete detail, such as “saved 3 hours a week.”",
    },
    {
      label: "Mentions a result or what you learned",
      pass: hasResult,
      tip: "End with the outcome: what changed, what improved, or what you learned.",
    },
    {
      label: `Covers key ideas (${found.length} of ${keywordResults.length})`,
      pass: found.length >= needed,
      tip: "Try to include more of the ideas listed below, if they fit your real experience.",
    },
    {
      label: "Avoids filler words",
      pass: fillerCount <= 2,
      tip: "Replace filler such as “basically” or “stuff” with specific wording.",
    },
  ];

  const passed = checks.filter((c) => c.pass).length;
  const score = Math.round((passed / checks.length) * 100);

  let summary;
  if (score >= 83) {
    summary =
      "Your answer ticks most boxes on the checklist. Practice saying it out loud and make the details your own.";
  } else if (score >= 50) {
    summary = "A good base. Work on the checklist items marked below, then review again.";
  } else {
    summary =
      "The basics need more work. Use the tips below and compare your answer with the sample.";
  }

  return { status: "ok", words, text, checks, score, summary, found, missing };
}

/* =====================================================================
   Shared UI
   ===================================================================== */
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!("IntersectionObserver" in window) || els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

function Logo() {
  return (
    <a href="#home" className="logo" aria-label="InterviewAce AI home">
      <span className="logo-mark" aria-hidden="true">
        <Icon name="sparkles" size={18} />
      </span>
      <span>
        InterviewAce <span className="logo-ai">AI</span>
      </span>
    </a>
  );
}

function Navbar({ active }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`nav ${scrolled || open ? "nav--solid" : ""}`}>
      <div className="container nav-inner">
        <Logo />
        <nav className="nav-links" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={active === l.id ? "is-active" : ""}
              aria-current={active === l.id ? "true" : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#practice" className="btn btn-primary nav-cta">
          Get Started
        </a>
        <button
          type="button"
          className="menu-btn"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <Icon name={open ? "close" : "menu"} size={22} />
        </button>
      </div>
      <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`}>
        <nav aria-label="Mobile">
          {NAV_LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={close} tabIndex={open ? 0 : -1}>
              {l.label}
            </a>
          ))}
          <a href="#practice" className="btn btn-primary" onClick={close} tabIndex={open ? 0 : -1}>
            Get Started
          </a>
        </nav>
      </div>
    </header>
  );
}

function ScoreRing({ value, size = 120, label }) {
  const gid = `ring-${useId().replace(/:/g, "")}`;
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" role="img" aria-label={`${label}: ${value} out of 100`}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={r} className="ring-track" />
        <circle
          cx="60"
          cy="60"
          r={r}
          className="ring-fill"
          stroke={`url(#${gid})`}
          style={{ strokeDasharray: c, strokeDashoffset: c - (c * value) / 100 }}
        />
      </svg>
      <div className="ring-text">
        <strong>{value}</strong>
        <span>/ 100</span>
      </div>
    </div>
  );
}

/* =====================================================================
   Home
   ===================================================================== */
function Hero() {
  const [selected, setSelected] = useState(0);
  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="pill">
            <span className="pill-dot" aria-hidden="true" /> Free interview preparation
          </p>
          <h1>
            Land Your Dream Job <span className="grad-text">With Confidence.</span>
          </h1>
          <p className="lead">
            Practice real interview questions, discover better answers, and prepare for your next
            opportunity.
          </p>
          <div className="cta-row">
            <a href="#practice" className="btn btn-primary btn-lg">
              Start Practicing <Icon name="arrow" size={18} />
            </a>
            <a href="#questions" className="btn btn-ghost btn-lg">
              Explore Questions
            </a>
          </div>
          <ul className="hero-points">
            <li><Icon name="check" size={16} /> 25 practice questions</li>
            <li><Icon name="check" size={16} /> Works on any device</li>
            <li><Icon name="check" size={16} /> No sign-up needed</li>
          </ul>
        </div>

        <figure className="dash" aria-label="Preview of the practice dashboard">
          <div className="dash-glow" aria-hidden="true" />
          <div className="dash-card">
            <div className="dash-top">
              <div className="dash-dots" aria-hidden="true"><i /><i /><i /></div>
              <span className="dash-title">Practice session</span>
              <span className="badge">Sample preview</span>
            </div>

            <div className="dash-body">
              <div className="dash-questions">
                <p className="dash-label">Today's questions</p>
                <ul>
                  {HERO_QUESTIONS.map((item, i) => (
                    <li key={item.q}>
                      <button
                        type="button"
                        className={`dash-q ${selected === i ? "is-selected" : ""}`}
                        onClick={() => setSelected(i)}
                        aria-pressed={selected === i}
                      >
                        <span className="dash-q-icon" aria-hidden="true">
                          {i < selected ? <Icon name="check" size={14} /> : i + 1}
                        </span>
                        <span className="dash-q-text">
                          {item.q}
                          <small>{item.tag}</small>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="progress">
                  <div className="progress-head">
                    <span>Progress</span>
                    <span>{selected + 1} of 3</span>
                  </div>
                  <div
                    className="bar"
                    role="progressbar"
                    aria-label="Practice progress"
                    aria-valuemin={0}
                    aria-valuemax={3}
                    aria-valuenow={selected + 1}
                  >
                    <span style={{ width: `${((selected + 1) / 3) * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="dash-score">
                <p className="dash-label">Checklist score</p>
                <ScoreRing value={82} label="Example checklist score" />
                <p className="dash-note">Example only. Your own score appears in Practice.</p>
              </div>
            </div>
          </div>
          <div className="float-chip chip-a" aria-hidden="true">
            <Icon name="clock" size={14} /> 1:20 answer time
          </div>
          <div className="float-chip chip-b" aria-hidden="true">
            <Icon name="check" size={14} /> Clear structure
          </div>
        </figure>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="section">
      <div className="container">
        <header className="section-head">
          <h2>Everything you need to prepare, in one place</h2>
          <p>Simple tools that help you practice with purpose instead of guessing.</p>
        </header>
        <div className="feature-grid">
          {FEATURES.map(({ icon, title, text, href, cta }) => (
            <article className="card feature" key={title}>
              <span className="icon-box" aria-hidden="true">
                <Icon name={icon} size={22} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
              <a href={href} className="feature-link">
                {cta} <Icon name="arrow" size={16} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   Interview Questions
   ===================================================================== */
function QuestionExplorer({ onPractice }) {
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);
  const active = useMemo(() => CATEGORIES.find((c) => c.id === activeId), [activeId]);

  const onKeyDown = (e) => {
    const i = CATEGORIES.findIndex((c) => c.id === activeId);
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % CATEGORIES.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + CATEGORIES.length) % CATEGORIES.length;
    if (next !== null) {
      e.preventDefault();
      setActiveId(CATEGORIES[next].id);
      document.getElementById(`tab-${CATEGORIES[next].id}`)?.focus();
    }
  };

  return (
    <section id="questions" className="section section-alt">
      <div className="container">
        <header className="section-head">
          <h2>Interview questions by job</h2>
          <p>Pick a role, open a question to see a sample answer, or practice it right away.</p>
        </header>

        <div className="tabs" role="tablist" aria-label="Job categories" onKeyDown={onKeyDown}>
          {CATEGORIES.map(({ id, name, icon }) => (
            <button
              key={id}
              id={`tab-${id}`}
              role="tab"
              type="button"
              aria-selected={activeId === id}
              aria-controls="category-panel"
              tabIndex={activeId === id ? 0 : -1}
              className={`tab ${activeId === id ? "is-active" : ""}`}
              onClick={() => setActiveId(id)}
            >
              <Icon name={icon} size={18} />
              {name}
            </button>
          ))}
        </div>

        <div
          id="category-panel"
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          className="panel card"
          key={active.id}
        >
          <div className="panel-head">
            <h3>{active.name} interview questions</h3>
            <p>{active.blurb}</p>
          </div>
          <ul className="q-list">
            {active.questions.map((item, i) => (
              <li key={item.q}>
                <details className="q-item">
                  <summary>
                    <span>{item.q}</span>
                    <Icon name="chevron" size={18} />
                  </summary>
                  <div className="q-body">
                    <p className="q-label">Sample answer</p>
                    <p className="q-answer">{item.answer}</p>
                    <p className="q-tip">
                      <strong>How to approach it: </strong>
                      {item.tip}
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => onPractice(active.id, i)}
                    >
                      Practice this question <Icon name="arrow" size={16} />
                    </button>
                  </div>
                </details>
              </li>
            ))}
          </ul>
          <p className="panel-note">
            Sample answers are examples with made-up details. Replace them with your own real
            experience.
          </p>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   Practice Mode
   ===================================================================== */
function SelectField({ id, label, value, onChange, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <span className="select-wrap">
        <select id={id} value={value} onChange={onChange}>
          {children}
        </select>
        <Icon name="chevron" size={18} />
      </span>
    </div>
  );
}

function SampleAnswer({ question }) {
  return (
    <div className="sample">
      <h4>Sample answer</h4>
      <p>{question.answer}</p>
      <p className="sample-note">
        This is only an example. Rewrite it using your own experience and details.
      </p>
    </div>
  );
}

function Feedback({ review, stale }) {
  if (!review) {
    return (
      <div className="fb-card">
        <p className="fb-placeholder">
          <strong>Your review will appear here.</strong> Write your answer, then press Review My
          Answer. You will get a simple checklist based on length, structure, and keywords.
        </p>
      </div>
    );
  }

  if (review.status === "empty") {
    return (
      <div className="alert" role="alert">
        <Icon name="alert" size={18} />
        <p>Your answer is empty. Type at least a few sentences, then press Review My Answer.</p>
      </div>
    );
  }

  if (review.status === "short") {
    return (
      <div className="fb-card">
        <div className="alert" role="alert">
          <Icon name="alert" size={18} />
          <p>
            Your answer is very short ({review.words} {review.words === 1 ? "word" : "words"}).
            Interviewers usually expect a few sentences with a real example.
          </p>
        </div>
        <ul className="tip-list">
          <li><Icon name="check" size={16} /> Start with one direct sentence that answers the question.</li>
          <li><Icon name="check" size={16} /> Add a specific example from work, school, or a project.</li>
          <li><Icon name="check" size={16} /> End with the result or what you learned.</li>
        </ul>
        <p className="fb-note">
          <strong>How this works:</strong> a short answer is detected by counting words. Compare
          with the sample answer below.
        </p>
      </div>
    );
  }

  return (
    <div className="fb-card">
      <div className="fb-head">
        <ScoreRing value={review.score} size={92} label="Checklist score" />
        <div>
          <h4>Checklist score</h4>
          <p>{review.summary}</p>
        </div>
      </div>

      <ul className="fb-checks">
        {review.checks.map((c) => (
          <li key={c.label} className={c.pass ? "is-pass" : "is-fail"}>
            <span className="fb-icon">
              <Icon name={c.pass ? "check" : "alert"} size={14} />
            </span>
            <div>
              <strong>{c.label}</strong>
              {!c.pass && <p>{c.tip}</p>}
            </div>
          </li>
        ))}
      </ul>

      <div className="ideas">
        {review.found.length > 0 && (
          <div>
            <h5>Ideas you covered</h5>
            <div className="chips">
              {review.found.map((k) => (
                <span key={k.label} className="chip chip-yes">{k.label}</span>
              ))}
            </div>
          </div>
        )}
        {review.missing.length > 0 && (
          <div>
            <h5>Ideas you could add, if they fit your experience</h5>
            <div className="chips">
              {review.missing.map((k) => (
                <span key={k.label} className="chip chip-no">{k.label}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {stale && (
        <p className="fb-stale">
          You edited your answer. Press Review My Answer again to update this review.
        </p>
      )}

      <p className="fb-note">
        <strong>How this works:</strong> this review is rule-based and runs on your device. It
        counts words and looks for patterns and keywords. It is not AI, and it cannot judge how
        good or accurate your answer really is.
      </p>
    </div>
  );
}

function PracticeWorkspace({ question, draft, onDraft, onTryAnother }) {
  const [review, setReview] = useState(null);
  const [showSample, setShowSample] = useState(false);
  const feedbackRef = useRef(null);

  const words = countWords(draft);
  const stale = review !== null && review.text !== draft;

  useEffect(() => {
    if (review && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "nearest",
      });
    }
  }, [review]);

  const handleReview = () => {
    const result = reviewAnswer(draft, question);
    setReview(result);
    if (result.status !== "empty") setShowSample(true);
  };

  const handleClear = () => {
    onDraft("");
    setReview(null);
  };

  return (
    <div className="practice-cols">
      <div className="answer-box">
        <h4>Your answer</h4>
        <label htmlFor="draft" className="sr-only">
          Type your answer to the selected question
        </label>
        <textarea
          id="draft"
          rows={8}
          value={draft}
          onChange={(e) => onDraft(e.target.value)}
          placeholder="Type your answer here. Aim for 50 to 220 words, with one real example and a result."
        />
        <div className="stats">
          <span>{words} {words === 1 ? "word" : "words"}</span>
          <span>
            <Icon name="clock" size={14} /> About {formatSpoken(words)} spoken
          </span>
        </div>

        <div className="actions">
          <button type="button" className="btn btn-primary" onClick={handleReview}>
            <Icon name="clipboard" size={18} /> Review My Answer
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setShowSample((s) => !s)}
            aria-expanded={showSample}
          >
            <Icon name="eye" size={18} /> {showSample ? "Hide Sample Answer" : "Show Sample Answer"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={onTryAnother}>
            <Icon name="refresh" size={18} /> Try Another Question
          </button>
          <button type="button" className="btn btn-ghost" onClick={handleClear}>
            <Icon name="close" size={18} /> Clear Answer
          </button>
        </div>
      </div>

      <div className="feedback" ref={feedbackRef} aria-live="polite">
        <h4 className="feedback-title">Feedback</h4>
        <Feedback review={review} stale={stale} />
        {showSample && <SampleAnswer question={question} />}
      </div>
    </div>
  );
}

function Practice({ selection, onSelect }) {
  const [drafts, setDrafts] = useState({});

  const category = CATEGORIES.find((c) => c.id === selection.catId) || CATEGORIES[0];
  const question = category.questions[selection.qIndex] || category.questions[0];
  const draftKey = `${category.id}-${selection.qIndex}`;

  const handleCategory = (e) => onSelect(e.target.value, 0);
  const handleQuestion = (e) => onSelect(category.id, Number(e.target.value));

  const handleTryAnother = () => {
    const others = category.questions.map((_, i) => i).filter((i) => i !== selection.qIndex);
    const next = others[Math.floor(Math.random() * others.length)];
    onSelect(category.id, next);
  };

  const setDraft = (value) => setDrafts((d) => ({ ...d, [draftKey]: value }));

  return (
    <section id="practice" className="section">
      <div className="container">
        <header className="section-head">
          <h2>Practice mode</h2>
          <p>
            Choose a question, write your own answer, and get a simple checklist review. Nothing
            you type leaves your device.
          </p>
        </header>

        <div className="card practice-shell">
          <div className="picker">
            <SelectField
              id="practice-category"
              label="Job category"
              value={category.id}
              onChange={handleCategory}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </SelectField>
            <SelectField
              id="practice-question"
              label="Question"
              value={selection.qIndex}
              onChange={handleQuestion}
            >
              {category.questions.map((item, i) => (
                <option key={item.q} value={i}>{item.q}</option>
              ))}
            </SelectField>
          </div>

          <div className="practice-q">
            <span className="badge badge-soft">{category.name}</span>
            <h3>{question.q}</h3>
            <p>
              <strong>Tip: </strong>
              {question.tip}
            </p>
          </div>

          <PracticeWorkspace
            key={draftKey}
            question={question}
            draft={drafts[draftKey] || ""}
            onDraft={setDraft}
            onTryAnother={handleTryAnother}
          />
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   Career Guides, CTA, Footer
   ===================================================================== */
function Guides() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section id="guides" className="section section-alt">
      <div className="container guides">
        <header className="section-head left">
          <h2>Career guides</h2>
          <p>Quick checklists for every stage of the interview process.</p>
        </header>
        <div className="accordion">
          {GUIDES.map((g, i) => {
            const open = openIndex === i;
            return (
              <div className={`acc-item card ${open ? "is-open" : ""}`} key={g.title}>
                <h3>
                  <button
                    type="button"
                    className="acc-btn"
                    aria-expanded={open}
                    aria-controls={`guide-${i}`}
                    onClick={() => setOpenIndex(open ? -1 : i)}
                  >
                    {g.title}
                    <Icon name="chevron" size={20} />
                  </button>
                </h3>
                <div id={`guide-${i}`} className="acc-panel" hidden={!open}>
                  <ul>
                    {g.points.map((p) => (
                      <li key={p}>
                        <Icon name="check" size={16} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="section cta-section" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-band">
          <h2 id="cta-title">Your next interview starts with one answer.</h2>
          <p>Pick a question, write your response, and refine it until you feel ready.</p>
          <a href="#practice" className="btn btn-primary btn-lg">
            Start Practicing <Icon name="arrow" size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>Free tools to help you prepare for interviews with clarity and confidence.</p>
        </div>
        <nav aria-label="Explore">
          <h4>Explore</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#questions">Interview Questions</a></li>
          </ul>
        </nav>
        <nav aria-label="Prepare">
          <h4>Prepare</h4>
          <ul>
            <li><a href="#practice">Practice</a></li>
            <li><a href="#guides">Career Guides</a></li>
            <li><a href="#questions">Job Categories</a></li>
          </ul>
        </nav>
      </div>
      <div className="container footer-bottom">
        <p className="disclaimer">
          <strong>Disclaimer:</strong> Sample answers are examples only. Always personalize your
          answers with your own experience, skills, and the specific role you are applying for.
          Practice feedback is rule-based and is not AI-generated advice.
        </p>
        <p className="copy">© {new Date().getFullYear()} InterviewAce AI. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* =====================================================================
   App
   ===================================================================== */
export default function App() {
  const ids = useMemo(() => ["home", "features", "questions", "practice", "guides"], []);
  const active = useActiveSection(ids);
  const navActive = active === "features" ? "home" : active;

  const [selection, setSelection] = useState({ catId: CATEGORIES[0].id, qIndex: 0 });

  const handlePractice = (catId, qIndex) => {
    setSelection({ catId, qIndex });
    requestAnimationFrame(() => scrollToId("practice"));
  };

  return (
    <div className="app">
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar active={navActive} />
      <main id="main">
        <Hero />
        <Features />
        <QuestionExplorer onPractice={handlePractice} />
        <Practice
          selection={selection}
          onSelect={(catId, qIndex) => setSelection({ catId, qIndex })}
        />
        <Guides />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
