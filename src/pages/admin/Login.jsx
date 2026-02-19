import React, { useState } from "react";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { Lock, ArrowRight } from "lucide-react";
import Button from "../../components/ui/Button";
import logo from "../../assets/logo.png";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login, isAdmin } = useAdmin();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/admin";

    if (isAdmin) {
        return <Navigate to={from} replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        setTimeout(() => {
            if (login(password)) {
                navigate(from, { replace: true });
            } else {
                setError("Invalid password. Please try again.");
                setLoading(false);
            }
        }, 600);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            {/* Background pattern */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-brand-navy/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-[420px] animate-fade-in-up">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-5">
                        <img src={logo} alt="Life at DAUST" className="h-14 w-auto" />
                    </div>
                    <h1 className="text-2xl font-[900] text-brand-navy tracking-tight mb-2">Admin Access</h1>
                    <p className="text-gray-400 text-sm">Restricted to DAUST staff only</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 h-4 w-4" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-3.5 text-brand-navy font-medium text-sm focus:bg-white transition-all"
                                    placeholder="Enter admin password"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm font-medium animate-fade-in">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full rounded-xl h-12 group"
                            loading={loading}
                        >
                            Sign In
                            <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-gray-50 text-center">
                        <Link to="/" className="text-gray-400 hover:text-brand-orange text-xs font-semibold transition-colors">
                            ← Back to store
                        </Link>
                    </div>
                </div>

                <p className="text-center mt-8 text-[10px] text-gray-300 font-medium tracking-wider">
                    Life at DAUST © 2026
                </p>
            </div>
        </div>
    );
}
