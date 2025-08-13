import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Sarah J.',
    role: 'Bar Owner, NOLA',
    content: 'NEONTJ created a stunning neon sign for our bar that perfectly captures our vibe. The 2-day shipping was a lifesaver for our grand opening!',
    rating: 5
  },
  {
    id: 2,
    name: 'Mike T.',
    role: 'Restaurant Owner',
    content: 'The quality exceeded our expectations. Our custom sign has been running 12 hours a day for 6 months with no issues. Worth every penny!',
    rating: 5
  },
  {
    id: 3,
    name: 'Jessica L.',
    role: 'Home Decor Enthusiast',
    content: 'I was nervous about ordering online, but the team walked me through the entire process. The result is a beautiful piece that gets compliments daily!',
    rating: 5
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-bgBlack to-neonPurple/10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading text-center mb-16 neon-text">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-bgBlack/50 border border-neonPurple/30 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-lg mb-4 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-bold text-iceBlue">{testimonial.name}</p>
                <p className="text-sm text-gray-400">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}