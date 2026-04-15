import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

interface PromptChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  exampleBad: string;
  exampleGood: string;
  criteria: string[];
  tips: string[];
}

const challenges: PromptChallenge[] = [
  {
    id: "landing-page", title: "Landing Page Builder", description: "Write a prompt to create a SaaS landing page for a project management tool.",
    category: "ui-design", difficulty: "beginner",
    exampleBad: "Make me a website for a project management tool.",
    exampleGood: "You are a senior web designer. Create a modern SaaS landing page for 'TaskFlow', a project management tool. Use a dark blue (#1a1a2e) and white color scheme with purple (#7C3AED) accents. Include: hero section with tagline 'Manage Projects, Not Chaos' and CTA button, features grid (4 features with icons: Kanban boards, Time tracking, Team chat, File sharing), pricing table (Free/Pro $12/mo/Team $29/mo), testimonials carousel (3 reviews), footer with links. Mobile-responsive, use Inter font.",
    criteria: ["Specifies the product name and purpose", "Includes color scheme (hex codes)", "Lists specific sections/components", "Mentions responsive design", "Includes content details (tagline, features, prices)"],
    tips: ["Name your product", "Use hex color codes for precision", "List every section you want", "Specify font and styling preferences", "Include actual content (not just 'add a pricing section')"]
  },
  {
    id: "auth-system", title: "Authentication System", description: "Write a prompt to add login/signup to an existing app.",
    category: "backend", difficulty: "intermediate",
    exampleBad: "Add login to my app.",
    exampleGood: "You are a senior fullstack developer with security expertise. Add email/password authentication to my React + Supabase app. Include: 1) Signup page with email, password (min 8 chars), and confirm password fields. 2) Login page with email/password and 'forgot password' link. 3) Password reset flow via email. 4) Protected routes: redirect to /login if not authenticated. 5) User profile page showing email and join date. 6) Logout button in the navbar. Use Supabase Auth. Do NOT store passwords in plain text. Add rate limiting to prevent brute force (max 5 attempts per minute).",
    criteria: ["Defines role with security expertise", "Lists all auth pages needed", "Specifies validation rules", "Mentions security requirements", "Includes edge cases (forgot password, rate limiting)"],
    tips: ["Always mention security in auth prompts", "Specify password requirements", "Include forgot password flow", "Mention rate limiting", "Specify what happens for unauthorized users"]
  },
  {
    id: "dashboard", title: "Analytics Dashboard", description: "Write a prompt to create a data dashboard with charts and stats.",
    category: "ui-design", difficulty: "intermediate",
    exampleBad: "Create a dashboard.",
    exampleGood: "Create an analytics dashboard with dark theme (#0f172a background). Include: 1) Sidebar navigation with icons: Dashboard, Users, Revenue, Settings. 2) Top bar with search input, notification bell with badge, and user avatar dropdown. 3) Main area: 4 stat cards in a row (Total Users: 12,450, Revenue: $45,230, Active Sessions: 1,893, Growth: +12.5%). 4) Line chart showing monthly revenue for the last 12 months using Recharts. 5) Data table: recent users (name, email, plan, joined date) with sortable columns and pagination. Use Tailwind CSS, shadcn/ui components.",
    criteria: ["Specifies layout (sidebar, topbar, main area)", "Includes exact stat numbers for mock data", "Names specific chart library", "Describes table with columns and features", "Mentions component library and styling"],
    tips: ["Include mock data — AI needs numbers to display", "Name the chart library (Recharts, Chart.js)", "Specify color theme with hex codes", "List every component in the sidebar", "Describe table columns and functionality"]
  },
  {
    id: "api-design", title: "REST API Design", description: "Write a prompt to create a REST API for a todo app.",
    category: "backend", difficulty: "beginner",
    exampleBad: "Make an API for todos.",
    exampleGood: "You are a senior backend developer. Create a REST API for a todo app using Express.js, TypeScript, and PostgreSQL with Prisma ORM. Endpoints: GET /api/todos (list all for authenticated user, paginated: ?page=1&limit=10), POST /api/todos (create: title required, description optional, returns created todo), PUT /api/todos/:id (update: title, description, completed status), DELETE /api/todos/:id (soft delete, set deleted_at timestamp). Include: JWT authentication middleware, input validation with Zod, proper error responses (400, 401, 404, 500), and request logging. Do NOT use any deprecated packages.",
    criteria: ["Specifies tech stack precisely", "Lists all endpoints with HTTP methods", "Describes request/response format", "Includes authentication requirement", "Mentions validation and error handling"],
    tips: ["List every endpoint with its HTTP method", "Describe required vs optional fields", "Specify authentication type", "Mention validation library", "Include error response codes"]
  },
  {
    id: "mobile-ui", title: "Mobile App Screen", description: "Write a prompt to design a mobile banking app home screen.",
    category: "ui-design", difficulty: "beginner",
    exampleBad: "Design a banking app.",
    exampleGood: "Design a mobile banking app home screen. Use a clean white background with blue (#3B82F6) primary color. Include: 1) Top: 'Good morning, Alex' greeting with notification bell. 2) Balance card: gradient blue background, showing $12,450.89 with 'hide balance' eye icon. 3) Quick actions row: Send, Request, Pay Bills, Top Up (circular icons). 4) Recent transactions list: each item has merchant icon, name, date, and amount (green for income, red for expense). Show 5 transactions. 5) Bottom tab bar: Home, Cards, Payments, Profile. Use rounded corners (12px) everywhere. Font: Inter, 16px body, 32px balance.",
    criteria: ["Describes specific layout for mobile", "Includes exact color codes", "Lists all UI components", "Specifies typography details", "Includes interaction details (hide balance, etc.)"],
    tips: ["Design for mobile viewport specifically", "Include exact font sizes", "Specify border radius values", "Add interactive elements", "Include mock data (names, amounts, dates)"]
  },
  {
    id: "debug-prompt", title: "Debugging with AI", description: "Write a prompt to ask AI to fix a specific error.",
    category: "debugging", difficulty: "beginner",
    exampleBad: "My app is broken, fix it.",
    exampleGood: "I'm getting this error when clicking the 'Submit' button on my contact form:\n\nTypeError: Cannot read properties of undefined (reading 'email')\nat handleSubmit (ContactForm.tsx:24)\n\nThe form has name, email, and message fields. I'm using React with TypeScript and the form state is managed with useState. The error happens after I added form validation. Here's the relevant code:\n\nconst [form, setForm] = useState({});\nconst handleSubmit = () => { if (form.email.includes('@')) { ... } }\n\nI think the issue is that 'form' starts empty so 'email' is undefined. How do I fix this while keeping the validation?",
    criteria: ["Includes the FULL error message", "Describes what triggers the error", "Mentions the tech stack", "Provides relevant code", "Explains what they think the issue is"],
    tips: ["Always paste the FULL error — every line matters", "Tell AI what you were doing when it happened", "Include the relevant code snippet", "Mention what changed before it broke", "Share your hypothesis — it helps AI focus"]
  },
  {
    id: "ecommerce", title: "E-commerce Product Page", description: "Write a prompt to create a product detail page for an online store.",
    category: "ui-design", difficulty: "intermediate",
    exampleBad: "Make a product page.",
    exampleGood: "Create a product detail page for an online sneaker store. Layout: left side (60%) shows product image gallery (main image + 4 thumbnails, click to switch), right side (40%) shows details. Details include: product name ('Nike Air Max 270'), price ($150 with strikethrough $180), star rating (4.5/5 with 128 reviews), color selector (3 color circles: black, white, red), size selector (grid of sizes 7-13, highlight selected, gray out unavailable), quantity selector (+/- buttons), 'Add to Cart' button (large, black, full-width), and 'Description' accordion section. Below: 'You might also like' carousel with 4 similar products. Mobile: stack vertically. Use Next.js with Tailwind.",
    criteria: ["Describes two-column layout with percentages", "Includes specific product details for mock data", "Lists all interactive elements", "Describes mobile behavior", "Specifies framework and styling"],
    tips: ["Include mock product data — name, price, ratings", "Describe interactive elements: selectors, buttons", "Specify responsive behavior", "Include related products section", "Name the tech stack"]
  },
  {
    id: "database-schema", title: "Database Schema Design", description: "Write a prompt to design a database for a social media app.",
    category: "backend", difficulty: "advanced",
    exampleBad: "Make a database for social media.",
    exampleGood: "You are a senior database architect. Design a PostgreSQL schema for a social media app using Prisma ORM. Tables: 1) users (id uuid PK, username unique, email unique, password_hash, avatar_url, bio, created_at). 2) posts (id uuid PK, user_id FK→users, content text max 500 chars, image_url optional, likes_count default 0, created_at). 3) comments (id uuid PK, user_id FK→users, post_id FK→posts, content text max 200, created_at). 4) likes (user_id FK, post_id FK, composite PK, created_at). 5) follows (follower_id FK→users, following_id FK→users, composite PK, created_at). Add indexes on: posts.user_id, comments.post_id, follows.follower_id. Enable Row Level Security. Include the Prisma schema file.",
    criteria: ["Lists all tables with columns and types", "Specifies primary and foreign keys", "Includes constraints (unique, max length)", "Mentions indexes for performance", "Requests specific ORM format"],
    tips: ["Define every column with its type", "Specify primary keys and foreign keys", "Include unique constraints", "Add indexes for frequently queried columns", "Mention the ORM (Prisma, Drizzle, etc.)"]
  }
];

// Get a random challenge
router.get('/challenge', authenticate, async (_req: AuthRequest, res: Response): Promise<void> => {
  const challenge = challenges[Math.floor(Math.random() * challenges.length)];
  // Don't send the good example yet - user needs to try first
  res.json({
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    category: challenge.category,
    difficulty: challenge.difficulty,
    criteria: challenge.criteria,
    tips: challenge.tips,
    exampleBad: challenge.exampleBad
  });
});

// Get a specific challenge with solution
router.get('/challenge/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const challenge = challenges.find(c => c.id === req.params.id);
  if (!challenge) { res.status(404).json({ error: 'Challenge not found' }); return; }
  res.json(challenge);
});

// Get all challenges
router.get('/challenges', authenticate, async (_req: AuthRequest, res: Response): Promise<void> => {
  res.json(challenges.map(c => ({
    id: c.id, title: c.title, description: c.description,
    category: c.category, difficulty: c.difficulty
  })));
});

// Score a prompt (simple rule-based scoring)
router.post('/score', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { challengeId, prompt } = req.body;
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) { res.status(404).json({ error: 'Challenge not found' }); return; }

    const promptLower = prompt.toLowerCase();
    let score = 0;
    const feedback: string[] = [];
    const maxScore = 10;

    // Length check (1-2 points)
    if (prompt.length > 200) { score += 2; feedback.push("Good length — detailed prompts get better results!"); }
    else if (prompt.length > 100) { score += 1; feedback.push("Decent length, but more detail would help."); }
    else { feedback.push("Too short! Great prompts are usually 200+ characters with specific details."); }

    // Role prompting (1 point)
    if (promptLower.includes("you are") || promptLower.includes("act as") || promptLower.includes("as a")) {
      score += 1; feedback.push("Role prompting detected — great start!");
    } else { feedback.push("Try adding a role: 'You are a senior developer...'"); }

    // Specificity checks (1 point each, up to 4)
    if (/\#[0-9a-fA-F]{6}/.test(prompt) || promptLower.includes("color")) {
      score += 1; feedback.push("Color specifications found!");
    } else if (challenge.category === "ui-design") { feedback.push("Add color specifications (hex codes like #3B82F6)."); }

    if (/\d+px|\d+rem|\d+em/.test(prompt) || promptLower.includes("font size") || promptLower.includes("spacing")) {
      score += 1; feedback.push("Size/spacing details included!");
    } else if (challenge.category === "ui-design") { feedback.push("Add sizing details (font sizes, spacing values)."); }

    if (promptLower.includes("include") || promptLower.includes("section") || promptLower.includes("component") || promptLower.includes("endpoint")) {
      score += 1; feedback.push("Structured requirements — well organized!");
    } else { feedback.push("List specific sections/components/endpoints you need."); }

    if (promptLower.includes("do not") || promptLower.includes("don't") || promptLower.includes("avoid") || promptLower.includes("never")) {
      score += 1; feedback.push("Negative constraints found — prevents common AI mistakes!");
    } else { feedback.push("Add constraints: 'Do NOT use inline styles' or 'Avoid deprecated APIs'."); }

    // Tech stack mentioned (1 point)
    if (promptLower.includes("react") || promptLower.includes("next") || promptLower.includes("tailwind") || promptLower.includes("express") || promptLower.includes("supabase") || promptLower.includes("postgresql")) {
      score += 1; feedback.push("Tech stack specified!");
    } else { feedback.push("Mention your preferred tech stack for better results."); }

    // Numbered steps or sections (1 point)
    if (/\d\)|\d\./.test(prompt) || prompt.includes("1)") || prompt.includes("Step 1")) {
      score += 1; feedback.push("Well-structured with numbered steps!");
    } else { feedback.push("Try numbering your requirements (1, 2, 3...) for clarity."); }

    const rating = score >= 8 ? "Expert" : score >= 6 ? "Great" : score >= 4 ? "Good" : score >= 2 ? "Needs Work" : "Beginner";

    res.json({
      score: Math.min(score, maxScore),
      maxScore,
      rating,
      feedback,
      exampleGood: challenge.exampleGood
    });
  } catch (error) {
    console.error('Score error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
