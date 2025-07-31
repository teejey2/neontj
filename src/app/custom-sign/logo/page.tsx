'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import ErrorBoundary from '@/components/ErrorBoundary';

// Validation helper
const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export default function LogoUploadPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const validateForm = (): string | null => {
    if (!name.trim()) return 'Name is required';
    if (!email.trim()) return 'Email is required';
    if (!validateEmail(email)) return 'Invalid email format';
    if (!message.trim()) return 'Design details are required';
    if (file && file.size > 10 * 1024 * 1024) return 'File size exceeds 10MB limit';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setSubmitMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    // Form submission logic would go here
    console.log('Form submitted', { name, email, phone, message, file });

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Thank you! We will contact you shortly with a quote.');
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setFile(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-bgBlack text-ledWhite">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-heading text-center mb-8 neon-text">
            Custom Logo/Image Neon Sign
          </h1>
          <p className="text-center text-xl text-iceBlue mb-12">
            Upload your design and we&apos;ll create a custom quote for you
          </p>

          <ErrorBoundary fallback={<div className="text-red-500 p-4">Form failed to load</div>}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-lg mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-bgBlack border border-neonPurple rounded-lg px-4 py-3"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-lg mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-bgBlack border border-neonPurple rounded-lg px-4 py-3"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-lg mb-2">Phone (optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-bgBlack border border-neonPurple rounded-lg px-4 py-3"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-lg mb-2">Design Details</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-bgBlack border border-neonPurple rounded-lg px-4 py-3"
                  placeholder="Describe your design, size requirements, colors, and any special requests"
                ></textarea>
              </div>

              <div>
                <label className="block text-lg mb-2">
                  Upload your logo or image (optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full bg-bgBlack border border-neonPurple rounded-lg px-4 py-3"
                  accept="image/*,.pdf,.ai,.eps"
                />
                <p className="text-sm text-iceBlue/80 mt-2">
                  Supported formats: JPG, PNG, PDF, AI, EPS (Max 10MB)
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`neon-button w-full py-4 text-xl ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>

              {submitMessage && (
                <p className={`text-center ${submitMessage.includes('Thank you') ? 'text-green-500' : 'text-red-500'}`}>
                  {submitMessage}
                </p>
              )}
            </form>
          </ErrorBoundary>
        </motion.div>
      </div>
    </div>
  );
}