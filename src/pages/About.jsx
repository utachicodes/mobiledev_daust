import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Heart, Users } from "lucide-react";

export default function About() {
  const values = [
    { icon: Sparkles, title: "Quality", text: "Premium fabrics, reinforced seams, and lasting color in every piece." },
    { icon: Heart, title: "Design", text: "Campus-inspired styles that look great on and off campus." },
    { icon: Users, title: "Community", text: "A portion of every sale supports DAUST events and student initiatives." },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[55vh] flex items-center bg-brand-navy overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-30"
            src="http://static.photos/fashion/1200x630/35"
            alt="About Life at DAUST"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/80 to-brand-navy/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32" data-aos="fade-up">
          <h1 className="text-[var(--text-5xl)] font-[900] text-white tracking-tight mb-4">About Us</h1>
          <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
            Life at DAUST blends campus culture, fashion, and community together — creating apparel and essentials that connect the DAUST family.
          </p>
        </div>
      </section>

      {/* Mission Body */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        <div className="max-w-2xl" data-aos="fade-up">
          <p className="text-gray-600 text-lg leading-relaxed">
            Our collections celebrate academic excellence, creativity, and unity. We make
            apparel that DAUST students and alumni are proud to wear — on campus, at events, and beyond.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" data-aos="fade-up">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-gray-200 transition-all duration-300 group premium-shadow">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-4 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                  <Icon size={20} />
                </div>
                <h3 className="font-[800] text-brand-navy text-lg mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.text}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center pt-8" data-aos="fade-up">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-brand-orange font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all duration-300"
          >
            Explore our collections <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}