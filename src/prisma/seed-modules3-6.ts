import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function mcq(q:string,o:string[],c:number,e:string){return{type:'multiple_choice',question:q,options:o,correct:c,explanation:e}}
function tf(q:string,a:boolean,e:string){return{type:'true_false',question:q,answer:a,explanation:e}}
function fb(q:string,a:string,e:string){return{type:'fill_blank',question:q,answer:a,explanation:e}}

async function seedModule(slug:string, lessons:any[]) {
  const mod = await prisma.module.findUnique({where:{slug}});
  if(!mod){console.log(`Module ${slug} not found`);return;}
  for(const l of lessons) {
    const exists = await prisma.lesson.findUnique({where:{slug:l.slug}});
    if(exists) continue;
    await prisma.lesson.create({data:{...l, moduleId:mod.id}});
    console.log(`  ✅ ${l.slug}`);
  }
}

function lesson(title:string,slug:string,order:number,mins:number,story:string,keyPoints:string[],eli10:string,realWorld:string,quiz:any[],demoTool?:string,demoSteps?:any[],challenge?:any) {
  return {
    title, slug, order, difficulty:'BEGINNER' as const, estimatedMinutes:mins,
    concept: JSON.stringify({story,keyPoints,eli10,realWorldExample:realWorld}),
    demo: demoTool ? JSON.stringify({tool:demoTool,steps:demoSteps||[]}) : undefined,
    quiz: JSON.stringify(quiz),
    challenge: challenge ? JSON.stringify(challenge) : undefined
  };
}

async function main() {
console.log('🚀 Seeding Modules 3-6\n');

// ==================== MODULE 3: PROMPT ENGINEERING (15) ====================
console.log('✨ Module 3: Prompt Engineering');
await seedModule('prompt-engineering', [
  lesson('Why Prompting is the New Programming','why-prompting',1,5,
    "In the age of AI, your ability to write clear, specific prompts IS your programming skill. Studies show that well-crafted prompts reduce iteration by 68%. The difference between a beginner and an expert vibe coder isn't coding knowledge — it's prompt quality. A great prompt turns a 2-hour build into a 10-minute build.",
    ["Prompt quality directly determines output quality","68% fewer iterations with well-crafted prompts","Prompting is a learnable skill, not a talent","The #1 differentiator between good and great vibe coders"],
    "Prompting is like giving directions. Bad directions: 'Go somewhere nice.' Good directions: 'Go to the Italian restaurant on 5th Street, get a table by the window, and order the pasta special.' Better directions = better results!",
    "A startup founder built the same app twice: once with vague prompts (took 3 days, lots of bugs) and once with precise prompts (took 4 hours, worked first try).",
    [mcq("What reduces AI iteration cycles by 68%?",["Using a faster computer","Writing specific, detailed prompts","Using multiple AI tools","Coding by hand first"],1,"Studies show well-crafted prompts with clear specifications dramatically reduce back-and-forth."),
     tf("You need coding experience to write good AI prompts.",false,"Prompt engineering is about clear communication, not coding knowledge.")]),

  lesson('Anatomy of a Great Prompt','anatomy-great-prompt',2,6,
    "Every great prompt has 5 parts: 1) ROLE — Tell the AI who it is ('You are a senior React developer'). 2) CONTEXT — What's the project about. 3) TASK — What specifically to build. 4) CONSTRAINTS — Technical requirements, restrictions. 5) OUTPUT FORMAT — How you want the result delivered. This 5-part framework works for ANY AI tool.",
    ["Role: Define the AI's expertise","Context: Project background and goals","Task: Specific thing to build","Constraints: Tech requirements, limits, style","Output: How to deliver the result"],
    "It's like ordering a custom cake. You tell the baker: 1) 'You're the best chocolate cake maker' (role). 2) 'It's for a birthday party' (context). 3) 'Make a 3-tier cake' (task). 4) 'No nuts, blue frosting' (constraints). 5) 'Deliver it boxed by 3pm' (output).",
    "Professional prompt engineers at companies like Anthropic and OpenAI use structured frameworks like this. It's not just for beginners — it's industry standard.",
    [mcq("What are the 5 parts of a great prompt?",["Who, What, When, Where, Why","Role, Context, Task, Constraints, Output","Introduction, Body, Conclusion","Subject, Verb, Object"],1,"The 5-part framework: Role + Context + Task + Constraints + Output = consistently great results."),
     fb("The first part of a great prompt defines the AI's ___, like 'You are a senior developer'.","role","Setting the role tells the AI what expertise level and perspective to use.")],
    undefined,undefined,
    {type:"project_task",description:"Write a 5-part prompt to build a personal portfolio website. Label each part (Role, Context, Task, Constraints, Output). Then paste it into Lovable or Bolt and see the result!",criteria:["Has all 5 parts labeled","Role is specific","Task is detailed","Constraints include tech preferences"],xpBonus:50}),

  lesson('Be Specific: Vague vs Precise Prompts','be-specific',3,5,
    "The #1 mistake beginners make: being too vague. Compare: VAGUE: 'Make me a website.' PRECISE: 'Create a modern landing page for a SaaS project management tool called TaskFlow. Use a dark blue (#1a1a2e) and white color scheme. Include: hero section with tagline and CTA, features grid (4 features with icons), pricing table (3 tiers), testimonials section, footer with links.' The precise prompt gets a usable result on the FIRST try.",
    ["Vague prompts = generic results + many iterations","Specific prompts = usable results on first try","Include: colors, layout, sections, text content","Name specific technologies when you have preferences","More detail = better output (up to a point)"],
    "Vague: 'Draw me a picture.' Specific: 'Draw a golden retriever puppy playing in autumn leaves in a park, watercolor style.' Which one gives you what you actually want?",
    "A/B tests show specific prompts produce usable output 73% of the time on the first attempt, vs 12% for vague prompts.",
    [mcq("Which prompt will give better results?",["'Make a website'","'Create a dark-themed landing page for a fitness app with hero, features, pricing, and testimonials sections using blue and green colors'","'Build something cool'","'I need an app'"],1,"Specificity is key. Include layout, colors, sections, and content details for best results.")]),

  lesson('Providing Context: Tell the AI Your Story','providing-context',4,5,
    "AI has zero context about your project unless you provide it. Before asking it to build something, tell it: What is the project? Who are the users? What's the current state? What tech are you using? What have you already tried? Think of it like briefing a new team member on their first day — they need background before they can contribute.",
    ["AI knows nothing about your project by default","Share: project purpose, users, tech stack, current state","More context = fewer misunderstandings","Include screenshots or code snippets when relevant","Context prevents the AI from making wrong assumptions"],
    "Imagine hiring a painter but just saying 'paint.' Paint what? What color? What room? What style? You need to tell them everything because they've never been to your house before!",
    "Enterprise prompt engineers at Google include 200-500 words of context before their actual request. Context is never wasted.",
    [mcq("Why does AI need context?",["It's polite","AI has no prior knowledge of your project — context prevents wrong assumptions","To make the prompt longer","AI prefers long prompts"],1,"Without context, AI fills in gaps with assumptions. Your project context ensures it assumes correctly."),
     tf("Providing more context makes AI slower.",false,"Context doesn't slow AI down — it makes outputs more accurate, saving time on iterations.")]),

  lesson('The Iterative Loop: Prompt → Test → Refine','iterative-loop',5,5,
    "Nobody gets perfect results on the first prompt. The iterative loop is: 1) Write a prompt. 2) Review the output. 3) Identify what's wrong or missing. 4) Refine the prompt with specific feedback. 5) Repeat. The key is SPECIFIC feedback: don't say 'make it better' — say 'move the nav bar to the left, increase font size to 18px, and change the button color to green.'",
    ["Perfect first-try results are rare — iteration is normal","Review output carefully before refining","Give SPECIFIC feedback, not vague ('make it better')","Each iteration should address ONE clear issue","Usually takes 2-4 iterations to get it right"],
    "It's like getting a haircut. After the first cut, you say 'a bit shorter on the sides' not 'make it better.' Each round of feedback gets closer to what you want!",
    "Professional developers using AI iterate an average of 3.2 times per feature. Even experts rarely get it right on attempt one.",
    [mcq("What's wrong with the feedback 'make it better'?",["Nothing, it's fine","It's too vague — AI doesn't know what 'better' means to you","It's rude","It's too short"],1,"'Better' is subjective. Instead: 'Increase spacing between sections, make the header font bolder, and add a shadow to the cards.'"),
     mcq("How many iterations do experts typically need?",["Always 1","2-4 iterations","10+","They don't iterate"],1,"Even experienced prompt engineers iterate 2-4 times. It's a normal part of the process, not a failure.")]),

  lesson('Role Prompting: Define the Expert','role-prompting',6,5,
    "Starting your prompt with 'You are a senior [X] developer...' dramatically changes the output quality. The AI adopts that persona's expertise level, coding style, and best practices. Compare: 'Build a login form' vs 'You are a senior React developer with 10 years of experience in security. Build a login form with proper validation, error handling, rate limiting, and accessibility.' Night and day difference.",
    ["'You are a senior X developer' sets expertise level","Add specialties: 'with experience in security'","Role affects code quality, patterns, and best practices","Can combine roles: 'You are a fullstack developer AND UX designer'","Different roles = different perspectives on the same task"],
    "It's like asking a random person vs asking a chef to cook dinner. Same request, vastly different results. The chef knows techniques, timing, and presentation!",
    "OpenAI's own prompt engineering guide recommends role prompting as technique #1 for improving output quality.",
    [mcq("What does role prompting change?",["Nothing","The AI's expertise level, coding style, and best practices","The speed of response","The language used"],1,"Role prompting activates different knowledge patterns. A 'senior security engineer' produces much more secure code than a generic prompt."),
     fb("Starting a prompt with 'You are a ___' sets the AI's expertise level and perspective.","senior developer","Role prompting tells AI what level of expertise and specialization to apply.")]),

  lesson('Few-Shot Prompting: Show Don\'t Tell','few-shot-prompting',7,5,
    "Instead of describing what you want, SHOW the AI an example! 'Create buttons like this: <button class=\"btn-primary rounded-lg px-4 py-2 bg-blue-500 text-white\">Click Me</button>. Now create 3 more buttons: Save, Cancel, Delete.' Few-shot prompting gives the AI a concrete pattern to follow. Works for code style, data formats, writing tone — anything!",
    ["Show 1-3 examples of what you want","AI matches the pattern, style, and format","Works for code, data, writing, design","Saves pages of explanation","Combine with role prompting for best results"],
    "Instead of explaining what a chocolate chip cookie should taste like, you just give the baker one to taste. 'Make more like this!' Way easier!",
    "Research shows few-shot prompts improve accuracy by 35-50% compared to zero-shot (no examples) for complex tasks.",
    [mcq("What is few-shot prompting?",["Asking the AI to try multiple times","Providing examples of desired output so AI can match the pattern","Using fewer words","Shooting prompts quickly"],1,"Few-shot = showing examples. The AI learns the pattern from your examples and applies it."),
     tf("One example is usually enough for few-shot prompting.",true,"Even one good example (one-shot) significantly improves output. 2-3 examples is ideal for complex patterns.")]),

  lesson('Chain-of-Thought: Break Complex Tasks','chain-of-thought',8,5,
    "For complex tasks, don't ask for everything at once. Break it into steps! Instead of: 'Build me a full e-commerce site.' Try: Step 1: 'Design the homepage layout with hero, featured products, and categories.' Step 2: 'Now add a product detail page with images, description, reviews, and add-to-cart.' Step 3: 'Now add a shopping cart page with quantity controls and checkout button.' Each step builds on the previous one.",
    ["Break complex tasks into sequential steps","Each step builds on previous results","Easier to catch and fix errors early","AI handles focused tasks better than massive ones","Like building with LEGO: one section at a time"],
    "You don't build a house all at once. First the foundation, then walls, then roof, then paint. Each step is simple, but together they make something amazing!",
    "Chain-of-thought prompting was pioneered by Google researchers and has become standard practice in AI development.",
    [mcq("Why break complex tasks into steps?",["AI can't handle big tasks","Each step is easier to review, and errors are caught early before they compound","It's slower but more fun","To use more tokens"],1,"Complex single prompts produce complex bugs. Step-by-step catches issues early and produces cleaner results.")]),

  lesson('Negative Prompting: Do NOT Use...','negative-prompting',9,5,
    "Sometimes telling AI what NOT to do is as important as what to do. 'Do NOT use inline styles. Do NOT use var — use const and let. Do NOT include console.log statements. Do NOT use any deprecated APIs.' Negative constraints prevent common AI mistakes. Think of it as setting guardrails before the AI starts building.",
    ["Tell AI what to AVOID, not just what to do","Prevents common AI mistakes","'Do NOT use...' is powerful for code quality","Combine with positive instructions","Guards against bad habits AI learned from training data"],
    "When you tell a babysitter 'don't give the kids candy before bed,' that rule prevents a specific problem. Same with AI — explicit 'don't do X' prevents specific mistakes!",
    "Teams at large tech companies maintain 'negative prompt lists' — things their AI should never do. It's like a coding standards document.",
    [mcq("When is negative prompting useful?",["Never","When you want to prevent specific AI habits or mistakes","Only for images","Only for ChatGPT"],1,"Negative prompts prevent known AI mistakes: deprecated APIs, inline styles, insecure patterns, etc.")]),

  lesson('Prompt Templates: Save & Reuse','prompt-templates',10,5,
    "Once you find a prompt that works well, save it as a template! Great templates: [New Feature]: 'You are a senior {FRAMEWORK} developer. I have a {PROJECT_TYPE} app. Add a {FEATURE} with these requirements: {REQUIREMENTS}. Use {TECH_STACK}. Follow best practices for {CONCERN}.' Having a library of tested templates makes you 10x faster.",
    ["Save prompts that produced great results","Create templates with {PLACEHOLDERS}","Build a personal prompt library","Share templates with your team","Templates evolve — keep improving them"],
    "Chefs have recipe books. Writers have outlines. Vibe coders have prompt templates. You don't reinvent the wheel every time!",
    "Top vibe coders maintain Notion pages or markdown files with their best prompt templates, organized by task type.",
    [tf("You should write every prompt from scratch.",false,"Saving and reusing great prompts as templates makes you dramatically faster and more consistent.")]),

  lesson('Debugging with AI: Copy Error, Paste, Get Fix','debugging-with-ai',11,5,
    "When something breaks, the debugging workflow is simple: 1) Copy the ENTIRE error message. 2) Paste it to the AI with context: 'I got this error when trying to [what you were doing]. Here's the error: [paste]. How do I fix it?' AI is phenomenal at reading error messages and suggesting fixes. Don't try to understand the error yourself — let AI be your debugger.",
    ["Copy the FULL error message — every line matters","Include what you were doing when it happened","Paste relevant code if available","AI reads error messages better than most humans","Don't paraphrase errors — paste them exactly"],
    "When your car makes a weird noise, you don't fix it yourself — you take it to a mechanic and say 'it makes this noise when I turn left.' Same with code errors — show the AI exactly what happened!",
    "Studies show AI can correctly diagnose and fix 80% of common runtime errors when given the full error message and context.",
    [mcq("What should you include when asking AI to fix a bug?",["Just say 'it's broken'","The full error message + what you were doing + relevant code","Only the line number","A screenshot of your face looking confused"],1,"Full error + context + code gives AI everything it needs to diagnose and fix the issue.")]),

  lesson('When AI Gets Confused: Unsticking Yourself','when-ai-confused',12,5,
    "Sometimes AI gets stuck in a loop — suggesting the same bad fix over and over. When this happens: 1) Start a NEW conversation (fresh context). 2) Rephrase your request differently. 3) Break the problem into smaller parts. 4) Try a different AI tool. 5) Describe the GOAL, not the implementation. The worst thing you can do is keep pasting the same error — that's the 'prompt loop' trap.",
    ["Start a new conversation to clear bad context","Rephrase the problem from a different angle","Break into smaller, simpler parts","Try a different AI tool for a fresh perspective","Describe the goal, not the failed approach"],
    "If you're lost and keep walking the same wrong path, stop! Look at the map again from the beginning. Sometimes you need to start your journey from a different starting point.",
    "The 'prompt loop' is the #1 productivity killer in vibe coding. Recognizing it early and resetting saves hours.",
    [mcq("What's the best first step when AI keeps giving wrong fixes?",["Keep pasting the same error","Give up","Start a NEW conversation with fresh context","Complain about AI"],2,"A fresh conversation clears accumulated bad context. Rephrasing often triggers better reasoning paths.")]),

  lesson('Prompt Engineering for UI Design','prompt-for-ui',13,5,
    "When prompting for UI, be visual! Include: layout descriptions (sidebar + main content), specific colors (hex codes or names), spacing (padding, gaps), typography (font sizes, weights), component types (cards, tables, modals), responsive behavior (mobile/tablet/desktop). Example: 'Hero section: full-width, 80vh height, dark gradient background (#1a1a2e to #2d2d4a), centered white heading 48px, subheading 20px gray, green CTA button rounded-lg.'",
    ["Describe layout: sections, grid, sidebar, etc.","Specify colors: hex codes or named colors","Define spacing: padding, margins, gaps","Include typography: sizes, weights, fonts","Mention responsive behavior"],
    "Describing a room to an interior designer: 'Big room, make it nice' vs 'Living room, 20x15, modern style, gray walls, wooden floor, blue couch facing the TV, plants by the window.' Details make dreams real!",
    "Designers using AI report that including hex color codes in prompts eliminates 90% of color revision requests.",
    [mcq("Which detail is MOST important for UI prompts?",["The AI model version","Specific colors, spacing, and layout descriptions","The time of day","Your name"],1,"Visual details (colors, spacing, layout, typography) directly translate to the AI's output quality.")]),

  lesson('Prompt Engineering for Backend Logic','prompt-for-backend',14,6,
    "Backend prompts need different details: data models (what to store), API endpoints (what routes to create), business logic (rules and validation), authentication (who can do what), error handling (what happens when things fail). Example: 'Create a REST API for a todo app. Endpoints: GET /todos (list all, paginated), POST /todos (create, validate title required), PUT /todos/:id (update), DELETE /todos/:id (soft delete). Use Express + PostgreSQL. Include input validation and proper error responses.'",
    ["Define data models: what fields, what types","Specify API endpoints: route, method, behavior","Include business rules: validation, permissions","Mention error handling requirements","Specify the tech stack: framework, database, ORM"],
    "Building the backend is like designing the kitchen in a restaurant. You need to specify: what dishes (endpoints), what ingredients you store (database), rules (no peanuts = validation), and who's allowed in (authentication).",
    "Backend prompts with explicit endpoint definitions produce working APIs 85% of the time on first attempt.",
    [fb("When prompting for an API, specify the HTTP ___ for each endpoint (GET, POST, PUT, DELETE).","method","HTTP methods define what each endpoint does: GET reads, POST creates, PUT updates, DELETE removes.")]),

  lesson('Master Challenge: Build an App with Prompts','master-challenge-prompts',15,10,
    "It's time to put everything together! Your challenge: build a complete app using ONLY the prompt engineering techniques you've learned. Choose one: 1) A recipe sharing app with categories and search. 2) A budget tracker with income/expenses and charts. 3) A book review app with ratings and recommendations. Use: role prompting, the 5-part framework, specific details, chain-of-thought (build step by step), and negative constraints. Document your prompts!",
    ["Apply ALL techniques from this module","Use the 5-part framework for each prompt","Build step-by-step (chain-of-thought)","Include role, context, constraints","Review and iterate on each result"],
    "This is your final exam! Like a cooking show where you use all the techniques you learned to create a complete dish. Show what you've learned!",
    "Students who complete this challenge report feeling 10x more confident in their prompt engineering skills.",
    [tf("You should use all prompt engineering techniques together for best results.",true,"Combining role prompting, specificity, few-shot examples, and chain-of-thought produces the best outcomes.")],
    undefined,undefined,
    {type:"project_task",description:"Build a complete app (recipe sharing, budget tracker, or book reviews) using Lovable, Bolt, or Replit. Use ALL prompt techniques. Save your prompts and share the deployed URL!",criteria:["App has at least 3 features","Used 5-part prompt framework","Built step-by-step","Deployed and accessible"],xpBonus:100})
]);

// ==================== MODULE 4: AI TOOLBOX (12) ====================
console.log('\n🧰 Module 4: AI Toolbox');
await seedModule('ai-toolbox', [
  lesson('Lovable: From Idea to App in Minutes','lovable-deep-dive',1,6,
    "Lovable is the most beginner-friendly AI coding tool. Think of it as the 'magic wand' of vibe coding. You describe what you want in plain English, and Lovable generates a complete, deployable web app. It handles frontend (React), backend (Supabase), database, authentication, and deployment — all from your description. Best for: landing pages, SaaS MVPs, dashboards, and internal tools.",
    ["Most beginner-friendly tool","Generates full-stack apps from descriptions","Built-in backend via Supabase","One-click deployment","Best for: MVPs, landing pages, dashboards"],
    "Lovable is like a magic drawing pad. You describe what picture you want, and it draws the whole thing for you. Then you can say 'change this part' and it fixes just that part!",
    "Over 100,000 apps have been built with Lovable since its launch. It's the most popular entry point for new vibe coders.",
    [mcq("What backend does Lovable use?",["Firebase","AWS","Supabase (PostgreSQL)","MongoDB"],2,"Lovable uses Supabase, which is built on PostgreSQL. It provides database, auth, and APIs automatically."),
     mcq("What is Lovable best for?",["Mobile games","MVPs and landing pages","Machine learning","Hardware projects"],1,"Lovable excels at web apps: landing pages, SaaS MVPs, dashboards, and internal tools.")],
    "lovable",[{instruction:"Go to lovable.dev and start a new project"},{instruction:"Type a detailed prompt using the 5-part framework"},{instruction:"Review the generated app and iterate"}]),

  lesson('Hands-On: Build a Portfolio with Lovable','build-portfolio-lovable',2,8,
    "Let's build a professional portfolio site! Your prompt: 'You are a senior web designer. Create a modern developer portfolio website with: 1) Dark theme with purple (#7C3AED) accents. 2) Hero section with name, title, and animated text. 3) About me section with skills grid. 4) Projects section with cards showing image, title, description, and links. 5) Contact form with validation. 6) Responsive design for mobile and desktop. Use smooth scroll animations.'",
    ["Use a detailed, specific prompt","Include color scheme and layout","Specify all sections needed","Mention responsive design","Request animations for polish"],
    "We're building your digital business card — but way cooler! Like designing your own superhero headquarters that anyone in the world can visit.",
    "A well-designed portfolio is the #1 tool for landing freelance work or job interviews in tech.",
    [tf("A portfolio site can be built with Lovable in under 10 minutes.",true,"With a good prompt, Lovable can generate a complete portfolio in minutes. Most of the time is spent iterating on details.")],
    "lovable",[{instruction:"Open Lovable and paste the portfolio prompt"},{instruction:"Review each section and note what needs adjusting"},{instruction:"Iterate: 'Make the hero text larger and add a gradient background'"},{instruction:"Deploy and share your portfolio URL!"}],
    {type:"project_task",description:"Build and deploy a personal portfolio website with Lovable. Must include: hero, about, projects, and contact sections.",criteria:["Has hero section with your name","Has projects section (can use placeholder projects)","Has contact form","Deployed with shareable URL"],xpBonus:75}),

  lesson('Bolt.new: More Control for Builders','bolt-deep-dive',3,6,
    "Bolt.new gives you more control than Lovable while still being AI-powered. Think of Lovable as an automatic car and Bolt as a manual — more control, slightly steeper learning curve. Bolt lets you see and edit the file structure, install npm packages, use the terminal, and make granular changes. It also uses Supabase for backend. Best for: developers who want to customize beyond what Lovable allows.",
    ["More control over code and file structure","Built-in terminal and package management","Can see and edit individual files","Same Supabase backend as Lovable","Best for: users who want more customization"],
    "If Lovable is like ordering a pizza (describe what you want, it arrives), Bolt is like making pizza with a recipe app — more steps, but you can customize every ingredient!",
    "Bolt.new is the preferred tool for users graduating from Lovable who want deeper control.",
    [mcq("How does Bolt differ from Lovable?",["It's completely different","More control over files and code, with terminal access","It's just a copy","It only makes mobile apps"],1,"Bolt gives you file-level control, terminal access, and npm package management — more power for customization.")]),

  lesson('Hands-On: Build a Dashboard with Bolt','build-dashboard-bolt',4,8,
    "Let's build a data dashboard! Prompt for Bolt: 'Create an analytics dashboard with: sidebar navigation (Dashboard, Users, Analytics, Settings), top bar with search and user avatar, main area with 4 stat cards (Total Users, Revenue, Active Sessions, Growth %), a line chart showing monthly trends, a data table with sortable columns, dark theme with purple and blue accents. Use React, Tailwind CSS, and Recharts for the chart.'",
    ["Dashboards are one of the most common vibe coding projects","Include: sidebar, stats cards, charts, tables","Specify chart library (Recharts, Chart.js)","Dark themes look professional","Data tables need sorting and pagination"],
    "A dashboard is like the cockpit of an airplane — lots of instruments showing different information at a glance. We're building the pilot's view of your data!",
    "Dashboards are the #1 most-requested internal tool at companies. Being able to build one quickly is a superpower.",
    [mcq("What chart library is commonly used in React dashboards?",["Microsoft Excel","Recharts or Chart.js","PowerPoint","Canvas"],1,"Recharts and Chart.js are the most popular React charting libraries. Both work great with AI-generated code.")],
    "bolt",[{instruction:"Open bolt.new and create a new project"},{instruction:"Paste the dashboard prompt"},{instruction:"Review the file structure Bolt creates"},{instruction:"Customize: add your own data to the stat cards"}],
    {type:"project_task",description:"Build a dashboard with Bolt.new. Must include: sidebar, stat cards, and at least one chart.",criteria:["Has sidebar navigation","Has stat cards with numbers","Has at least one chart","Responsive layout"],xpBonus:75}),

  lesson('v0 by Vercel: UI Design Superpower','v0-deep-dive',5,6,
    "v0 is Vercel's AI tool focused specifically on generating beautiful UI components. It's not for building complete apps — it's for designing pixel-perfect React components. Think of v0 as an AI graphic designer that writes code. You describe a UI, and v0 creates a polished, production-ready React component. Best for: rapid UI prototyping, component design, and frontend polish.",
    ["Focused on UI components, not full apps","Generates production-ready React code","Best for: buttons, cards, forms, layouts, landing pages","Export directly to your codebase","Powered by Next.js and Tailwind CSS"],
    "v0 is like having a professional interior designer on speed dial. You describe a room and they create a perfect design — not the whole house, just beautiful rooms (components)!",
    "Many professional designers use v0 to prototype UIs before handing off to developers. It bridges design and code.",
    [mcq("What is v0 best for?",["Full-stack apps","Beautiful UI components and design prototyping","Databases","Backend APIs"],1,"v0 specializes in generating polished React/Next.js UI components from descriptions.")]),

  lesson('Hands-On: Design a Mobile UI with v0','design-ui-v0',6,7,
    "Let's use v0 to design a mobile app UI! Prompt: 'Create a modern mobile banking app interface with: bottom tab navigation (Home, Cards, Payments, Profile), home screen showing balance card with gradient, recent transactions list with icons and amounts, quick action buttons (Send, Request, Top Up, Pay Bills), notification bell with badge. Use a clean white theme with blue (#3B82F6) accents and rounded corners everywhere.'",
    ["v0 excels at mobile-first UI design","Include navigation, cards, lists, buttons","Specify the color scheme precisely","Request rounded corners and modern styling","Export the code to use in your actual project"],
    "We're designing the screen of a banking app — like drawing the perfect display for a fancy new phone. Every button, every color, every spacing matters!",
    "v0-generated components are used in production at companies processing millions of dollars in transactions.",
    [tf("v0 can generate code you can directly use in production.",true,"v0 generates clean, production-ready React/Next.js code that can be exported and used immediately.")],
    "v0",[{instruction:"Go to v0.dev and describe the mobile banking UI"},{instruction:"Iterate: 'Make the balance card gradient darker' or 'Add shadows to the transaction cards'"},{instruction:"Copy the generated code for later use"}]),

  lesson('Replit Agent: The All-in-One Builder','replit-deep-dive',7,6,
    "Replit Agent is like having an entire engineering team. It can: create full applications, set up databases, configure servers, deploy instantly, run in the browser (no local setup needed). What makes Replit special: everything happens in one browser tab — code editor, terminal, preview, and deployment. It's the most versatile tool but has a steeper learning curve than Lovable.",
    ["Full development environment in the browser","AI Agent creates and deploys complete apps","Built-in hosting with zero configuration","Supports 50+ programming languages","Best for: complete apps, bots, scripts, APIs"],
    "Replit is like an all-in-one art studio in a box. Drawing supplies, paint, clay, kiln — everything you need to make anything, all in one place!",
    "Replit hosts over 30 million projects and has been used to build everything from simple websites to AI chatbots to multiplayer games.",
    [mcq("What makes Replit unique?",["It only does frontend","Complete development environment in the browser with built-in hosting","It's only for Python","It's offline only"],1,"Replit combines editor + terminal + preview + deployment in one browser tab. No local setup needed.")]),

  lesson('Hands-On: Build a Chatbot with Replit','build-chatbot-replit',8,8,
    "Let's build an AI chatbot! In Replit, ask the Agent: 'Build a customer support chatbot web app. It should have: a chat interface with message bubbles, a text input with send button, predefined responses for common questions (shipping, returns, pricing), a typing indicator when the bot is responding, clean modern design with blue theme. Use Node.js backend and vanilla JavaScript frontend.'",
    ["Chatbots are fun and practical","Include: chat UI, message bubbles, input field","Define pre-set responses for common questions","Add a typing indicator for realism","Replit deploys it instantly"],
    "We're building a robot friend that answers questions! Like a really smart FAQ page that talks back to you.",
    "Chatbots are one of the most in-demand features businesses want. Building one makes you immediately valuable to companies.",
    [mcq("What's needed for a chatbot UI?",["Just a text box","Message bubbles, input field, send button, and typing indicator","Only backend","A database"],1,"A good chatbot needs: chat history (bubbles), text input, send button, and a typing indicator for realism.")],
    "replit",[{instruction:"Open Replit and start a new project with Replit Agent"},{instruction:"Describe the chatbot with the detailed prompt"},{instruction:"Test the chatbot by asking it questions"},{instruction:"Deploy and share the URL"}]),

  lesson('Cursor: The AI-Powered Code Editor','cursor-deep-dive',9,6,
    "Cursor is not for beginners — it's the tool you graduate TO. It's a code editor (like VS Code) with AI built into every feature. It can: autocomplete code as you type, explain existing code, refactor entire files, generate new features from descriptions. Unlike Lovable/Bolt (which build from scratch), Cursor is for working WITH existing code. Best for: users who've built apps with other tools and want to customize them further.",
    ["AI-powered code editor (fork of VS Code)","Works with EXISTING codebases","Autocomplete, explain, refactor, generate","Tab to accept AI suggestions","Best for: customizing apps beyond what no-code tools allow"],
    "If Lovable is like ordering a pre-made LEGO set, Cursor is like having a LEGO expert sit next to you and help you build custom pieces. You need to understand the basics first!",
    "Cursor is used by developers at major tech companies. It's the bridge between no-code and traditional development.",
    [mcq("When should you use Cursor?",["As your first AI tool","When you want to customize apps beyond what Lovable/Bolt allow","Only for mobile apps","Never"],1,"Cursor shines when you have an existing codebase and want to modify, extend, or customize it with AI assistance.")]),

  lesson('Claude Code: Terminal-Based Power','claude-code-deep-dive',10,6,
    "Claude Code is the most powerful AI coding tool — it works directly in your terminal and can edit files, run commands, search codebases, and build complex features. It's like having a senior developer pair-programming with you. Claude Code excels at: multi-file changes, debugging complex issues, understanding large codebases, and building sophisticated features. It's the tool for serious builders.",
    ["Most capable AI coding assistant","Works in terminal — edits files, runs commands","Excels at multi-file changes and complex features","Understands entire codebases","Best for: power users building complex applications"],
    "Claude Code is like having a genius best friend who can read your entire project instantly, understand everything, and help you build anything. But they only talk through text in a terminal!",
    "Claude Code was used to build significant portions of the very app you're using right now (VibeCode Academy)!",
    [mcq("What makes Claude Code different from other tools?",["It has a GUI","It works in the terminal and can make multi-file changes across entire codebases","It only does frontend","It's free"],1,"Claude Code operates at the project level — it can understand, navigate, and modify entire codebases from the terminal.")]),

  lesson('GitHub Copilot: AI in Your Editor','copilot-deep-dive',11,5,
    "GitHub Copilot is an AI coding assistant that lives inside VS Code (and other editors). As you type, it suggests complete lines and functions. It's like autocomplete on steroids. Unlike standalone tools (Lovable, Bolt), Copilot works alongside you as you code — suggesting, completing, and generating code in real-time. Best for: developers who write code and want AI assistance inline.",
    ["AI autocomplete inside your code editor","Suggests lines, functions, and entire files","Works in VS Code, JetBrains, Neovim","Learns from your coding style","Best for: developers who type code and want AI help"],
    "Copilot is like a really smart spell-checker for code. As you type, it guesses what you want to write next and fills it in. You just press Tab to accept!",
    "GitHub Copilot helps developers write code 55% faster according to GitHub's own research.",
    [tf("GitHub Copilot can generate entire functions from comments.",true,"Write a comment describing what you want, and Copilot generates the full function. It's one of its most popular features.")]),

  lesson('Choosing the Right Tool','choosing-right-tool',12,6,
    "Decision matrix: COMPLETE BEGINNER → Lovable (easiest, fastest). WANT MORE CONTROL → Bolt.new (see files, use terminal). JUST NEED UI → v0 (beautiful components). BUILD ANYTHING → Replit (most versatile). CUSTOMIZE EXISTING CODE → Cursor (AI code editor). COMPLEX PROJECTS → Claude Code (most powerful). Most vibe coders use 2-3 tools depending on the project. Start with Lovable, graduate to others as you grow.",
    ["Beginners: Start with Lovable","Need control: Bolt.new","UI design: v0","Versatility: Replit","Customization: Cursor","Power: Claude Code","Use 2-3 tools depending on the project"],
    "Different tools for different jobs! You wouldn't use a hammer to cut wood or a saw to hammer nails. Pick the right tool for what you're building.",
    "Professional vibe coders typically use Lovable/Bolt for new projects, Cursor for customization, and Claude Code for complex features.",
    [mcq("What tool should a complete beginner start with?",["Cursor","Claude Code","Lovable","GitHub Copilot"],2,"Lovable is the most beginner-friendly. It handles everything — frontend, backend, deployment — from a text description."),
     mcq("When should you switch from Lovable to Cursor?",["Immediately","When you need to customize code beyond what Lovable's chat allows","Never","After 1 year"],1,"Once you hit Lovable's limits and need file-level code editing, Cursor is the natural next step.")])
]);

// ==================== MODULE 5: BUILDING FIRST APP (10) ====================
console.log('\n🏗️ Module 5: Building First App');
await seedModule('first-app', [
  lesson('Planning: From Idea to Requirements','planning-app',1,6,"Every great app starts with a plan. Before touching any AI tool, answer: 1) What problem does this solve? 2) Who are the users? 3) What are the core features (MVP)? 4) What can wait until later? Write a simple requirements doc: one paragraph describing the app, a list of must-have features, and a list of nice-to-haves. This doc becomes your prompt foundation.",
    ["Start with WHY: what problem are you solving?","Define your users","List MVP features (must-haves)","Separate nice-to-haves for later","This becomes your prompt playbook"],
    "Before building a treehouse, you draw a picture of what it should look like. How many rooms? A slide? A rope ladder? Planning makes building easier!",
    "Products that start with a clear requirements doc are 3x more likely to launch successfully than those that 'figure it out as they go.'",
    [mcq("What should you do BEFORE opening an AI tool?",["Start coding immediately","Write a plan: problem, users, features","Watch tutorials for 3 months","Buy a domain name"],1,"Planning first saves hours of wasted iteration. Know what you want before asking AI to build it.")]),

  lesson('User Stories: What Your App Should Do','user-stories',2,5,"User stories describe features from the user's perspective: 'As a [user], I want to [action], so that [benefit].' Examples: 'As a restaurant customer, I want to browse the menu online, so I can decide what to order before arriving.' User stories become perfect prompts because they include the who, what, and why.",
    ["Format: As a [user], I want to [action], so that [benefit]","Each story = one prompt for the AI","Include acceptance criteria: how to know it's done","5-10 user stories = a complete MVP","Stories keep you focused on user needs, not cool tech"],
    "User stories are like writing a wish list for Santa, but specific! Not 'I want toys' but 'I want a red bicycle with training wheels so I can ride to school.'",
    "Amazon, Spotify, and every major tech company uses user stories to plan features. It's how the pros do it.",
    [fb("User story format: As a ___, I want to ___, so that I can ___.","user","User stories center development around the person who will use the feature.")]),

  lesson('Wireframing: Sketch Before Building','wireframing',3,5,"A wireframe is a simple sketch of your app's layout — boxes and lines, no colors or images. You can draw them on paper or use tools like Figma/Excalidraw. Wireframes help you think through: page layout, navigation flow, what information goes where, user journey. Share wireframes with AI tools for even better results!",
    ["Simple sketches: boxes, lines, labels","No colors or images needed","Shows layout, navigation, and information flow","Can draw on paper or use Figma/Excalidraw","Describing a wireframe to AI produces better results"],
    "A wireframe is like a floor plan for a house. Before building walls, you draw where rooms go. Simple lines show the layout!",
    "Design teams at Google sketch wireframes on whiteboards before any code is written. The simplest tool often produces the best plans.",
    [tf("Wireframes need to be beautiful and detailed.",false,"Wireframes are intentionally simple — boxes and lines. Beauty comes later. They're about structure, not style.")]),

  lesson('Setting Up Your Project','setting-up-project',4,6,"Choose your tool (Lovable for beginners), create a new project, and write your first prompt using your plan + user stories + wireframe description. The setup prompt should include: project name, description, tech preferences (if any), color scheme, and core pages/features. This is the 'foundation pour' of your app.",
    ["Choose tool based on your skill level","First prompt = project setup","Include: name, description, pages, color scheme","Reference your plan and user stories","This sets the foundation for everything else"],
    "This is like breaking ground on a construction site. You've got your blueprint (plan), now it's time to start building the foundation!",
    "The initial project prompt is the most important one. Getting it right saves hours of restructuring later.",
    [mcq("What should your first prompt include?",["Just 'make an app'","Project name, description, pages, colors, and core features from your plan","Only the color scheme","A list of bugs to fix"],1,"Your first prompt sets the foundation. Include everything from your planning phase.")]),

  lesson('Building the Frontend','building-frontend',5,7,"Now we build what users see! Prompt for each page: describe the layout, sections, components, colors, and interactions. Work page by page: homepage first, then secondary pages. Use chain-of-thought: one page per prompt. After each page, review and iterate before moving on.",
    ["Build one page at a time","Describe layout, sections, and components","Include colors and typography","Specify interactions (hover, click, animations)","Review each page before moving to the next"],
    "We're decorating each room of the house. Living room first (homepage), then bedroom (profile page), then kitchen (dashboard). One room at a time!",
    "Frontend development accounts for about 60% of the work in most web apps. Take your time getting it right.",
    [mcq("How should you build frontend pages?",["All at once in one giant prompt","One page at a time, reviewing each before moving on","Backend first, frontend never","Only the homepage"],1,"Page by page with review after each. This catches issues early and produces cleaner results.")]),

  lesson('Adding Interactivity','adding-interactivity',6,6,"Static pages are boring! Add life with: forms that validate input, buttons that do things, navigation between pages, loading states, error messages, modals/popups. Prompt example: 'Add form validation to the contact form: name required (min 2 chars), email must be valid format, message required (min 10 chars). Show red error messages below each field. Disable submit button until all fields are valid.'",
    ["Forms: validation, error messages, success states","Buttons: loading states, disabled states","Navigation: page transitions, active states","Modals: confirmation dialogs, popups","Animations: hover effects, transitions"],
    "Making your website come alive! Like turning a drawing into a cartoon — things move, respond to touch, and react when you interact with them.",
    "User testing shows that apps with good form validation and loading states feel 40% more 'professional' to users.",
    [mcq("What makes an app feel interactive?",["More text","Form validation, loading states, animations, and responsive buttons","Bigger images","More pages"],1,"Interactivity = the app responds to user actions with validation, loading indicators, animations, and feedback.")]),

  lesson('Connecting to a Backend: APIs & Data','connecting-backend',7,7,"Time to add a backend! With Lovable/Bolt (Supabase): prompt for database tables and the AI sets them up. With Replit: ask for API endpoints. Key concepts: 'Create a Supabase table called \"projects\" with columns: id (uuid), title (text), description (text), image_url (text), user_id (uuid, foreign key to auth.users), created_at (timestamp). Enable Row Level Security so users can only see their own projects.'",
    ["Supabase = database + auth + APIs","Define tables with columns and types","Enable Row Level Security for safety","Foreign keys link related tables","AI handles the SQL — you describe what you need"],
    "We're building the kitchen! The backend is where data gets cooked (processed) and stored (database). The frontend is just the dining room showing the results.",
    "Most vibe-coded apps use Supabase because Lovable and Bolt integrate it automatically.",
    [mcq("What does Supabase provide?",["Only a database","Database + authentication + APIs + storage","Only frontend","Only hosting"],1,"Supabase is an all-in-one backend: PostgreSQL database, user authentication, REST APIs, and file storage.")]),

  lesson('User Authentication: Login & Signup','adding-auth',8,6,"Every app with user accounts needs authentication. With Supabase (via Lovable/Bolt), it's almost free: 'Add user authentication with email/password signup and login. Include: signup page with email and password fields, login page, password reset flow, protected routes (redirect to login if not authenticated). Use Supabase Auth.'",
    ["Auth = login, signup, logout, password reset","Supabase Auth handles the hard parts","Protected routes: redirect unauthenticated users","Never build auth from scratch — use a service","Add social login (Google, GitHub) for convenience"],
    "Authentication is like the lock on your front door. You need a key (password) to get in, and only people with keys can access their stuff inside!",
    "60% of security breaches come from poorly implemented authentication. Using Supabase Auth avoids most common mistakes.",
    [tf("You should build authentication yourself from scratch.",false,"NEVER build auth from scratch. Use proven services like Supabase Auth, Auth0, or Firebase Auth. They handle security complexities for you.")]),

  lesson('Storing Data: Connecting a Database','storing-data',9,6,"Your app needs to remember things between visits. That's the database! Define what to store: users (profile info), content (posts, products, projects), relationships (who owns what, who follows whom). Prompt: 'Create these Supabase tables: profiles (id, username, avatar_url, bio), posts (id, user_id, title, content, created_at), likes (user_id, post_id, created_at). Add foreign keys and enable RLS.'",
    ["Define what data your app needs to store","Create tables for each entity (users, posts, etc.)","Link tables with foreign keys (relationships)","Enable Row Level Security (RLS) for protection","Index frequently searched columns for speed"],
    "A database is like a really organized filing cabinet. Each drawer (table) holds one type of thing. The labels help you find anything instantly!",
    "Database design is the foundation of every app. Get it right early, and everything else becomes easier.",
    [mcq("What are foreign keys for?",["Making keys out of metal","Linking related data between tables (e.g., a post belongs to a user)","Encrypting data","Foreign languages"],1,"Foreign keys create relationships: user_id in the posts table links each post to the user who created it.")]),

  lesson('Deploying Your App: Going Live!','deploying-app',10,7,"The moment of truth — making your app accessible to the world! With Lovable: click 'Deploy' (done!). With Bolt: click 'Deploy' (done!). With Replit: it's already live! For custom deploys: push to GitHub → Vercel auto-deploys. Getting a custom domain: buy on Namecheap ($10/yr), point DNS to your host. Your app is now live on the internet!",
    ["Lovable/Bolt: one-click deploy","Replit: already hosted automatically","Vercel: connect GitHub for auto-deploy","Custom domain: buy and point DNS","SSL/HTTPS: handled automatically by most platforms"],
    "Launch day! Like opening night of a play. The curtain goes up, and the world can see what you built. Hit that deploy button!",
    "The first deploy is a milestone every vibe coder remembers. It's the moment 'I built this' becomes real.",
    [mcq("What's the easiest way to deploy?",["Set up an AWS server","Click 'Deploy' in Lovable or Bolt","FTP files to a server","Mail a CD to the hosting company"],1,"Modern tools make deployment a single click. Lovable, Bolt, and Replit all handle hosting automatically.")],
    undefined,undefined,
    {type:"project_task",description:"Build and deploy a complete app from scratch! Use your planning doc, build step by step, and deploy it live. Share the URL!",criteria:["Has at least 3 pages","Has user authentication","Stores data in a database","Deployed and accessible via URL"],xpBonus:100})
]);

// ==================== MODULE 6: GIT (10) ====================
console.log('\n🔀 Module 6: Git');
await seedModule('git', [
  lesson('Why Git Matters','why-git-matters',1,5,"Imagine writing a 20-page essay with no undo button. That's coding without Git. Git is a version control system — it saves snapshots of your entire project at any point. Made a mistake? Go back to a previous snapshot. Want to try something risky? Create a branch (parallel universe). Git is the safety net every vibe coder needs.",
    ["Git = infinite undo for your entire project","Saves 'snapshots' (commits) you can return to","Branches let you experiment safely","Essential for collaboration","Every professional developer uses Git"],
    "Git is like a time machine for your project. You can take a photo (commit) at any point, and travel back to that moment if things go wrong!",
    "Git was created by Linus Torvalds (who also created Linux) in 2005. It's used by virtually every software company in the world.",
    [mcq("What is Git?",["A social media platform","A version control system that tracks changes to your code","A programming language","A hosting service"],1,"Git tracks every change to your project, lets you undo mistakes, and enables safe experimentation with branches.")]),

  lesson('Git Concepts: Repos, Commits, Branches','git-concepts',2,6,"Three key concepts: REPOSITORY (repo) = your project folder tracked by Git. COMMIT = a snapshot of your project at a point in time (like a save point in a game). BRANCH = a parallel version of your project for experimenting. The 'main' branch is your official version. Feature branches are for experiments.",
    ["Repository = your project tracked by Git","Commit = a saved snapshot with a message","Branch = parallel version for safe experiments","Main branch = official version","Feature branches merge back into main when ready"],
    "A repo is your photo album. Each commit is a photo (snapshot). Branches are like alternate timelines — you can experiment in one without messing up the original!",
    "The average developer makes 5-10 commits per day. Each one captures a meaningful change.",
    [fb("A ___ is a snapshot of your project at a specific point in time, with a descriptive message.","commit","Commits capture the state of all files with a message explaining what changed."),
     mcq("What is a branch?",["A tree limb","A parallel version of your project for safe experimentation","A type of commit","A file type"],1,"Branches let you work on features without affecting the main codebase. Merge when ready.")]),

  lesson('Your First Repository','first-repository',3,6,"Let's create your first Git repo! In terminal: 'git init' creates a repo. 'git add .' stages all files. 'git commit -m \"Initial commit\"' saves the first snapshot. That's it — 3 commands and you have version control! With Replit or Lovable, Git is built-in. But knowing these commands helps you understand what's happening.",
    ["git init = create a new repository","git add . = stage all changes","git commit -m 'message' = save a snapshot","Three commands = version control active","AI tools handle this automatically, but knowing helps"],
    "Creating a repo is like opening a fresh photo album and taking the first picture. 'This is where my project started!' Now every change gets tracked.",
    "Even if you use AI tools that handle Git automatically, understanding these commands helps you debug and recover from problems.",
    [mcq("What does 'git init' do?",["Deletes the project","Creates a new Git repository in the current folder","Pushes to GitHub","Creates a branch"],0,"'git init' initializes a new Git repository. It creates a hidden .git folder that tracks all changes.")]),

  lesson('GitHub: Your Code\'s Home','github-explained',4,5,"GitHub is where your code lives online. It's Git + social features: profiles, followers, stars, pull requests. Push your local repo to GitHub, and it's backed up forever. Anyone can view public repos. GitHub also enables collaboration — multiple people can work on the same project.",
    ["GitHub = Git repos hosted online","Free for public and private repos","Backup + collaboration + social coding","Every developer has a GitHub profile","Connected to deployment platforms (Vercel, Netlify)"],
    "If Git is your photo album, GitHub is Instagram for code. You upload your photos (push your code) and others can see, like (star), and contribute!",
    "GitHub has over 100 million developers and 400 million repositories. It's the world's largest code hosting platform.",
    [tf("GitHub and Git are the same thing.",false,"Git is the version control tool (runs locally). GitHub is a website that hosts Git repositories online.")]),

  lesson('Branching: Safe Experimentation','branching-explained',5,5,"Branches let you experiment without risk. 'git checkout -b new-feature' creates and switches to a new branch. Make changes, test them. If it works: merge back to main. If it breaks: delete the branch. Your main branch stays clean and working. This is how professionals add features without breaking production.",
    ["Create branch: git checkout -b feature-name","Work on the branch independently","Main branch stays untouched","Merge when feature is ready","Delete if experiment fails — no harm done"],
    "Branching is like making a copy of your drawing. You can try crazy colors on the copy. If it looks good, you use it. If not, you throw the copy away. Your original is safe!",
    "Companies like Google, Meta, and Netflix use branching extensively. No one pushes directly to main.",
    [mcq("What happens to main when you create a branch?",["It gets deleted","Nothing — main stays exactly as it was","It moves to the branch","It stops working"],1,"That's the beauty of branching. Main is completely unaffected until you explicitly merge the branch back.")]),

  lesson('Merging: Bringing Changes Together','merging-explained',6,5,"After testing your feature branch, merge it into main: 'git checkout main' then 'git merge feature-branch'. If Git can auto-merge: done! If there are conflicts (same line changed in both): you resolve them manually (or let AI help). After merging, the feature branch can be deleted.",
    ["Switch to main: git checkout main","Merge: git merge feature-name","Auto-merge if no conflicts","Manual resolution if same lines changed","Delete feature branch after merge"],
    "Merging is like combining two puzzle pieces. Usually they fit perfectly (auto-merge). Sometimes you need to trim a bit (resolve conflicts). Then the picture is complete!",
    "Git handles most merges automatically. Conflicts only happen when two people change the exact same lines.",
    [mcq("When do merge conflicts happen?",["Every merge","When the same lines were changed in both branches","When branches have different names","Never"],1,"Conflicts occur only when the exact same lines were modified in both branches. Git can't decide which version to keep.")]),

  lesson('Pull Requests: The Code Review Handshake','pull-requests',7,5,"On GitHub, instead of merging directly, you create a Pull Request (PR). A PR says 'I want to merge this branch into main — please review first.' Team members can comment, suggest changes, and approve. It's the professional way to merge. Even solo developers use PRs to review their own work before merging.",
    ["PR = request to merge a branch","Enables code review before merging","Team members can comment and approve","Even solo devs benefit from PR self-review","PRs document what changed and why"],
    "A PR is like raising your hand in class. 'Teacher, I finished my homework — can you check it before I put it in the done pile?' Review before submit!",
    "At GitHub itself, every change goes through a PR. Even the CEO's code gets reviewed.",
    [tf("Only teams need pull requests — solo developers can skip them.",false,"Solo developers benefit from PRs too. Self-reviewing before merge catches many bugs and documents changes.")]),

  lesson('.gitignore: Keeping Secrets Out','gitignore-explained',8,5,"The .gitignore file tells Git which files to NEVER track. Critical: .env files (secrets!), node_modules (dependencies), .DS_Store (Mac junk), build folders. Without .gitignore, you might accidentally push API keys to GitHub where anyone can see them. Rule #1: add .gitignore BEFORE your first commit.",
    [".gitignore = list of files Git should ignore","ALWAYS ignore: .env, node_modules, build folders","Add .gitignore BEFORE first commit","Prevents accidentally exposing secrets","Template .gitignore files exist for every project type"],
    ".gitignore is like telling the photographer 'don't take pictures of the messy kitchen!' Some things should stay private and never be shared.",
    "Over 10,000 API keys are accidentally exposed on GitHub every day. A proper .gitignore prevents this.",
    [mcq("What should ALWAYS be in .gitignore?",["Your source code","README.md",".env files (secrets), node_modules, build folders","package.json"],2,".env contains secrets, node_modules is huge, build folders are regenerated. All should be ignored.")]),

  lesson('Undoing Mistakes: Reset, Revert, Checkout','undoing-mistakes',9,5,"Made a mistake? Git has your back: 'git checkout -- file.txt' = undo changes to one file. 'git revert HEAD' = undo the last commit (safe, creates new commit). 'git reset --soft HEAD~1' = undo last commit but keep changes. 'git stash' = temporarily hide your changes. The undo button you always wanted!",
    ["git checkout -- file = undo file changes","git revert = safely undo a commit","git reset --soft = undo commit, keep changes","git stash = temporarily hide changes","Always prefer revert over reset for safety"],
    "Git is the ultimate undo button! Messed up a file? Ctrl+Z. Messed up a commit? Revert. Changed your mind? Stash. You can ALWAYS go back.",
    "Every developer has that moment of panic when something breaks. Knowing Git undo commands turns panic into a 30-second fix.",
    [mcq("Which command safely undoes the last commit?",["git delete","git revert HEAD","rm -rf","git destroy"],1,"'git revert HEAD' creates a new commit that undoes the last one. It's safe because it doesn't rewrite history.")]),

  lesson('Git Cheat Sheet for Vibe Coders','git-cheat-sheet',10,5,"Your essential Git commands: SETUP: git init, git clone. DAILY: git add, git commit, git push, git pull. BRANCHING: git checkout -b, git merge. UNDO: git revert, git stash. STATUS: git status, git log, git diff. That's 12 commands. Master these and you can handle 99% of Git situations. Bookmark this lesson!",
    ["12 essential commands cover 99% of needs","git status and git log are your best friends","Push to GitHub daily for backup","Commit often with descriptive messages","When confused: git status first"],
    "This is your Git recipe card. Like a chef keeps their favorite recipes handy, keep these commands bookmarked. You'll use them every day!",
    "Senior developers still Google Git commands. Having a cheat sheet isn't cheating — it's efficient.",
    [mcq("What command should you run first when confused?",["git push","git delete","git status","git reset --hard"],2,"'git status' shows you exactly where you are: what's changed, what's staged, what branch you're on. Always start here.")])
]);

const total = await prisma.lesson.count();
console.log(`\n🎉 Modules 3-6 seeded! Total lessons: ${total}`);
}

main().catch(console.error).finally(()=>prisma.$disconnect());
