import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <aside className="hidden md:flex flex-col justify-between h-screen w-20 bg-white border-r fixed left-0 top-0 z-30">
            {/* Top: Logo */}
            <div className="flex flex-col items-center mt-6">
                <Link to="/" className="mb-8">
                    <span className="block w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">B</span>
                </Link>
                <nav className="flex flex-col space-y-8 mt-8">
                    <Link to="/" className={`group flex flex-col items-center ${isActive("/") ? "text-blue-600" : "text-gray-400 hover:text-blue-600"}`} title="Home">
                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v6a2 2 0 002 2h4a2 2 0 002-2v-6m-6 0h6" /></svg>
                        <span className="text-xs">Home</span>
                    </Link>
                    <Link to="/posts" className={`group flex flex-col items-center ${isActive("/posts") ? "text-blue-600" : "text-gray-400 hover:text-blue-600"}`} title="Posts">
                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h3.28a2 2 0 001.42-.59l1.3-1.3a2 2 0 012.83 0l1.3 1.3A2 2 0 0015.72 5H19a2 2 0 012 2v12a2 2 0 01-2 2z" /></svg>
                        <span className="text-xs">Posts</span>
                    </Link>
                    <Link to="/about" className={`group flex flex-col items-center ${isActive("/about") ? "text-blue-600" : "text-gray-400 hover:text-blue-600"}`} title="About">
                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                        <span className="text-xs">About</span>
                    </Link>
                </nav>
            </div>
            {/* Bottom: User avatar */}
            <div className="flex flex-col items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold">
                    <span role="img" aria-label="User">👤</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
