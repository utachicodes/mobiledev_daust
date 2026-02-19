import React, { useState } from "react";
import { AlertCircle, CheckCircle, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";

function ContactForm() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.message.trim()) newErrors.message = "Message is required";
    else if (form.message.trim().length < 10) newErrors.message = "At least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    if (!validateForm()) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setSuccess(true);
    setForm({ firstName: "", lastName: "", email: "", message: "" });
    setErrors({});
  };

  const inputClasses = (field) =>
    `mt-1.5 w-full border rounded-xl px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 focus:bg-white transition-all ${errors[field] ? 'border-red-400' : 'border-gray-200'}`;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-7 border border-gray-100 premium-shadow">
      <h3 className="text-lg font-[800] text-brand-navy mb-6">Send us a message</h3>

      {success && (
        <div className="mb-5 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-700 text-sm font-medium animate-fade-in">
          <CheckCircle size={18} />
          Thanks! We'll get back to you soon.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">First name</label>
          <input className={inputClasses('firstName')} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Last name</label>
          <input className={inputClasses('lastName')} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Email</label>
        <input type="email" className={inputClasses('email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div className="mt-4">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Message</label>
        <textarea rows="5" className={inputClasses('message')} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>

      <Button type="submit" loading={loading} className="mt-6 rounded-xl group">
        Send Message <ArrowRight size={15} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
      </Button>
    </form>
  );
}

export default function Contact() {
  const info = [
    { icon: Mail, title: "Email", text: "support@lifeatdaust.com" },
    { icon: MapPin, title: "Campus Office", text: "DAUST Campus, Ngaparou, Dakar, Senegal" },
    { icon: Clock, title: "Hours", text: "Mon – Fri: 9:00 – 18:00" },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center bg-brand-navy overflow-hidden">
        <div className="absolute inset-0">
          <img className="w-full h-full object-cover opacity-30" src="http://static.photos/fashion/1200x630/31" alt="Contact banner" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/80 to-brand-navy/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <h1 className="text-[var(--text-5xl)] font-[900] text-white tracking-tight mb-4">Contact Us</h1>
          <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
            Questions, returns, or collaborations — we're here to help.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-3">
            <ContactForm />
          </div>

          <div className="md:col-span-2 space-y-5">
            {info.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100 premium-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center flex-shrink-0">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-brand-navy mb-1">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}