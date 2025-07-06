// src/app/privacy/page.tsx
export const metadata = {
  title: 'Privacy Policy – NeonTJ',
  description: 'How NeonTJ collects and uses data for our custom neon sign service.',
};

export default function PrivacyPage() {
  return (
    <main className="prose prose-invert max-w-3xl mx-auto py-16 px-4">
      <h1>Privacy Policy</h1>
      <p>Effective date: July 6, 2025</p>

      <h2>1. Information We Collect</h2>
      <p>We collect your name, email, phone number, and any files you upload when requesting quotes…</p>

      <h2>2. How We Use Your Information</h2>
      <p>We use your details to process custom sign requests, communicate order updates, and improve our services…</p>

      <h2>3. Third-Party Services</h2>
      <p>We employ FormSubmit.co to handle form submissions securely. We do not share your data with any advertisers…</p>

      <h2>4. Your Rights</h2>
      <p>You can request deletion of your data at any time by emailing internetmoneyirl@gmail.com…</p>

      <h2>5. Contact Us</h2>
      <p>Questions? <a href="mailto:internetmoneyirl@gmail.com">internetmoneyirl@gmail.com</a></p>
    </main>
  );
}
