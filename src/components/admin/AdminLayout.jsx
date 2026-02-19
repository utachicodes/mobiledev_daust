import React, { useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    LogOut,
    ChevronLeft,
    Menu,
    ExternalLink,
    Layers
} from "lucide-react";
import logo from "../../assets/logo.png";

export default function AdminLayout() {
    const { isAdmin, logout } = useAdmin();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    if (!isAdmin) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
        { icon: Package, label: "Products", path: "/admin/products" },
        { icon: Layers, label: "Collections", path: "/admin/collections" },
        { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "w-60" : "w-[72px]"
                    } bg-brand-navy text-white transition-all duration-300 flex flex-col z-[110]`}
            >
                {/* Logo area */}
                <div className="h-16 px-4 flex items-center justify-between border-b border-white/5">
                    {isSidebarOpen && (
                        <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
                            <img src={logo} alt="DAUST" className="h-8 w-8 flex-shrink-0" />
                            <span className="font-[800] text-sm tracking-tight truncate">DAUST Admin</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors flex-shrink-0"
                    >
                        {isSidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                                    ? "bg-brand-orange text-white"
                                    : "text-white/40 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <Icon size={18} className="flex-shrink-0" />
                                {isSidebarOpen && <span className="text-sm font-semibold">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom actions */}
                <div className="p-3 border-t border-white/5 space-y-1">
                    <Link
                        to="/shop"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <ExternalLink size={18} />
                        {isSidebarOpen && <span className="text-sm font-semibold">View Store</span>}
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                        <LogOut size={18} />
                        {isSidebarOpen && <span className="text-sm font-semibold">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-50">
                    <h1 className="text-base font-[800] text-brand-navy tracking-tight">
                        {menuItems.find(item => item.path === location.pathname)?.label || "Admin Panel"}
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-navy text-white flex items-center justify-center text-xs font-bold">
                            A
                        </div>
                        <span className="text-sm font-semibold text-gray-500 hidden sm:inline">Admin</span>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
