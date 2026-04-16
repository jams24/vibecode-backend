import { Router, Request, Response } from 'express';

const router = Router();

const LAST_UPDATED = 'April 16, 2026';

const baseHtml = (title: string, body: string) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — VibeCode Academy</title>
<style>
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    max-width: 720px; margin: 0 auto; padding: 40px 24px 80px;
    line-height: 1.6; color: #1F1D1B; background: #FBFAF9;
  }
  @media (prefers-color-scheme: dark) {
    body { background: #0E0D0C; color: #FBFAF9; }
    a { color: #8B5CF6; }
    h1, h2, h3 { color: #FBFAF9; }
    hr { border-color: #2A2724; }
    .meta { color: #7A7570; }
  }
  h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin: 0 0 4px; }
  h2 { font-size: 20px; font-weight: 700; margin: 32px 0 8px; letter-spacing: -0.3px; }
  h3 { font-size: 16px; font-weight: 600; margin: 20px 0 8px; }
  p, li { font-size: 15px; }
  ul { padding-left: 20px; }
  li { margin-bottom: 4px; }
  a { color: #5B52F0; text-decoration: underline; }
  .meta { color: #7A7570; font-size: 13px; margin-bottom: 32px; }
  hr { border: none; border-top: 1px solid #E7E5E2; margin: 40px 0; }
  .footer { font-size: 12px; color: #7A7570; text-align: center; }
</style>
</head>
<body>
${body}
<hr>
<p class="footer">VibeCode Academy · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="/delete-account">Delete Account</a></p>
</body>
</html>`;

router.get('/privacy', (_req: Request, res: Response) => {
  const body = `
<h1>Privacy Policy</h1>
<p class="meta">Last updated: ${LAST_UPDATED}</p>

<h2>Information We Collect</h2>
<h3>Account Information</h3>
<ul>
  <li>Email address (for login)</li>
  <li>Username (displayed in app)</li>
  <li>Password (hashed with bcrypt, never stored in plain text)</li>
  <li>Google account ID and profile image, if you sign in with Google</li>
</ul>

<h3>Usage Data</h3>
<ul>
  <li>Lesson progress and quiz scores</li>
  <li>XP, level, and streak data</li>
  <li>Daily goal preferences</li>
  <li>Onboarding assessment answers (experience level, build goals)</li>
</ul>

<h3>Third-Party Services</h3>
<ul>
  <li><strong>Google Play Billing</strong>: Processes subscription payments. We do not collect or store credit card information. See <a href="https://policies.google.com/privacy" target="_blank">Google's Privacy Policy</a>.</li>
  <li><strong>RevenueCat</strong>: Manages subscription state and entitlements. See <a href="https://www.revenuecat.com/privacy" target="_blank">RevenueCat Privacy Policy</a>.</li>
  <li><strong>Google Sign-In</strong>: For authentication. We receive your email address, name, and public profile image.</li>
</ul>

<h2>How We Use Your Data</h2>
<ul>
  <li>Personalize your learning experience</li>
  <li>Track your progress across lessons and modules</li>
  <li>Maintain streaks, leaderboards, and gamification features</li>
  <li>Process subscriptions and restore purchases</li>
  <li>Improve the app based on aggregate, anonymized usage patterns</li>
</ul>

<h2>Data Storage</h2>
<ul>
  <li>Account data stored on secure PostgreSQL servers</li>
  <li>Passwords hashed with bcrypt (industry standard)</li>
  <li>All API communication encrypted via HTTPS/TLS</li>
</ul>

<h2>Data Sharing</h2>
<p>We do <strong>not</strong> sell your data. We share data only with:</p>
<ul>
  <li>RevenueCat (subscription management)</li>
  <li>Google Play (app distribution and payments)</li>
  <li>Google Sign-In (identity verification, only if you use it)</li>
</ul>

<h2>Your Rights</h2>
<ul>
  <li>Delete your account and all associated data by contacting us</li>
  <li>Export your progress data by request</li>
  <li>Opt out of non-essential data collection</li>
  <li>Review and correct any personal data we hold about you</li>
</ul>

<h2>Children's Privacy</h2>
<p>This app is not directed at children under 13. We do not knowingly collect personal information from children under 13.</p>

<h2>Contact</h2>
<p>For privacy questions, email: <a href="mailto:rimolaofficial@gmail.com">rimolaofficial@gmail.com</a></p>

<h2>Changes to This Policy</h2>
<p>We may update this policy from time to time. Changes will be posted on this page with a new "Last updated" date.</p>
`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(baseHtml('Privacy Policy', body));
});

router.get('/delete-account', (_req: Request, res: Response) => {
  const body = `
<h1>Delete Your Account</h1>
<p class="meta">Last updated: ${LAST_UPDATED}</p>

<p>This page explains how to request deletion of your <strong>VibeCode Academy</strong> account and the associated data we hold about you.</p>

<h2>How to Request Account Deletion</h2>
<p>To delete your account, send an email to <a href="mailto:rimolaofficial@gmail.com?subject=Account%20Deletion%20Request">rimolaofficial@gmail.com</a> from the email address associated with your VibeCode Academy account.</p>

<p>In your email, please include:</p>
<ul>
  <li>The email address used to register your account</li>
  <li>Your VibeCode Academy username (if you remember it)</li>
  <li>A short statement confirming you want your account and data deleted</li>
</ul>

<p>We will process deletion requests within <strong>30 days</strong> of receipt and send you a confirmation email once complete.</p>

<h2>What Data Will Be Deleted</h2>
<p>Upon deletion, the following will be permanently removed from our servers:</p>
<ul>
  <li>Your account (email, username, password hash, Google ID if used)</li>
  <li>Your profile avatar URL</li>
  <li>All lesson progress, quiz scores, and XP history</li>
  <li>Streak data and daily goal preferences</li>
  <li>Onboarding answers (experience level, build goals)</li>
  <li>Your entry on leaderboards</li>
  <li>Any badges, achievements, and user-generated project submissions</li>
</ul>

<h2>What Data May Be Retained</h2>
<p>Some data may be retained for legitimate business, legal, or financial reasons:</p>
<ul>
  <li><strong>Subscription and payment records</strong> — retained for up to 7 years as required by tax and accounting regulations. These are held by Google Play and RevenueCat, not directly by us.</li>
  <li><strong>Aggregated, anonymized analytics</strong> — cannot be linked back to you and may be retained indefinitely.</li>
  <li><strong>Security and fraud prevention logs</strong> — retained for up to 90 days.</li>
</ul>

<h2>Third-Party Data</h2>
<p>Deleting your VibeCode Academy account does <strong>not</strong> automatically cancel active Google Play subscriptions. To cancel subscriptions, visit <a href="https://play.google.com/store/account/subscriptions" target="_blank">Google Play Subscriptions</a>.</p>

<p>Your RevenueCat customer record will be anonymized when you delete your account.</p>

<h2>Questions</h2>
<p>For questions about account deletion or data handling, contact us at <a href="mailto:rimolaofficial@gmail.com">rimolaofficial@gmail.com</a>.</p>

<p>For more details on what we collect and how we use it, see our <a href="/privacy">Privacy Policy</a>.</p>
`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(baseHtml('Delete Account', body));
});

router.get('/terms', (_req: Request, res: Response) => {
  const body = `
<h1>Terms of Service</h1>
<p class="meta">Last updated: ${LAST_UPDATED}</p>

<h2>1. Acceptance of Terms</h2>
<p>By downloading, installing, or using VibeCode Academy ("the App"), you agree to be bound by these Terms of Service. If you do not agree, do not use the App.</p>

<h2>2. Service Description</h2>
<p>VibeCode Academy is an educational platform teaching AI-powered software development ("vibe coding"). We provide interactive lessons, quizzes, a prompt playground, and gamification features.</p>

<h2>3. Accounts</h2>
<ul>
  <li>You must provide accurate information when creating an account</li>
  <li>You are responsible for maintaining the security of your account credentials</li>
  <li>You are responsible for all activity under your account</li>
  <li>You may not share your account with others</li>
  <li>You must be at least 13 years old to use the App</li>
</ul>

<h2>4. Subscriptions and Payments</h2>
<h3>Free Trial</h3>
<p>New subscribers may be eligible for a 7-day free trial. The trial automatically converts to a paid subscription at the end of the trial period unless cancelled at least 24 hours before expiration through your Google Play account settings.</p>

<h3>Billing</h3>
<ul>
  <li>Subscriptions are billed through Google Play Billing</li>
  <li>Subscription prices are displayed in the App before purchase</li>
  <li>Subscriptions auto-renew until cancelled</li>
  <li>All payments are final, subject to Google Play's refund policy</li>
</ul>

<h3>Cancellation</h3>
<p>You may cancel your subscription at any time via Google Play → Subscriptions. Cancellation takes effect at the end of the current billing period. You retain Pro access until that date.</p>

<h2>5. Acceptable Use</h2>
<p>You agree not to:</p>
<ul>
  <li>Reverse engineer, decompile, or attempt to extract source code from the App</li>
  <li>Use the App for any illegal purpose</li>
  <li>Attempt to bypass payment systems, trial restrictions, or access controls</li>
  <li>Upload malicious code or attempt to compromise the platform</li>
  <li>Resell, rent, or redistribute App content without written permission</li>
</ul>

<h2>6. Intellectual Property</h2>
<p>All content in the App — lessons, quizzes, illustrations, code examples, and brand assets — is owned by Remola or its licensors and is protected by copyright and other intellectual property laws. You are granted a limited, non-transferable, revocable license to use the App for personal, non-commercial learning.</p>

<h2>7. User Content</h2>
<p>Any prompts, projects, or content you create within the App remain your property. However, you grant us a non-exclusive license to use anonymized, aggregated forms of this content to improve the platform.</p>

<h2>8. Termination</h2>
<p>We reserve the right to suspend or terminate accounts that violate these Terms. You may terminate your account at any time by contacting us.</p>

<h2>9. Disclaimers</h2>
<p>The App is provided "as is" without warranties of any kind. We do not guarantee that the App will be uninterrupted, error-free, or meet every specific requirement. Educational content is provided for informational purposes and is not a substitute for professional certification.</p>

<h2>10. Limitation of Liability</h2>
<p>To the maximum extent permitted by law, Remola shall not be liable for indirect, incidental, consequential, or punitive damages arising from use of the App. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.</p>

<h2>11. Changes to Terms</h2>
<p>We may update these Terms from time to time. Continued use of the App after changes constitutes acceptance of the updated Terms.</p>

<h2>12. Contact</h2>
<p>For questions about these Terms, email: <a href="mailto:rimolaofficial@gmail.com">rimolaofficial@gmail.com</a></p>
`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(baseHtml('Terms of Service', body));
});

export default router;
