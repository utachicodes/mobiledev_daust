import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import logo from "../assets/logo.png";
import { NAV_LINKS } from "../data/navigation.js";

export default function Navbar() {
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const collections = useQuery(api.collections.list);
  const location = useLocation();

  useEffect(() => { setMobileOpen(false); }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileOpen]);

  const dynNavLinks = NAV_LINKS.map(link => {
    if (link.name === "Collections" && collections) {
      return { ...link, dropdown: collections.map(c => ({ name: c.name, path: `/collections/${c.slug}` })) };
    }
    return link;
  });

  return (
    <>
      {/* ── Desktop / Sticky Nav ── */}
      <nav
        className={`sticky top-0 z-[100] transition-all duration-500 ${scrolled ? "glass-morphism shadow-sm" : "bg-white/95 backdrop-blur-md"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Row 1: Logo & Utilities */}
          <div className="flex items-center justify-between py-4 lg:py-6 relative">
            {/* Left Spacer (for centering) */}
            <div className="hidden lg:flex flex-1 items-center gap-4">
              {/* Optional secondary utility or blank */}
            </div>

            {/* Logo - Centered */}
            <Link
              to="/"
              className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex items-center group flex-shrink-0"
            >
              <img
                src={logo}
                alt="Life at DAUST"
                className="h-10 sm:h-12 lg:h-[100px] w-auto transition-transform duration-500 group-hover:scale-105"
              />
            </Link>

            {/* Utilities - Right */}
            <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
              {/* Search Bar (Desktop) */}
              <div className="hidden lg:flex items-center bg-gray-50 border border-gray-100 rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-brand-orange/20 focus-within:border-brand-orange transition-all duration-300">
                <Menu size={16} className="text-gray-400 mr-2" /> {/* Simplified search icon for now, usually search icon but using Menu for reference if needed or Search from lucide */}
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent border-none text-xs font-[500] w-full focus:ring-0 p-0 placeholder:text-gray-400"
                />
              </div>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center gap-2.5 px-3 py-2.5 text-gray-600 hover:text-brand-navy rounded-xl hover:bg-gray-50 transition-all duration-300 group"
                aria-label="Cart"
              >
                <ShoppingBag size={20} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                {count > 0 && (
                  <span className="absolute top-1 right-1 bg-brand-orange text-white text-[9px] font-[900] rounded-full min-w-[17px] h-[17px] flex items-center justify-center px-1 shadow-md animate-scale-in">
                    {count}
                  </span>
                )}
                <span className="hidden lg:block text-[11px] font-[800] uppercase tracking-[0.1em]">
                  Cart
                </span>
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-brand-navy rounded-xl hover:bg-gray-50 transition-colors"
                aria-label="Open menu"
              >
                <Menu size={22} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Row 2: Navigation Links (Desktop Only) */}
          <div className="hidden lg:flex items-center justify-center py-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              {dynNavLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.name} className="relative group dropdown">
                    <button className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-[700] uppercase tracking-[0.15em] text-gray-600 hover:text-brand-orange transition-colors duration-300">
                      {link.name}
                      <ChevronDown size={11} className="opacity-40 group-hover:rotate-180 transition-transform duration-300 group-hover:text-brand-orange" />
                    </button>
                    <div className="dropdown-menu absolute hidden pt-2.5 w-56 left-1/2 -translate-x-1/2 z-50">
                      <div className="bg-white rounded-2xl shadow-2xl shadow-black/8 border border-gray-100 overflow-hidden p-1.5">
                        {link.dropdown.length > 0 ? (
                          link.dropdown.map(sub => (
                            <Link
                              key={sub.name}
                              to={sub.path}
                              className="flex items-center px-4 py-2.5 text-sm font-[600] text-gray-600 hover:bg-orange-50/70 hover:text-brand-orange rounded-xl transition-all duration-200"
                            >
                              {sub.name}
                            </Link>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-400">No collections yet</div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `relative px-4 py-2 text-[11px] font-[700] uppercase tracking-[0.15em] transition-colors duration-300 nav-link-ul${isActive ? " text-brand-orange active-link" : " text-gray-600 hover:text-brand-orange"}`
                    }
                  >
                    {link.name}
                  </NavLink>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Full-Screen Mobile Menu ── */}
      <div
        className={`fixed inset-0 z-[200] flex flex-col transition-all duration-500 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Dark navy background */}
        <div className="absolute inset-0 bg-brand-navy" />
        <div className="absolute inset-0 dot-pattern pointer-events-none" />

        {/* Orange glow decorations */}
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-orange/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-0 w-60 h-60 bg-brand-orange/8 rounded-full blur-[100px] pointer-events-none" />

        {/* Content */}
        <div
          className={`relative z-10 flex flex-col h-full transition-all duration-500 ${mobileOpen ? "translate-y-0" : "translate-y-5"
            }`}
        >
          {/* Top bar */}
          <div className="flex justify-between items-center px-6 h-[72px] border-b border-white/5">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="Life at DAUST" className="h-10 w-auto" />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-white/50 hover:text-white rounded-xl transition-colors"
              aria-label="Close menu"
            >
              <X size={22} strokeWidth={2} />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-6 py-8 space-y-1">
            {dynNavLinks.map((link, i) => (
              <div key={link.name}>
                {link.dropdown ? (
                  <div className="mb-5">
                    <div className="px-3 py-2 text-[10px] font-[900] text-white/25 uppercase tracking-[0.25em] mb-1.5">
                      {link.name}
                    </div>
                    <div className="space-y-0.5 pl-3 border-l-2 border-white/10">
                      {link.dropdown.map(sub => (
                        <NavLink
                          key={sub.name}
                          to={sub.path}
                          className={({ isActive }) =>
                            `flex items-center px-3 py-2.5 text-base font-[700] rounded-xl transition-all duration-200 ${isActive ? "text-brand-orange" : "text-white/60 hover:text-white hover:bg-white/5"
                            }`
                          }
                        >
                          {sub.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink
                    to={link.path}
                    style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-4 text-[2rem] font-[900] tracking-[-0.03em] rounded-2xl transition-all duration-200 animate-fade-in-up ${isActive ? "text-brand-orange" : "text-white hover:bg-white/5 hover:pl-5"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>

          {/* Bottom CTA */}
          <div className="px-6 pb-8 pt-4 border-t border-white/5">
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-5 py-4 bg-brand-orange rounded-2xl text-white font-[800] text-sm hover:bg-orange-500 active:scale-[0.98] transition-all"
            >
              <span className="uppercase tracking-[0.12em]">View Cart</span>
              <div className="flex items-center gap-2">
                <ShoppingBag size={17} />
                {count > 0 && (
                  <span className="bg-white text-brand-orange rounded-full w-5 h-5 flex items-center justify-center text-xs font-[900]">
                    {count}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
