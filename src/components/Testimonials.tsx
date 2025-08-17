// src/components/Testimonials.tsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  { id: "t1", name: "Ashley M.", role: "Event Planner", avatar: "/assets/testimonials/ashley.jpg",
    content: "The sign was absolutely stunning and made my event unforgettable. The colors popped perfectly!",
    highlight: "stunning" },
  { id: "t2", name: "Marcus T.", role: "Restaurant Owner", avatar: "/assets/testimonials/marcus.jpg",
    content: "Customers keep asking where we got our neon sign. It's been a huge boost to our brand.",
    highlight: "huge boost" },
  { id: "t3", name: "Brianna L.", role: "Wedding Coordinator", avatar: "/assets/testimonials/brianna.jpg",
    content: "From start to finish, the process was seamless. The quality is unmatched.",
    highlight: "unmatched" },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 px-4 md:px-8 lg:px-16 bg-black text-white">
      <motion.h2 className="text-3xl md:text-4xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        What Our Clients Say
      </motion.h2>

      <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible scrollbar-hide">
        {testimonials.map((t, index) => {
          const parts = t.content.split(t.highlight);
          return (
            <motion.blockquote
              key={t.id}
              className="bg-bgBlack/50 border border-neon-purple/30 rounded-xl p-6 flex-shrink-0 md:flex-shrink md:w-auto md:block transition-transform hover:scale-105 hover:border-neon-purple"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center mb-4">
                <Image src={t.avatar} alt={t.name} width={48} height={48} className="rounded-full border border-neon-purple" loading="lazy" />
                <div className="ml-3">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-gray-400">{t.role}</p>
                </div>
              </div>
              <p className="text-lg mb-4 italic">
                &ldquo;{parts.map((part, i) => (
                  <span key={i}>
                    {part}
                    {i < parts.length - 1 && <span className="text-neon-purple font-semibold">{t.highlight}</span>}
                  </span>
                ))}&rdquo;
              </p>
              <div className="flex text-neon-purple" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.2 + i * 0.1 }}>
                    ★
                  </motion.span>
                ))}
              </div>
            </motion.blockquote>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <a href="/custom-sign" className="px-6 py-3 bg-neon-purple text-white rounded-full font-bold shadow-lg hover:bg-neonPink transition">
          Design Your Sign
        </a>
      </div>
    </section>
  );
}
