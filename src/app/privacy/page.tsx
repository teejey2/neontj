export const metadata = {
  title: 'Privacy Policy – NeonTJ',
  description: 'How NeonTJ collects and uses data for our custom neon sign service.',
};

export default function PrivacyPage() {
  return (
    <main className="prose prose-invert max-w-3xl mx-auto py-16 px-4">
      <h1 className="neon-text">Privacy Policy</h1>
      <p>Effective date: July 23, 2025</p>

      <section>
        <h2>1. Information We Collect</h2>
        <p>We collect the following types of information when you use our services:</p>
        <ul>
          <li><strong>Personal Information:</strong> Name, email address, phone number, and shipping address when you place an order or request a quote.</li>
          <li><strong>Design Information:</strong> Custom text, logos, colors, and specifications for your neon sign.</li>
          <li><strong>Payment Information:</strong> We use Stripe for payment processing and do not store your credit card details on our servers.</li>
          <li><strong>Technical Information:</strong> IP address, browser type, device information, and usage data through cookies.</li>
        </ul>
      </section>

      <section>
        <h2>2. How We Use Your Information</h2>
        <p>We use your information for the following purposes:</p>
        <ul>
          <li>To create and fulfill your custom neon sign orders</li>
          <li>To communicate with you about your order status</li>
          <li>To provide customer support and respond to inquiries</li>
          <li>To improve our products, services, and website experience</li>
          <li>To send promotional offers (only with your explicit consent)</li>
        </ul>
      </section>

      <section>
        <h2>3. Data Sharing and Disclosure</h2>
        <p>We do not sell your personal information. We may share information with:</p>
        <ul>
          <li><strong>Service Providers:</strong> Payment processors (Stripe), shipping carriers (FedEx, UPS), and cloud storage providers (AWS).</li>
          <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety.</li>
          <li><strong>Business Transfers:</strong> In connection with a merger or acquisition of our business.</li>
        </ul>
      </section>

      <section>
        <h2>4. Data Security</h2>
        <p>We implement industry-standard security measures including:</p>
        <ul>
          <li>SSL encryption for all data transmissions</li>
          <li>Secure storage on AWS servers with regular security audits</li>
          <li>Limited access to personal information to authorized personnel only</li>
        </ul>
      </section>

      <section>
        <h2>5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access and receive a copy of your personal data</li>
          <li>Correct inaccurate personal information</li>
          <li>Request deletion of your personal data</li>
          <li>Opt-out of marketing communications</li>
        </ul>
        <p>To exercise these rights, contact us at <a href="mailto:privacy@neontj.com" className="text-iceBlue">privacy@neontj.com</a>.</p>
      </section>

      <section>
        <h2>6. Cookies</h2>
        <p>We use cookies to:</p>
        <ul>
          <li>Remember your design preferences during customization</li>
          <li>Analyze website traffic using Google Analytics (anonymized data)</li>
          <li>Provide personalized content based on your browsing history</li>
        </ul>
        <p>You can manage cookie preferences through your browser settings.</p>
      </section>

      <section>
        <h2>7. Changes to This Policy</h2>
        <p>We may update this policy periodically. The latest version will always be posted on our website with the effective date.</p>
      </section>

      <section>
        <h2>8. Contact Us</h2>
        <p>Questions about this policy? Contact us at:</p>
        <address className="not-italic mt-2">
          NeonTJ Privacy Officer<br />
          <a href="mailto:privacy@neontj.com" className="text-iceBlue">privacy@neontj.com</a><br />
          123 Neon Street, New Orleans, LA 70115
        </address>
      </section>
    </main>
  );
}