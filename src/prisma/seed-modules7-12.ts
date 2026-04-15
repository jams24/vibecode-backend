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

function L(title:string,slug:string,order:number,mins:number,story:string,kp:string[],eli10:string,rw:string,quiz:any[],challenge?:any) {
  return {title,slug,order,difficulty:'BEGINNER' as const,estimatedMinutes:mins,
    concept:JSON.stringify({story,keyPoints:kp,eli10,realWorldExample:rw}),
    demo:undefined, quiz:JSON.stringify(quiz), challenge:challenge?JSON.stringify(challenge):undefined};
}

async function main() {
console.log('🚀 Seeding Modules 7-12\n');

// ==================== MODULE 7: SECURITY (12) ====================
console.log('🛡️ Module 7: Security');
await seedModule('security', [
  L('The #1 Rule: Never Put Secrets in Code','never-secrets-in-code',1,5,"The single most important rule: NEVER hardcode API keys, passwords, or tokens in your source code. Why? If your code goes to GitHub (even accidentally), those secrets are exposed to the entire internet. Bots scan GitHub constantly for leaked keys. Within MINUTES of a leak, attackers can use your keys to rack up charges or access your data.",
    ["NEVER hardcode secrets in source code","Bots scan GitHub for leaked keys within minutes","Leaked AWS keys have cost people $10,000+ in hours","Use environment variables instead","Add .env to .gitignore BEFORE first commit"],
    "Imagine writing your house key combination on a poster and hanging it on the street. Anyone walking by can get in! That's what putting passwords in code is like.",
    "A developer accidentally pushed AWS keys to GitHub. Within 3 hours, attackers spun up crypto miners costing $14,000. It happens more often than you think.",
    [tf("It's okay to put API keys in code if the repo is private.",false,"Private repos can become public, get forked, or be accessed by compromised accounts. NEVER put secrets in code, period."),
     mcq("What happens when API keys leak to GitHub?",["Nothing","Bots find them in minutes and exploit them","GitHub deletes them","The keys stop working"],1,"Automated bots continuously scan GitHub for secrets. They find and exploit leaked keys within minutes.")]),

  L('Environment Variables & .env Files','env-files',2,5,"Environment variables store secrets OUTSIDE your code. Create a .env file: API_KEY=sk-abc123. Access in code: process.env.API_KEY. The .env file stays on YOUR computer, never goes to GitHub (add it to .gitignore). Different environments (dev, staging, production) have different .env values.",
    [".env files store secrets outside code","Access via process.env.VARIABLE_NAME","ALWAYS add .env to .gitignore","Different .env per environment (dev/prod)","Never commit .env to version control"],
    "A .env file is like a secret diary you keep locked in your drawer. The code knows to check the drawer for secrets, but the diary never leaves your room!",
    "Every major deployment platform (Vercel, Netlify, Replit) has built-in environment variable management. It's standard practice.",
    [fb("To access an environment variable in Node.js, use process.env.___","VARIABLE_NAME","Environment variables are accessed through the process.env object in Node.js."),
     mcq("Where should .env be listed?",["In package.json","In .gitignore (so it's never committed)","In the README","In the database"],1,".env must be in .gitignore to prevent accidental commits. This is the #1 security practice.")]),

  L('API Key Management','api-key-management',3,5,"Best practices: 1) Use different keys for dev and production. 2) Set the tightest permissions possible. 3) Rotate keys regularly (every 90 days). 4) Monitor usage for anomalies. 5) If a key leaks: revoke it immediately and generate a new one. Most API providers have dashboards showing key usage — check them!",
    ["Different keys for dev vs production","Minimal permissions (least privilege)","Rotate every 90 days","Monitor usage dashboards","Leaked? Revoke and regenerate IMMEDIATELY"],
    "API keys are like car keys. You don't give your car key to strangers, you have a spare at home, and if you lose one, you change the locks immediately!",
    "Google Cloud automatically scans GitHub for leaked Google API keys and sends alerts. But by then, damage may already be done.",
    [mcq("What should you do FIRST if an API key is leaked?",["Wait and see","Revoke the key immediately and generate a new one","Delete the GitHub repo","Change your email password"],1,"Speed is critical. Revoke the leaked key immediately, then generate a new one. Seconds matter.")]),

  L('Common Vulnerabilities AI Creates','common-vulnerabilities',4,6,"Over 40% of AI-generated code has security flaws. The most common: SQL injection (unsanitized database queries), XSS (allowing scripts in user input), hardcoded secrets, insecure authentication, missing input validation, using deprecated/vulnerable packages. You don't need to understand all the technical details — just know these exist and always review AI output.",
    ["40%+ of AI code has security vulnerabilities","SQL injection: unsanitized database queries","XSS: malicious scripts in user input","Hardcoded secrets in generated code","Missing input validation","Using outdated/vulnerable packages"],
    "AI is like a really fast builder who sometimes forgets to install locks on the doors. The house looks great, but you need to check that all the security features are there!",
    "A 2024 Stanford study found that developers using AI assistants produced less secure code than those coding manually, because they trusted the AI too much.",
    [mcq("What percentage of AI-generated code may have security flaws?",["Less than 5%","About 15%","Over 40%","0%"],2,"Studies consistently show 40%+ of AI-generated code contains security vulnerabilities. Always review!"),
     tf("AI-generated code is always secure because AI knows best practices.",false,"AI often generates code with security flaws. It optimizes for functionality, not security. Human review is essential.")]),

  L('SQL Injection Explained','sql-injection',5,5,"SQL injection is when an attacker puts database commands in an input field. Example: a login form asks for username. Attacker types: ' OR 1=1 --'. If the code directly inserts this into a SQL query, the attacker bypasses authentication. Prevention: ALWAYS use parameterized queries (prepared statements). AI tools sometimes generate vulnerable code — check for string concatenation in queries.",
    ["Attacker puts SQL code in input fields","Can bypass login, delete data, steal information","Prevention: use parameterized queries","NEVER concatenate user input into SQL strings","AI often generates vulnerable SQL patterns"],
    "SQL injection is like someone writing 'and also open the vault' on a bank deposit slip. If the teller reads it literally, they'd open the vault! Parameterized queries = tellers who only read the amount.",
    "SQL injection has been the #1 web vulnerability for over 20 years. It's responsible for some of the largest data breaches in history.",
    [mcq("How do you prevent SQL injection?",["Use longer passwords","Use parameterized queries instead of string concatenation","Block all users","Disable the database"],1,"Parameterized queries treat user input as DATA, never as SQL commands. This makes injection impossible.")]),

  L('XSS Attacks: Bad Code in Browsers','xss-attacks',6,5,"Cross-Site Scripting (XSS): an attacker injects JavaScript into your page that runs in other users' browsers. Example: a comment field where someone types <script>steal_cookies()</script>. If your app renders this without sanitizing, every user who views it gets attacked. Prevention: sanitize/escape all user-generated content before rendering.",
    ["XSS = injecting scripts that run in other users' browsers","Can steal login cookies, redirect users, deface pages","Prevention: sanitize all user input before display","React auto-escapes by default (but not always)","AI code sometimes bypasses React's protections with dangerouslySetInnerHTML"],
    "XSS is like someone slipping a note into a library book that says 'give me your library card.' If the next reader follows the note, they lose their card!",
    "XSS has been used to steal millions of user accounts. It's the second most common web vulnerability after SQL injection.",
    [mcq("What does XSS stand for?",["Extra Special Security","Cross-Site Scripting","CSS Extended","Cross-Server Exchange"],1,"Cross-Site Scripting: malicious scripts injected into web pages that execute in other users' browsers.")]),

  L('Authentication Security','auth-security',7,5,"Auth security essentials: 1) NEVER store plain text passwords — always hash with bcrypt. 2) Use HTTPS everywhere. 3) Implement rate limiting (prevent brute force). 4) Use secure session tokens (JWTs with expiration). 5) Add two-factor authentication for sensitive apps. When using Supabase Auth, most of this is handled for you.",
    ["Hash passwords with bcrypt (never plain text!)","HTTPS encrypts data in transit","Rate limiting prevents brute force attacks","JWTs should expire (not last forever)","Supabase Auth handles most security for you"],
    "Hashing a password is like putting it through a paper shredder. You can verify the right password was used, but nobody can reconstruct the original from the shredded pieces!",
    "The LinkedIn breach of 2012 exposed 117 million passwords stored in plain text. If they'd used bcrypt, the passwords would have been useless to attackers.",
    [tf("It's okay to store passwords as plain text if your database is secure.",false,"NEVER store plain text passwords. Databases get breached. Hashed passwords (bcrypt) are useless to attackers even if stolen.")]),

  L('HTTPS: Why the Lock Matters','https-explained',8,5,"HTTPS encrypts data between the browser and server. Without it (HTTP), everything is sent in plain text — passwords, credit cards, messages. Anyone on the same network (coffee shop WiFi!) can read it. Good news: all modern hosting platforms (Vercel, Netlify, Replit, Lovable) provide HTTPS automatically and free.",
    ["HTTPS = encrypted connection between browser and server","HTTP (no S) = plain text anyone can read","All modern hosts provide HTTPS automatically","The lock icon means HTTPS is active","Free SSL certificates via Let's Encrypt"],
    "HTTPS is like sending a letter in a locked box vs a postcard. A postcard (HTTP) — anyone who handles it can read it. A locked box (HTTPS) — only the sender and receiver have the key!",
    "Google Chrome marks all HTTP sites as 'Not Secure.' Users trust HTTPS sites more, and Google ranks them higher.",
    [mcq("What does HTTPS encrypt?",["Only passwords","Only credit card numbers","ALL data between the browser and server","Nothing — it's just a badge"],2,"HTTPS encrypts EVERYTHING sent between browser and server: forms, passwords, cookies, page content, everything.")]),

  L('Slopsquatting: Fake AI Packages','slopsquatting',9,5,"A terrifying AI vulnerability: AI often suggests installing packages that don't exist. Attackers register those fake package names with malicious code. When you install the AI's suggestion, you run the attacker's code. This is called 'slopsquatting.' Prevention: verify every package before installing. Check npm/PyPI for the real package name, author, and download count.",
    ["AI invents package names that don't exist","Attackers register those names with malware","Installing runs the attacker's code on your machine","20% of AI package suggestions don't exist","ALWAYS verify packages: check author, downloads, age"],
    "Imagine AI tells you to buy medicine called 'SuperCure' but it doesn't exist. A scammer hears this, makes fake pills called 'SuperCure', and sells them. You'd be taking fake medicine! Always check the pharmacy (npm registry) first.",
    "Researchers published a study showing that 20% of AI-suggested package names don't exist on npm. It's a real and growing threat.",
    [mcq("What is slopsquatting?",["A exercise routine","Attackers registering fake package names that AI commonly suggests","A type of squat","A database technique"],1,"Slopsquatting exploits AI hallucinations: AI suggests non-existent packages, attackers register them with malware.")]),

  L('Code Review Checklist','code-review-checklist',10,5,"Before shipping ANY AI-generated code, check: 1) No hardcoded secrets? 2) Input validated/sanitized? 3) Authentication on protected routes? 4) HTTPS enabled? 5) .env in .gitignore? 6) Dependencies up to date? 7) Error messages don't leak internal details? 8) Rate limiting on APIs? This takes 5 minutes and prevents 90% of security issues.",
    ["Check for hardcoded secrets","Verify input validation/sanitization","Confirm authentication on protected routes","Ensure HTTPS is active","Verify .gitignore includes .env","Check dependency versions","Review error messages (no internal details)","Confirm rate limiting on APIs"],
    "A code review checklist is like the checklist pilots use before takeoff. It takes 5 minutes but prevents disasters!",
    "Companies that use security checklists experience 80% fewer security incidents than those that skip this step.",
    [tf("A 5-minute security review can prevent 90% of common vulnerabilities.",true,"Most security issues are basic: leaked secrets, missing validation, no HTTPS. A simple checklist catches them all.")]),

  L('Rate Limiting: Protecting APIs','rate-limiting',11,5,"Without rate limiting, an attacker can hit your API millions of times per second — crashing your server (DDoS) or brute-forcing passwords. Rate limiting caps requests: '100 requests per minute per IP.' If exceeded, return 429 Too Many Requests. Most hosting platforms and API gateways offer built-in rate limiting.",
    ["Cap requests per IP per time window","Prevents DDoS and brute force attacks","Common limits: 100/min for APIs, 5/min for login","Return 429 Too Many Requests when exceeded","Most platforms offer built-in rate limiting"],
    "Rate limiting is like a bouncer at a club. They control how many people can enter per hour. If someone tries to rush in 100 times, the bouncer says 'slow down, wait your turn!'",
    "The Twitter API limits requests to prevent abuse. Without rate limits, a single user could consume all server resources.",
    [mcq("What HTTP status code indicates rate limiting?",["200 OK","404 Not Found","429 Too Many Requests","500 Server Error"],2,"429 means 'you're sending too many requests.' It tells the client to slow down and try again later.")]),

  L('Security Quiz: Find the Vulnerability','security-quiz-final',12,6,"Final test! Review code snippets and spot the security issues. This is the most important skill in vibe coding — you don't need to FIX the code, just IDENTIFY what's wrong. Even non-coders can spot: hardcoded secrets, missing validation, SQL concatenation, missing HTTPS, and exposed error details.",
    ["Spotting vulnerabilities doesn't require coding skills","Look for: hardcoded strings that look like keys","Check for: user input going directly into queries","Verify: error messages don't expose internals","Confirm: authentication on sensitive endpoints"],
    "You're a security detective! You don't need to solve the crime (fix the code) — just spot the clues (vulnerabilities). Like finding hidden objects in a picture!",
    "Bug bounty hunters earn $50,000-$500,000/year by finding vulnerabilities in companies' code. Spotting security issues is a valuable skill.",
    [mcq("Which line has a security vulnerability? Line 1: const API_KEY = 'sk-abc123'; Line 2: const name = req.body.name;",["Line 2","Line 1 — hardcoded API key in source code","Both are fine","Neither has issues"],1,"Line 1 hardcodes an API key. This will be exposed if code is pushed to GitHub. Use environment variables instead."),
     mcq("Is this query safe? db.query('SELECT * FROM users WHERE id = ' + userId)",["Yes, it's fine","No — it's vulnerable to SQL injection (string concatenation)","Only if userId is a number","Yes, because it uses SELECT"],1,"Concatenating user input into SQL = injection vulnerability. Use parameterized queries: db.query('SELECT * FROM users WHERE id = $1', [userId])")])
]);

// ==================== MODULE 8: DEPLOYMENT (10) ====================
console.log('\n☁️ Module 8: Deployment');
await seedModule('deployment', [
  L('What Happens When You Deploy','what-happens-deploy',1,5,"Deployment = taking your code and making it accessible on the internet. Behind the scenes: 1) Your code is uploaded to a server. 2) Dependencies are installed. 3) The code is built/compiled. 4) A process starts serving your app. 5) A URL is assigned. With modern platforms, ALL of this happens with one click or one git push.",
    ["Deploy = make code accessible on the internet","Server installs dependencies and builds code","A URL is assigned to your app","Modern platforms: one-click deploy","Can also auto-deploy on every git push"],
    "Deploying is like finishing a painting and hanging it in a gallery. The painting (your code) moves from your studio (computer) to the gallery (server) where everyone can see it!",
    "Vercel processes over 20 billion requests per month. That's 20 billion times someone visited an app deployed on their platform.",
    [mcq("What does deployment do?",["Deletes your code","Makes your app accessible on the internet","Designs your UI","Writes your code"],1,"Deployment uploads your code to a server, builds it, and makes it accessible via a URL.")]),

  L('Vercel: Deploy React in 30 Seconds','vercel-deploy',2,6,"Vercel is the best platform for React/Next.js apps. Setup: connect your GitHub account → select your repo → click Deploy. Done! Vercel auto-detects the framework, builds, and deploys. Every git push automatically redeploys. Free tier: unlimited projects, 100GB bandwidth, custom domains.",
    ["Best for React and Next.js","Connect GitHub → auto-deploy on push","Free tier is generous (100GB bandwidth)","Custom domains supported","Automatic HTTPS"],
    "Vercel is like a gallery that picks up your paintings from your studio automatically. Every time you finish a new one (git push), they hang it up (deploy) for you!",
    "Vercel was created by the same team behind Next.js. They optimize specifically for React applications.",
    [mcq("What triggers an automatic redeploy on Vercel?",["Clicking a button","A git push to the connected repository","Visiting the URL","Nothing — you must manually deploy"],1,"Vercel watches your GitHub repo. Every push triggers an automatic build and deploy. Zero manual steps.")]),

  L('Netlify: Static Sites & Functions','netlify-deploy',3,5,"Netlify specializes in static sites and JAMstack. Similar to Vercel but with extras: built-in form handling, identity management, and plugins. Great for: marketing sites, blogs, documentation, and portfolio sites. Drag-and-drop deployment available for non-Git users!",
    ["Great for static sites and JAMstack","Built-in forms, identity, plugins","Drag-and-drop deploy option","Free tier with custom domains","Automatic HTTPS and CDN"],
    "Netlify is like a gallery with extra services — they'll frame your paintings (add forms), put up name cards (identity), and make prints (CDN) automatically!",
    "Netlify hosts over 3 million sites. It's particularly popular for documentation sites, blogs, and marketing pages.",
    [tf("Netlify requires Git to deploy.",false,"Netlify supports drag-and-drop deployment in addition to Git-based deployment. Upload a folder and you're live!")]),

  L('Replit: Zero-Config Hosting','replit-hosting',4,5,"Replit is the simplest: your app is ALREADY hosted. When you create a project on Replit, it gets a URL instantly. No configuration, no build steps, no deployment process. Hit Run → it's live. The URL format: projectname.username.repl.co. Perfect for prototypes and learning.",
    ["Already hosted — no deploy step needed","Hit Run → instantly accessible","URL: projectname.username.repl.co","Perfect for prototypes and demos","Free tier available"],
    "Replit is like a gallery that's also your studio. You paint AND display in the same room. As soon as you finish a stroke, everyone can see it!",
    "Replit's zero-config hosting makes it the fastest way to get something live on the internet. Literally zero steps.",
    [mcq("How do you deploy on Replit?",["Connect to GitHub and push","Click Run — it's already hosted","Set up a server manually","Buy a hosting plan"],1,"Replit hosts your project automatically. Just click Run and it's live at projectname.username.repl.co.")]),

  L('Custom Domains: YourApp.com','custom-domains',5,5,"Want yourapp.com instead of yourapp.vercel.app? 1) Buy a domain from Namecheap/GoDaddy ($10-15/year). 2) In Vercel/Netlify: add the custom domain. 3) Update DNS records at your domain registrar to point to Vercel/Netlify. 4) Wait 5-30 minutes for DNS propagation. 5) HTTPS is configured automatically!",
    ["Buy from Namecheap or GoDaddy ($10-15/yr)","Add domain in hosting platform settings","Update DNS records at registrar","Wait for propagation (5-30 min)","HTTPS configured automatically"],
    "A custom domain is like getting your name on a store instead of a street number. Instead of '123 Main Street' (vercel.app), it says 'Joe's Pizza' (joespizza.com)!",
    "A custom domain adds credibility. Studies show users trust .com domains 60% more than free subdomains.",
    [mcq("How much does a .com domain typically cost?",["$100/year","$10-15/year","$1,000","Free"],1,"Basic .com domains cost $10-15/year from registrars like Namecheap or GoDaddy.")]),

  L('Environment Variables in Production','env-production',6,5,"Development uses .env files. Production uses the hosting platform's built-in secrets: Vercel → Project Settings → Environment Variables. Netlify → Site Settings → Build & Deploy → Environment. Replit → Secrets tab. NEVER deploy .env files to production. The platform injects them securely at build/runtime.",
    ["Don't deploy .env files to production","Use platform's built-in secret management","Vercel/Netlify/Replit all have secret storage","Different values for dev vs production","Secrets are injected at build/runtime"],
    "In development, you keep secrets in a locked drawer (.env). In production, you give them to the building's security team (hosting platform). They handle protecting them professionally!",
    "Every major deployment platform has built-in environment variable management. Using it correctly is the difference between secure and vulnerable apps.",
    [tf("You should upload your .env file when deploying to production.",false,"NEVER deploy .env files. Use the hosting platform's built-in environment variable management instead.")]),

  L('CI/CD: Auto Deploy on Push','cicd-explained',7,5,"CI/CD = Continuous Integration / Continuous Deployment. Translation: every time you push code to GitHub, it automatically: tests the code (CI), builds the app, and deploys it (CD). With Vercel/Netlify connected to GitHub, CI/CD is automatic. Push code → site updates in ~60 seconds. No manual steps!",
    ["CI = automatic testing on code push","CD = automatic deployment after tests pass","Vercel/Netlify do this automatically with GitHub","Push → test → build → deploy in ~60 seconds","No manual deployment steps needed"],
    "CI/CD is like a conveyor belt in a factory. You put raw materials in (code push), and a finished product (deployed site) comes out the other end automatically!",
    "Companies like Netflix deploy hundreds of times per day using CI/CD. It's how modern software is built.",
    [mcq("What does CI/CD automate?",["Only testing","Only deployment","Testing AND deployment — push code and it goes live automatically","Nothing"],2,"CI (testing) + CD (deployment) = push code → automatically test, build, and deploy. Fully automated pipeline.")]),

  L('Monitoring: Is Your App Working?','monitoring-explained',8,5,"After deploying, how do you know your app is working? Monitoring! Key metrics: uptime (is it accessible?), response time (is it fast?), error rate (are things breaking?), usage (how many users?). Tools: Vercel Analytics (built-in), UptimeRobot (free), LogRocket (session replay). Set up alerts for downtime!",
    ["Monitor: uptime, speed, errors, usage","Vercel Analytics: built-in, free","UptimeRobot: free downtime alerts","Set alerts for when things break","Check error logs regularly"],
    "Monitoring is like having a security camera for your website. You can see if anyone's visiting, if anything breaks, and get alerted if there's a problem — even while you're sleeping!",
    "Amazon calculated that every 100ms of latency costs them 1% in sales. Monitoring performance matters.",
    [mcq("What should you monitor?",["Only uptime","Uptime, response time, error rate, and usage","Only errors","Nothing after deployment"],1,"All four: uptime (is it up?), speed (is it fast?), errors (is it breaking?), usage (are people using it?).")]),

  L('Scaling: When You Go Viral','scaling-explained',9,5,"What if your app suddenly gets 100,000 users? Scaling! With Vercel/Netlify: automatic. They run on edge networks — your app is replicated across the globe. With Replit: you might need to upgrade. With custom servers (AWS): you manage scaling yourself. For vibe coders: use platforms that auto-scale so you never have to worry.",
    ["Vercel/Netlify: auto-scale globally","Edge networks: app runs close to every user","Replit: may need to upgrade for high traffic","AWS: manual scaling (complex)","Choose auto-scaling platforms to avoid headaches"],
    "Auto-scaling is like a restaurant that magically adds more tables when it gets busy. You never have to worry about running out of seats!",
    "When a Vercel-hosted app goes viral, it handles the traffic automatically. No intervention needed. That's the power of edge computing.",
    [tf("You need to manually configure servers when your app goes viral on Vercel.",false,"Vercel auto-scales. It handles traffic spikes automatically — that's one of its biggest advantages over self-hosting.")]),

  L('Cost Management: Staying on Budget','cost-management',10,5,"Free tiers cover most learning and small projects. When you grow: Vercel Pro ($20/mo), Netlify Pro ($19/mo). API costs (OpenAI, Stripe) are pay-per-use. Set budget alerts! Monitor: token usage for AI APIs, bandwidth for hosting, database size for Supabase. The #1 cost mistake: running AI API calls in a loop without monitoring.",
    ["Free tiers cover learning and small projects","Hosting: $0-20/mo for most apps","API costs: pay per use (monitor!)","Set budget alerts on all services","#1 mistake: unmonitored AI API loops"],
    "Cost management is like budgeting allowance money. Free tier is like your regular allowance — plenty for most things. But if you go to the arcade and start playing every machine (AI API calls), it adds up fast!",
    "A developer left an AI API loop running overnight and woke up to a $2,300 bill. Always set spending limits and monitor usage.",
    [mcq("What's the #1 cost mistake in vibe coding?",["Using too many tools","Unmonitored AI API calls running in loops","Having too many users","Using custom domains"],1,"AI APIs charge per token. A loop making thousands of calls can cost hundreds of dollars in hours. Always set budget limits.")])
]);

// ==================== MODULE 9: APIs & DATA (10) ====================
console.log('\n🔌 Module 9: APIs & Data');
await seedModule('apis-data', [
  L('What is an API Key?','what-is-api-key',1,5,"An API key is a password that identifies YOUR app to a service. When you use the OpenAI API, Stripe, or Google Maps, you get a unique key. This key: identifies who's making requests, tracks your usage, bills you for what you use, and can be revoked if compromised. Keep it secret like a password!",
    ["API key = your app's identity/password for a service","Tracks usage and billing","Keep it in .env files, never in code","Can be revoked if compromised","Different keys for different services"],
    "An API key is like a student ID card for the internet. You show it to access different services, and it tracks what you use. If you lose it, someone else could pretend to be you!",
    "OpenAI alone has issued millions of API keys. Each one uniquely identifies a developer and their usage.",
    [mcq("What does an API key do?",["Makes your website faster","Identifies your app to a service and tracks usage/billing","Encrypts your database","Styles your CSS"],1,"API keys authenticate your app, track usage, enable billing, and can be revoked if needed.")]),

  L('Making API Calls: GET, POST, PUT, DELETE','http-methods',2,6,"The 4 HTTP methods: GET = read data (fetch a list of users). POST = create data (submit a new user). PUT = update data (change a user's email). DELETE = remove data (delete a user). Every API interaction uses one of these. When you load a webpage, your browser makes GET requests. When you submit a form, it makes a POST request.",
    ["GET = read/fetch data","POST = create new data","PUT = update existing data","DELETE = remove data","Every web interaction uses these methods"],
    "GET = looking at a menu (reading). POST = placing an order (creating). PUT = changing your order (updating). DELETE = canceling your order (removing). Four actions cover everything!",
    "The average web page makes 50-100 API calls on load (fetching data, loading images, tracking analytics). It's all GET requests behind the scenes.",
    [mcq("Which method creates new data?",["GET","POST","DELETE","SELECT"],1,"POST creates new resources. GET reads, PUT updates, DELETE removes. These four cover all CRUD operations."),
     fb("The four HTTP methods are GET, POST, ___, and DELETE.","PUT","PUT updates existing data. Together with GET (read), POST (create), and DELETE (remove), they form CRUD.")]),

  L('JSON: The Universal Data Format','json-explained',3,5,"JSON (JavaScript Object Notation) is how APIs send and receive data. It looks like: {\"name\": \"Alice\", \"age\": 25, \"hobbies\": [\"coding\", \"hiking\"]}. Key-value pairs, nested objects, arrays. Every API you'll ever use sends JSON. It's human-readable AND machine-readable — the best of both worlds.",
    ["JSON = standard format for API data","Key-value pairs: {\"name\": \"value\"}","Supports: strings, numbers, booleans, arrays, objects","Human-readable and machine-readable","Every modern API uses JSON"],
    "JSON is like a form you fill out. Each field has a label (key) and your answer (value). 'Name: Alice, Age: 25, Hobbies: coding, hiking.' Organized and easy to read!",
    "JSON was designed in 2001 and has become the universal data format. It replaced XML, which was much more verbose and harder to read.",
    [mcq("What does JSON stand for?",["Java Server Object Notation","JavaScript Object Notation","JSON Simple Object Network","Just Standard Object Names"],1,"JavaScript Object Notation — but it's used by every language, not just JavaScript.")]),

  L('Using Third-Party APIs','third-party-apis',4,6,"The real power: connecting to services. Stripe for payments, OpenAI for AI features, Google Maps for location, SendGrid for email, Twilio for SMS. Each has: documentation, API keys, rate limits, and pricing. Prompt pattern: 'Integrate the Stripe API to handle payments. Use the checkout session flow. The product costs $29/month. After payment, redirect to /success.'",
    ["Stripe: payments","OpenAI: AI features","Google Maps: location/maps","SendGrid/Resend: email","Twilio: SMS","Each has docs, keys, limits, and pricing"],
    "Third-party APIs are like hiring specialists. Instead of learning plumbing (payments), electricity (email), and carpentry (maps) yourself, you hire experts (APIs) who already know how!",
    "The average modern web app uses 5-10 third-party APIs. Standing on the shoulders of giants.",
    [mcq("What is Stripe used for?",["Maps","Email","Payment processing","SMS"],0,"Stripe is the most popular payment processing API. It handles credit cards, subscriptions, and invoicing.")]),

  L('Building Your Own API','building-own-api',5,6,"When your app needs a custom backend, build an API! Prompt: 'Create a REST API with Express.js and PostgreSQL. Endpoints: GET /api/products (list all), GET /api/products/:id (get one), POST /api/products (create, requires auth), PUT /api/products/:id (update), DELETE /api/products/:id (delete). Include input validation and error handling.'",
    ["REST APIs follow standard patterns","Define endpoints: route + HTTP method + behavior","Include input validation","Add authentication for write operations","Error handling for every endpoint"],
    "Building an API is like writing a restaurant's rulebook. 'If someone orders X (GET), do this. If they submit a new dish idea (POST), do that. If they cancel (DELETE), do the other thing.'",
    "Once you can build APIs with AI, you can create any backend for any app. It's the key skill for full-stack development.",
    [fb("A REST API endpoint combines an HTTP ___ with a URL path, like GET /api/users.","method","Each endpoint is defined by its HTTP method (GET/POST/PUT/DELETE) and path (/api/resource).")]),

  L('Webhooks: When APIs Call YOU','webhooks-explained',6,5,"Normal API calls: YOUR app asks for data. Webhooks: THE SERVICE sends data to you when something happens. Examples: Stripe webhook tells you when a payment succeeds. GitHub webhook tells you when code is pushed. It's like getting a phone call instead of constantly checking your phone for messages.",
    ["Webhooks = push notifications for your server","Service sends data to YOUR endpoint when events occur","Stripe: payment succeeded/failed","GitHub: code pushed, PR created","No polling needed — events arrive automatically"],
    "Regular API: You keep calling the pizza place asking 'Is my order ready yet?' Webhook: The pizza place calls YOU when it's ready. Much better!",
    "Stripe uses webhooks to notify your app about successful payments. Without them, you'd have to constantly poll Stripe — wasteful and unreliable.",
    [mcq("How are webhooks different from regular API calls?",["They're faster","The SERVICE sends data to YOU, instead of you requesting it","They cost more","They use different programming languages"],1,"Webhooks are push-based: the service notifies you when something happens, instead of you polling for changes.")]),

  L('Rate Limits: Don\'t Get Blocked','api-rate-limits',7,5,"Every API limits how many requests you can make. OpenAI: varies by plan. Google Maps: 28,500 requests/day (free). Stripe: 100 requests/second. Exceeding limits → 429 error. Solutions: cache responses, batch requests, use exponential backoff for retries.",
    ["Every API has request limits","Exceeding = 429 Too Many Requests error","Cache responses to reduce API calls","Batch multiple items in one request","Use exponential backoff for retries"],
    "API limits are like a buffet with rules. You can go back for seconds, but not 100 times per minute! Pace yourself and you'll be fine.",
    "A vibe coder's app kept calling the Google Maps API for every keystroke in a search box. 10,000 requests later, they hit the daily limit by noon.",
    [mcq("What should you do when hitting rate limits?",["Send more requests faster","Cache responses, batch requests, and use retry backoff","Switch to a different API","Give up"],1,"Cache (save responses locally), batch (combine requests), and backoff (wait before retrying) are the three solutions.")]),

  L('API Authentication: Keys, OAuth, Tokens','api-auth-types',8,5,"Three ways APIs verify you: 1) API Keys: simple, sent in headers (Authorization: Bearer sk-xxx). 2) OAuth: 'Login with Google/GitHub' flow — user approves, you get a token. 3) JWT Tokens: short-lived tokens after login, sent with every request. Most APIs use option 1 or 3. OAuth is for user-facing authentication flows.",
    ["API Keys: simple, include in request header","OAuth: user-approves-access flow (Login with Google)","JWT: token-based after login","Keys for service-to-service communication","JWT for user session management"],
    "API Key = a permanent VIP badge. OAuth = asking someone 'can I speak on your behalf?' and they say yes. JWT = a day pass that expires tonight.",
    "OAuth powers every 'Login with Google/Facebook/GitHub' button you've ever seen. It lets apps access your data without knowing your password.",
    [mcq("Which auth method is used for 'Login with Google'?",["API Key","OAuth","JWT","Password"],1,"OAuth enables third-party authentication. Google confirms your identity and gives the app a token to access your info.")]),

  L('Error Handling: When Things Go Wrong','error-handling-apis',9,5,"APIs fail. Networks go down. Servers crash. Your app needs to handle this gracefully. Key patterns: try-catch blocks (catch errors), status code checks (200=ok, 4xx=your fault, 5xx=server fault), user-friendly error messages (never show raw errors), retry logic (try again for temporary failures), fallback data (show cached version).",
    ["Always wrap API calls in try-catch","Check status codes: 200=ok, 4xx=client error, 5xx=server error","Show user-friendly error messages","Never display raw error details to users","Implement retry logic for temporary failures"],
    "Error handling is like having an umbrella. You hope it doesn't rain, but when it does, you're prepared. Without it, you (and your users) get soaked!",
    "Apps without error handling crash and show ugly messages. Apps WITH error handling show 'Something went wrong, try again' and recover gracefully.",
    [mcq("What status code means 'server error'?",["200","404","500","301"],2,"5xx = server-side error (not your fault). 4xx = client-side error (your request was wrong). 2xx = success.")]),

  L('API Testing: Postman & Thunder Client','api-testing',10,5,"Before connecting your frontend to an API, TEST it! Tools: Postman (standalone app, most popular), Thunder Client (VS Code extension), curl (terminal). Test each endpoint: send requests, check responses, verify error handling. This catches problems before your users do.",
    ["Test APIs BEFORE connecting to frontend","Postman: most popular API testing tool","Thunder Client: VS Code extension","Test: request format, responses, errors","Catches problems early"],
    "Testing an API is like test-driving a car before buying it. You check that everything works — steering, brakes, lights — before putting it on the road!",
    "Professional developers test every API endpoint before integration. A 5-minute test prevents hours of debugging later.",
    [mcq("When should you test API endpoints?",["After deploying to production","Before connecting them to your frontend","Never — trust the documentation","Only when there's a bug"],1,"Test BEFORE integration. Verify requests, responses, and error handling work correctly.")])
]);

// ==================== MODULE 10: DESIGN (8) ====================
console.log('\n🎨 Module 10: Design');
await seedModule('design-ux', [
  L('Design Principles Every Builder Needs','design-principles',1,5,"You don't need to be a designer. But 4 principles make everything look better: 1) Contrast — make important things stand out. 2) Alignment — line things up. 3) Repetition — be consistent. 4) Proximity — group related items. These 4 rules (CARP) transform amateur-looking apps into professional ones.",
    ["Contrast: important things stand out","Alignment: everything lines up","Repetition: consistent styles throughout","Proximity: related items grouped together","CARP = 4 rules that make everything look professional"],
    "Design rules are like manners for your app. You don't need to be fancy — just be neat, consistent, and make things easy to find!",
    "Apple's design philosophy is built on these exact principles. Contrast, alignment, repetition, and proximity are everywhere in iOS.",
    [mcq("What does CARP stand for?",["Code, API, React, Python","Contrast, Alignment, Repetition, Proximity","Create, Adjust, Review, Publish","Color, Animation, Responsive, Performance"],1,"CARP: the four fundamental design principles that make any interface look professional.")]),

  L('Color Theory: Don\'t Make Ugly Apps','color-theory',2,5,"Color rules: 1) Pick ONE primary color (your brand). 2) Add a neutral (gray for text/backgrounds). 3) Add an accent (for CTAs and highlights). 4) Use a color palette tool (coolors.co, colorhunt.co). 5) NEVER use pure black (#000) — use dark gray (#1a1a2e). 6) Ensure contrast ratio ≥ 4.5:1 for accessibility.",
    ["One primary + one neutral + one accent","Use palette tools: coolors.co, colorhunt.co","Never pure black — use dark gray","4.5:1 contrast ratio for readability","Include hex codes in AI prompts for exact colors"],
    "Picking colors is like picking an outfit. You wouldn't wear red shirt + green pants + yellow hat. Pick one main color (shirt), neutral base (pants), and a pop of accent (shoes)!",
    "Companies spend millions on color selection. Facebook's blue was chosen because Mark Zuckerberg is red-green colorblind — blue is the color he sees best.",
    [mcq("How many main colors should you pick?",["As many as possible","Three: primary, neutral, accent","Only one","Seven for a rainbow effect"],1,"Three colors: one primary (brand), one neutral (text/bg), one accent (CTAs). That's all you need.")]),

  L('Typography: Fonts That Don\'t Suck','typography-basics',3,5,"Font rules: 1) Use MAX 2 fonts (one for headings, one for body). 2) System fonts (Inter, SF Pro, Segoe UI) are always safe. 3) Font size: body 16px minimum, headings 24-48px. 4) Line height: 1.5-1.6 for body text. 5) Font weight: 400 for body, 600-700 for headings. Specify these in your prompts!",
    ["Max 2 fonts: heading + body","System fonts are safe and fast","Body: 16px minimum","Line height: 1.5-1.6 for readability","Headings: 600-700 weight (bold)"],
    "Typography is like choosing your voice for writing. You wouldn't use a fancy cursive for a text message or comic sans for a legal document. Match the font to the purpose!",
    "Google's Material Design uses Roboto everywhere. Apple uses SF Pro. Consistency in typography is key to looking professional.",
    [tf("Using 5+ different fonts makes your app look more creative.",false,"More than 2 fonts looks chaotic. Professionals use 1-2 fonts consistently. Constraint breeds elegance.")]),

  L('Layout & Spacing: The Power of Whitespace','layout-spacing',4,5,"Whitespace is the most underrated design tool. More space = more professional. Rules: 8px grid (all spacing in multiples of 8). Generous padding inside cards (16-24px). Clear section separation (32-64px between sections). Don't cram content — let it breathe!",
    ["Use 8px grid (spacing in multiples of 8)","Card padding: 16-24px","Section gaps: 32-64px","More whitespace = more professional","Content should 'breathe' — avoid cramming"],
    "Whitespace is like silence in music. Without pauses, music is just noise. Without spacing, a website is just a wall of text. The space between things matters as much as the things themselves!",
    "Studies show that increased whitespace between paragraphs and margins improves reading comprehension by 20%.",
    [mcq("What spacing system do most modern designs use?",["Random pixel values","5px grid","8px grid (multiples of 8)","No system"],2,"The 8px grid creates visual harmony. 8, 16, 24, 32, 40, 48... All spacing follows this pattern.")]),

  L('Mobile-First Design','mobile-first',5,5,"Design for phones FIRST, then expand to tablets and desktops. Why? 60%+ of web traffic is mobile. Mobile constraints force you to prioritize: limited space means only essential content survives. Then add more for larger screens. All AI tools generate responsive layouts — but specifying 'mobile-first' in prompts ensures the best mobile experience.",
    ["60%+ of web traffic is mobile","Design phone version first","Prioritize content for small screens","Expand layout for larger screens","AI tools make responsive layouts — prompt 'mobile-first'"],
    "Mobile-first is like packing for a trip with a tiny backpack first, then a big suitcase. If it fits in the backpack (mobile), it definitely fits in the suitcase (desktop)!",
    "Google uses mobile-first indexing — your mobile site is what determines your search ranking, not desktop.",
    [tf("You should design the desktop version first, then adapt for mobile.",false,"Design mobile first! Constraints force better prioritization, and 60%+ of users are on mobile.")]),

  L('Component Libraries: Don\'t Design from Scratch','component-libraries',6,5,"Why design buttons from scratch when thousands of pre-made ones exist? Component libraries: shadcn/ui (most popular for React), Material UI (Google's design), Chakra UI, Tailwind CSS (utility classes). When prompting AI: 'Use shadcn/ui components' or 'Use Tailwind CSS' to get consistent, professional UI instantly.",
    ["Pre-made components save hours","shadcn/ui: most popular, modern, customizable","Tailwind CSS: utility-first styling","Material UI: Google's design language","Specify the library in your AI prompts"],
    "Component libraries are like IKEA for websites. Instead of building furniture from trees, you buy pre-made pieces that look great and fit together. Way faster!",
    "shadcn/ui has become the default component library for AI-generated apps. Both Lovable and v0 use it extensively.",
    [mcq("Which component library is most popular for AI-generated React apps?",["Bootstrap","jQuery UI","shadcn/ui","Foundation"],2,"shadcn/ui has become the default for modern React apps. It's what Lovable, v0, and most AI tools generate.")]),

  L('Accessibility: Building for Everyone','accessibility-basics',7,5,"Accessibility (a11y) means making your app usable by everyone, including people with disabilities. Key practices: alt text on images (for screen readers), keyboard navigation (not just mouse), sufficient color contrast (4.5:1), semantic HTML (use proper tags), ARIA labels on interactive elements. Many of these are automatic with good component libraries.",
    ["Alt text on all images","Keyboard navigation support","4.5:1 color contrast minimum","Semantic HTML (proper heading hierarchy)","ARIA labels on buttons and inputs"],
    "Accessibility is like building a ramp next to stairs. The stairs work for most people, but the ramp works for EVERYONE — including people with strollers, wheelchairs, or crutches!",
    "1 billion people worldwide have a disability. Making your app accessible isn't just ethical — it's a massive market opportunity.",
    [tf("Accessibility only benefits people with disabilities.",false,"Accessibility benefits everyone: keyboard navigation is faster, good contrast helps in sunlight, clear labels help non-native speakers.")]),

  L('AI Design Tools: v0, Figma AI, Galileo','ai-design-tools',8,5,"The AI design landscape: v0 (generates React code from descriptions), Figma AI (AI features in the design tool), Galileo AI (generates full designs), Midjourney (generates images). For vibe coders: v0 is the most useful because it produces code. Use Midjourney or DALL-E for custom images/illustrations to make your apps unique.",
    ["v0: generates React code from descriptions","Figma AI: AI-powered design tool","Galileo AI: full design generation","Midjourney/DALL-E: custom images","v0 is most useful for vibe coders (code output)"],
    "AI design tools are like having a whole design team on your laptop. One draws the blueprint (v0), one paints pictures (Midjourney), and one arranges the furniture (Figma AI)!",
    "The combination of v0 for UI components and Midjourney for custom illustrations lets non-designers create apps that look professional.",
    [mcq("Which AI design tool is most useful for vibe coders?",["Photoshop","v0 (generates actual React code)","Microsoft Paint","Canva"],1,"v0 generates production-ready React code, not just pictures. That's directly usable in your projects.")])
]);

// ==================== MODULE 11: ADVANCED (8) ====================
console.log('\n⚡ Module 11: Advanced');
await seedModule('advanced', [
  L('Building Full-Stack Apps','fullstack-apps',1,6,"Full-stack = frontend + backend + database working together. The AI workflow: 1) Design database schema. 2) Build API endpoints. 3) Create frontend pages. 4) Connect frontend to API. 5) Add authentication. 6) Deploy everything. With Lovable/Bolt, steps 1-5 happen almost automatically!",
    ["Full-stack = frontend + backend + database","AI tools handle most of the integration","Plan database first, then API, then frontend","Supabase simplifies backend dramatically","Deploy everything together"],
    "Full-stack development is like building a complete restaurant: the dining room (frontend), the kitchen (backend), and the pantry (database). All three work together!",
    "Full-stack vibe coding is the most in-demand skill for non-technical founders. Build your entire product without hiring developers.",
    [mcq("What order should you build a full-stack app?",["Frontend first","Random order","Database → API → Frontend → Auth → Deploy","Deploy first"],2,"Database schema first (what to store), API next (how to access it), frontend last (what users see).")]),

  L('Real-time Features','realtime-features',2,6,"Add live updates: chat messages appear instantly, notifications pop up, dashboards update in real-time. With Supabase Realtime: subscribe to database changes and update the UI automatically. Prompt: 'Add real-time updates to the messages table. When a new message is inserted, it should appear in all connected clients immediately without page refresh.'",
    ["WebSockets enable instant updates","Supabase Realtime: subscribe to database changes","Use for: chat, notifications, live dashboards","No page refresh needed","Prompt specifically for 'real-time' features"],
    "Real-time is like a group video call — everyone sees and hears everything instantly. Without it, it's like sending letters back and forth!",
    "Real-time features are what make apps feel 'alive.' Slack, Discord, and Notion all use real-time extensively.",
    [mcq("What technology enables real-time web features?",["HTTP","FTP","WebSockets","CSS"],2,"WebSockets maintain a persistent connection for instant two-way communication.")]),

  L('Payments: Integrating Stripe','stripe-payments',3,6,"Stripe makes payments easy. The flow: 1) User clicks 'Buy.' 2) Frontend creates a Checkout Session via your API. 3) Stripe shows payment form (hosted by Stripe — you never touch card numbers!). 4) User pays. 5) Stripe webhook notifies your server. 6) Your server grants access. Prompt: 'Integrate Stripe Checkout for a $29/month subscription.'",
    ["Stripe handles all payment security","You NEVER touch credit card numbers","Checkout Sessions = Stripe-hosted payment page","Webhooks confirm payment success","Test mode for development (no real charges)"],
    "Stripe is like hiring a professional cashier. You don't need to know how credit cards work — Stripe handles it all. You just tell them the price!",
    "Stripe processes hundreds of billions of dollars annually. Companies from startups to Amazon use it.",
    [tf("You need to store credit card numbers in your database for Stripe.",false,"NEVER store credit card numbers. Stripe handles all payment data on their secure servers. You only get a confirmation.")]),

  L('Email: Sending from Your App','email-sending',4,5,"Send emails with Resend or SendGrid. Use cases: welcome emails, password resets, notifications, newsletters. Prompt: 'Set up Resend to send a welcome email when a new user registers. Include the user's name in the greeting and a link to get started. Use a clean, modern HTML template.'",
    ["Resend: modern, developer-friendly email API","SendGrid: enterprise email service","Use for: welcome, reset, notifications","Never send from your personal email","Include unsubscribe links for marketing emails"],
    "Email services are like having a post office inside your app. You write the letter (content), they stamp and deliver it to the right person's inbox!",
    "Resend was built by a former Vercel engineer and has become the go-to email API for modern apps.",
    [mcq("Why use an email service instead of sending from your own server?",["It's more fun","Better deliverability, spam avoidance, and compliance","It's the only way","To save money"],1,"Email services handle deliverability, spam filters, bounces, and compliance (like CAN-SPAM). Self-sending emails often land in spam.")]),

  L('File Uploads: Images & Storage','file-uploads',5,5,"Let users upload profile pictures, documents, and images. With Supabase Storage: create a bucket, upload files via API, get a public URL. Prompt: 'Add profile picture upload. Create a Supabase Storage bucket called avatars. Allow image uploads up to 2MB. Show a preview before uploading. Display the avatar in the user's profile.'",
    ["Supabase Storage: file hosting built-in","Create 'buckets' for different file types","Set size limits (e.g., 2MB for images)","Get public URLs for uploaded files","Validate file types (images only, etc.)"],
    "File uploads are like a digital locker. Users put their stuff (photos, documents) in the locker (storage bucket), and they can access it anytime from anywhere!",
    "Instagram processes 100 million photo uploads per day. File storage is a fundamental feature of modern apps.",
    [mcq("What does Supabase Storage provide?",["Code hosting","File storage with buckets, URLs, and access control","Database tables","Email sending"],1,"Supabase Storage lets you create buckets, upload files, set access rules, and get public/private URLs.")]),

  L('AI Integration: Adding ChatGPT/Claude','ai-integration',6,6,"Add AI to YOUR app! Use the OpenAI API or Anthropic API to add AI features: chatbots, content generation, summarization, translation. Prompt: 'Add an AI chat feature using the OpenAI API. Create an endpoint that accepts a user message, sends it to GPT-4, and returns the response. Show messages in a chat interface with typing indicator.'",
    ["OpenAI API: GPT models for text generation","Anthropic API: Claude models","Use for: chatbots, summaries, translations, analysis","API keys go in environment variables","Stream responses for better UX"],
    "Adding AI to your app is like giving your app a brain! It can understand questions, generate text, analyze data, and have conversations with your users.",
    "Apps with AI features see 3-5x higher user engagement than those without. AI is becoming a must-have feature.",
    [tf("You need a PhD in machine learning to add AI to your app.",false,"With APIs, adding AI is just a few lines of code. The AI models are hosted by OpenAI/Anthropic — you just call the API.")]),

  L('Multi-page Apps: Routing','routing-navigation',7,5,"Most apps have multiple pages. React uses React Router or Next.js's built-in routing. Routes map URLs to pages: /home → HomePage, /profile → ProfilePage, /settings → SettingsPage. Dynamic routes: /users/:id shows different user profiles. Protected routes: redirect to /login if not authenticated.",
    ["Routes map URLs to pages","Static: /about → AboutPage","Dynamic: /users/:id → UserProfile(id)","Protected: redirect unauthenticated users","Next.js: file-based routing (create file = create route)"],
    "Routes are like addresses in a city. /home is your house, /profile is the office, /settings is the control room. Each address takes you to a different place!",
    "Next.js file-based routing means creating a file at pages/about.js automatically creates the /about route. It's the simplest routing system available.",
    [fb("In dynamic routing, /users/:id means the ___ part changes for each user.","id","Dynamic route segments (like :id) are placeholders that match any value: /users/1, /users/abc, etc.")]),

  L('Performance: Making Your App Fast','performance-optimization',8,5,"Speed matters — users leave if your app takes more than 3 seconds to load. Quick wins: 1) Optimize images (WebP format, lazy loading). 2) Code splitting (only load what's needed). 3) Caching (store data locally). 4) CDN (serve assets from nearby servers). 5) Minimize API calls. Most of these are automatic with Vercel/Next.js!",
    ["3-second load time = users leave","Optimize images: WebP format, lazy loading","Code splitting: load pages on demand","Caching: store data locally for reuse","Vercel/Next.js handle most optimizations automatically"],
    "Performance is like a fast-food restaurant. If it takes 30 minutes to get a burger, you leave! Your website needs to serve content as fast as McDonald's serves fries.",
    "Amazon found that every 100ms of latency costs 1% in revenue. Google uses page speed as a search ranking factor.",
    [mcq("What happens when a page takes more than 3 seconds to load?",["Users wait patiently","Most users leave","Nothing changes","The app crashes"],1,"53% of mobile users abandon sites that take longer than 3 seconds. Speed = retention.")])
]);

// ==================== MODULE 12: SHIP IT (8) ====================
console.log('\n🚢 Module 12: Ship It!');
await seedModule('ship-it', [
  L('Pre-Launch Checklist','pre-launch-checklist',1,5,"Before launching: 1) Test on mobile AND desktop. 2) Check all forms work. 3) Verify authentication flow. 4) Run through the user journey end-to-end. 5) Check for broken links. 6) Verify HTTPS is working. 7) Test payment flow (if applicable). 8) Review security checklist. 9) Set up monitoring. 10) Tell someone to test it (fresh eyes catch bugs).",
    ["Test on multiple devices (phone, tablet, desktop)","Verify all forms and authentication","End-to-end user journey test","Check HTTPS and security","Get a friend to test (fresh perspective)"],
    "Pre-launch is like a pilot's checklist before takeoff. Every item matters. Skipping one can mean a bumpy flight (or a crash)!",
    "NASA uses 500+ item checklists before launches. Your 10-item checklist is nothing in comparison — but equally important for YOUR launch.",
    [tf("You should get someone else to test your app before launching.",true,"Fresh eyes catch bugs you've become blind to. Always have at least one other person test before launch.")]),

  L('Analytics: Understanding Users','analytics-setup',2,5,"After launch: who's using your app? Add analytics! Vercel Analytics (built-in, simple), Google Analytics (detailed, free), Mixpanel (event tracking), PostHog (open-source). Track: page views, user signups, feature usage, drop-off points. Data drives decisions — don't guess what users want, measure it!",
    ["Vercel Analytics: simple, built-in","Google Analytics: detailed, free","Track: views, signups, feature usage, drop-offs","Data > guessing for product decisions","Set up BEFORE launch to capture day-one data"],
    "Analytics is like putting security cameras in your store. You can see: how many customers come in, what they look at, where they spend time, and where they leave. Super valuable information!",
    "Data-driven companies grow 30% faster than those making decisions based on gut feeling alone.",
    [mcq("When should you set up analytics?",["After you have 1000 users","Before launch to capture day-one data","Never — it slows down the app","After 6 months"],1,"Set up before launch! Day-one data shows your first users' behavior — invaluable for early decisions.")]),

  L('SEO Basics: Getting Found on Google','seo-basics',3,5,"SEO (Search Engine Optimization) helps people find your app on Google. Basics: 1) Page title (title tag) — descriptive, include keywords. 2) Meta description — shows in search results. 3) Fast load time (Google rewards speed). 4) Mobile-friendly. 5) Semantic HTML (h1, h2, p tags). Prompt: 'Add SEO meta tags to all pages. Include title, description, and Open Graph tags for social sharing.'",
    ["Title tag: descriptive page title with keywords","Meta description: shows in Google results","Fast loading = higher ranking","Mobile-friendly = higher ranking","Open Graph tags for social media previews"],
    "SEO is like putting a sign on your store that faces the main road. Without it, your store is hidden in a back alley. With good SEO, people walking by (searching Google) find you!",
    "93% of web traffic comes from search engines. Good SEO is free marketing that compounds over time.",
    [mcq("What's the most important SEO element?",["Background color","A descriptive title tag with relevant keywords","Number of images","Amount of text"],1,"The title tag is what Google shows in search results. A clear, keyword-rich title is the #1 SEO factor.")]),

  L('User Feedback: Iterating on Product','user-feedback',4,5,"After launch, listen to users! Add: a feedback form, a contact email, analytics event tracking. Watch for: features people request most, pages where users get stuck, tasks that take too many clicks. Iterate in small increments — don't rebuild everything at once. Ship improvements weekly.",
    ["Add a feedback form to your app","Watch analytics for drop-off points","Listen to what users request most","Iterate in small, weekly improvements","Don't rebuild — improve incrementally"],
    "Getting user feedback is like asking customers 'How was your meal?' Some will love it, some will suggest improvements. Each piece of feedback makes the restaurant better!",
    "Slack launched as a gaming company's internal tool. User feedback pivoted them into the biggest team communication platform in the world.",
    [mcq("How should you respond to user feedback?",["Ignore it — you know best","Rebuild everything from scratch","Make small, incremental improvements based on patterns","Only listen to paying users"],2,"Small iterations based on user patterns is the most effective approach. Look for common themes, not individual requests.")]),

  L('Monetization: Making Money','monetization',5,5,"How to earn from your app: 1) Subscriptions (monthly fee for premium features — Stripe). 2) One-time purchases (pay for the app — Stripe). 3) Freemium (free basic, paid premium). 4) Ads (Google AdSense — usually low revenue). 5) Affiliate links. Most vibe-coded products use freemium + subscriptions. Stripe makes payment integration straightforward.",
    ["Subscriptions: monthly/yearly (Stripe)","One-time purchases (Stripe)","Freemium: free base + paid premium features","Ads: low revenue, lots of traffic needed","Stripe handles all payment complexity"],
    "Monetization is like choosing how your lemonade stand makes money. Charge per cup (one-time)? Monthly all-you-can-drink (subscription)? Free lemonade with paid upgrades (freemium)?",
    "The most successful indie SaaS products use the freemium model: free plan hooks users, premium plan converts 2-5% to paying.",
    [mcq("What's the most popular monetization model for SaaS?",["Ads only","Freemium (free basic + paid premium)","One-time purchase","Donations"],1,"Freemium converts the best: free plan attracts users, premium plan with additional features generates revenue.")]),

  L('Building in Public','building-in-public',6,5,"Share your journey! Tweet progress updates, write blog posts about what you learned, post on Reddit/HN/ProductHunt. Building in public: gets you feedback, builds an audience, creates accountability, and attracts early users. Many successful products got their first 1000 users from the founder's Twitter/X audience.",
    ["Share progress on social media","Post on: Twitter/X, Reddit, Product Hunt","Blog about what you're learning","Builds audience + gets early feedback","Many products get first users from founder's audience"],
    "Building in public is like opening your kitchen so diners can watch you cook. People love seeing the process, and they become fans before the food even arrives!",
    "Pieter Levels (creator of Nomad List, RemoteOK) built his entire audience by sharing his journey publicly. His products generate millions in revenue.",
    [tf("You should keep your project secret until it's perfect.",false,"Sharing progress publicly builds an audience, gets early feedback, and creates accountability. Launch early, iterate often.")]),

  L('From Vibe Coder to Technical Founder','vibe-to-founder',7,5,"You've learned to build. Now what? Options: 1) Build products for yourself (solve your own problems). 2) Freelance (build for others). 3) Start a startup (your app, your business). 4) Get hired (tech companies value builders). The vibe coding skills you've learned are genuinely valuable in 2025+ — you can build faster than many traditional developers.",
    ["Build products for yourself","Freelance: build apps for clients","Startup: turn your app into a business","Get hired: companies want builders","Your skills are genuinely valuable in today's market"],
    "You started as someone who couldn't code. Now you can build real apps. That's like going from never cooking to running a restaurant. Your journey has just begun!",
    "Non-technical founders who can build MVPs raise funding 2x more successfully. Investors want to see a working product, not just a pitch deck.",
    [mcq("What's the biggest advantage of being a vibe coder?",["Free software","You can build and test ideas faster than most traditional developers","Unlimited API calls","Better design skills"],1,"Speed of iteration is your superpower. While others plan for months, you can build and test an idea in days.")]),

  L('What\'s Next: Your Continued Path','whats-next',8,5,"You've completed VibeCode Academy! You now know: prompt engineering, all major AI tools, web development fundamentals, security best practices, deployment, and how to ship products. Keep building! Join communities: Indie Hackers, Product Hunt, Vibe Coding subreddits. The best way to learn is to build real things for real people. Your next step: build something you personally need.",
    ["Keep building — real projects = real learning","Join: Indie Hackers, Product Hunt communities","Build something YOU personally need","Teach others — it reinforces your knowledge","The journey from beginner to builder is complete!"],
    "Congratulations, you've graduated! Like finishing school, the real learning starts when you go out into the world and start building. Your degree is 'Vibe Coder' and the world is your campus!",
    "The best vibe coders never stop learning. They build a project every week, share their progress, and continuously expand their skills.",
    [tf("After completing this course, you should know everything about coding.",false,"This course gives you strong foundations. But technology evolves fast — keep building, keep learning, and stay curious!")],
    {type:"project_task",description:"Build and launch a REAL app that solves a problem you personally have. Deploy it, share it publicly, and get at least 3 people to use it!",criteria:["Solves a real problem","Deployed and accessible","Shared publicly (social media, Product Hunt, etc.)","At least 3 real users"],xpBonus:200})
]);

const total = await prisma.lesson.count();
console.log(`\n🎉🎉🎉 ALL MODULES SEEDED! Total lessons: ${total}`);
}

main().catch(console.error).finally(()=>prisma.$disconnect());
