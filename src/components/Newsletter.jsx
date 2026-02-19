import { useState } from "react";
import { Mail, ArrowRight, CheckCircle, Sparkles } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError]   = useState("");

  const validate = (val) => {
    if (!val.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Please enter a valid email";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const err = validate(email);
    if (err) { setError(err); setStatus("error"); return; }
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 5000);
    }, 1400);
  };

  return (
    <section className="relative overflow-hidden bg-brand-navy">
      {/* Pattern + glows */}
      <div className="absolute inset-0 dot-pattern pointer-events-none" />
      <div className="absolute -top-48 -right-48 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-48 -left-48 w-[400px] h-[400px] bg-brand-orange/6 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:py-28 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-20">

          {/* Left copy */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 text-brand-orange text-[10px] font-[900] uppercase tracking-[0.22em] mb-5">
              <Sparkles size={13} />
              Newsletter
            </div>
            <h2 className="text-3xl sm:text-[2.8rem] font-[900] text-white tracking-[-0.03em] leading-[1.1] mb-4">
              Stay ahead of<br />every drop.
            </h2>
            <p className="text-white/40 text-base leading-relaxed max-w-sm">
              Get notified about new collections, exclusive campus offers, and events before anyone else.
            </p>
          </div>

          {/* Right form */}
          <div className="lg:w-1/2">
            {status === "success" ? (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl animate-scale-in">
                <div className="flex items-center gap-3 text-green-400 mb-2">
                  <CheckCircle size={20} />
                  <h3 className="font-[800] text-lg">You&apos;re in!</h3>
                </div>
                <p className="text-white/50 text-sm">
                  Thanks for subscribing. We&apos;ll keep you posted on every drop.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={status === "loading"}
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 text-white placeholder-white/25 rounded-xl focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange/50 disabled:opacity-50 transition-all text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-7 py-4 bg-brand-orange text-white font-[800] rounded-xl hover:bg-orange-500 active:scale-[0.97] disabled:opacity-60 transition-all duration-300 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.15em] whitespace-nowrap shadow-xl shadow-brand-orange/20"
                >
                  {status === "loading" ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-fast" />
                  ) : (
                    <>Subscribe <ArrowRight size={15} /></>
                  )}
                </button>
              </form>
            )}

            {error && status === "error" && (
              <p className="mt-2.5 text-sm text-red-400 font-[500]">{error}</p>
            )}
            <p className="mt-4 text-[11px] text-white/20 font-[500]">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
